const ENCODED_KEY = "QVEuQWI4Uk42TGgtNl9pTWdrdFpqNk1JeHJMT0lUZmczVU9Pb3dndEZYdzBZckpWcHZvVnc=";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${atob(ENCODED_KEY)}`;

document.addEventListener("DOMContentLoaded", () => {
    const btnSop = document.getElementById("btn-generate-sop");
    if (!btnSop) return;

    let aiQuota = parseInt(localStorage.getItem("logaritma_ai_quota") || "2");
    
    btnSop.addEventListener("click", async () => {
        const inputVal = document.getElementById("input-sop").value;
        if(!inputVal) {
            alert("Masukkan nama proses bisnis terlebih dahulu.");
            return;
        }

        const currentUserStr = localStorage.getItem("logarithm_current_user");
        let isPremium = false;
        let userCat = "UMKM";

        if(currentUserStr) {
            const cu = JSON.parse(currentUserStr);
            isPremium = (cu.status === "PREMIUM");
            userCat = cu.kategori || "UMKM";
        }

        if (!isPremium && aiQuota <= 0) {
            document.getElementById("paywall-modal").classList.remove("hidden");
            document.body.style.overflow = "hidden";
            return;
        }

        if (!isPremium) {
            aiQuota--;
            localStorage.setItem("logaritma_ai_quota", aiQuota);
            // Panggil fungsi updateQuotaUI dari main.js jika ada
            if(typeof window.updateQuotaUI === "function") {
                window.updateQuotaUI(aiQuota);
            }
        }

        // Tampilkan State Loading
        document.getElementById("ai-loading").classList.remove("hidden");
        document.getElementById("ai-result").classList.add("hidden");
        btnSop.disabled = true;
        btnSop.textContent = "Sedang Memproses...";
        
        // Ubah teks loading sesuai request
        const loadingText = document.querySelector("#ai-loading p");
        if (loadingText) {
            loadingText.textContent = "🛡️ Tim Spesialis Logaritma sedang meracik sistem operasional Anda...";
        }

        try {
            // Dynamic Prompt Generator
            let roleContext = "Tim Rekayasa Operasional Logaritma (Konsultan & Asisten Bisnis Profesional UMKM Indonesia). Dilarang keras menyebut kata AI, LLM, atau Bot. Bertindaklah penuh sebagai 'Tim Spesialis Operasional Logaritma'. Gunakan bahasa profesional, tegas, solutif, dan empati khas praktisi bisnis.";
            let outputFormat = "SOP Lengkap, Checklist Kualitas, dan KPI.";

            if (userCat.toLowerCase().includes("kuliner") || userCat.toLowerCase().includes("f&b")) {
                roleContext = "Tim Spesialis Operasional Kuliner Logaritma. Dilarang keras menyebut kata AI, LLM, atau Bot. Bertindaklah penuh sebagai 'Tim Spesialis Operasional Logaritma'. Gunakan bahasa profesional, tegas, solutif, dan empati khas praktisi bisnis kuliner.";
                outputFormat = "Analisis margin porsi tergerus, SOP Takaran Dapur Resipis, dan Panduan Menu Combo/Upselling Kasir terkait kegiatan tersebut.";
            } else if (userCat.toLowerCase().includes("fashion")) {
                roleContext = "Tim Analis Sales & Inventori Logaritma. Dilarang keras menyebut kata AI, LLM, atau Bot. Bertindaklah penuh sebagai 'Tim Spesialis Operasional Logaritma'. Gunakan bahasa profesional, tegas, solutif, dan empati khas praktisi bisnis fashion.";
                outputFormat = "Analisis stok mati (deadstock), Skrip Follow-Up Chat Sales CS, SOP Bundling Promo, dan Draft Broadcast WhatsApp terkait kegiatan tersebut.";
            } else if (userCat.toLowerCase().includes("cetak") || userCat.toLowerCase().includes("jasa")) {
                roleContext = "Tim QC & Production Engineering Logaritma. Dilarang keras menyebut kata AI, LLM, atau Bot. Bertindaklah penuh sebagai 'Tim Spesialis Operasional Logaritma'. Gunakan bahasa profesional, tegas, solutif, dan empati khas praktisi bisnis percetakan.";
                outputFormat = "Analisis potensi delay/mis-print, Checklist QC Sebelum Cetak, dan SOP Handling File Desain terkait kegiatan tersebut.";
            } else if (userCat.toLowerCase().includes("pkl") || userCat.toLowerCase().includes("lapak")) {
                roleContext = "Tim Pendamping Cashflow Lapak Logaritma. Dilarang keras menyebut kata AI, LLM, atau Bot. Bertindaklah penuh sebagai 'Tim Spesialis Operasional Logaritma'. Gunakan bahasa profesional, tegas, solutif, dan empati khas praktisi bisnis PKL.";
                outputFormat = "Analisis kebocoran kas dapur vs usaha, Aturan Ambil Gaji Owner Harian, dan Target Jual Porsi Harian terkait kegiatan tersebut.";
            }

            const promptText = `
