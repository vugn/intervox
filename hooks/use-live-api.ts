import { useState, useEffect, useRef, useCallback } from "react";
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import {
  AudioQueue,
  base64ToFloat32Array,
  float32ArrayToBase64,
} from "@/lib/audio-utils";

export function useLiveAPI({
  systemInstruction,
  voiceName = "Zephyr",
  language = "English",
  inputDeviceId,
  outputDeviceId,
}: {
  systemInstruction: string;
  voiceName?: string;
  language?: string;
  inputDeviceId?: string;
  outputDeviceId?: string;
}) {
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<
    { role: "ai" | "user"; text: string; isFinal?: boolean }[]
  >([]);
  const [audioLevel, setAudioLevel] = useState(0);

  const sessionRef = useRef<any>(null);
  const audioQueueRef = useRef<AudioQueue | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const inputDeviceIdRef = useRef<string | undefined>(inputDeviceId);
  const outputDeviceIdRef = useRef<string | undefined>(outputDeviceId);
  const lastAiAudioAtRef = useRef<number>(0);
  const aiSpeakingUntilRef = useRef<number>(0);
  const userMutedRef = useRef(false);
  const autoMutedRef = useRef(false);
  const unmuteTimerRef = useRef<number | null>(null);
  const echoSuppressUntilRef = useRef<number>(0);
  const isSessionActiveRef = useRef(false);
  const currentSessionIdRef = useRef(0);

  const getMicTrack = useCallback(() => {
    return mediaStreamRef.current?.getAudioTracks()?.[0] || null;
  }, []);

  const applyMicGate = useCallback(() => {
    const track = getMicTrack();
    if (!track) return;
    const shouldEnable = !(userMutedRef.current || autoMutedRef.current);
    track.enabled = shouldEnable;
    setIsRecording(shouldEnable);
  }, [getMicTrack]);

  const scheduleAutoUnmute = useCallback(() => {
    if (unmuteTimerRef.current) {
      window.clearTimeout(unmuteTimerRef.current);
      unmuteTimerRef.current = null;
    }
    const delay = Math.max(0, aiSpeakingUntilRef.current - Date.now() + 250);
    unmuteTimerRef.current = window.setTimeout(() => {
      autoMutedRef.current = false;
      echoSuppressUntilRef.current = Date.now() + 700;
      applyMicGate();
      unmuteTimerRef.current = null;
    }, delay);
  }, [applyMicGate]);

  const stopInputCapture = useCallback(() => {
    if (processorRef.current) {
      processorRef.current.onaudioprocess = null;
    }
    if (processorRef.current && sourceRef.current) {
      sourceRef.current.disconnect();
      processorRef.current.disconnect();
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    if (unmuteTimerRef.current) {
      window.clearTimeout(unmuteTimerRef.current);
      unmuteTimerRef.current = null;
    }
    processorRef.current = null;
    sourceRef.current = null;
    mediaStreamRef.current = null;
    audioContextRef.current = null;
    setIsRecording(false);
  }, []);

  const cleanupAudio = useCallback(() => {
    stopInputCapture();
    if (audioQueueRef.current) {
      audioQueueRef.current.close();
    }
    audioQueueRef.current = null;
  }, [stopInputCapture]);

  const startInputCapture = useCallback(
    async (sessionPromise: Promise<any>, sessionId: number) => {
      stopInputCapture();
      const constraints: MediaTrackConstraints = {
        sampleRate: 16000,
        channelCount: 1,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        ...(inputDeviceIdRef.current
          ? { deviceId: { exact: inputDeviceIdRef.current } }
          : {}),
      };

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: constraints,
      });
      mediaStreamRef.current = stream;

      const audioCtx = new (
        window.AudioContext || (window as any).webkitAudioContext
      )({ sampleRate: 16000 });
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      sourceRef.current = source;

      const processor = audioCtx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        if (
          !isSessionActiveRef.current ||
          currentSessionIdRef.current !== sessionId
        ) {
          return;
        }

        const inputData = e.inputBuffer.getChannelData(0);

        let sum = 0;
        for (let i = 0; i < inputData.length; i++) {
          sum += Math.abs(inputData[i]);
        }
        const avgLevel = sum / inputData.length;
        setAudioLevel(avgLevel * 100);

        const now = Date.now();
        const isAiSpeaking = now < aiSpeakingUntilRef.current;
        const bargeInThreshold = 0.05;
        const postAiEchoThreshold = 0.09;

        if (isAiSpeaking && avgLevel < bargeInThreshold) {
          return;
        }

        if (
          now < echoSuppressUntilRef.current &&
          avgLevel < postAiEchoThreshold
        ) {
          return;
        }

        const base64Data = float32ArrayToBase64(inputData);
        sessionPromise.then((session) => {
          if (
            !isSessionActiveRef.current ||
            currentSessionIdRef.current !== sessionId
          ) {
            return;
          }

          const wsReadyState =
            (session as any)?._ws?.readyState ??
            (session as any)?.ws?.readyState ??
            (session as any)?.socket?.readyState;
          if (
            typeof wsReadyState === "number" &&
            wsReadyState !== WebSocket.OPEN
          ) {
            return;
          }

          try {
            session.sendRealtimeInput({
              media: {
                data: base64Data,
                mimeType: "audio/pcm;rate=16000",
              },
            });
          } catch (err) {
            // Ignored softly
          }
        });
      };

      source.connect(processor);
      processor.connect(audioCtx.destination);
      applyMicGate();
    },
    [stopInputCapture, applyMicGate],
  );

  const disconnect = useCallback(() => {
    isSessionActiveRef.current = false;
    if (sessionRef.current) {
      sessionRef.current.then((session: any) => {
        if (session && typeof session.close === "function") {
          try {
            session.close();
          } catch (e) {
            // Ignore if closed
          }
        }
      });
      sessionRef.current = null;
    }
    cleanupAudio();
    setIsConnected(false);
    setIsRecording(false);
  }, [cleanupAudio]);

  const connect = useCallback(async () => {
    try {
      setError(null);
      const sessionId = currentSessionIdRef.current + 1;
      currentSessionIdRef.current = sessionId;
      isSessionActiveRef.current = false;
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error(
          "Gemini API key is missing. Set NEXT_PUBLIC_GEMINI_API_KEY in .env/.env.local then restart dev server.",
        );
      }

      const ai = new GoogleGenAI({ apiKey });
      audioQueueRef.current = new AudioQueue(24000, outputDeviceIdRef.current);

      const languageMap: Record<string, string> = {
        Indonesian: "id-ID",
        English: "en-US",
        Spanish: "es-ES",
        Japanese: "ja-JP",
      };
      const langCode = languageMap[language] || "en-US";

      const sessionPromise = ai.live.connect({
        model: "models/gemini-2.0-flash-exp",
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName } },
            languageCode: langCode,
          },
          systemInstruction,
          // @ts-ignore
          outputAudioTranscription: {},
          // @ts-ignore
          inputAudioTranscription: {},
        },
        callbacks: {
          onopen: async () => {
            if (currentSessionIdRef.current !== sessionId) return;
            isSessionActiveRef.current = true;
            setIsConnected(true);
            // Start microphone
            try {
              await startInputCapture(sessionPromise, sessionId);
            } catch (err: any) {
              setError("Microphone access denied or failed: " + err.message);
              disconnect();
            }
          },
          onmessage: async (message: LiveServerMessage) => {
            if (
              !isSessionActiveRef.current ||
              currentSessionIdRef.current !== sessionId
            ) {
              return;
            }

            // Handle audio output
            const base64Audio =
              message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio && audioQueueRef.current) {
              const float32Array = base64ToFloat32Array(base64Audio);
              const now = Date.now();
              const chunkDurationMs = (float32Array.length / 24000) * 1000;
              const tailGuardMs = 260;
              lastAiAudioAtRef.current = now;
              aiSpeakingUntilRef.current = Math.max(
                aiSpeakingUntilRef.current,
                now + chunkDurationMs + tailGuardMs,
              );
              autoMutedRef.current = true;
              applyMicGate();
              scheduleAutoUnmute();
              audioQueueRef.current.playChunk(float32Array);
            }

            // Handle interruption
            if (message.serverContent?.interrupted) {
              lastAiAudioAtRef.current = 0;
              aiSpeakingUntilRef.current = 0;
              echoSuppressUntilRef.current = 0;
              autoMutedRef.current = false;
              applyMicGate();
              audioQueueRef.current?.stopAll();
              setTranscript((prev) => {
                const last = prev[prev.length - 1];
                if (last && last.role === "ai") {
                  const newTranscript = [...prev];
                  newTranscript[newTranscript.length - 1] = {
                    ...last,
                    isFinal: true,
                  };
                  return newTranscript;
                }
                return prev;
              });
            }

            // Handle transcription
            const msgAny = message as any;

            // AI Transcription (from outputTranscription)
            if (msgAny.serverContent?.outputTranscription) {
              const text = msgAny.serverContent.outputTranscription.text || "";
              const finished =
                msgAny.serverContent.outputTranscription.finished;

              if (text || finished) {
                setTranscript((prev) => {
                  const last = prev[prev.length - 1];
                  if (last && last.role === "ai" && !last.isFinal) {
                    const newTranscript = [...prev];
                    newTranscript[newTranscript.length - 1] = {
                      ...last,
                      text: last.text + text,
                      isFinal: finished,
                    };
                    return newTranscript;
                  }
                  if (text) {
                    return [...prev, { role: "ai", text, isFinal: finished }];
                  }
                  return prev;
                });
              }
            }

            // User Transcription (from inputTranscription)
            if (msgAny.serverContent?.inputTranscription) {
              const text = msgAny.serverContent.inputTranscription.text || "";
              const finished = msgAny.serverContent.inputTranscription.finished;

              if (text || finished) {
                setTranscript((prev) => {
                  const last = prev[prev.length - 1];
                  if (last && last.role === "user" && !last.isFinal) {
                    const newTranscript = [...prev];
                    newTranscript[newTranscript.length - 1] = {
                      ...last,
                      text: last.text + text,
                      isFinal: finished,
                    };
                    return newTranscript;
                  }
                  if (text) {
                    return [...prev, { role: "user", text, isFinal: finished }];
                  }
                  return prev;
                });
              }
            }

            // Mark turn as complete
            if (msgAny.serverContent?.turnComplete) {
              scheduleAutoUnmute();
              setTranscript((prev) => {
                const last = prev[prev.length - 1];
                if (last) {
                  const newTranscript = [...prev];
                  newTranscript[newTranscript.length - 1] = {
                    ...last,
                    isFinal: true,
                  };
                  return newTranscript;
                }
                return prev;
              });
            }
          },
          onerror: (err) => {
            console.error("Live API Error:", err);
            isSessionActiveRef.current = false;
            setError("Connection error occurred.");
          },
          onclose: () => {
            isSessionActiveRef.current = false;
            setIsConnected(false);
            setIsRecording(false);
            cleanupAudio();
          },
        },
      });

      sessionRef.current = sessionPromise;
    } catch (err: any) {
      setError("Failed to connect: " + err.message);
    }
  }, [
    systemInstruction,
    voiceName,
    language,
    disconnect,
    cleanupAudio,
    startInputCapture,
    applyMicGate,
    scheduleAutoUnmute,
  ]);

  useEffect(() => {
    inputDeviceIdRef.current = inputDeviceId;
  }, [inputDeviceId]);

  useEffect(() => {
    outputDeviceIdRef.current = outputDeviceId;
    if (audioQueueRef.current && outputDeviceId) {
      audioQueueRef.current.setOutputDevice(outputDeviceId);
    }
  }, [outputDeviceId]);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  const toggleMute = useCallback(() => {
    userMutedRef.current = !userMutedRef.current;
    applyMicGate();
  }, [applyMicGate]);

  const sendText = useCallback((text: string) => {
    if (sessionRef.current && isSessionActiveRef.current) {
      sessionRef.current.then((session: any) => {
        if (!isSessionActiveRef.current) {
          return;
        }
        session.sendClientContent({
          turns: [{ role: "user", parts: [{ text }] }],
          turnComplete: true,
        });
      });
    }
  }, []);

  const changeInputDevice = useCallback(
    async (deviceId: string) => {
      inputDeviceIdRef.current = deviceId;
      if (isConnected && sessionRef.current) {
        try {
          await startInputCapture(
            sessionRef.current,
            currentSessionIdRef.current,
          );
        } catch (err: any) {
          setError("Failed to switch microphone: " + err.message);
        }
      }
    },
    [isConnected, startInputCapture],
  );

  const changeOutputDevice = useCallback(async (deviceId: string) => {
    outputDeviceIdRef.current = deviceId;
    if (audioQueueRef.current) {
      await audioQueueRef.current.setOutputDevice(deviceId);
    }
  }, []);

  return {
    isConnected,
    isRecording,
    error,
    transcript,
    audioLevel,
    connect,
    disconnect,
    toggleMute,
    sendText,
    changeInputDevice,
    changeOutputDevice,
  };
}
