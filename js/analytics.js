/**
 * Analytics & Weak Keys Detector
 * Heatmap analysis, problem key identification, and custom dynamic drill generator.
 */

class AnalyticsManager {
    constructor() {
        this.heatmapContainer = document.getElementById('weak-keys-heatmap');
        this.problemKeysListEl = document.getElementById('problem-keys-list');
        this.historyTableBody = document.getElementById('test-history-tbody');
    }

    refresh() {
        this.renderHeatmap();
        this.renderProblemKeys();
        this.renderTestHistory();
    }

    renderHeatmap() {
        if (!this.heatmapContainer || !window.storageManager) return;
        const stats = window.storageManager.getKeyStats();

        // Standard QWERTY layout characters to show
        const layout = [
            ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
            ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
            ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.']
        ];

        this.heatmapContainer.innerHTML = '';

        layout.forEach(row => {
            const rowEl = document.createElement('div');
            rowEl.className = 'heatmap-row flex justify-center gap-1.5 mb-1.5';

            row.forEach(char => {
                const s = stats[char] || { total: 0, errors: 0 };
                const total = s.total;
                const errors = s.errors;
                const accuracy = total > 0 ? Math.round(((total - errors) / total) * 100) : 100;

                // Color gradient based on accuracy & sample size
                let bgClass = 'bg-slate-800 text-slate-400 border-slate-700'; // untouched
                if (total >= 5) {
                    if (accuracy >= 96) bgClass = 'bg-emerald-950/80 text-emerald-300 border-emerald-600/50';
                    else if (accuracy >= 90) bgClass = 'bg-blue-950/80 text-blue-300 border-blue-600/50';
                    else if (accuracy >= 80) bgClass = 'bg-amber-950/80 text-amber-300 border-amber-600/50';
                    else bgClass = 'bg-rose-950/80 text-rose-300 border-rose-600/50 ring-1 ring-rose-500';
                }

                const keyBox = document.createElement('div');
                keyBox.className = `heatmap-key w-12 h-14 rounded-lg flex flex-col items-center justify-center border font-mono text-sm transition-transform hover:scale-110 shadow-sm ${bgClass}`;
                keyBox.innerHTML = `
                    <span class="font-bold text-base">${char.toUpperCase()}</span>
                    <span class="text-[10px] opacity-80">${total > 0 ? `${accuracy}%` : '-'}</span>
                `;
                rowEl.appendChild(keyBox);
            });

            this.heatmapContainer.appendChild(rowEl);
        });
    }

    getProblemKeys() {
        if (!window.storageManager) return [];
        const stats = window.storageManager.getKeyStats();
        const problemList = [];

        Object.keys(stats).forEach(char => {
            const { total, errors } = stats[char];
            if (total >= 4) {
                const accuracy = Math.round(((total - errors) / total) * 100);
                if (accuracy < 94 || errors >= 3) {
                    problemList.push({ char, total, errors, accuracy });
                }
            }
        });

        // Sort by lowest accuracy first, then error count
        problemList.sort((a, b) => a.accuracy - b.accuracy || b.errors - a.errors);
        return problemList;
    }

