import React from 'react';
import QRCode from 'react-qr-code';

interface HeadOfProgramData {
  name?: string;
  nip?: string;
  signature_url?: string;
  qr_code_data?: string;
}

interface ReportTemplateProps {
  title: string;
  subtitle?: string;
  dateRange?: { start: string; end: string };
  children: React.ReactNode;
  headOfProgram?: HeadOfProgramData | null;
  requireSignature?: boolean;
  hideHeader?: boolean;
}

export default function ReportTemplate({
  title,
  subtitle,
  dateRange,
  children,
  headOfProgram,
  requireSignature = false,
  hideHeader = false,
}: ReportTemplateProps) {
  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const dekanName = (headOfProgram?.name && headOfProgram.name.trim() !== '')
    ? headOfProgram.name
    : 'Prof. Dr. Hj. Silvia Ratna, S.Kom., M.Kom.';
  const dekanNip = (headOfProgram?.nip && headOfProgram.nip.trim() !== '')
    ? headOfProgram.nip
    : '19750913 200501 2 001';

  return (
    <div className={`bg-white ${hideHeader ? 'p-0 max-w-none print:p-6' : 'p-8 md:p-12 max-w-[210mm] print:px-12 print:py-10'} w-full mx-auto text-slate-900 print:max-w-none print:w-full print:bg-transparent shadow-sm print:shadow-none min-h-[297mm]`}>
      
      {/* KOP SURAT / HEADER */}
      {!hideHeader && (
        <div className="flex items-center border-b-[3px] border-double border-slate-900 pb-5 mb-8 print:pb-4 print:mb-6">
          <div className="flex-1 text-center">
            <h1 className="text-xl md:text-2xl font-black uppercase tracking-wider text-slate-900 mb-1">UNIVERSITAS ISLAM KALIMANTAN (UNISKA)</h1>
            <h2 className="text-sm md:text-base font-bold text-slate-800 uppercase tracking-wide">FAKULTAS TEKNOLOGI INFORMASI</h2>
            <p className="text-xs text-slate-600 mt-1 font-medium">Jl. Adhyaksa No.2 Kayu Tangi, Banjarmasin, Kalimantan Selatan</p>
          </div>
        </div>
      )}

      {/* REPORT TITLE */}
      {!hideHeader && (
        <div className="text-center mb-8 print:mb-6">
          <h3 className="text-lg md:text-xl font-bold uppercase tracking-wide text-slate-900">{title}</h3>
          <div className="w-20 h-0.5 bg-slate-900 mx-auto mt-2 mb-2 print:my-1.5"></div>
          {subtitle && <p className="text-sm text-slate-600 mt-1 max-w-2xl mx-auto">{subtitle}</p>}
          {dateRange && (
            <p className="text-xs font-medium text-slate-500 mt-2 inline-block bg-slate-100 px-3 py-1 rounded-full print:bg-transparent print:border print:border-slate-300">
              Periode: {dateRange.start} s.d {dateRange.end}
            </p>
          )}
        </div>
      )}

      {/* REPORT CONTENT (TABLES/CHARTS/CERTIFICATE) */}
      <div className="mb-12 print:mb-8 min-h-[350px]">
        {children}
      </div>

      {/* PENGESAHAN / SIGNATURE BLOCK */}
      {requireSignature && !hideHeader && (
        <div className="flex justify-end mt-16 print:mt-10 print:pt-6 break-inside-avoid">
          <div className="text-center">
            <p className="text-sm mb-1">Banjarmasin, {currentDate}</p>
            <p className="text-sm font-semibold mb-4">Dekan Fakultas Teknologi Informasi</p>
            
            <div className="flex justify-center items-center gap-4 my-4 h-24">
              {headOfProgram?.qr_code_data && (
                <div className="p-1 border border-slate-200 rounded-lg bg-white">
                  <QRCode value={headOfProgram.qr_code_data} size={64} />
                </div>
              )}
              {headOfProgram?.signature_url ? (
                <img 
                  src={headOfProgram.signature_url} 
                  alt="Tanda Tangan" 
                  className="h-20 object-contain"
                  onError={(e) => e.currentTarget.style.display = 'none'} 
                />
              ) : (
                <div className="h-20 w-32 border-b border-dashed border-slate-300"></div>
              )}
            </div>

            <p className="text-sm font-bold underline">{dekanName}</p>
            <p className="text-xs text-slate-600 mt-1">NIP: {dekanNip}</p>
          </div>
        </div>
      )}
    </div>
  );
}
