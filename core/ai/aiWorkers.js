// aiWorkers.js - Real AI Workers powered by Gemini API
// Each worker routes to appropriate model tier and builds context-aware prompts

window.LogaritmaAIWorkers = {

    // ─────────────────────────────────────────────
    // BRIEF ANALYZER — uses gemini-2.5-pro (complex)
    // ─────────────────────────────────────────────
    brief_analyzer: {
        analyze: async function(context) {
            const systemPrompt = window.LogaritmaPromptRegistry['brief_analyzer'].instruction +
                '\n\nBahasa: Bahasa Indonesia. Respond ONLY in this JSON format: {"insight": "...", "recommendation": "...", "confidence": number_0_to_100}';

            const brief = context.brief || {};
            const userPrompt = `Analisis brief berikut:\n` +
                `- Produk: ${brief.product?.value || 'Tidak disebutkan'}\n` +
                `- Objektif: ${brief.objective?.value || 'Tidak disebutkan'}\n` +
                `- Target Area: ${brief.area?.value || 'Tidak disebutkan'}\n` +
                `- Promo: ${brief.promo?.value || 'Tidak disebutkan'}\n` +
                `- Catatan: ${brief.notes?.value || '-'}\n` +
                `- Budget Iklan: Rp ${(context.finances?.adsBudget || 0).toLocaleString('id-ID')}\n` +
                `- Paket: ${context.package?.name || 'Tidak diketahui'}`;

            return await window.LogaritmaGeminiAdapter.call('pro', systemPrompt, userPrompt);
        }
    },

    // ─────────────────────────────────────────────
    // COPYWRITER — uses gemini-2.5-flash
    // ─────────────────────────────────────────────
    copywriter: {
        generate: async function(context) {
            const systemPrompt = window.LogaritmaPromptRegistry['copywriter'].instruction +
                '\n\nBahasa: Bahasa Indonesia. Respond ONLY in this JSON format: {"insight": "Penjelasan singkat strategi copy", "recommendation": "Rekomendasi penggunaan", "confidence": number_0_to_100, "payload": ["Copy A...", "Copy B...", "Copy C..."]}';

            const brief = context.brief || {};
            const userPrompt = `Buat 3 variasi ad copy untuk:\n` +
                `- Produk: ${brief.product?.value || 'Produk'}\n` +
                `- Target: ${brief.area?.value || 'Indonesia'}\n` +
                `- Promo: ${brief.promo?.value || 'Penawaran terbaik'}\n` +
                `- Objektif: ${brief.objective?.value || 'Leads'}\n` +
                `Gunakan tone yang persuasif dan sesuai dengan audiens produk tersebut.`;

            return await window.LogaritmaGeminiAdapter.call('flash', systemPrompt, userPrompt);
        }
    },

    // ─────────────────────────────────────────────
    // ADS STRATEGIST — uses gemini-2.5-pro
    // ─────────────────────────────────────────────
    ads_strategist: {
        recommend_strategy: async function(context) {
            const systemPrompt = window.LogaritmaPromptRegistry['ads_strategist'].instruction +
                '\n\nBahasa: Bahasa Indonesia. Respond ONLY in this JSON format: {"insight": "...", "recommendation": "...", "confidence": number_0_to_100}';

            const budget = context.finances?.adsBudget || 0;
            const brief = context.brief || {};
            const userPrompt = `Buat strategi campaign Meta Ads:\n` +
                `- Budget: Rp ${budget.toLocaleString('id-ID')}\n` +
                `- Durasi: ${context.package?.name || '7 Hari'}\n` +
                `- Objektif: ${brief.objective?.value || 'Leads'}\n` +
                `- Target Area: ${brief.area?.value || 'Indonesia'}\n` +
                `- Produk: ${brief.product?.value || 'Umum'}\n` +
                `Sertakan rekomendasi audience targeting, placement, dan budget split.`;

            return await window.LogaritmaGeminiAdapter.call('pro', systemPrompt, userPrompt);
        }
    },

    // ─────────────────────────────────────────────
    // REPORT ANALYST — uses gemini-2.5-flash
    // ─────────────────────────────────────────────
    report_analyst: {
        analyze: async function(context) {
            const systemPrompt = window.LogaritmaPromptRegistry['report_analyst'].instruction +
                '\n\nBahasa: Bahasa Indonesia. Respond ONLY in this JSON format: {"insight": "...", "recommendation": "...", "confidence": number_0_to_100}';

            const report = context.report || {};
            const userPrompt = `Analisis laporan campaign berikut:\n` +
                `- CTR: ${report.ctr || 'Data belum tersedia'}\n` +
                `- CPL: ${report.cpl || 'Data belum tersedia'}\n` +
                `- Reach: ${report.reach || 'Data belum tersedia'}\n` +
                `- Spend: ${report.spend || 'Data belum tersedia'}\n` +
                `- Produk: ${context.brief?.product?.value || 'Umum'}\n` +
                `Berikan insight tentang performa dan rekomendasi optimasi konkret.`;

            return await window.LogaritmaGeminiAdapter.call('flash', systemPrompt, userPrompt);
        }
    },

    // ─────────────────────────────────────────────
    // OPERATIONS MANAGER — uses gemini-2.0-flash-lite (cepat & ringan)
    // ─────────────────────────────────────────────
    operations_manager: {
        check_sla: async function(context) {
            const systemPrompt = window.LogaritmaPromptRegistry['operations_manager'].instruction +
                '\n\nBahasa: Bahasa Indonesia. Respond ONLY in this JSON format: {"insight": "...", "recommendation": "...", "confidence": number_0_to_100}';

            const createdAt = context.timestamps?.createdAt || 'Tidak diketahui';
            const status = context.status || 'unknown';
            const checklist = context.checklist || [];
            const doneItems = Array.isArray(checklist) ? checklist.filter(c => c.done).length : 0;
            const totalItems = Array.isArray(checklist) ? checklist.length : 0;

            const userPrompt = `Cek status Work Order:\n` +
                `- ID: ${context.id || 'N/A'}\n` +
                `- Status: ${status}\n` +
                `- Dibuat: ${createdAt}\n` +
                `- Checklist: ${doneItems}/${totalItems} selesai\n` +
                `- Paket: ${context.package?.name || 'Tidak diketahui'}\n` +
                `Apakah ada risiko keterlambatan? Apa tindakan yang harus dilakukan segera?`;

            return await window.LogaritmaGeminiAdapter.call('flashLite', systemPrompt, userPrompt);
        }
    },

    // ─────────────────────────────────────────────
    // OWNER ASSISTANT — uses gemini-2.5-flash
    // Dashboard command center summary (real data dari WorkOrderEngine)
    // ─────────────────────────────────────────────
    owner_assistant: {
        daily_brief: async function(context) {
            // Ambil data nyata dari WorkOrderEngine
            let woStats = { total: 0, running: 0, pending: 0, needAttention: 0, revenue: 0 };
            if (window.LogaritmaWorkOrderEngine) {
                try {
                    const allWO = await window.LogaritmaWorkOrderEngine.getAllWorkOrders() || [];
                    woStats.total = allWO.length;
                    woStats.running = allWO.filter(w => w.status === 'running_ads').length;
                    woStats.pending = allWO.filter(w =>
                        ['pending_payment', 'awaiting_brief', 'awaiting_setup'].includes(w.status)
                    ).length;
                    woStats.needAttention = allWO.filter(w =>
                        w.status === 'awaiting_brief' || w.status === 'awaiting_setup'
                    ).length;
                    woStats.revenue = allWO
                        .filter(w => w.status !== 'pending_payment')
                        .reduce((sum, w) => sum + (w.finances?.total || 0), 0);
                } catch(e) { console.warn('[AI Owner] WO data unavailable', e); }
            }

            const systemPrompt = window.LogaritmaPromptRegistry['owner_assistant'].instruction +
                '\n\nBahasa: Bahasa Indonesia. Respond ONLY in this JSON format: ' +
                '{"insight": "ringkasan singkat 1-2 kalimat", "recommendation": "1 tindakan prioritas utama yang harus dilakukan owner sekarang", "confidence": number_0_to_100}';

            const userPrompt = `Ringkas situasi operasional agensi hari ini:\n` +
                `- Total Work Orders: ${woStats.total}\n` +
                `- Campaign Aktif (Running): ${woStats.running}\n` +
                `- Menunggu Tindakan: ${woStats.pending}\n` +
                `- Perlu Perhatian Segera: ${woStats.needAttention}\n` +
                `- Total Revenue (WO aktif): Rp ${woStats.revenue.toLocaleString('id-ID')}\n` +
                `Berikan ringkasan singkat dan 1 rekomendasi prioritas utama untuk owner.`;

            const llmResult = await window.LogaritmaGeminiAdapter.call('flash', systemPrompt, userPrompt);

            // Render command center UI dengan data real + AI insight
            const commandCenterHTML = `
                <div class="space-y-4">
                    <div class="text-center pb-2 border-b border-slate-700/50">
                        <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Today's Summary (Live)</span>
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        <div class="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50 flex flex-col items-center justify-center">
                            <span class="text-xs text-slate-400 mb-1">Revenue</span>
                            <span class="text-lg font-bold text-emerald-400">Rp ${woStats.revenue.toLocaleString('id-ID')}</span>
                        </div>
                        <div class="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50 flex flex-col items-center justify-center">
                            <span class="text-xs text-slate-400 mb-1">Total WO</span>
                            <span class="text-lg font-bold text-blue-400">${woStats.total}</span>
                        </div>
                        <div class="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50 flex flex-col items-center justify-center">
                            <span class="text-xs text-slate-400 mb-1">Running</span>
                            <span class="text-lg font-bold text-amber-400">${woStats.running}</span>
                        </div>
                        <div class="bg-slate-900/50 p-3 rounded-lg border ${woStats.needAttention > 0 ? 'border-red-500/30' : 'border-slate-700/50'} flex flex-col items-center justify-center">
                            <span class="text-xs ${woStats.needAttention > 0 ? 'text-red-400' : 'text-slate-400'} mb-1">Need Attention</span>
                            <span class="text-lg font-bold ${woStats.needAttention > 0 ? 'text-red-500' : 'text-slate-400'}">${woStats.needAttention}</span>
                        </div>
                    </div>
                    ${llmResult._error ? '' : `
                    <div class="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                        <p class="text-[10px] font-bold text-blue-400 mb-1 uppercase">🤖 AI Insight</p>
                        <p class="text-xs text-slate-300 leading-relaxed">${llmResult.insight || ''}</p>
                    </div>`}
                </div>
            `;

            return {
                insight: commandCenterHTML,
                recommendation: llmResult.recommendation || 'Periksa Work Order yang membutuhkan perhatian.',
                confidence: llmResult.confidence || 85
            };
        }
    }
};