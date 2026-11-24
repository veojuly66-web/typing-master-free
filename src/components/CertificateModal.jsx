import React, { useRef, useState } from 'react';
import { Award, Download, Printer, X, CheckCircle, ShieldCheck } from 'lucide-react';

export default function CertificateModal({
  stats,
  userName = 'Master Typist',
  onClose,
  testTitle = '5-Minute Official Certification Exam'
}) {
  const [name, setName] = useState(userName);
  const [isEditingName, setIsEditingName] = useState(false);
  const certRef = useRef(null);

  const { netWpm = 45, accuracy = 98, duration = 60 } = stats || {};

  const certDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const certId = 'TM-' + Math.random().toString(36).substring(2, 9).toUpperCase();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative max-w-3xl w-full my-8">
        {/* Top Floating Actions */}
        <div className="flex items-center justify-between gap-3 mb-4 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Recipient Name:</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 text-sm text-white font-medium focus:outline-none focus:border-blue-500"
              placeholder="Enter your name"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Certificate Canvas / Card (Printable) */}
        <div 
          ref={certRef}
          className="bg-gradient-to-br from-amber-50/95 via-white to-amber-50/95 text-slate-900 rounded-3xl p-8 sm:p-12 shadow-2xl border-8 border-double border-amber-600/40 relative overflow-hidden select-none print:m-0 print:border-4"
        >
          {/* Subtle Watermark background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <Award className="w-96 h-96 text-amber-900" />
          </div>

          {/* Ornate Corner Accents */}
          <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-amber-600/80" />
          <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-amber-600/80" />
          <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-amber-600/80" />
          <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-amber-600/80" />

          {/* Certificate Header */}
          <div className="text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-800 text-xs font-bold uppercase tracking-widest mb-3">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Typing Master Verified Certificate</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 uppercase font-serif">
              Certificate of Achievement
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 uppercase tracking-widest font-semibold">
              Touch Typing Professional Proficiency
            </p>
          </div>

          {/* Recipient Presentation */}
          <div className="text-center my-8 relative z-10">
            <p className="text-sm text-slate-500 italic">This is proudly presented to</p>
            <div className="text-3xl sm:text-4xl font-extrabold text-blue-900 font-serif border-b-2 border-amber-600/50 pb-2 max-w-md mx-auto mt-2 tracking-wide">
              {name || 'Typist'}
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto mt-4 leading-relaxed">
              for successfully completing the official Typing Master speed and accuracy assessment benchmark under touch-typing standards.
            </p>
          </div>

          {/* Verified Stats Badges */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto my-6 relative z-10">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-center shadow-sm">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Net Speed</div>
              <div className="text-2xl sm:text-3xl font-black text-blue-700 font-mono mt-0.5">
                {netWpm}
              </div>
              <div className="text-[10px] text-slate-500 font-medium">Words / Min</div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-center shadow-sm">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Accuracy</div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-700 font-mono mt-0.5">
                {accuracy}%
              </div>
              <div className="text-[10px] text-slate-500 font-medium">Touch Typing</div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-center shadow-sm">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Duration</div>
              <div className="text-2xl sm:text-3xl font-black text-purple-700 font-mono mt-0.5">
                {Math.round(duration / 60)}m
              </div>
              <div className="text-[10px] text-slate-500 font-medium">Timed Test</div>
            </div>
          </div>

          {/* Certificate Footer with Gold Seal & Signatures */}
          <div className="flex items-end justify-between pt-6 border-t border-amber-200/80 mt-8 relative z-10">
            <div className="text-left text-xs text-slate-600">
              <div className="font-semibold text-slate-800">Date Issued:</div>
              <div>{certDate}</div>
              <div className="text-[10px] text-slate-400 mt-1 font-mono">Certificate ID: {certId}</div>
            </div>

            {/* Official Gold Seal Graphic */}
            <div className="relative flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-500 p-1 shadow-lg flex items-center justify-center ring-4 ring-amber-300/50">
                <div className="w-full h-full rounded-full border-2 border-dashed border-amber-800/60 flex flex-col items-center justify-center text-center p-1 bg-gradient-to-b from-amber-400 to-yellow-500">
                  <Award className="w-6 h-6 text-amber-900" />
                  <span className="text-[8px] font-black uppercase text-amber-950 tracking-tighter leading-tight mt-0.5">
                    GOLD SEAL
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right text-xs text-slate-600">
              <div className="font-serif italic text-base text-slate-800 border-b border-slate-400 pb-0.5">
                Typing Master Academy
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Automated Proctor System</div>
              <div className="text-[10px] text-emerald-700 font-semibold mt-1">Verified 100% Free Lifetime</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
