import React from 'react';
import QRCode from 'react-qr-code';

interface HeadOfProgramData {
  name: string;
  nip: string;
  signature_url: string;
  qr_code_data: string;
}

interface ReportTemplateProps {
  title: string;
  subtitle?: string;
  dateRange?: { start: string; end: string };
  children: React.ReactNode;
  headOfProgram: HeadOfProgramData | null;
  requireSignature?: boolean;
}

export default function ReportTemplate({
  title,
  subtitle,
  dateRange,
  children,
  headOfProgram,
  requireSignature = false,
}: ReportTemplateProps) {
  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="bg-white p-8 w-full max-w-[210mm] mx-auto text-slate-900 print:p-0 print:max-w-none print:w-full print:bg-transparent shadow-sm print:shadow-none min-h-[297mm]">
      
      {/* KOP SURAT / HEADER */}
      <div className="flex items-center border-b-2 border-slate-900 pb-6 mb-6">
        <div className="flex-1 text-center">
          <h1 className="text-xl font-bold uppercase tracking-wider mb-1">Intervox Platform</h1>
          <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Sistem Pelatihan Wawancara Cerdas Berbasis AI</h2>
          <p className="text-xs text-slate-500 mt-2">Jl. Contoh Kampus No. 123, Kota Pendidikan, 12345</p>
        </div>
      </div>

      {/* REPORT TITLE */}
      <div className="text-center mb-8">
        <h3 className="text-lg font-bold underline uppercase">{title}</h3>
        {subtitle && <p className="text-sm text-slate-600 mt-1">{subtitle}</p>}
        {dateRange && (
          <p className="text-xs text-slate-500 mt-2">
            Periode: {dateRange.start} s.d {dateRange.end}
          </p>
        )}
      </div>

      {/* REPORT CONTENT (TABLES/CHARTS) */}
      <div className="mb-12 min-h-[400px]">
        {children}
      </div>

      {/* PENGESAHAN / SIGNATURE BLOCK */}
      {requireSignature && headOfProgram && (
        <div className="flex justify-end mt-16 print:mt-auto break-inside-avoid">
          <div className="text-center">
            <p className="text-sm mb-1">Kota Pendidikan, {currentDate}</p>
            <p className="text-sm font-semibold mb-4">Kepala Program Studi</p>
            
            <div className="flex justify-center items-center gap-4 my-4 h-24">
              {headOfProgram.qr_code_data && (
                <div className="p-1 border border-slate-200 rounded-lg bg-white">
                  <QRCode value={headOfProgram.qr_code_data} size={64} />
                </div>
              )}
              {headOfProgram.signature_url ? (
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

            <p className="text-sm font-bold underline">{headOfProgram.name || 'Nama Kepala Program'}</p>
            <p className="text-xs text-slate-600 mt-1">NIP/NIDN: {headOfProgram.nip || '.......................'}</p>
          </div>
        </div>
      )}
    </div>
  );
}
