/**
 * Certificate Generator
 * Produces an authentic, high-resolution certificate of completion
 * with custom recipient name, speed metrics, official seal, and PNG export.
 */

class CertificateManager {
    constructor() {
        this.currentData = null;
        this.modal = document.getElementById('certificate-modal');
        this.initDOM();
    }

    initDOM() {
        const closeBtn = document.getElementById('btn-close-certificate');
        if (closeBtn) closeBtn.onclick = () => this.close();

        const printBtn = document.getElementById('btn-print-certificate');
        if (printBtn) printBtn.onclick = () => window.print();

        const downloadBtn = document.getElementById('btn-download-certificate');
        if (downloadBtn) downloadBtn.onclick = () => this.downloadCertificatePNG();

        const nameInput = document.getElementById('cert-student-name-input');
        if (nameInput) {
            nameInput.addEventListener('input', (e) => {
                const nameDisplay = document.getElementById('cert-student-name-display');
                if (nameDisplay) {
                    nameDisplay.textContent = e.target.value || 'Typing Champion';
                }
                if (window.storageManager) {
                    const u = window.storageManager.getUser();
                    u.name = e.target.value;
                    window.storageManager.saveUser(u);
                }
            });
        }
    }

    openCertificate(data) {
        this.currentData = data || {
            netWpm: 45,
            wpm: 48,
            accuracy: 97,
            durationSeconds: 60,
            date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        };

        const u = window.storageManager ? window.storageManager.getUser() : { name: 'Typing Champion' };
        const nameInput = document.getElementById('cert-student-name-input');
        const nameDisplay = document.getElementById('cert-student-name-display');

        if (nameInput) nameInput.value = u.name || 'Typing Champion';
        if (nameDisplay) nameDisplay.textContent = u.name || 'Typing Champion';

        const netWpmEl = document.getElementById('cert-net-wpm');
        const grossWpmEl = document.getElementById('cert-gross-wpm');
        const accEl = document.getElementById('cert-accuracy');
        const dateEl = document.getElementById('cert-date');
        const idEl = document.getElementById('cert-serial-id');

        if (netWpmEl) netWpmEl.textContent = this.currentData.netWpm || this.currentData.wpm;
        if (grossWpmEl) grossWpmEl.textContent = this.currentData.wpm;
        if (accEl) accEl.textContent = `${this.currentData.accuracy}%`;
        if (dateEl) dateEl.textContent = this.currentData.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        if (idEl) idEl.textContent = `TMF-${Math.floor(100000 + Math.random() * 900000)}`;

        if (this.modal) this.modal.classList.add('open');
    }

    close() {
        if (this.modal) this.modal.classList.remove('open');
    }

    downloadCertificatePNG() {
        const studentName = document.getElementById('cert-student-name-display')?.textContent || 'Typing Champion';
        const netWpm = this.currentData ? (this.currentData.netWpm || this.currentData.wpm) : 45;
        const accuracy = this.currentData ? this.currentData.accuracy : 97;
        const dateStr = this.currentData?.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        const serial = document.getElementById('cert-serial-id')?.textContent || 'TMF-982341';

        // Render to high-res offscreen canvas
        const canvas = document.createElement('canvas');
        canvas.width = 1600;
        canvas.height = 1100;
        const ctx = canvas.getContext('2d');

        // Background
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Subtle gradient inner card
        const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        grad.addColorStop(0, '#1e293b');
        grad.addColorStop(1, '#090d16');
        ctx.fillStyle = grad;
        ctx.fillRect(40, 40, canvas.width - 80, canvas.height - 80);

        // Gold Ornate Borders
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 6;
        ctx.strokeRect(60, 60, canvas.width - 120, canvas.height - 120);

        ctx.strokeStyle = '#ca8a04';
        ctx.lineWidth = 2;
        ctx.strokeRect(75, 75, canvas.width - 150, canvas.height - 150);

        // Corner Flourishes
        const drawCorner = (x, y, flipX, flipY) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
            ctx.strokeStyle = '#facc15';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(10, 30);
            ctx.lineTo(10, 10);
            ctx.lineTo(30, 10);
            ctx.stroke();
            ctx.restore();
        };
        drawCorner(90, 90, false, false);
        drawCorner(canvas.width - 90, 90, true, false);
        drawCorner(90, canvas.height - 90, false, true);
        drawCorner(canvas.width - 90, canvas.height - 90, true, true);

        // Header Title
        ctx.fillStyle = '#94a3b8';
        ctx.font = 'bold 24px "Inter", sans-serif';
        ctx.textAlign = 'center';
        ctx.letterSpacing = '6px';
        ctx.fillText('TYPING MASTER FREE • OFFICIAL CERTIFICATION', canvas.width / 2, 160);

        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 64px "Georgia", serif';
        ctx.fillText('Certificate of Achievement', canvas.width / 2, 250);

        ctx.fillStyle = '#38bdf8';
        ctx.font = '22px "Inter", sans-serif';
        ctx.letterSpacing = '2px';
        ctx.fillText('THIS IS PROUDLY PRESENTED TO', canvas.width / 2, 330);

        // Recipient Name
        ctx.fillStyle = '#facc15';
        ctx.font = 'bold 58px "Georgia", serif';
        ctx.fillText(studentName, canvas.width / 2, 420);

        // Underline
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2 - 250, 445);
        ctx.lineTo(canvas.width / 2 + 250, 445);
        ctx.stroke();

        // Certification text
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '22px "Inter", sans-serif';
        ctx.fillText('for successfully demonstrating touch-typing proficiency, velocity, and accuracy', canvas.width / 2, 510);
        ctx.fillText('under timed standardized assessment conditions.', canvas.width / 2, 545);

        // Stat Badges
        const drawStatBox = (x, y, label, value) => {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.strokeStyle = 'rgba(234, 179, 8, 0.4)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(x - 120, y - 50, 240, 100, 12);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#f8fafc';
            ctx.font = 'bold 44px "Inter", sans-serif';
            ctx.fillText(value, x, y + 10);

            ctx.fillStyle = '#94a3b8';
            ctx.font = '14px "Inter", sans-serif';
            ctx.fillText(label.toUpperCase(), x, y + 36);
        };

        drawStatBox(canvas.width / 2 - 200, 680, 'Net Speed', `${netWpm} WPM`);
        drawStatBox(canvas.width / 2 + 200, 680, 'Accuracy', `${accuracy}%`);

        // Gold Seal Stamp (Center/Bottom)
        ctx.save();
        ctx.translate(canvas.width / 2, 850);
        ctx.fillStyle = '#ca8a04';
        ctx.beginPath();
        ctx.arc(0, 0, 50, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, 42, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px "Inter", sans-serif';
        ctx.fillText('OFFICIAL', 0, -6);
        ctx.fillText('VERIFIED', 0, 12);
        ctx.restore();

        // Date and Serial
        ctx.fillStyle = '#64748b';
        ctx.font = '16px "Courier New", monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`Issued: ${dateStr}`, 120, 980);
        ctx.fillText(`Certificate ID: ${serial}`, 120, 1010);

        ctx.textAlign = 'right';
        ctx.fillText('Typing Master Free Academic Board', canvas.width - 120, 980);
        ctx.fillText('www.typingmasterfree.org', canvas.width - 120, 1010);

        // Trigger download
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `Typing_Certificate_${studentName.replace(/\s+/g, '_')}.png`;
        link.href = dataUrl;
        link.click();
    }
}

window.certificateManager = null;
