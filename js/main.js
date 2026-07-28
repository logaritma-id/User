document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Modal Logic
    const modal = document.getElementById('cta-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const ctaButtons = document.querySelectorAll('.open-modal-btn');

    if (modal && closeModalBtn) {
        ctaButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                modal.classList.remove('hidden');
                modal.classList.add('flex');
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            });
        });

        closeModalBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            document.body.style.overflow = 'auto'; // Restore scrolling
        });

        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Error Modal Logic
    const errorModal = document.getElementById('error-modal');
    const closeErrorModalBtn = document.getElementById('close-error-modal-btn');
    const okErrorModalBtn = document.getElementById('ok-error-modal-btn');
    
    if (errorModal) {
        const closeErrorModal = () => {
            errorModal.classList.add('hidden');
            errorModal.classList.remove('flex');
            document.body.style.overflow = 'auto';
        };
        
        if (closeErrorModalBtn) closeErrorModalBtn.addEventListener('click', closeErrorModal);
        if (okErrorModalBtn) okErrorModalBtn.addEventListener('click', closeErrorModal);
        
        errorModal.addEventListener('click', (e) => {
            if (e.target === errorModal) {
                closeErrorModal();
            }
        });
    }

    // Calculator Logic (Praktisi Page)
    const btnHitung = document.getElementById('btn-hitung-skor');
    if (btnHitung) {
        btnHitung.addEventListener('click', () => {
            const q1 = document.querySelector('input[name="q1"]:checked');
            const q2 = document.querySelector('input[name="q2"]:checked');
            const q3 = document.querySelector('input[name="q3"]:checked');

            if (!q1 || !q2 || !q3) {
                alert("Mohon jawab seluruh 3 pertanyaan untuk menghitung skor.");
                return;
            }

            const total = parseInt(q1.value) + parseInt(q2.value) + parseInt(q3.value);
            const skorAngka = document.getElementById('skor-angka');
            const skorPesan = document.getElementById('skor-pesan');
            const skorResult = document.getElementById('skor-result');

            skorAngka.textContent = total + " / 30";
            
            if (total <= 10) {
                skorAngka.className = "text-5xl font-black text-red-500 font-heading mb-4";
                skorPesan.innerHTML = "Organisasi Anda berada dalam status <strong class='text-red-400'>Bahaya (Silo Parah)</strong>. Sebagian besar anggaran berisiko terbuang untuk kegiatan tanpa dampak.";
            } else if (total <= 20) {
                skorAngka.className = "text-5xl font-black text-yellow-500 font-heading mb-4";
                skorPesan.innerHTML = "Organisasi Anda berstatus <strong class='text-yellow-400'>Transisi</strong>. Ada niat baik menuju outcome, namun sistem keterlacakan (traceability) masih bocor.";
            } else {
                skorAngka.className = "text-5xl font-black text-green-500 font-heading mb-4";
                skorPesan.innerHTML = "Luar biasa! Organisasi Anda berstatus <strong class='text-green-400'>Sehat & Terlacak</strong>. Sistem closed-loop Anda meminimalisir waste anggaran.";
            }

            skorResult.classList.remove('hidden');
            
            // Smooth scroll ke hasil
            skorResult.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Re-bind modal for the dynamic button inside result
            const modal = document.getElementById('cta-modal');
            const newBtn = skorResult.querySelector('.open-modal-btn');
            if (newBtn && modal) {
                newBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    modal.classList.remove('hidden');
                    modal.classList.add('flex');
                    document.body.style.overflow = 'hidden';
                });
            }
        });
    }

    // Modal Form Simulation (Unduh PDF & Demo)
    const forms = document.querySelectorAll('#cta-modal form');
    forms.forEach(form => {
        const submitBtn = form.querySelector('button[type="button"]');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                const inputs = form.querySelectorAll('input');
                let valid = true;
                inputs.forEach(i => {
                    if (!i.value) valid = false;
                });
                
                if (!valid) {
                    alert("Mohon lengkapi data form terlebih dahulu.");
                    return;
                }
                
                const originalText = submitBtn.textContent;
                submitBtn.textContent = "Memproses...";
                submitBtn.disabled = true;
                
                setTimeout(() => {
                    if (originalText.includes("Unduh")) {
                        alert("Berhasil! File PDF Executive Summary sedang diunduh ke perangkat Anda.");
                        window.open('/assets/docs/Executive-Summary-Metoda-Logaritma.pdf', '_blank');
                    } else {
                        alert("Terima kasih. Tim ahli kami akan menghubungi Anda untuk penjadwalan Demo.");
                    }
                    
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    form.reset();
                    
                    const modal = document.getElementById('cta-modal');
                    if (modal) {
                        modal.classList.add('hidden');
                        modal.classList.remove('flex');
                        document.body.style.overflow = 'auto';
                    }
                }, 1500);
            });
        }
    });
});

