const ENCODED_KEY = "QVEuQWI4Uk42TGgtNl9pTWdrdFpqNk1JeHJMT0lUZmczVU9Pb3dndEZYdzBZckpWcHZvVnc=";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${atob(ENCODED_KEY)}`;

// Init User State & Toggle UI Immediately
(function initWorkspaceUI() {
    const currentUserStr = localStorage.getItem("logarithm_current_user");
    let userCat = "UMKM";

    if(currentUserStr) {
        try {
            const cu = JSON.parse(currentUserStr);
            userCat = cu.kategori || "UMKM";
        } catch(e) {}
    }

    const calcDefaultContainer = document.getElementById("calc-default-container");
    const calcFbContainer = document.getElementById("calc-fb-container");
    
    if(userCat.toLowerCase().includes("kuliner") || userCat.toLowerCase().includes("f&b")) {
        if(calcDefaultContainer) calcDefaultContainer.classList.add("hidden");
        if(calcFbContainer) calcFbContainer.classList.remove("hidden");
        const supportTitle = document.getElementById("support-box-title");
        if(supportTitle) supportTitle.textContent = "Tim Spesialis Operasional Kuliner Logaritma";
    }
})();

window.updateSopBadge = function updateSopBadge() {
    const targetBadge = document.getElementById("sop-target-badge");
    const targetText = document.getElementById("sop-target-text");
    if (!targetBadge || !targetText) return;

    const dataStrFb = localStorage.getItem("logaritma_fb_target");
    const dataStrDef = localStorage.getItem("logaritma_default_target");
    
    const currentUserStr = localStorage.getItem("logarithm_current_user");
    let isFb = false;
    if(currentUserStr) {
        try {
            const cu = JSON.parse(currentUserStr);
            const userCat = cu.kategori || "";
            if (userCat.toLowerCase().includes("kuliner") || userCat.toLowerCase().includes("f&b")) {
                isFb = true;
            }
        } catch(e) {}
    }

    try {
        if (isFb && dataStrFb) {
            const data = JSON.parse(dataStrFb);
            const fRupiah = (num) => new Intl.NumberFormat("id-ID", {style: "currency", currency: "IDR", maximumFractionDigits: 0}).format(num);
            targetText.textContent = `Target Operasional Anda Saat Ini: ${data.porsiHari} Porsi/Hari | HPP Max: ${fRupiah(data.batasBelanja)}`;
            targetBadge.classList.remove("hidden");
        } else if (dataStrDef) {
            const data = JSON.parse(dataStrDef);
            const fRupiah = (num) => new Intl.NumberFormat("id-ID", {style: "currency", currency: "IDR", maximumFractionDigits: 0}).format(num);
            targetText.textContent = `Target Bulanan Anda Saat Ini: ${Math.round(data.targetUnitBulan)} Unit | Estimasi Traffic: ${Math.round(data.leadsHarian)} Leads/hari`;
            targetBadge.classList.remove("hidden");
        } else {
            targetBadge.classList.add("hidden");
        }
    } catch (e) {
        targetBadge.classList.add("hidden");
    }
}
updateSopBadge();

document.addEventListener("DOMContentLoaded", () => {
    const btnSop = document.getElementById("btn-generate-sop");
    
    // Init User State for other functions
    const currentUserStr = localStorage.getItem("logarithm_current_user");
    let isPremium = false;
    let userCat = "UMKM";

    if(currentUserStr) {
        try {
            const cu = JSON.parse(currentUserStr);
            isPremium = (cu.status === "PREMIUM");
            userCat = cu.kategori || "UMKM";
        } catch(e) {}
    }

    // F&B Calculator Logic
    const btnKalkulasiFb = document.getElementById("btn-kalkulasi-fb");
    let calculatedFbData = null;

    if (btnKalkulasiFb) {
        btnKalkulasiFb.addEventListener("click", () => {
            const valProfit = parseFloat(document.getElementById("fb-input-profit").value.replace(/\./g, "")) || 0;
            const valHarga = parseFloat(document.getElementById("fb-input-harga").value.replace(/\./g, "")) || 0;
            const valMargin = parseFloat(document.getElementById("fb-input-margin").value) || 0;
            const valHari = parseFloat(document.getElementById("fb-input-hari").value) || 30;

            if(valProfit === 0 || valHarga === 0 || valMargin === 0 || valHari === 0) {
                Swal.fire({text: "Mohon isi semua data perhitungan dengan benar.", background: '#0f172a', color: '#cbd5e1', confirmButtonColor: '#10b981'});
                return;
            }

            const omzetBulan = valProfit / (valMargin / 100);
            const omzetHari = omzetBulan / valHari;
            const porsiHari = Math.ceil(omzetHari / valHarga);
            const batasBelanja = omzetHari * 0.45; // HPP 45%
            const targetTraffic = Math.ceil(porsiHari / 0.40); // CR 40%

            calculatedFbData = {
                omzetBulan,
                omzetHari,
                porsiHari,
                batasBelanja,
                targetTraffic,
                hari: valHari
            };
            
            localStorage.setItem("logaritma_fb_target", JSON.stringify(calculatedFbData));
            updateSopBadge();

            const fRupiah = (num) => new Intl.NumberFormat("id-ID", {style: "currency", currency: "IDR", maximumFractionDigits: 0}).format(num);
            
            document.getElementById("fb-hasil-omzet-bln").textContent = fRupiah(omzetBulan);
            document.getElementById("fb-hasil-omzet-hr").textContent = fRupiah(omzetHari);
            document.getElementById("fb-hasil-porsi").textContent = porsiHari + " Porsi";
            document.getElementById("fb-hasil-belanja").textContent = fRupiah(batasBelanja) + " / hari";

            document.getElementById("fb-gemini-desc").textContent = `Sistem mencatat Anda wajib menjual ${porsiHari} porsi/hari dengan batas belanja bahan baku ${fRupiah(batasBelanja)}/hari. Izinkan Tim Logaritma merancang SOP Dapur, Skrip Upselling Kasir, dan Checklist Audit Kas Malam Anda.`;
            
            document.getElementById("hasil-fb").classList.remove("hidden");
            // Scroll to hasil
            document.getElementById("hasil-fb").scrollIntoView({behavior: "smooth"});
        });
    }

    // F&B Gemini Integration
    let aiQuota = parseInt(localStorage.getItem("logaritma_ai_quota") || "2");
    
    const btnGenerateFbSop = document.getElementById("btn-generate-fb-sop");
    if (btnGenerateFbSop) {
        btnGenerateFbSop.addEventListener("click", async () => {
            if (!calculatedFbData) return;

            if (!isPremium && aiQuota <= 0) {
                document.getElementById("paywall-modal").classList.remove("hidden");
                document.body.style.overflow = "hidden";
                return;
            }
            if (!isPremium) {
                aiQuota--;
                localStorage.setItem("logaritma_ai_quota", aiQuota);
                if(typeof window.updateQuotaUI === "function") window.updateQuotaUI(aiQuota);
            }

            document.getElementById("fb-gemini-loading").classList.remove("hidden");
            document.getElementById("fb-gemini-output").classList.add("hidden");
            btnGenerateFbSop.disabled = true;
            btnGenerateFbSop.textContent = "Sedang Meracik...";

            const prompt = `Anda adalah Tim Rekayasa Operasional Logaritma (Konsultan F&B Profesional). Klien adalah pemilik usaha Kuliner.
