const ENCODED_KEY = "QVEuQWI4Uk42TGgtNl9pTWdrdFpqNk1JeHJMT0lUZmczVU9Pb3dndEZYdzBZckpWcHZvVnc=";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${atob(ENCODED_KEY)}`;

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
            alert("Maaf, Tim Logaritma sedang mengalami kendala teknis dalam meracik sistem Anda. Silakan coba lagi.");
        } finally {
            document.getElementById("ai-loading").classList.add("hidden");
            document.getElementById("ai-result").classList.remove("hidden");
            btnSop.disabled = false;
            btnSop.innerHTML = "Eksekusi Rekomendasi Tim Logaritma ⚡";
        }
    });

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
