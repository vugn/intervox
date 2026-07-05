import { useState, useEffect, useRef, useCallback } from 'react';
import * as faceapi from '@vladmandic/face-api';

export type ExpressionSummary = {
  dominantExpression: string;
  expressionDistribution: Record<string, number>;
  confidenceScore: number;
  nervousnessIndicator: number;
  totalFramesAnalyzed: number;
};

export function useFaceExpression() {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [currentExpression, setCurrentExpression] = useState<{ expression: string, probability: number } | null>(null);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const historyRef = useRef<Array<{ timestamp: number, expression: string, probability: number }>>([]);
  const requestRef = useRef<number | null>(null);
  const lastDetectTimeRef = useRef<number>(0);

  // Load Models
  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
          faceapi.nets.faceExpressionNet.loadFromUri('/models')
        ]);
        setIsModelLoaded(true);
      } catch (error) {
        console.error("Failed to load face-api models:", error);
      }
    };
    loadModels();

    return () => {
      stopDetection();
    };
  }, []);

  const detectFace = useCallback(async () => {
    if (!videoRef.current || !isModelLoaded) return;
    
    const now = Date.now();
    // Throttle: only detect every 500ms
    if (now - lastDetectTimeRef.current >= 500) {
      if (videoRef.current.readyState === 4) { // HAVE_ENOUGH_DATA
        try {
          const detections = await faceapi.detectSingleFace(
            videoRef.current, 
            new faceapi.TinyFaceDetectorOptions({ inputSize: 160 })
          ).withFaceExpressions();

          if (detections) {
            const expressions = detections.expressions;
            // Get the dominant expression
            const sorted = Object.entries(expressions).sort((a, b) => b[1] - a[1]);
            const dominant = sorted[0];

            setCurrentExpression({ expression: dominant[0], probability: dominant[1] });
            historyRef.current.push({
              timestamp: now,
              expression: dominant[0],
              probability: dominant[1]
            });
          }
        } catch (error) {
          // Ignore detection errors (e.g., when video is suddenly paused)
        }
      }
      lastDetectTimeRef.current = now;
    }
    
    // Continue loop
    requestRef.current = requestAnimationFrame(detectFace);
  }, [isModelLoaded]);

  const startDetection = async (stream?: MediaStream) => {
    if (!isModelLoaded) return;
    
    try {
      if (!videoRef.current) {
        videoRef.current = document.createElement('video');
        videoRef.current.muted = true;
        videoRef.current.playsInline = true;
      }
      
      let activeStream = stream;
      if (!activeStream) {
        activeStream = await navigator.mediaDevices.getUserMedia({ video: true });
      }

      videoRef.current.srcObject = activeStream;
      streamRef.current = activeStream;
      await videoRef.current.play();
      
      setIsCameraActive(true);
      historyRef.current = []; // Reset history
      
      requestRef.current = requestAnimationFrame(detectFace);
      return activeStream;
    } catch (error) {
      console.error("Failed to start face detection:", error);
      return null;
    }
  };

  const stopDetection = () => {
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const getExpressionSummary = (): ExpressionSummary => {
    const history = historyRef.current;
    if (history.length === 0) {
      return {
        dominantExpression: 'neutral',
        expressionDistribution: { neutral: 100 },
        confidenceScore: 50,
        nervousnessIndicator: 0,
        totalFramesAnalyzed: 0
      };
    }

    const counts: Record<string, number> = {};
    history.forEach(item => {
      counts[item.expression] = (counts[item.expression] || 0) + 1;
    });

    const total = history.length;
    const distribution: Record<string, number> = {};
    let dominant = '';
    let maxCount = 0;

    for (const [expr, count] of Object.entries(counts)) {
      distribution[expr] = parseFloat(((count / total) * 100).toFixed(1));
      if (count > maxCount) {
        maxCount = count;
        dominant = expr;
      }
    }

    // Heuristics for confidence and nervousness
    // Positive expressions: happy, neutral, surprised
    // Negative expressions: fearful, sad, angry, disgusted
    const positiveScore = (distribution.happy || 0) + (distribution.neutral || 0) * 0.8 + (distribution.surprised || 0) * 0.5;
    const negativeScore = (distribution.fearful || 0) * 1.5 + (distribution.sad || 0) + (distribution.angry || 0) + (distribution.disgusted || 0);
    
    let confidence = Math.min(100, Math.max(0, 50 + positiveScore - negativeScore));
    let nervousness = Math.min(100, Math.max(0, (distribution.fearful || 0) * 2 + (distribution.sad || 0)));

    return {
      dominantExpression: dominant,
      expressionDistribution: distribution,
      confidenceScore: Math.round(confidence),
      nervousnessIndicator: Math.round(nervousness),
      totalFramesAnalyzed: total
    };
  };

  return {
    isModelLoaded,
    isCameraActive,
    currentExpression,
    startDetection,
    stopDetection,
    getExpressionSummary
  };
}