// ==========================================
// MULTI-STEP DIAGNOSTIC LEAD CAPTURE (INDEX.HTML)
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    const btnOpenDiag = document.getElementById("btn-open-diagnostic");
    const diagModal = document.getElementById("diagnostic-modal");
    const btnCloseDiag = document.getElementById("close-diagnostic-btn");
    const step1 = document.getElementById("diagnostic-step-1");
    const step2 = document.getElementById("diagnostic-step-2");
    const formStep1 = document.getElementById("diagnostic-form-step1");
    const btnBackStep1 = document.getElementById("btn-back-step1");
    const btnSubmitDiag = document.getElementById("btn-submit-diagnostic");
    const questionsContainer = document.getElementById("diagnostic-questions-container");
    const displayKategori = document.getElementById("diag-display-kategori");
    const spinnerDiag = document.getElementById("spinner-diagnostic");

    // Dynamic Questions Database
    const diagQuestions = {
        "Kuliner & F&B": [
            { q: "Apakah Anda tahu persis Food Cost (HPP) per porsi setiap menunya?", options: ["Belum dihitung rinci, tebak-tebak saja.", "Tahu sebagian menu favorit saja.", "Ya, tahu persis sampai gramasi bahan."] },
            { q: "Berapa banyak bahan baku yang sering terbuang (wastage) setiap harinya?", options: ["Lumayan banyak, sering sisa sayur/daging.", "Kadang-kadang kalau sepi pengunjung.", "Sangat minim, porsi terjaga ketat."] },
            { q: "Apakah Anda punya target harian porsi terjual agar warung/resto balik modal?", options: ["Tidak ada, yang penting ada yang beli.", "Tahu kira-kira nominal rupiahnya.", "Tahu persis berapa porsi per menu yang harus laku."] },
            { q: "Apakah ada SOP takaran di dapur agar rasa dan porsi selalu konsisten?", options: ["Tergantung feeling koki yang masak.", "Ada, tapi jarang ditimbang presisi.", "Ada SOP gramasi yang ketat ditaati."] },
            { q: "Apakah kas masuk laci kasir sering selisih dengan stok yang keluar?", options: ["Sering bocor dan malas ngecek.", "Kadang ada selisih sedikit.", "Selalu klop antara kasir dan dapur."] }
        ],
        "Fashion & Olshop": [
            { q: "Berapa banyak stok barang mati (dead stock) di gudang Anda saat ini?", options: ["Lebih dari 30% stok numpuk.", "Sekitar 10-20% belum laku.", "Hampir tidak ada, stok cepat berputar."] },
            { q: "Berapa % rata-rata konversi dari chat nanya-nanya menjadi pembeli nyata?", options: ["Dibawah 5% (banyak tanya doang).", "Sekitar 10-20%.", "Diatas 30%, closing rate tinggi."] },
            { q: "Apakah biaya ngiklan (Ads/Endorse) Anda selalu menghasilkan untung?", options: ["Sering boncos, pengeluaran iklan > profit.", "Kadang untung, kadang rugi.", "Selalu untung dan terukur ROI-nya."] },
            { q: "Berapa tingkat retur/komplain barang cacat dari pelanggan?", options: ["Lumayan sering karena packing asal.", "Sesekali terjadi kalau lagi ramai.", "Sangat jarang, ada proses QC ketat."] },
            { q: "Apakah admin Anda punya target closing harian yang wajib dicapai?", options: ["Tidak ada, admin cuma balas chat saja.", "Ada, tapi sering tidak tercapai.", "Ya, admin berorientasi pada target closing."] }
        ],
        "Jasa & Percetakan": [
            { q: "Apakah waktu pengerjaan project/pesanan pelanggan sering molor dari janji?", options: ["Sering banget, klien suka komplain.", "Kadang-kadang kalau antrean penuh.", "Selalu tepat waktu sesuai deadline."] },
            { q: "Berapa sering terjadi kesalahan pengerjaan (error rate/salah cetak)?", options: ["Sering, bahan banyak terbuang percuma.", "Sesekali karyawan kurang teliti.", "Sangat jarang, ada sistem cek berlapis."] },
            { q: "Apakah Anda menghitung biaya jam kerja karyawan (man-hours) ke dalam harga jual?", options: ["Tidak, hanya hitung harga bahan saja.", "Kadang dihitung kalau proyek besar.", "Selalu, setiap jam kerja dihitung biayanya."] },
            { q: "Bagaimana cara Anda menentukan harga jual jasa/produk?", options: ["Ikut-ikutan harga kompetitor saja.", "Tebak-tebak asal nutup operasional.", "Dihitung matang dari HPP + Target Margin."] },
            { q: "Apakah ada alur kerja (workflow) tertulis untuk setiap staf produksi?", options: ["Kerja ngalir saja, tunggu perintah.", "Ada, tapi cuma lisan.", "Ada SOP tertulis yang jelas tiap mesin/tugas."] }
        ],
        "PKL & Lapakan": [
            { q: "Apakah uang hasil dagangan sering tercampur dengan uang kebutuhan rumah tangga?", options: ["Selalu kecampur, dompetnya sama.", "Kadang dipisah, kadang kecampur kalau butuh.", "Sudah dipisah 100% disiplin."] },
            { q: "Apakah Anda tahu persis berapa untung bersih (bukan omzet kotor) Anda hari ini?", options: ["Tidak tahu, yang penting pegang uang.", "Cuma tahu kira-kira saja.", "Tahu persis sampai ke nominal ribuan."] },
            { q: "Jika jalanan sepi atau hujan, apa yang Anda lakukan agar tetap laku?", options: ["Pasrah saja nunggu pembeli lewat.", "Coba promosi mulut ke mulut seadanya.", "Punya database kontak WA pelanggan untuk dihubungi/PO."] },
            { q: "Apakah Anda mencatat stok bahan baku yang dibeli setiap pagi?", options: ["Malas mencatat, beli secukupnya.", "Kadang dicatat kalau ingat.", "Selalu ada catatan belanja harian."] },
            { q: "Apakah Anda menabung sebagian keuntungan untuk dana darurat usaha?", options: ["Uangnya habis terus untuk makan sehari-hari.", "Kadang menabung kalau lagi ramai banget.", "Selalu sisihkan prosentase tertentu tiap hari."] }
        ]
    };

    if (btnOpenDiag && diagModal) {
        // Open Modal
        btnOpenDiag.addEventListener("click", () => {
            diagModal.classList.remove("hidden");
            diagModal.classList.add("flex");
            document.body.style.overflow = "hidden";
        });

        // Close Modal
        btnCloseDiag.addEventListener("click", () => {
            diagModal.classList.add("hidden");
            diagModal.classList.remove("flex");
            document.body.style.overflow = "auto";
        });

        // Step 1 Submit
        formStep1.addEventListener("submit", (e) => {
            e.preventDefault();
            const kategori = document.getElementById("diag-kategori").value;
            displayKategori.textContent = kategori;
            
            // Generate Questions
            questionsContainer.innerHTML = "";
            const questions = diagQuestions[kategori] || diagQuestions["Kuliner & F&B"]; // Fallback
            
            questions.forEach((qObj, index) => {
                const qHtml = `
                    <div class="bg-slate-950/50 p-5 rounded-xl border border-slate-700">
                        <p class="text-white font-medium mb-3">${index + 1}. ${qObj.q}</p>
                        <div class="space-y-2">
                            ${qObj.options.map((opt, i) => `
                                <label class="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-slate-700 hover:bg-slate-800 transition">
                                    <input type="radio" required name="diag_q${index}" value="${i}" class="text-emerald-500 bg-slate-800 border-slate-600 focus:ring-emerald-500">
                                    <span class="text-slate-300 text-sm">${opt}</span>
                                </label>
                            `).join("")}
                        </div>
                    </div>
                `;
                questionsContainer.insertAdjacentHTML("beforeend", qHtml);
            });

            step1.classList.add("hidden");
            step2.classList.remove("hidden");
        });

        // Back to Step 1
        btnBackStep1.addEventListener("click", () => {
            step2.classList.add("hidden");
            step1.classList.remove("hidden");
        });

        // Step 2 Submit
        btnSubmitDiag.addEventListener("click", () => {
            // Validate all 5 questions
            let totalScore = 0;
            let answered = 0;
            const kategori = document.getElementById("diag-kategori").value;
            const questions = diagQuestions[kategori] || diagQuestions["Kuliner & F&B"];
            
            for(let i=0; i < questions.length; i++) {
                const selected = document.querySelector(`input[name="diag_q${i}"]:checked`);
                if(selected) {
                    totalScore += parseInt(selected.value);
                    answered++;
                }
            }

            if(answered < questions.length) {
                alert("Mohon jawab seluruh 5 pertanyaan.");
                return;
            }

            // Lock UI & Show Spinner
            btnSubmitDiag.disabled = true;
            spinnerDiag.classList.remove("hidden");
            btnSubmitDiag.querySelector("span").textContent = "Memproses Analisa...";

            // Determine Score Status
            const maxScore = questions.length * 2; // Each q is 0,1,2
            const percentage = (totalScore / maxScore) * 100;
            let statusKesehatan = "";
            if(percentage <= 30) statusKesehatan = "Kritis (" + percentage.toFixed(0) + "%)";
            else if (percentage <= 70) statusKesehatan = "Transisi (" + percentage.toFixed(0) + "%)";
            else statusKesehatan = "Sehat (" + percentage.toFixed(0) + "%)";

            // Prepare Lead Object
            const leadData = {
                id: "LEAD-" + Date.now(),
                tanggal: new Date().toLocaleDateString('id-ID'),
                timestamp: Date.now(),
                namaPemilik: document.getElementById("diag-nama").value,
                namaBisnis: document.getElementById("diag-nama").value,
                kategori: kategori,
                whatsapp: document.getElementById("diag-wa").value,
                alamat: document.getElementById("diag-alamat").value,
                skorKesehatan: statusKesehatan,
                status: "Calon Pelanggan",
                sumber: "Form Diagnostik Landing Page",
                followUp: false
            };

            // Save to localStorage for Admin
            let adminLeads = JSON.parse(localStorage.getItem("logarithm_admin_leads") || "[]");
            adminLeads.unshift(leadData);
            localStorage.setItem("logarithm_admin_leads", JSON.stringify(adminLeads));
            
            // Legacy fallback (for the old admin dashboard logic if needed)
            let oldLeads = JSON.parse(localStorage.getItem("logaritma_leads") || "[]");
            oldLeads.unshift({
                timestamp: leadData.timestamp,
                nama: leadData.namaPemilik,
                bisnis: leadData.namaBisnis,
                wa: leadData.whatsapp,
                status: "FREE",
                followUp: false
            });
            localStorage.setItem("logaritma_leads", JSON.stringify(oldLeads));

            // Save active session for Member Area Greeting
            localStorage.setItem("logarithm_lead_data", JSON.stringify(leadData));

            // Redirect
            setTimeout(() => {
                window.location.href = '/tools/?source=diagnostic_lead';
            }, 1000);
        });
    }
});