    renderProblemKeys() {
        if (!this.problemKeysListEl) return;
        const problemKeys = this.getProblemKeys();

        if (problemKeys.length === 0) {
            this.problemKeysListEl.innerHTML = `
                <div class="p-6 text-center text-slate-400 bg-slate-900/50 rounded-xl border border-slate-800">
                    <div class="text-3xl mb-2">🎯</div>
                    <div class="font-semibold text-slate-200">No Weak Keys Detected Yet!</div>
                    <div class="text-xs mt-1">Complete a few lessons or speed tests. The AI will pinpoint your difficult keys and generate custom drills.</div>
                </div>
            `;
            const drillBtn = document.getElementById('btn-generate-weak-drill');
            if (drillBtn) drillBtn.disabled = true;
            return;
        }

        const drillBtn = document.getElementById('btn-generate-weak-drill');
        if (drillBtn) drillBtn.disabled = false;

        this.problemKeysListEl.innerHTML = `
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                ${problemKeys.slice(0, 8).map(pk => `
                    <div class="p-3 bg-rose-950/30 border border-rose-900/50 rounded-xl flex items-center justify-between">
                        <div class="w-10 h-10 rounded-lg bg-rose-900/60 border border-rose-700 flex items-center justify-center font-bold text-lg text-rose-200">
                            ${pk.char.toUpperCase()}
                        </div>
                        <div class="text-right">
                            <div class="text-sm font-semibold text-rose-300">${pk.accuracy}% Acc</div>
                            <div class="text-xs text-rose-400/80">${pk.errors} errors (${pk.total} hits)</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    generateCustomWeakDrill() {
        const problemKeys = this.getProblemKeys();
        if (problemKeys.length === 0) return null;

        const targetChars = problemKeys.slice(0, 5).map(p => p.char);

        // Word dictionary for targeted training
        const dictionary = [
            'pack', 'quick', 'zoom', 'vibe', 'flux', 'lazy', 'jump', 'zero', 'pixel', 'exact',
            'brave', 'crazy', 'mixed', 'quiet', 'favor', 'globe', 'prize', 'heavy', 'spark',
            'jungle', 'galaxy', 'oxygen', 'rhythm', 'syntax', 'breeze', 'unique', 'matrix',
            'vector', 'wizard', 'beyond', 'flight', 'frozen', 'silver', 'bronze', 'jacket'
        ];

        // Find words with target characters
        const matchedWords = dictionary.filter(w => {
            return targetChars.some(c => w.includes(c));
        });

        // Add repetition patterns
        const drillPatterns = [];
        targetChars.forEach(c => {
            drillPatterns.push(`${c}${c}${c} f${c}j ${c}d${c} ${c}k${c}`);
        });

        const drillText = `${drillPatterns.join(' ')} ${matchedWords.join(' ')} ${matchedWords.reverse().join(' ')}`;

        return {
            id: 'custom-weak-drill-' + Date.now(),
            title: `Custom Weak Keys Drill: [ ${targetChars.map(c => c.toUpperCase()).join(', ')} ]`,
            instructions: `Targeted practice for your top problem keys: ${targetChars.map(c => c.toUpperCase()).join(', ')}. Focus on clean, deliberate keystrokes.`,
            fingers: ['Weak Key Focus'],
            newKeys: targetChars,
            targetWpm: 25,
            targetAcc: 98,
            text: drillText
        };
    }

    renderTestHistory() {
        if (!this.historyTableBody || !window.storageManager) return;
        const history = window.storageManager.getTestHistory();

        if (history.length === 0) {
            this.historyTableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-8 text-slate-500">
                        No speed tests taken yet. Head over to the Speed Test tab to take your first 1-minute test!
                    </td>
                </tr>
            `;
            return;
        }

        this.historyTableBody.innerHTML = history.slice(0, 10).map((h, i) => `
            <tr class="border-b border-slate-800/80 hover:bg-slate-800/30 transition-colors">
                <td class="py-3 px-4 font-mono text-slate-400">${h.date} ${h.time}</td>
                <td class="py-3 px-4 text-slate-300">${h.durationSeconds}s (${h.category})</td>
                <td class="py-3 px-4 font-bold text-amber-400 font-mono">${h.netWpm} WPM</td>
                <td class="py-3 px-4 text-slate-400 font-mono">${h.wpm} WPM</td>
                <td class="py-3 px-4 font-mono ${h.accuracy >= 95 ? 'text-emerald-400' : 'text-amber-400'}">${h.accuracy}%</td>
                <td class="py-3 px-4">
                    <button class="btn-cert-history text-xs text-sky-400 hover:text-sky-300 underline" data-index="${i}">
                        View Certificate
                    </button>
                </td>
            </tr>
        `).join('');

        // Bind history certificate view buttons
        document.querySelectorAll('.btn-cert-history').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.dataset.index, 10);
                const item = history[idx];
                if (item && window.certificateManager) {
                    window.certificateManager.openCertificate(item);
                }
            });
        });
    }
}

window.AnalyticsManager = AnalyticsManager;