Berdasarkan perhitungan Tarik Mundur, klien menargetkan:
- Omzet Bulanan: Rp ${calculatedFbData.omzetBulan}
- Omzet Harian: Rp ${calculatedFbData.omzetHari}
- Hari Buka: ${calculatedFbData.hari} Hari
- Target Jual: ${calculatedFbData.porsiHari} Porsi/Hari
- Batas Belanja Bahan (HPP 45%): Rp ${calculatedFbData.batasBelanja}/Hari

Tolong buatkan dokumen operasional yang SANGAT DETAIL, TERSTRUKTUR DAN PRAKTIS. Format markdown. Gunakan heading, list, tabel jika perlu. Dilarang menggunakan kata 'AI', posisikan diri Anda sebagai 'Tim Logaritma'.

Isi Dokumen Wajib Memuat:
1. SOP Dapur & Pengendalian HPP (Sertakan cara menjaga batas belanja Rp ${calculatedFbData.batasBelanja}/hari dan kontrol gramasi)
2. Skrip Upselling Kasir (Berikan contoh skrip dialog kasir untuk mencapai target ${calculatedFbData.porsiHari} porsi/hari)
3. Checklist Evaluasi & Audit Kas Malam (Checklist untuk closing kasir dan dapur)`;

            try {
                const response = await fetch(GEMINI_API_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: { temperature: 0.7, maxOutputTokens: 2048 }
                    })
                });

                if (!response.ok) throw new Error("Network response was not ok");

                const data = await response.json();
                const aiResultText = data.candidates[0].content.parts[0].text;
                
                renderResultFb(aiResultText, isPremium);
            } catch (error) {
                console.error("Gemini API Error:", error);
                showElegantError("Sistem sedang mengalami peningkatan layanan. Mohon coba beberapa saat lagi.");
            } finally {
                document.getElementById("fb-gemini-loading").classList.add("hidden");
                document.getElementById("fb-gemini-output").classList.remove("hidden");
                btnGenerateFbSop.disabled = false;
                btnGenerateFbSop.innerHTML = "Generate Dokumen Operasional Kuliner Saya";
            }
        });
    }

    function renderResultFb(markdownText, isPremium) {
        const contentDiv = document.getElementById("fb-gemini-content");
        if (isPremium) {
            contentDiv.innerHTML = marked.parse(markdownText);
            window.latestGeminiFbResult = markdownText;
        } else {
            // Cut text to 40% and blur the rest
            const rawHtml = marked.parse(markdownText);
            const words = rawHtml.split(" ");
            const showCount = Math.floor(words.length * 0.4);
            const htmlAllowed = words.slice(0, showCount).join(" ");
            const htmlBlurred = words.slice(showCount).join(" ");
            
            contentDiv.innerHTML = `
                <div class="text-slate-300 space-y-4 markdown-content">
                    ${htmlAllowed}
                </div>
                <div class="text-slate-300 space-y-4 markdown-content opacity-40 blur-[3px] select-none mt-4 pointer-events-none relative">
                    ${htmlBlurred}
                    <div class="absolute inset-0 z-10 bg-slate-900/10"></div>
                </div>
                <div class="mt-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg text-center">
                    <p class="text-amber-400 text-sm font-bold mb-2">Buka Kunci Seluruh Dokumen</p>
                    <button class="trigger-paywall bg-amber-500 hover:bg-amber-400 text-black font-bold py-2 px-6 rounded transition">Upgrade ke PRO</button>
                </div>
            `;
        }
    }

    const btnCopyFb = document.getElementById("btn-copy-fb-sop");
    if (btnCopyFb) {
        btnCopyFb.addEventListener("click", () => {
            if (window.latestGeminiFbResult) {
                navigator.clipboard.writeText(window.latestGeminiFbResult)
                    .then(() => Swal.fire({text: "Berhasil di-copy!", background: '#0f172a', color: '#cbd5e1', confirmButtonColor: '#10b981'}))
                    .catch(err => Swal.fire({text: "Gagal copy teks.", background: '#0f172a', color: '#cbd5e1', confirmButtonColor: '#10b981'}));
            } else {
                Swal.fire({text: "Harap upgrade ke Premium untuk mengcopy seluruh dokumen.", background: '#0f172a', color: '#cbd5e1', confirmButtonColor: '#10b981'});
            }
        });
    }

    if (!btnSop) return;
    
    btnSop.addEventListener("click", async () => {
        const inputVal = document.getElementById("input-sop").value;
        if(!inputVal) {
            Swal.fire({text: "Masukkan nama proses bisnis terlebih dahulu.", background: '#0f172a', color: '#cbd5e1', confirmButtonColor: '#10b981'});
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

            let targetInfo = "";
            const dataStrFb = localStorage.getItem("logaritma_fb_target");
            const dataStrDef = localStorage.getItem("logaritma_default_target");
            
            if (dataStrFb && (userCat.toLowerCase().includes("kuliner") || userCat.toLowerCase().includes("f&b"))) {
                try {
                    const data = JSON.parse(dataStrFb);
                    targetInfo = `\n[Konteks Target Klien Saat Ini: Target Jual ${data.porsiHari} Porsi/Hari, Batas Belanja HPP: Rp ${data.batasBelanja}/hari. Pastikan panduan/SOP yang Anda buat mendukung pencapaian target ini.]\n`;
                } catch(e) {}
            } else if (dataStrDef) {
                try {
                    const data = JSON.parse(dataStrDef);
                    targetInfo = `\n[Konteks Target Klien Saat Ini: Target Penjualan Bulanan ${Math.round(data.targetUnitBulan)} Unit, Target Traffic/Leads: ${Math.round(data.leadsHarian)} leads/hari. Pastikan panduan/SOP yang Anda buat mendukung pencapaian target ini.]\n`;
                } catch(e) {}
            }

            const promptText = `
System Persona: ${roleContext}
Format Output: Format menggunakan markdown yang rapi dengan heading dan bullet point. Jangan bertele-tele, langsung berikan: ${outputFormat}.

Masalah/Kegiatan Bisnis Pengguna: "${inputVal}"
${targetInfo}
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
                    .then(() => Swal.fire({text: "Berhasil di-copy!", background: '#0f172a', color: '#cbd5e1', confirmButtonColor: '#10b981'}))
                    .catch(err => Swal.fire({text: "Gagal copy teks.", background: '#0f172a', color: '#cbd5e1', confirmButtonColor: '#10b981'}));
            }
        });
    }

});