// ==========================================
// TOOLS FREEMIUM LOGIC (/tools/index.html)
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    
    // Tabs Navigation
    const tabBtns = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");
    
    if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                tabBtns.forEach(b => {
                    b.classList.remove("bg-emerald-500/10", "text-emerald-400", "border-emerald-500/20");
                    b.classList.add("text-slate-400", "border-transparent");
                });
                tabContents.forEach(c => c.classList.add("hidden"));
                
                btn.classList.remove("text-slate-400", "border-transparent");
                btn.classList.add("bg-emerald-500/10", "text-emerald-400", "border", "border-emerald-500/20");
                
                const target = document.getElementById(btn.getAttribute("data-target"));
                if (target) target.classList.remove("hidden");
            });
        });
    }

    // Paywall Modal
    const paywallTriggers = document.querySelectorAll(".trigger-paywall");
    const paywallModal = document.getElementById("paywall-modal");
    const closePaywallBtn = document.getElementById("close-paywall-btn");
    
    // Checkout Mayar Elements
    const btnCheckoutMayar = document.getElementById("btn-checkout-mayar");
    const checkoutContainer = document.getElementById("checkout-container");
    const paywallContent = document.getElementById("paywall-content");
    const mayarIframe = document.getElementById("mayar-iframe");
    const closeCheckoutBtn = document.getElementById("close-checkout-btn");
    const paywallModalInner = document.getElementById("paywall-modal-inner");

    if (paywallModal) {
        paywallTriggers.forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                paywallModal.classList.remove("hidden");
                paywallModal.classList.add("flex");
                document.body.style.overflow = "hidden";
                
                // Reset to paywall view
                if(checkoutContainer && paywallContent) {
                    checkoutContainer.classList.add("hidden");
                    paywallContent.classList.remove("hidden");
                    if(mayarIframe) mayarIframe.src = "";
                }
                if (paywallModalInner) {
                    paywallModalInner.classList.add("max-w-md");
                    paywallModalInner.classList.remove("max-w-4xl", "h-[90vh]");
                }
            });
        });

        if(closePaywallBtn) {
            closePaywallBtn.addEventListener("click", () => {
                paywallModal.classList.add("hidden");
                paywallModal.classList.remove("flex");
                document.body.style.overflow = "auto";
            });
        }

        // Handle Instant Checkout Button
        if(btnCheckoutMayar && checkoutContainer && paywallContent && mayarIframe) {
            btnCheckoutMayar.addEventListener("click", () => {
                paywallContent.classList.add("hidden");
                checkoutContainer.classList.remove("hidden");
                checkoutContainer.classList.add("flex");
                if (paywallModalInner) {
                    paywallModalInner.classList.remove("max-w-md");
                    paywallModalInner.classList.add("max-w-4xl", "h-[90vh]");
                }
                mayarIframe.src = "https://baimwarunkarsi.myr.id/m/logaritma-umkm-pro-akses-ai-profit-engine";
            });
        }

        // Close Checkout Iframe
        if(closeCheckoutBtn && checkoutContainer && paywallContent && mayarIframe) {
            closeCheckoutBtn.addEventListener("click", () => {
                checkoutContainer.classList.add("hidden");
                checkoutContainer.classList.remove("flex");
                paywallContent.classList.remove("hidden");
                if (paywallModalInner) {
                    paywallModalInner.classList.add("max-w-md");
                    paywallModalInner.classList.remove("max-w-4xl", "h-[90vh]");
                }
                mayarIframe.src = ""; // Stop iframe load
            });
        }
    }

    // --- PREMIUM STATUS LOGIC ---
    const urlParams = new URLSearchParams(window.location.search);
    
    // 1. Cek parameter success dari Mayar
    if (urlParams.get("status") === "premium_success") {
        // Jika redirect terjadi di dalam iframe Mayar, redirect parent window
        if (window.self !== window.top) {
            window.top.location.href = window.location.href;
        } else {
            localStorage.setItem("logarithm_user_status", "premium");
            
            // Membersihkan URL tanpa mereload halaman
            const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
            window.history.pushState({path:newUrl}, '', newUrl);

            const errorModal = document.getElementById("error-modal");
            if (errorModal) {
                const iconContainer = errorModal.querySelector(".w-12");
                if (iconContainer) {
                    iconContainer.className = "w-12 h-12 bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-400 mb-5 border border-emerald-500/30";
                    iconContainer.textContent = "🎉";
                }
                const h3 = errorModal.querySelector("h3");
                if (h3) {
                    h3.className = "text-xl font-bold font-heading mb-2 text-emerald-400";
                    h3.textContent = "PEMBAYARAN BERHASIL!";
                }
                const p = errorModal.querySelector("p");
                if (p) {
                    p.textContent = "Selamat! Akses Logarithm UMKM PRO Anda Telah Aktif. Detail akses juga telah dikirim via WhatsApp.";
                }
                const btn = errorModal.querySelector("#ok-error-modal-btn") || errorModal.querySelector("button:not(#close-error-modal-btn)");
                if (btn) {
                    btn.className = "w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded-lg transition shadow-lg shadow-emerald-500/20";
                    btn.textContent = "Mulai Gunakan";
                    btn.onclick = () => {
                        errorModal.classList.add("hidden");
                        errorModal.classList.remove("flex");
                        document.body.style.overflow = "auto";
                    };
                }
                
                errorModal.classList.remove("hidden");
                errorModal.classList.add("flex");
                document.body.style.overflow = "hidden";
            } else {
                alert("🎉 Selamat! Akses Logarithm UMKM PRO Anda Telah Aktif. Detail akses juga telah dikirim via WhatsApp.");
            }
        }
    }

    // 2. Terapkan Status Premium di UI
    const isPremium = localStorage.getItem("logarithm_user_status") === "premium";
    if (isPremium) {
        // Ganti badge status
        const badge = document.getElementById("user-status-badge");
        if(badge) {
            badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-amber-400"></span>STATUS: UMKM PRO (PREMIUM)`;
            badge.classList.replace("bg-slate-800", "bg-amber-500/20");
            badge.classList.replace("text-slate-300", "text-amber-400");
            badge.classList.replace("border-slate-700", "border-amber-500/30");
        }

        // Sembunyikan tombol langganan utama, tampilkan kelola membership
        const btnTopPaywall = document.getElementById("btn-top-paywall");
        const btnManageMembership = document.getElementById("btn-manage-membership");
        if(btnTopPaywall) btnTopPaywall.classList.add("hidden");
        if(btnManageMembership) {
            btnManageMembership.classList.remove("hidden");
            btnManageMembership.classList.add("flex");
        }

        // Ubah badge AI quota menjadi Unlimited
        const quotaBadgeContainer = document.querySelector("#ai-quota-bar")?.closest(".bg-slate-800");
        if(quotaBadgeContainer) {
            quotaBadgeContainer.innerHTML = `
                <div class="absolute -right-4 -bottom-4 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl"></div>
                <h4 class="text-xs font-bold text-slate-400 mb-1">Akses Fitur Cerdas AI</h4>
                <div class="mt-2 inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg w-full">
                    <span class="text-emerald-400">✨</span>
                    <span class="text-emerald-400 font-bold text-sm drop-shadow">UNLIMITED ACCESS</span>
                </div>
            `;
        }

        // Buka LTM Checker
        const tabLtm = document.getElementById("tab-ltm");
        if(tabLtm) {
            const lockedContent = tabLtm.querySelector(".ltm-locked-content");
            const premiumContent = tabLtm.querySelector(".ltm-premium-content");
            if (lockedContent) lockedContent.classList.add("hidden");
            if (premiumContent) premiumContent.classList.remove("hidden");
        }

        // Ubah link download laporan menjadi fungsi window.print
        const btnDownloadProfit = document.getElementById("btn-download-profit");
        if(btnDownloadProfit) {
            btnDownloadProfit.classList.remove("trigger-paywall", "bg-slate-800");
            btnDownloadProfit.classList.add("bg-emerald-600", "hover:bg-emerald-500", "border-emerald-500");
            btnDownloadProfit.innerHTML = `📄 Download / Cetak Laporan (PDF)`;
            btnDownloadProfit.addEventListener("click", (e) => {
                e.preventDefault();
                document.title = "Target_Untung_Logaritma";
                window.print();
            });
        }
        
        const btnDownloadSop = document.getElementById("btn-download-sop");
        if(btnDownloadSop) {
            btnDownloadSop.classList.remove("trigger-paywall");
            btnDownloadSop.addEventListener("click", (e) => {
                e.preventDefault();
                document.title = "SOP_Logaritma";
                window.print();
            });
        }
        
        // Buka hasil blur pada AI SOP dan hapus tombol langganan
        const blurElements = document.querySelectorAll("#ai-result .blur-sm");
        blurElements.forEach(el => el.classList.remove("blur-sm", "select-none"));
        
        const overlayPremium = document.querySelector("#ai-result .bg-gradient-to-t");
        if(overlayPremium) overlayPremium.classList.add("hidden");
        
        // Hapus batas kuota AI
        localStorage.setItem("logaritma_ai_quota", "9999");
    }

    // Input Formatter
    function formatRibuan(angka) {
        let number_string = angka.replace(/[^,\d]/g, '').toString();
        let split = number_string.split(',');
        let sisa = split[0].length % 3;
        let rupiah = split[0].substr(0, sisa);
        let ribuan = split[0].substr(sisa).match(/\d{3}/gi);
        if (ribuan) {
            let separator = sisa ? '.' : '';
            rupiah += separator + ribuan.join('.');
        }
        rupiah = split[1] !== undefined ? rupiah + ',' + split[1] : rupiah;
        return rupiah;
    }

    const inputsNominal = ["input-profit", "input-harga", "input-ltm-biaya", "input-ltm-target"];
    inputsNominal.forEach(id => {
        const el = document.getElementById(id);
        if(el) {
            el.addEventListener("input", function(e) {
                this.value = formatRibuan(this.value);
            });
        }
    });

    const printDate = document.getElementById("print-date");
    if(printDate) {
        const d = new Date();
        printDate.textContent = "Dibuat pada: " + d.toLocaleDateString("id-ID") + " " + d.toLocaleTimeString("id-ID");
    }

    // Profit Calculator Logic
    const btnProfit = document.getElementById("btn-kalkulasi-profit");
    if (btnProfit) {
        btnProfit.addEventListener("click", () => {
            const rawProfit = document.getElementById("input-profit").value.replace(/\./g, "");
            const rawHarga = document.getElementById("input-harga").value.replace(/\./g, "");
            
            const profit = parseFloat(rawProfit);
            const margin = parseFloat(document.getElementById("input-margin").value);
            const harga = parseFloat(rawHarga);
            const cr = parseFloat(document.getElementById("input-cr").value);

            if (!profit || !margin || !harga || !cr) {
                alert("Harap isi semua kolom dengan angka yang valid.");
                return;
            }

            // Rumus Backward Mapping
            const omzet = profit / (margin / 100);
            const salesUnit = omzet / harga;
            const leadsTotal = salesUnit / (cr / 100);
            const leadsHarian = leadsTotal / 30;

            const formatRp = (num) => "Rp " + Math.round(num).toLocaleString("id-ID");

            document.getElementById("hasil-omzet").textContent = formatRp(omzet);
            document.getElementById("hasil-unit").textContent = Math.round(salesUnit).toLocaleString("id-ID") + " Unit";
            document.getElementById("hasil-leads").textContent = Math.ceil(leadsHarian) + " Leads/hari";

            document.getElementById("hasil-profit").classList.remove("hidden");
        });
    }

    // AI SOP Logic & Quota
    const btnSop = document.getElementById("btn-generate-sop");
    if (btnSop) {
        let aiQuota = parseInt(localStorage.getItem("logaritma_ai_quota") || "2");
        updateQuotaUI(aiQuota);

        btnSop.addEventListener("click", () => {
            const inputVal = document.getElementById("input-sop").value;
            if(!inputVal) {
                alert("Masukkan nama proses bisnis terlebih dahulu.");
                return;
            }

            if (aiQuota <= 0) {
                document.getElementById("paywall-modal").classList.remove("hidden");
                document.body.style.overflow = "hidden";
                return;
            }

            aiQuota--;
            localStorage.setItem("logaritma_ai_quota", aiQuota);
            updateQuotaUI(aiQuota);

            document.getElementById("ai-loading").classList.remove("hidden");
            document.getElementById("ai-result").classList.add("hidden");
            btnSop.disabled = true;

            setTimeout(() => {
                document.getElementById("ai-loading").classList.add("hidden");
                document.getElementById("ai-result").classList.remove("hidden");
                btnSop.disabled = false;
                
                const content = document.getElementById("ai-content");
                content.innerHTML = `
                    <div class="mb-4 pb-4 border-b border-slate-700/50">
                        <h4 class="font-bold text-white text-lg mb-1">1. Identitas Dokumen</h4>
                        <ul class="text-sm space-y-1 text-slate-300">
                            <li><span class="text-slate-500">Nama Proses:</span> <span class="text-emerald-400 font-bold">${inputVal.toUpperCase()}</span></li>
                            <li><span class="text-slate-500">Sektor / Departemen:</span> Operasional Internal</li>
                            <li><span class="text-slate-500">Penanggung Jawab:</span> Staf / Manajer Terkait</li>
                        </ul>
                    </div>
                    <div class="mb-4 pb-4 border-b border-slate-700/50">
                        <h4 class="font-bold text-white text-lg mb-1">2. Tujuan & Output Akhir</h4>
                        <p class="text-sm text-slate-300">Memastikan proses <span class="font-semibold">${inputVal}</span> berjalan terstandarisasi, efisien, meminimalisir kesalahan manusia (human error), dan berujung pada penghematan waktu/biaya serta peningkatan kepuasan.</p>
                    </div>
                    <div class="mb-4 pb-4 border-b border-slate-700/50">
                        <h4 class="font-bold text-white text-lg mb-1">3. Dokumen & Bahan Persiapan</h4>
                        <ul class="list-disc pl-5 text-sm space-y-1 text-slate-300">
                            <li>Checklist Harian / Sistem Pencatatan (Digital/Buku)</li>
                            <li>Akses ke Alat Bantu / Software Relevan</li>
                            <li>Protokol Komunikasi Tim</li>
                        </ul>
                    </div>
                    <div class="mb-4 pb-4 border-b border-slate-700/50">
                        <h4 class="font-bold text-white text-lg mb-1">4. Langkah-Langkah Operasional Detail</h4>
                        <ul class="list-decimal pl-5 text-sm space-y-2 text-slate-300">
                            <li><strong class="text-white">Persiapan (Pra-Eksekusi):</strong> Lakukan pengecekan kesiapan alat, bahan, dan data 15 menit sebelum proses dimulai.</li>
                            <li><strong class="text-white">Eksekusi Inti:</strong> Terapkan tindakan utama sesuai standar kualitas perusahaan tanpa melewatkan detail kecil.</li>
                            <li><strong class="text-white">Monitoring Proses:</strong> Jika terjadi kendala atau eskalasi di tengah jalan, segera laporkan ke atasan dalam rentang waktu maks 10 menit.</li>
                            <li class="${isPremium ? '' : 'blur-sm select-none'}"><strong class="${isPremium ? 'text-white' : ''}">Quality Control (QC):</strong> Periksa kembali hasil akhir sebelum diserahkan ke pelanggan atau departemen selanjutnya. Pastikan bebas cacat.</li>
                            <li class="${isPremium ? '' : 'blur-sm select-none'}"><strong class="${isPremium ? 'text-white' : ''}">Pencatatan (Logging):</strong> Input status penyelesaian ke dalam sistem atau buku laporan harian untuk rekam jejak.</li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="font-bold text-white text-lg mb-1">5. Indikator Keberhasilan (KPI)</h4>
                        <ul class="list-disc pl-5 text-sm space-y-1 text-slate-300">
                            <li>Waktu penyelesaian tepat waktu (On-time Delivery > 95%).</li>
                            <li class="${isPremium ? '' : 'blur-sm select-none'}">Tingkat komplain atau *error rate* mendekati 0%.</li>
                        </ul>
                    </div>
                `;
            }, 2500);
        });
    }

    function updateQuotaUI(quota) {
        const quotaText = document.getElementById("ai-quota-text");
        const quotaBar = document.getElementById("ai-quota-bar");
        if(quotaText && quotaBar) {
            quotaText.textContent = `${quota}/3`;
            quotaBar.style.width = `${(quota/3)*100}%`;
            
            if(quota === 0) {
                quotaBar.classList.replace("bg-emerald-500", "bg-red-500");
            }
        }
    }
});


