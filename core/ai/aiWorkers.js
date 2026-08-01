// aiWorkers.js - Mock implementations for various AI Specialists
window.LogaritmaAIWorkers = {
    brief_analyzer: {
        analyze: function(context) {
            const missing = [];
            if(!context.brief || !context.brief.target_location) missing.push("Target Area Spesifik");
            if(!context.brief || !context.brief.offer_details) missing.push("Promo/Penawaran Khusus");
            
            if(missing.length > 0) {
                return {
                    insight: "Brief kurang lengkap. Membutuhkan informasi tambahan: " + missing.join(", "),
                    recommendation: "Minta klien melengkapi detail tersebut agar performa iklan maksimal.",
                    confidence: 95
                };
            }
            return {
                insight: "Brief sudah lengkap dan siap dieksekusi.",
                recommendation: "Lanjutkan ke pembuatan copywriting dan visual.",
                confidence: 88
            };
        }
    },
    copywriter: {
        generate: function(context) {
            const product = (context.brief && context.brief.product_focus) ? context.brief.product_focus.value : "Produk";
            return {
                insight: "Menghasilkan 3 variasi copywriting untuk " + product + ".",
                recommendation: "Gunakan variasi A untuk A/B Testing minggu pertama.",
                confidence: 92,
                payload: [
                    "Variasi A: Dapatkan " + product + " dengan promo eksklusif hari ini!",
                    "Variasi B: Kenapa " + product + " adalah pilihan terbaik untuk bisnis Anda?",
                    "Variasi C: Waktu terbatas! Klaim diskon " + product + " sekarang."
                ]
            };
        }
    },
    ads_strategist: {
        recommend_strategy: function(context) {
            const budget = context.finances ? context.finances.adsBudget : 0;
            const obj = (context.brief && context.brief.campaign_goal) ? context.brief.campaign_goal.value : "Conversion";
            return {
                insight: `Dengan budget Rp ${budget.toLocaleString()} dan objektif ${obj}, strategi optimal adalah CBO (Campaign Budget Optimization).`,
                recommendation: "Bagi budget menjadi 70% Broad Audience dan 30% Retargeting.",
                confidence: 87
            };
        }
    },
    report_analyst: {
        analyze: function(context) {
            // Mocking a report insight
            return {
                insight: "CTR (Click Through Rate) minggu ini berada di 1.2%, sedikit di bawah standar 1.5%.",
                recommendation: "Refresh materi kreatif video dan lakukan testing pada angle edukasi.",
                confidence: 78
            };
        }
    },
    operations_manager: {
        check_sla: function(context) {
            return {
                insight: "SLA pengerjaan masih tersisa 24 jam.",
                recommendation: "Segera selesaikan Setup Ads Manager agar tidak terjadi keterlambatan.",
                confidence: 99
            };
        }
    },
    owner_assistant: {
        daily_brief: function(context) {
            const commandCenterHTML = `
                <div class="space-y-4">
                    <div class="text-center pb-2 border-b border-slate-700/50">
                        <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Today's Summary</span>
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        <div class="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50 flex flex-col items-center justify-center">
                            <span class="text-xs text-slate-400 mb-1">Revenue</span>
                            <span class="text-lg font-bold text-emerald-400">Rp822.000</span>
                        </div>
                        <div class="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50 flex flex-col items-center justify-center">
                            <span class="text-xs text-slate-400 mb-1">New Orders</span>
                            <span class="text-lg font-bold text-blue-400">4</span>
                        </div>
                        <div class="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50 flex flex-col items-center justify-center">
                            <span class="text-xs text-slate-400 mb-1">Running</span>
                            <span class="text-lg font-bold text-amber-400">11</span>
                        </div>
                        <div class="bg-slate-900/50 p-3 rounded-lg border border-red-500/30 flex flex-col items-center justify-center">
                            <span class="text-xs text-red-400 mb-1">Need Attention</span>
                            <span class="text-lg font-bold text-red-500">2</span>
                        </div>
                    </div>
                </div>
            `;
            
            return {
                insight: commandCenterHTML,
                recommendation: "Prioritaskan WO-021 karena SLA tinggal 2 jam.",
                confidence: 98
            };
        }
    }
};