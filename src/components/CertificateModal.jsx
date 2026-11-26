import React, { useRef, useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { Printer, Download, FileText, X, Check } from 'lucide-react';
import { Storage } from '../lib/storage';

export default function CertificateModal({
  stats,
  userName = 'Typist',
  onClose,
  testTitle = '5-Minute Typing Speed Test'
}) {
  const savedSettings = Storage.getSettings();
  const [name, setName] = useState(() => savedSettings.userName || userName || 'Typist');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const certRef = useRef(null);

  const { netWpm = 45, grossWpm = 48, accuracy = 98, duration = 60 } = stats || {};

  const certDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const [certId] = useState(() => 'PT-' + Math.random().toString(36).substring(2, 8).toUpperCase());

  // Save certificate to Storage on mount or name change
  useEffect(() => {
    try {
      Storage.saveCertificate({
        id: certId,
        userName: name,
        testTitle,
        netWpm,
        grossWpm,
        accuracy,
        duration,
        date: certDate
      });
      setSavedSuccess(true);
    } catch (e) {
      console.error('Failed to save certificate', e);
    }
  }, [certId, name, testTitle, netWpm, grossWpm, accuracy, duration, certDate]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = 297;
    const pageHeight = 210;

    // Background: #FAFAF7 (warm off-white)
    doc.setFillColor(250, 250, 247);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Outer subtle border: #E7E5DF
    doc.setDrawColor(231, 229, 223);
    doc.setLineWidth(1.2);
    doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

    // Inner deep green border: #1F6F54
    doc.setDrawColor(31, 111, 84);
    doc.setLineWidth(0.4);
    doc.rect(16, 16, pageWidth - 32, pageHeight - 32);

    // Header Logo & Brand
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(31, 111, 84);
    doc.text('PANKAJ TYPING', pageWidth / 2, 34, { align: 'center' });

    // Main Heading
    doc.setFont('times', 'bold');
    doc.setFontSize(26);
    doc.setTextColor(28, 27, 25);
    doc.text('Certificate of Typing Speed', pageWidth / 2, 48, { align: 'center' });

    // Subtitle
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(107, 104, 98);
    doc.text('This document certifies that', pageWidth / 2, 62, { align: 'center' });

    // Recipient Name
    doc.setFont('times', 'bold');
    doc.setFontSize(30);
    doc.setTextColor(28, 27, 25);
    doc.text(name || 'Typist', pageWidth / 2, 82, { align: 'center' });

    // Decorative rule under name
    doc.setDrawColor(231, 229, 223);
    doc.setLineWidth(0.8);
    doc.line(pageWidth / 2 - 50, 88, pageWidth / 2 + 50, 88);

    // Achievement statement
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(107, 104, 98);
    doc.text(
      `has successfully demonstrated verified touch-typing proficiency on the ${testTitle}.`,
      pageWidth / 2,
      98,
      { align: 'center' }
    );

    // Metrics Row (3 Boxes)
    const boxY = 114;
    const boxW = 48;
    const boxH = 32;

    // Box 1: Net Speed
    const box1X = pageWidth / 2 - 76;
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(231, 229, 223);
    doc.rect(box1X, boxY, boxW, boxH, 'FD');
    doc.setFont('courier', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(28, 27, 25);
    doc.text(`${netWpm}`, box1X + boxW / 2, boxY + 16, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(107, 104, 98);
    doc.text('NET WPM', box1X + boxW / 2, boxY + 24, { align: 'center' });

    // Box 2: Accuracy
    const box2X = pageWidth / 2 - boxW / 2;
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(231, 229, 223);
    doc.rect(box2X, boxY, boxW, boxH, 'FD');
    doc.setFont('courier', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(31, 111, 84);
    doc.text(`${accuracy}%`, box2X + boxW / 2, boxY + 16, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(107, 104, 98);
    doc.text('ACCURACY', box2X + boxW / 2, boxY + 24, { align: 'center' });

    // Box 3: Benchmark Duration
    const box3X = pageWidth / 2 + 28;
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(231, 229, 223);
    doc.rect(box3X, boxY, boxW, boxH, 'FD');
    doc.setFont('courier', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(28, 27, 25);
    const durLabel = duration >= 60 ? `${Math.round(duration / 60)}m` : `${duration}s`;
    doc.text(durLabel, box3X + boxW / 2, boxY + 16, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(107, 104, 98);
    doc.text('BENCHMARK', box3X + boxW / 2, boxY + 24, { align: 'center' });

    // Footer info
    const footerY = 175;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(107, 104, 98);
    doc.text(`Issued: ${certDate}`, 24, footerY);
    doc.setFont('courier', 'normal');
    doc.setFontSize(8);
    doc.text(`Certificate ID: ${certId}`, 24, footerY + 6);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(28, 27, 25);
    doc.text('Pankaj Typing Tutor', pageWidth - 24, footerY, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(107, 104, 98);
    doc.text('veojuly66-web.github.io/typing-master-free', pageWidth - 24, footerY + 6, { align: 'right' });

    doc.save(`pankaj-typing-certificate-${certId}.pdf`);
  };

  const handleDownloadPng = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 840;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#FAFAF7';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle Outer Border
    ctx.strokeStyle = '#E7E5DF';
    ctx.lineWidth = 4;
    ctx.strokeRect(36, 36, canvas.width - 72, canvas.height - 72);

    // Inner Accent Border
    ctx.strokeStyle = '#1F6F54';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(52, 52, canvas.width - 104, canvas.height - 104);

    // Wordmark
    ctx.fillStyle = '#1F6F54';
    ctx.font = 'bold 18px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('PANKAJ TYPING', canvas.width / 2, 120);

    // Title
    ctx.fillStyle = '#1C1B19';
    ctx.font = '600 38px "Source Serif 4", Georgia, serif';
    ctx.fillText('Certificate of Typing Speed', canvas.width / 2, 180);

    // Subtitle
    ctx.fillStyle = '#6B6862';
    ctx.font = '16px Inter, sans-serif';
    ctx.fillText('This document certifies that', canvas.width / 2, 235);

    // Name
    ctx.fillStyle = '#1C1B19';
    ctx.font = '600 44px "Source Serif 4", Georgia, serif';
    ctx.fillText(name || 'Typist', canvas.width / 2, 310);

    // Underline
    ctx.strokeStyle = '#E7E5DF';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 180, 335);
    ctx.lineTo(canvas.width / 2 + 180, 335);
    ctx.stroke();

    // Body text
    ctx.fillStyle = '#6B6862';
    ctx.font = '16px Inter, sans-serif';
    ctx.fillText(
      `has successfully demonstrated verified touch-typing proficiency on the ${testTitle}`,
      canvas.width / 2,
      385
    );

    // Metrics Row
    const metricsY = 470;
    // Box 1: Speed
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(canvas.width / 2 - 270, metricsY, 160, 105);
    ctx.strokeRect(canvas.width / 2 - 270, metricsY, 160, 105);
    ctx.fillStyle = '#1C1B19';
    ctx.font = 'bold 36px "JetBrains Mono", monospace';
    ctx.fillText(`${netWpm}`, canvas.width / 2 - 190, metricsY + 55);
    ctx.fillStyle = '#6B6862';
    ctx.font = '12px Inter, sans-serif';
    ctx.fillText('NET WPM', canvas.width / 2 - 190, metricsY + 85);

    // Box 2: Accuracy
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(canvas.width / 2 - 80, metricsY, 160, 105);
    ctx.strokeRect(canvas.width / 2 - 80, metricsY, 160, 105);
    ctx.fillStyle = '#1F6F54';
    ctx.font = 'bold 36px "JetBrains Mono", monospace';
    ctx.fillText(`${accuracy}%`, canvas.width / 2, metricsY + 55);
    ctx.fillStyle = '#6B6862';
    ctx.font = '12px Inter, sans-serif';
    ctx.fillText('ACCURACY', canvas.width / 2, metricsY + 85);

    // Box 3: Duration
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(canvas.width / 2 + 110, metricsY, 160, 105);
    ctx.strokeRect(canvas.width / 2 + 110, metricsY, 160, 105);
    ctx.fillStyle = '#1C1B19';
    ctx.font = 'bold 36px "JetBrains Mono", monospace';
    const durLabel = duration >= 60 ? `${Math.round(duration / 60)}m` : `${duration}s`;
    ctx.fillText(durLabel, canvas.width / 2 + 190, metricsY + 55);
    ctx.fillStyle = '#6B6862';
    ctx.font = '12px Inter, sans-serif';
    ctx.fillText('BENCHMARK', canvas.width / 2 + 190, metricsY + 85);

    // Footer
    const footerY = 700;
    ctx.fillStyle = '#6B6862';
    ctx.font = '13px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Issued: ${certDate}`, 90, footerY);
    ctx.fillText(`Certificate ID: ${certId}`, 90, footerY + 24);

    ctx.textAlign = 'right';
    ctx.fillText('Pankaj Typing Tutor', canvas.width - 90, footerY);
    ctx.fillText('veojuly66-web.github.io/typing-master-free', canvas.width - 90, footerY + 24);

    const link = document.createElement('a');
    link.download = `pankaj-typing-certificate-${certId}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 overflow-y-auto animate-fadeIn">
      <div className="relative max-w-3xl w-full my-6">
        {/* Actions bar (hidden in print) */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3 print:hidden bg-paper-surface border border-paper-border rounded-card p-3 shadow-subtle">
          <div className="flex items-center gap-2">
            <label htmlFor="recipient-name" className="text-xs text-ink-muted">Name on certificate:</label>
            <input
              id="recipient-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-2.5 py-1 text-xs rounded-btn bg-paper border border-paper-border text-ink focus:outline-none focus:border-accent"
              placeholder="Your name"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-btn bg-accent hover:bg-accent-hover text-white text-xs font-medium transition-colors shadow-subtle"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPng}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-btn border border-paper-border bg-paper hover:bg-paper-border/60 text-ink text-xs font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PNG</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-btn border border-paper-border bg-paper hover:bg-paper-border/60 text-ink text-xs font-medium transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close certificate modal"
              className="p-1.5 rounded-btn text-ink-muted hover:text-ink transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Certificate Card (Printable) */}
        <div
          ref={certRef}
          className="bg-[#FAFAF7] text-[#1C1B19] rounded-card p-8 sm:p-12 border-2 border-[#E7E5DF] relative shadow-overlay print:m-0 print:border print:shadow-none"
        >
          {/* Inner Accent Line */}
          <div className="border border-[#1F6F54]/30 rounded p-6 sm:p-8">
            <div className="text-center mb-6">
              <div className="text-xs font-semibold uppercase tracking-widest text-[#1F6F54] mb-2 font-mono">
                Pankaj Typing
              </div>
              <h2 className="text-2xl sm:text-3xl font-semibold font-serif text-[#1C1B19] tracking-tight">
                Certificate of Typing Speed
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
                <div className="font-mono text-2xl font-semibold tabular-nums text-[#1C1B19] mt-0.5">{netWpm}</div>
                <div className="text-[10px] text-[#6B6862]">WPM</div>
              </div>

              <div className="p-3 bg-white border border-[#E7E5DF] rounded">
                <div className="text-[10px] text-[#6B6862] uppercase tracking-wider">Accuracy</div>
                <div className="font-mono text-2xl font-semibold tabular-nums text-[#1F6F54] mt-0.5">{accuracy}%</div>
                <div className="text-[10px] text-[#6B6862]">Correct</div>
              </div>

              <div className="p-3 bg-white border border-[#E7E5DF] rounded">
                <div className="text-[10px] text-[#6B6862] uppercase tracking-wider">Duration</div>
                <div className="font-mono text-2xl font-semibold tabular-nums text-[#1C1B19] mt-0.5">
                  {duration >= 60 ? `${Math.round(duration / 60)}m` : `${duration}s`}
                </div>
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
                <div className="font-medium text-[#1C1B19]">Pankaj Typing Tutor</div>
                <div className="text-[10px] mt-0.5">veojuly66-web.github.io/typing-master-free</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