System Persona: ${roleContext}
Format Output: Format menggunakan markdown yang rapi dengan heading dan bullet point. Jangan bertele-tele, langsung berikan: ${outputFormat}.

Masalah/Kegiatan Bisnis Pengguna: "${inputVal}"

Buatkan rekomendasi operasionalnya.
            `;

            const requestBody = {
                contents: [{
                    parts: [{ text: promptText }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 2048,
                }
            };

            const response = await fetch(GEMINI_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error("API Timeout atau Error Server.");
            }

            const data = await response.json();
            const resultText = data.candidates[0].content.parts[0].text;
            
            // Simpan raw markdown di variabel global untuk fitur Copy
            window.latestGeminiResult = resultText;

            renderResult(resultText, isPremium);

        } catch (error) {
            console.error("Gemini API Error:", error);
            showElegantError("Sistem sedang mengalami peningkatan layanan. Mohon coba beberapa saat lagi.");
        } finally {
            document.getElementById("ai-loading").classList.add("hidden");
            document.getElementById("ai-result").classList.remove("hidden");
            btnSop.disabled = false;
            btnSop.innerHTML = "Eksekusi Rekomendasi Tim Logaritma ⚡";
        }
    });

    function showElegantError(message) {
        let errDiv = document.getElementById("elegant-toast");
        if (!errDiv) {
            errDiv = document.createElement("div");
            errDiv.id = "elegant-toast";
            errDiv.className = "fixed top-5 right-5 z-[200] max-w-sm w-full bg-slate-900 border border-rose-500/30 rounded-xl shadow-[0_0_40px_-10px_rgba(244,63,94,0.3)] p-4 transform transition-all duration-500 translate-x-[150%] flex gap-4 items-start";
            
            errDiv.innerHTML = `
                <div class="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center shrink-0 border border-rose-500/20">
                    <span class="text-rose-400 text-xl">⚠️</span>
                </div>
                <div>
                    <h4 class="text-white font-bold text-sm mb-1 font-heading">Kendala Teknis</h4>
                    <p class="text-slate-400 text-xs leading-relaxed" id="elegant-toast-msg"></p>
                </div>
                <button onclick="document.getElementById('elegant-toast').classList.add('translate-x-[150%]')" class="absolute top-4 right-4 text-slate-500 hover:text-white transition">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            `;
            document.body.appendChild(errDiv);
        }
        
        document.getElementById("elegant-toast-msg").textContent = message;
        
        // Show
        setTimeout(() => {
            errDiv.classList.remove("translate-x-[150%]");
        }, 100);
        
        // Auto hide
        setTimeout(() => {
            errDiv.classList.add("translate-x-[150%]");
        }, 5000);
    }

    function renderResult(markdownText, isPremium) {
        const contentDiv = document.getElementById("ai-content");
        
        // Bersihkan area
        contentDiv.innerHTML = "";
        
        // Pisahkan markdown berdasarkan double newline (paragraf/heading)
        const paragraphs = markdownText.split(/\n\s*\n/).filter(p => p.trim() !== "");
        
        if (isPremium) {
            // Render semua 100%
            contentDiv.innerHTML = marked.parse(markdownText);
            // Pastikan overlay paywall hilang
            const overlay = document.querySelector("#ai-result .absolute.bottom-0");
            if (overlay) overlay.classList.add("hidden");
        } else {
            // Potong hasil setelah 2 paragraf pertama
            const allowedContent = paragraphs.slice(0, 2).join("\n\n");
            
            // Buat Dummy paragraf yang diblur
            let dummyContent = paragraphs.slice(2).join("\n\n");
            if (!dummyContent) {
                dummyContent = "## Langkah Selanjutnya\n\nUntuk langkah selanjutnya, Anda dapat melihat detail implementasi operasional yang mencakup SOP Harian, Indikator Kinerja, dan Checklist Evaluasi.\n\n### Quality Control\n\nPastikan semua standar diterapkan dengan konsisten.";
            }
            
            const htmlAllowed = marked.parse(allowedContent);
            const htmlBlurred = marked.parse(dummyContent);
            
            contentDiv.innerHTML = `
                <div class="text-slate-300 space-y-4 markdown-content">
                    ${htmlAllowed}
                </div>
                <div class="text-slate-300 space-y-4 markdown-content opacity-40 blur-[3px] select-none mt-4 pointer-events-none relative">
                    ${htmlBlurred}
                    <div class="absolute inset-0 z-10 bg-slate-900/10"></div>
                </div>
            `;
            
            // Munculkan overlay paywall
            const overlay = document.querySelector("#ai-result .absolute.bottom-0");
            if (overlay) overlay.classList.remove("hidden");
        }
    }

    // Fitur Copy
    const btnCopy = document.getElementById("btn-copy-sop");
    if (btnCopy) {
        btnCopy.addEventListener("click", () => {
            if (window.latestGeminiResult) {
                navigator.clipboard.writeText(window.latestGeminiResult)
                    .then(() => alert("Berhasil di-copy!"))
                    .catch(err => alert("Gagal copy teks."));
            }
        });
    }

});
