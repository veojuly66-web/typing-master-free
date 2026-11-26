import React, { useRef, useState } from 'react';
import { Printer, Download, X } from 'lucide-react';

export default function CertificateModal({
  stats,
  userName = 'Typist',
  onClose,
  testTitle = '5-Minute Typing Speed Test'
}) {
  const [name, setName] = useState(userName);
  const certRef = useRef(null);

  const { netWpm = 45, accuracy = 98, duration = 60 } = stats || {};

  const certDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const certId = 'PT-' + Math.random().toString(36).substring(2, 8).toUpperCase();

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPng = () => {
    // Generate clean canvas-based PNG download
    const canvas = document.createElement('canvas');
    canvas.width = 1120;
    canvas.height = 792; // Landscape ratio approx A4
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#FAFAF7';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle border
    ctx.strokeStyle = '#E7E5DF';
    ctx.lineWidth = 4;
    ctx.strokeRect(32, 32, canvas.width - 64, canvas.height - 64);

    // Inner thin border
    ctx.strokeStyle = '#1F6F54';
    ctx.lineWidth = 1;
    ctx.strokeRect(48, 48, canvas.width - 96, canvas.height - 96);

    // Wordmark
    ctx.fillStyle = '#1F6F54';
    ctx.font = 'bold 20px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('PANKAJ TYPING', canvas.width / 2, 120);

    // Heading
    ctx.fillStyle = '#1C1B19';
    ctx.font = '600 38px "Source Serif 4", Georgia, serif';
    ctx.fillText('Certificate of Completion', canvas.width / 2, 180);

    // Subtitle
    ctx.fillStyle = '#6B6862';
    ctx.font = '16px Inter, sans-serif';
    ctx.fillText('This document certifies that', canvas.width / 2, 240);

    // Recipient Name
    ctx.fillStyle = '#1C1B19';
    ctx.font = '600 44px "Source Serif 4", Georgia, serif';
    ctx.fillText(name || 'Typist', canvas.width / 2, 310);

    // Underline
    ctx.strokeStyle = '#E7E5DF';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 200, 335);
    ctx.lineTo(canvas.width / 2 + 200, 335);
    ctx.stroke();

    // Body text
    ctx.fillStyle = '#6B6862';
    ctx.font = '16px Inter, sans-serif';
    ctx.fillText(
      `has successfully demonstrated touch-typing proficiency on the ${testTitle}`,
      canvas.width / 2,
      385
    );

    // Metrics Row
    const metricsY = 470;
    // Box 1: Speed
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(canvas.width / 2 - 260, metricsY, 150, 100);
    ctx.strokeRect(canvas.width / 2 - 260, metricsY, 150, 100);
    ctx.fillStyle = '#1C1B19';
    ctx.font = 'bold 36px "JetBrains Mono", monospace';
    ctx.fillText(`${netWpm}`, canvas.width / 2 - 185, metricsY + 55);
    ctx.fillStyle = '#6B6862';
    ctx.font = '12px Inter, sans-serif';
    ctx.fillText('NET WPM', canvas.width / 2 - 185, metricsY + 85);

    // Box 2: Accuracy
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(canvas.width / 2 - 75, metricsY, 150, 100);
    ctx.strokeRect(canvas.width / 2 - 75, metricsY, 150, 100);
    ctx.fillStyle = '#1F6F54';
    ctx.font = 'bold 36px "JetBrains Mono", monospace';
    ctx.fillText(`${accuracy}%`, canvas.width / 2, metricsY + 55);
    ctx.fillStyle = '#6B6862';
    ctx.font = '12px Inter, sans-serif';
    ctx.fillText('ACCURACY', canvas.width / 2, metricsY + 85);

    // Box 3: Duration
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(canvas.width / 2 + 110, metricsY, 150, 100);
    ctx.strokeRect(canvas.width / 2 + 110, metricsY, 150, 100);
    ctx.fillStyle = '#1C1B19';
    ctx.font = 'bold 36px "JetBrains Mono", monospace';
    ctx.fillText(`${Math.round(duration / 60)}m`, canvas.width / 2 + 185, metricsY + 55);
    ctx.fillStyle = '#6B6862';
    ctx.font = '12px Inter, sans-serif';
    ctx.fillText('DURATION', canvas.width / 2 + 185, metricsY + 85);

    // Footer lines
    const footerY = 670;
    ctx.fillStyle = '#6B6862';
    ctx.font = '13px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Issued: ${certDate}`, 80, footerY);
    ctx.fillText(`Certificate ID: ${certId}`, 80, footerY + 24);

    ctx.textAlign = 'right';
    ctx.fillText('pankaj typing', canvas.width - 80, footerY);
    ctx.fillText('veojuly66-web.github.io/typing-master-free', canvas.width - 80, footerY + 24);

    // Trigger download
    const link = document.createElement('a');
    link.download = `pankaj-typing-certificate-${certId}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-sm overflow-y-auto">
      <div className="relative max-w-3xl w-full my-6">
        {/* Actions bar (hidden in print) */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3 print:hidden">
          <div className="flex items-center gap-2">
            <label htmlFor="recipient-name" className="text-xs text-ink-muted">Name on certificate:</label>
            <input
              id="recipient-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-2.5 py-1 text-xs rounded-btn bg-paper-surface border border-paper-border text-ink focus:outline-none focus:border-accent"
              placeholder="Your name"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadPng}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-btn bg-accent hover:bg-accent-hover text-white text-xs font-medium transition-colors shadow-subtle"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PNG</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-btn border border-paper-border bg-paper-surface hover:bg-paper text-ink text-xs font-medium transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close certificate"
              className="p-1.5 rounded-btn text-ink-muted hover:text-ink transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Certificate Card (Printable) */}
        <div
          ref={certRef}
          className="bg-[#FAFAF7] text-[#1C1B19] rounded-card p-8 sm:p-12 border-2 border-[#E7E5DF] relative shadow-xl print:m-0 print:border print:shadow-none"
        >
          {/* Inner Accent Line */}
          <div className="border border-[#1F6F54]/30 rounded p-6 sm:p-8">
            <div className="text-center mb-6">
              <div className="text-xs font-semibold uppercase tracking-widest text-[#1F6F54] mb-2 font-mono">
                Pankaj Typing
              </div>
              <h2 className="text-2xl sm:text-3xl font-semibold font-serif text-[#1C1B19] tracking-tight">
                Certificate of Completion
              </h2>
              <p className="text-xs text-[#6B6862] mt-1">
                Touch Typing Performance Assessment
              </p>
            </div>

            <div className="text-center my-6">
              <p className="text-xs text-[#6B6862]">This is awarded to</p>
              <div className="text-2xl sm:text-3xl font-serif text-[#1C1B19] border-b border-[#E7E5DF] pb-1.5 max-w-sm mx-auto mt-2">
                {name || 'Typist'}
              </div>
              <p className="text-xs text-[#6B6862] max-w-md mx-auto mt-3 leading-relaxed">
                for demonstrating sustained touch-typing speed and accuracy standards on the {testTitle}.
              </p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto my-6 text-center">
              <div className="p-3 bg-white border border-[#E7E5DF] rounded">
                <div className="text-[10px] text-[#6B6862] uppercase tracking-wider">Net Speed</div>
                <div className="font-mono text-2xl font-semibold text-[#1C1B19] mt-0.5">{netWpm}</div>
                <div className="text-[10px] text-[#6B6862]">WPM</div>
              </div>

              <div className="p-3 bg-white border border-[#E7E5DF] rounded">
                <div className="text-[10px] text-[#6B6862] uppercase tracking-wider">Accuracy</div>
                <div className="font-mono text-2xl font-semibold text-[#1F6F54] mt-0.5">{accuracy}%</div>
                <div className="text-[10px] text-[#6B6862]">Correct</div>
              </div>

              <div className="p-3 bg-white border border-[#E7E5DF] rounded">
                <div className="text-[10px] text-[#6B6862] uppercase tracking-wider">Duration</div>
                <div className="font-mono text-2xl font-semibold text-[#1C1B19] mt-0.5">{Math.round(duration / 60)}m</div>
                <div className="text-[10px] text-[#6B6862]">Benchmark</div>
              </div>
            </div>

            {/* Certificate Footer */}
            <div className="flex items-end justify-between pt-6 border-t border-[#E7E5DF] mt-6 text-xs text-[#6B6862]">
              <div>
                <div>Date: {certDate}</div>
                <div className="text-[10px] font-mono mt-0.5">ID: {certId}</div>
              </div>

              <div className="text-right">
                <div className="font-medium text-[#1C1B19]">pankaj typing</div>
                <div className="text-[10px] mt-0.5">Free Touch Typing Tutor</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