// =// ==========================================
// ADMIN DASHBOARD LOGIC (/admin/index.html)
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    // Admin Mobile Menu Toggle
    const adminMenuBtn = document.getElementById("admin-menu-btn");
    const adminSidebar = document.getElementById("admin-sidebar");
    
    if (adminMenuBtn && adminSidebar) {
        adminMenuBtn.addEventListener("click", () => {
            adminSidebar.classList.toggle("-translate-x-full");
        });
    }

    // Populate Data leads
    const tableBody = document.getElementById("admin-leads-table");
    if(tableBody) {
        let leads = JSON.parse(localStorage.getItem("logarithm_admin_leads") || "[]");

        // Helper date format
        const formatDate = (isoString) => {
            const d = new Date(isoString);
            return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
        };

        const renderAdmin = () => {
            let totalLeads = leads.length;
            let premiumLeads = leads.filter(l => l.status === "Member Premium").length;
            
            // Update stats cards
            const totalLeadsEl = document.getElementById("stat-total-leads");
            const premiumLeadsEl = document.getElementById("stat-premium-leads");
            if(totalLeadsEl) totalLeadsEl.textContent = totalLeads;
            if(premiumLeadsEl) premiumLeadsEl.textContent = premiumLeads;

            if(leads.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="6" class="px-6 py-8 text-center text-slate-500">Belum ada data lead diagnostik.</td></tr>`;
                return;
            }

            tableBody.innerHTML = "";
            leads.forEach((lead, index) => {
                let badgeClass = "bg-slate-500/20 text-slate-400";
                if(lead.kesehatan === "Sehat") badgeClass = "bg-green-500/20 text-green-400 border-green-500/30";
                if(lead.kesehatan === "Transisi") badgeClass = "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
                if(lead.kesehatan === "Kritis") badgeClass = "bg-red-500/20 text-red-400 border-red-500/30";

                let tr = document.createElement("tr");
                tr.className = "border-b border-slate-700/50 hover:bg-slate-800/30 transition";
                tr.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-400">${formatDate(lead.tanggal)}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="font-medium text-white">${lead.nama}</div>
                        <div class="text-sm text-slate-400">${lead.wa}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-slate-300">${lead.kategori}</div>
                        <div class="text-xs text-slate-500">${lead.skor}/5</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 py-1 text-xs font-bold rounded-full border ${badgeClass}">${lead.kesehatan}</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <select onchange="updateLeadStatus(${index}, this.value)" class="bg-slate-800 border border-slate-600 rounded px-2 py-1 text-sm text-slate-300 focus:outline-none focus:border-blue-500">
                            <option value="Calon Pelanggan" ${lead.status === 'Calon Pelanggan' ? 'selected' : ''}>Calon Pelanggan</option>
                            <option value="Di-Follow Up" ${lead.status === 'Di-Follow Up' ? 'selected' : ''}>Di-Follow Up</option>
                            <option value="Member Premium" ${lead.status === 'Member Premium' ? 'selected' : ''}>Member Premium</option>
                        </select>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <button onclick="sendWA(${index})" class="px-3 py-1 bg-green-600 hover:bg-green-500 text-white text-sm rounded shadow transition">Kirim WA</button>
                    </td>
                `;
                tableBody.appendChild(tr);
            });
        };

        window.updateLeadStatus = function(index, newStatus) {
            leads[index].status = newStatus;
            localStorage.setItem("logarithm_admin_leads", JSON.stringify(leads));
            renderAdmin();
        };

        window.sendWA = function(index) {
            const lead = leads[index];
            const text = `Halo Bapak/Ibu ${lead.nama}, saya dari Logaritma.id melihat bisnis ${lead.kategori} Anda berstatus ${lead.kesehatan}. Mari diskusikan bagaimana Logaritma bisa membantu.`;
            const waUrl = `https://wa.me/${lead.wa.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
            
            if(lead.status === "Calon Pelanggan") {
                leads[index].status = "Di-Follow Up";
                localStorage.setItem("logarithm_admin_leads", JSON.stringify(leads));
                renderAdmin();
            }
            
            window.open(waUrl, "_blank");
        };

        renderAdmin();
    }
});

document.getElementById("admin-sidebar");
// LTM CHECKER LOGIC (/tools/index.html)
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    const btnLTM = document.getElementById("btn-hitung-ltm");
    if(btnLTM) {
        btnLTM.addEventListener("click", () => {
            const rawBiaya = document.getElementById("input-ltm-biaya").value.replace(/\./g, "");
            const rawTarget = document.getElementById("input-ltm-target").value.replace(/\./g, "");
            const biaya = parseFloat(rawBiaya);
            const target = parseFloat(rawTarget);
            
            if(!biaya || !target) {
                alert("Masukkan angka biaya dan target hasil yang valid.");
                return;
            }

            const roi = ((target - biaya) / biaya) * 100;
            
            const badge = document.getElementById("ltm-badge");
            const title = document.getElementById("ltm-title");
            const desc = document.getElementById("ltm-desc");
            const roiEl = document.getElementById("ltm-roi");
            const action = document.getElementById("ltm-action");
            const box = document.getElementById("ltm-result-box");

            roiEl.textContent = roi.toFixed(1) + "%";

            // Cleanup classes
            badge.className = "inline-block text-[10px] font-bold px-2 py-1 rounded w-max mb-3 uppercase border";
            box.className = "bg-slate-900 border rounded-xl p-6 relative overflow-hidden transition-all shadow-lg";

            if(roi < 0) {
                // JEBAKAN
                badge.classList.add("bg-red-500/20", "text-red-400", "border-red-500/30");
                box.classList.add("border-red-500/50", "shadow-red-500/10");
                title.textContent = "AWAS JEBAKAN OUTPUT!";
                title.className = "text-2xl font-bold font-heading text-red-400 mb-2";
                desc.textContent = "Kegiatan ini diproyeksikan akan membuat Anda RUGI. Anda mengeluarkan biaya lebih besar daripada uang yang masuk.";
                action.textContent = "Batalkan / Revisi Rencana";
                action.className = "font-bold text-red-400 text-right";
                roiEl.className = "font-bold text-red-400";
            } else if (roi < 100) {
                // MARGINAL
                badge.classList.add("bg-yellow-500/20", "text-yellow-400", "border-yellow-500/30");
                box.classList.add("border-yellow-500/50", "shadow-yellow-500/10");
                title.textContent = "HASIL TERLALU KECIL / MARGINAL";
                title.className = "text-2xl font-bold font-heading text-yellow-400 mb-2";
                desc.textContent = "Ada potensi untung, tapi terlalu kecil untuk menutupi risiko tersembunyi (waktu & tenaga tim).";
                action.textContent = "Tingkatkan Target atau Pangkas Biaya";
                action.className = "font-bold text-yellow-400 text-right";
                roiEl.className = "font-bold text-yellow-400";
            } else {
                // PROFIT
                badge.classList.add("bg-emerald-500/20", "text-emerald-400", "border-emerald-500/30");
                box.classList.add("border-emerald-500/50", "shadow-emerald-500/10");
                title.textContent = "KEGIATAN LAYAK DIEKSEKUSI";
                title.className = "text-2xl font-bold font-heading text-emerald-400 mb-2";
                desc.textContent = "Rencana kegiatan ini memiliki rasio pengembalian (ROI) yang positif dan kuat. Silakan susun pelaksanaannya menggunakan fitur AI kami.";
                action.textContent = "Lanjutkan & Kawal Eksekusi";
                action.className = "font-bold text-emerald-400 text-right";
                roiEl.className = "font-bold text-emerald-400";
            }

            document.getElementById("hasil-ltm").classList.remove("hidden");
        });
    }
});

// ==========================================
// SCROLL REVEAL ANIMATIONS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const revealElements = document.querySelectorAll('.reveal-up, .animate-fade-in-up');
    
    if (revealElements.length > 0) {
        const revealOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                } else {
                    if(entry.boundingClientRect.top > 0) {
                        entry.target.classList.remove('active');
                    }
                }
            });
        }, revealOptions);

        revealElements.forEach(el => {
            // Jika elemen sudah punya animate-fade-in-up bawaan tailwind dan ingin dipicu observer
            // Kita bisa memanfaatkan class active
            if(el.classList.contains('animate-fade-in-up')) {
                el.style.animationPlayState = 'paused';
                revealObserver.observe(el);
            } else {
                revealObserver.observe(el);
            }
        });
    }
    
    // Khusus untuk Tailwind animate-fade-in-up agar dipicu saat muncul
    const observer2 = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    });
    
    document.querySelectorAll('.animate-fade-in-up').forEach((el) => {
        el.style.animationPlayState = 'paused';
        observer2.observe(el);
    });
});



// ==========================================
// DIAGNOSTIC LEAD WELCOME (MEMBER AREA)
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("source") === "diagnostic_lead") {
        const welcomeModal = document.getElementById("diagnostic-welcome-modal");
        const btnCloseWelcome = document.getElementById("btn-close-welcome");
        const titleWelcome = document.getElementById("welcome-modal-title");
        
        if (welcomeModal) {
            // Coba ambil nama dari localStorage
            const leadData = JSON.parse(localStorage.getItem("logarithm_lead_data") || "{}");
            if (leadData.namaPemilik && titleWelcome) {
                titleWelcome.textContent = "Halo " + leadData.namaPemilik + ", Selamat Datang!";
            }

            welcomeModal.classList.remove("hidden");
            welcomeModal.classList.add("flex");
            document.body.style.overflow = "hidden";

            if (btnCloseWelcome) {
                btnCloseWelcome.addEventListener("click", () => {
                    welcomeModal.classList.add("hidden");
                    welcomeModal.classList.remove("flex");
                    document.body.style.overflow = "auto";
                    
                    // Membersihkan URL agar tidak muncul terus kalau direfresh
                    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
                    window.history.pushState({path:newUrl}, "", newUrl);
                });
            }
        }
    }
});



