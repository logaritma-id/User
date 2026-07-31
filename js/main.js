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
                Swal.fire({text: "Mohon jawab seluruh 3 pertanyaan untuk menghitung skor.", background: '#0f172a', color: '#cbd5e1', confirmButtonColor: '#10b981'});
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
                    Swal.fire({text: "Mohon lengkapi data form terlebih dahulu.", background: '#0f172a', color: '#cbd5e1', confirmButtonColor: '#10b981'});
                    return;
                }
                
                const originalText = submitBtn.textContent;
                submitBtn.textContent = "Memproses...";
                submitBtn.disabled = true;
                
                if(window.LogaritmaDB) { const currentUserStr = localStorage.getItem("logarithm_current_user"); if(currentUserStr) { window.LogaritmaDB.trackActivity(JSON.parse(currentUserStr).whatsapp, "sop"); } }
            setTimeout(() => {
                    if (originalText.includes("Unduh")) {
                        Swal.fire({text: "Berhasil! File PDF Executive Summary sedang diunduh ke perangkat Anda.", background: '#0f172a', color: '#cbd5e1', confirmButtonColor: '#10b981'});
                        window.open('/assets/docs/Executive-Summary-Metoda-Logaritma.pdf', '_blank');
                    } else {
                        Swal.fire({text: "Terima kasih. Tim ahli kami akan menghubungi Anda untuk penjadwalan Demo.", background: '#0f172a', color: '#cbd5e1', confirmButtonColor: '#10b981'});
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
        "kuliner": [
            { q: "Apakah Anda tahu persis Food Cost (HPP) per porsi setiap menunya?", options: ["Belum dihitung rinci, tebak-tebak saja.", "Tahu sebagian menu favorit saja.", "Ya, tahu persis sampai gramasi bahan."] },
            { q: "Berapa banyak bahan baku yang sering terbuang (wastage) setiap harinya?", options: ["Lumayan banyak, sering sisa sayur/daging.", "Kadang-kadang kalau sepi pengunjung.", "Sangat minim, porsi terjaga ketat."] },
            { q: "Apakah Anda punya target harian porsi terjual agar warung/resto balik modal?", options: ["Tidak ada, yang penting ada yang beli.", "Tahu kira-kira nominal rupiahnya.", "Tahu persis berapa porsi per menu yang harus laku."] },
            { q: "Apakah ada SOP takaran di dapur agar rasa dan porsi selalu konsisten?", options: ["Tergantung feeling koki yang masak.", "Ada, tapi jarang ditimbang presisi.", "Ada SOP gramasi yang ketat ditaati."] },
            { q: "Apakah kas masuk laci kasir sering selisih dengan stok yang keluar?", options: ["Sering bocor dan malas ngecek.", "Kadang ada selisih sedikit.", "Selalu klop antara kasir dan dapur."] }
        ],
        "fashion": [
            { q: "Berapa banyak stok barang mati (dead stock) di gudang Anda saat ini?", options: ["Lebih dari 30% stok numpuk.", "Sekitar 10-20% belum laku.", "Hampir tidak ada, stok cepat berputar."] },
            { q: "Berapa % rata-rata konversi dari chat nanya-nanya menjadi pembeli nyata?", options: ["Dibawah 5% (banyak tanya doang).", "Sekitar 10-20%.", "Diatas 30%, closing rate tinggi."] },
            { q: "Apakah biaya ngiklan (Ads/Endorse) Anda selalu menghasilkan untung?", options: ["Sering boncos, pengeluaran iklan > profit.", "Kadang untung, kadang rugi.", "Selalu untung dan terukur ROI-nya."] },
            { q: "Berapa tingkat retur/komplain barang cacat dari pelanggan?", options: ["Lumayan sering karena packing asal.", "Sesekali terjadi kalau lagi ramai.", "Sangat jarang, ada proses QC ketat."] },
            { q: "Apakah admin Anda punya target closing harian yang wajib dicapai?", options: ["Tidak ada, admin cuma balas chat saja.", "Ada, tapi sering tidak tercapai.", "Ya, admin berorientasi pada target closing."] }
        ],
        "percetakan": [
            { q: "Apakah waktu pengerjaan project/pesanan pelanggan sering molor dari janji?", options: ["Sering banget, klien suka komplain.", "Kadang-kadang kalau antrean penuh.", "Selalu tepat waktu sesuai deadline."] },
            { q: "Berapa sering terjadi kesalahan pengerjaan (error rate/salah cetak)?", options: ["Sering, bahan banyak terbuang percuma.", "Sesekali karyawan kurang teliti.", "Sangat jarang, ada sistem cek berlapis."] },
            { q: "Apakah Anda menghitung biaya jam kerja karyawan (man-hours) ke dalam harga jual?", options: ["Tidak, hanya hitung harga bahan saja.", "Kadang dihitung kalau proyek besar.", "Selalu, setiap jam kerja dihitung biayanya."] },
            { q: "Bagaimana cara Anda menentukan harga jual jasa/produk?", options: ["Ikut-ikutan harga kompetitor saja.", "Tebak-tebak asal nutup operasional.", "Dihitung matang dari HPP + Target Margin."] },
            { q: "Apakah ada alur kerja (workflow) tertulis untuk setiap staf produksi?", options: ["Kerja ngalir saja, tunggu perintah.", "Ada, tapi cuma lisan.", "Ada SOP tertulis yang jelas tiap mesin/tugas."] }
        ],
        "pkl": [
            { q: "Apakah uang hasil dagangan sering tercampur dengan uang kebutuhan rumah tangga?", options: ["Selalu kecampur, dompetnya sama.", "Kadang dipisah, kadang kecampur kalau butuh.", "Sudah dipisah 100% disiplin."] },
            { q: "Apakah Anda tahu persis berapa untung bersih (bukan omzet kotor) Anda hari ini?", options: ["Tidak tahu, yang penting pegang uang.", "Cuma tahu kira-kira saja.", "Tahu persis sampai ke nominal ribuan."] },
            { q: "Jika jalanan sepi atau hujan, apa yang Anda lakukan agar tetap laku?", options: ["Pasrah saja nunggu pembeli lewat.", "Coba promosi mulut ke mulut seadanya.", "Punya database kontak WA pelanggan untuk dihubungi/PO."] },
            { q: "Apakah Anda mencatat stok bahan baku yang dibeli setiap pagi?", options: ["Malas mencatat, beli secukupnya.", "Kadang dicatat kalau ingat.", "Selalu ada catatan belanja harian."] },
            { q: "Apakah Anda menabung sebagian keuntungan untuk dana darurat usaha?", options: ["Uangnya habis terus untuk makan sehari-hari.", "Kadang menabung kalau lagi ramai banget.", "Selalu sisihkan prosentase tertentu tiap hari."] }
        ],
        "distributor": [
            { q: "Bagaimana Anda mengelola batas piutang (kredit limit) untuk toko/pelanggan?", options: ["Tidak ada batas, yang penting barang keluar.", "Ada batas tapi sering dilanggar kasihan.", "Ada sistem limitasi piutang yang ketat."] },
            { q: "Berapa persentase invoice jatuh tempo yang telat dibayar?", options: ["Lebih dari 30% sering telat bayar.", "Sekitar 10-20% butuh ditagih berkali-kali.", "Hampir semua bayar tepat waktu."] },
            { q: "Apakah Anda tahu pasti produk mana yang perputarannya paling cepat (fast-moving)?", options: ["Kira-kira saja berdasarkan insting.", "Tahu dari laporan bulanan.", "Punya data real-time inventory turnover."] },
            { q: "Bagaimana tim sales Anda melakukan kunjungan (route plan) harian?", options: ["Sales jalan bebas semau mereka.", "Ada rute tapi jarang dievaluasi.", "Rute harian terstruktur dan dimonitor ketat."] },
            { q: "Apakah sering terjadi selisih stok fisik gudang dengan catatan di sistem?", options: ["Sering banget, gudang berantakan.", "Kadang-kadang ada selisih sedikit.", "Selalu akurat lewat sistem opname rutin."] }
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
            const selectEl = document.getElementById("diag-kategori");
            const kategori = selectEl.value;
            const kategoriName = selectEl.options[selectEl.selectedIndex].text;
            displayKategori.textContent = kategoriName;
            
            // Save selection to data attribute for step 2
            formStep1.dataset.kategoriId = kategori;
            formStep1.dataset.kategoriName = kategoriName;
            
            // Generate Questions
            questionsContainer.innerHTML = "";
            const questions = diagQuestions[kategori] || diagQuestions["kuliner"]; // Fallback
            
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
        btnSubmitDiag.addEventListener("click", async () => {
            // Validate all 5 questions
            let totalScore = 0;
            let answered = 0;
            const kategoriId = formStep1.dataset.kategoriId || "kuliner";
            const kategoriName = formStep1.dataset.kategoriName || "Kuliner & F&B";
            const questions = diagQuestions[kategoriId] || diagQuestions["kuliner"];
            
            for(let i=0; i < questions.length; i++) {
                const selected = document.querySelector(`input[name="diag_q${i}"]:checked`);
                if(selected) {
                    totalScore += parseInt(selected.value);
                    answered++;
                }
            }

            if(answered < questions.length) {
                Swal.fire({text: "Mohon jawab seluruh 5 pertanyaan.", background: '#0f172a', color: '#cbd5e1', confirmButtonColor: '#10b981'});
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
                kategori: kategoriName,
                kategoriId: kategoriId,
                whatsapp: document.getElementById("diag-wa").value,
                alamat: document.getElementById("diag-alamat").value,
                skor: Math.round(totalScore / 2),
                skorKesehatan: statusKesehatan,
                status: "Calon Pelanggan",
                sumber: "Form Diagnostik Landing Page",
                followUp: false
            };

            // Save to Database
            if(window.LogaritmaDB) {
                await window.LogaritmaDB.saveLead(leadData);
            } else {
                let adminLeads = JSON.parse(localStorage.getItem("logarithm_admin_leads") || "[]");
                adminLeads.unshift(leadData);
                localStorage.setItem("logarithm_admin_leads", JSON.stringify(adminLeads));
            }
            
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

            // Show Step 3 instead of Redirecting
            setTimeout(() => {
                document.getElementById("diagnostic-step-2").classList.add("hidden");
                const step3 = document.getElementById("diagnostic-step-3");
                
                // Populate Step 3 Data
                document.getElementById("diag-result-score").textContent = statusKesehatan;
                
                const iconEl = document.getElementById("diag-result-icon");
                const badgeEl = document.getElementById("diag-result-badge");
                const descEl = document.getElementById("diag-result-desc");
                
                document.getElementById("diag-result-kategori").textContent = kategoriName;
                
                if(percentage <= 30) {
                    iconEl.innerHTML = "🚨";
                    iconEl.className = "w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl mb-4 shadow-xl bg-red-900/50 border-2 border-red-500/50";
                    badgeEl.className = "inline-block px-4 py-1.5 rounded-full text-sm font-bold border mb-6 bg-red-950 text-red-400 border-red-500/30";
                    badgeEl.textContent = "STATUS: KRITIS";
                    descEl.innerHTML = `Bisnis ${kategoriName} Anda berpotensi mengalami <strong>kebocoran operasional yang fatal</strong>. Segera evaluasi ulang struktur biaya, harga jual, dan alur kerja harian sebelum kehabisan modal kas.`;
                } else if(percentage <= 70) {
                    iconEl.innerHTML = "⚠️";
                    iconEl.className = "w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl mb-4 shadow-xl bg-yellow-900/50 border-2 border-yellow-500/50";
                    badgeEl.className = "inline-block px-4 py-1.5 rounded-full text-sm font-bold border mb-6 bg-yellow-950 text-yellow-400 border-yellow-500/30";
                    badgeEl.textContent = "STATUS: TRANSISI";
                    descEl.innerHTML = `Bisnis ${kategoriName} Anda berjalan cukup stabil, namun <strong>masih ada inefisiensi</strong>. Anda membuang potensi profit yang seharusnya bisa lebih besar jika operasional diperketat.`;
                } else {
                    iconEl.innerHTML = "🏆";
                    iconEl.className = "w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl mb-4 shadow-xl bg-emerald-900/50 border-2 border-emerald-500/50";
                    badgeEl.className = "inline-block px-4 py-1.5 rounded-full text-sm font-bold border mb-6 bg-emerald-950 text-emerald-400 border-emerald-500/30";
                    badgeEl.textContent = "STATUS: SEHAT";
                    descEl.innerHTML = `Selamat! Bisnis ${kategoriName} Anda beroperasi dengan <strong>sangat optimal</strong>. Saatnya fokus pada strategi ekspansi dan delegasi otomatis menggunakan sistem Logaritma.`;
                }

                // Automatically log the user in for the dashboard
                const currentUserData = {
                    nama: leadData.namaPemilik,
                    bisnis: leadData.namaBisnis,
                    whatsapp: leadData.whatsapp,
                    kategori: leadData.kategori,
                    categoryId: leadData.kategoriId,
                    status: "FREE"
                };
                localStorage.setItem("logarithm_current_user", JSON.stringify(currentUserData));
                
                step3.classList.remove("hidden");
                
                // Hide spinner
                spinnerDiag.classList.add("hidden");
                btnSubmitDiag.querySelector("span").textContent = "Selesai & Lihat Hasil Diagnosa";
            }, 800);
            
            // Handle Dashboard Button
            document.getElementById("btn-to-dashboard").addEventListener("click", () => {
                const catId = formStep1.dataset.kategoriId || "kuliner";
                window.location.href = '/tools/' + catId + '/';
            });
        });
    }
});

// ==========================================
// TOOLS FREEMIUM LOGIC (/tools/index.html)
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    
    // Tabs Navigation (Desktop sidebar + Mobile bottom bar)
    const tabBtns = document.querySelectorAll(".tab-btn");
    const mobileTabBtns = document.querySelectorAll(".mobile-tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");

    function switchTab(targetId) {
        // Reset desktop sidebar buttons
        tabBtns.forEach(b => {
            b.classList.remove("bg-emerald-500/10", "text-emerald-400", "border-emerald-500/20", "border");
            b.classList.add("text-slate-400", "border-transparent");
        });
        // Reset mobile tab buttons
        mobileTabBtns.forEach(b => {
            b.classList.remove("text-emerald-400", "bg-emerald-500/10", "border-emerald-500");
            b.classList.add("text-slate-400", "border-transparent");
        });
        // Hide all tab contents
        tabContents.forEach(c => c.classList.add("hidden"));

        // Activate matching desktop button
        tabBtns.forEach(b => {
            if (b.getAttribute("data-target") === targetId) {
                b.classList.remove("text-slate-400", "border-transparent");
                b.classList.add("bg-emerald-500/10", "text-emerald-400", "border", "border-emerald-500/20");
            }
        });
        // Activate matching mobile button
        mobileTabBtns.forEach(b => {
            if (b.getAttribute("data-target") === targetId) {
                b.classList.remove("text-slate-400", "border-transparent");
                b.classList.add("text-emerald-400", "bg-emerald-500/10", "border-emerald-500");
            }
        });
        // Show target content
        const target = document.getElementById(targetId);
        if (target) target.classList.remove("hidden");
    }

    if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener("click", () => switchTab(btn.getAttribute("data-target")));
        });
    }
    if (mobileTabBtns.length > 0) {
        mobileTabBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                switchTab(btn.getAttribute("data-target"));
                // Scroll to top of content on mobile
                window.scrollTo({ top: 80, behavior: "smooth" });
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
                Swal.fire({text: "🎉 Selamat! Akses Logarithm UMKM PRO Anda Telah Aktif. Detail akses juga telah dikirim via WhatsApp.", background: '#0f172a', color: '#cbd5e1', confirmButtonColor: '#10b981'});
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
                <h4 class="text-xs font-bold text-slate-400 mb-1">Lisensi Operasional</h4>
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

    const inputsNominal = ["input-profit", "input-harga", "input-ltm-biaya", "input-ltm-target", "fb-input-profit", "fb-input-harga"];
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
                Swal.fire({text: "Harap isi semua kolom dengan angka yang valid.", background: '#0f172a', color: '#cbd5e1', confirmButtonColor: '#10b981'});
                return;
            }

            if(window.LogaritmaDB && window.LogaritmaDB.trackActivity) {
                const currentUserStr = localStorage.getItem("logarithm_current_user");
                if(currentUserStr) {
                    const u = JSON.parse(currentUserStr);
                    window.LogaritmaDB.trackActivity(u.wa || u.whatsapp, "Kalkulator Profit");
                }
            }
            const omzet = profit / (margin / 100);
            const salesUnit = omzet / harga;
            const leadsTotal = salesUnit / (cr / 100);
            const leadsHarian = leadsTotal / 30;

            const targetDefaultData = {
                omzetBulan: omzet,
                targetUnitBulan: salesUnit,
                leadsHarian: leadsHarian
            };
            localStorage.setItem("logaritma_default_target", JSON.stringify(targetDefaultData));
            
            // Try updating sop badge if it exists
            if (typeof window.updateSopBadge === "function") {
                window.updateSopBadge();
            }

            const formatRp = (num) => "Rp " + Math.round(num).toLocaleString("id-ID");

            document.getElementById("hasil-omzet").textContent = formatRp(omzet);
            document.getElementById("hasil-unit").textContent = Math.round(salesUnit).toLocaleString("id-ID") + " Unit";
            document.getElementById("hasil-leads").textContent = Math.ceil(leadsHarian) + " Leads/hari";

            document.getElementById("hasil-profit").classList.remove("hidden");

            // Rekomendasi Eksekusi Tim Logaritma Logic
            const rekFreeState = document.getElementById("rek-free-state");
            const rekPremiumState = document.getElementById("rek-premium-state");
            const rekPremiumContent = document.getElementById("rek-premium-content");
            
            if (currentUser.status === "FREE") {
                if(rekFreeState) rekFreeState.classList.remove("hidden");
                if(rekPremiumState) rekPremiumState.classList.add("hidden");
            } else {
                if(rekFreeState) rekFreeState.classList.add("hidden");
                if(rekPremiumState) {
                    rekPremiumState.classList.remove("hidden");
                    let premiumHTML = `<ul class="list-disc list-inside space-y-2">`;
                    if (currentUser.kategori === "Kuliner & F&B") {
                        premiumHTML += `<li>SOP Quality Control Bahan Baku (Mencegah Wastage)</li>`;
                        premiumHTML += `<li>Draft Instruksi Kerja Kasir untuk Upselling</li>`;
                        premiumHTML += `<li>Format Rekap Penjualan Harian via WA Group</li>`;
                    } else if (currentUser.kategori === "Fashion & Olshop") {
                        premiumHTML += `<li>Skrip Balas Chat WA (Meningkatkan Konversi Sales)</li>`;
                        premiumHTML += `<li>SOP Packing Barang Anti Salah Kirim</li>`;
                        premiumHTML += `<li>Matriks Re-stock Barang Fast Moving</li>`;
                    } else if (currentUser.kategori === "Jasa & Percetakan" || currentUser.kategori === "Jasa & Kriya") {
                        premiumHTML += `<li>SOP Maintenance Mesin Mingguan (Mencegah Downtime)</li>`;
                        premiumHTML += `<li>SLA Pengerjaan Order & Sistem Antrian</li>`;
                        premiumHTML += `<li>Formulir Quality Control Hasil Cetak</li>`;
                    } else if (currentUser.kategori === "PKL & Lapakan") {
                        premiumHTML += `<li>Aturan Pisah Uang Kas Pribadi & Jualan</li>`;
                        premiumHTML += `<li>SOP Persiapan Buka Lapak & Bersih-bersih</li>`;
                        premiumHTML += `<li>Tabel Pencatatan Laba Bersih Sederhana</li>`;
                    } else {
                        premiumHTML += `<li>SOP Standar Operasional Harian</li>`;
                        premiumHTML += `<li>Draft Evaluasi Kinerja Karyawan Bulanan</li>`;
                    }
                    premiumHTML += `</ul>`;
                    if(rekPremiumContent) rekPremiumContent.innerHTML = premiumHTML;
                }
            }
        });
    }

    // AI SOP Logic & Quota
    const btnSop = document.getElementById("btn-generate-sop");
    if (btnSop) {
        let aiQuota = parseInt(localStorage.getItem("logaritma_ai_quota") || "2");
        updateQuotaUI(aiQuota);

        // Event listener dipindahkan ke js/workspace.js
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

    // ==========================================
    // ADMIN DASHBOARD LOGIC (/admin/index.html)
    // ==========================================
    document.addEventListener("DOMContentLoaded", async function() {
        // Admin Mobile Menu Toggle
        const adminMenuBtn = document.getElementById("admin-menu-btn");
        const adminSidebar = document.getElementById("admin-sidebar");
        
        if (adminMenuBtn && adminSidebar) {
            adminMenuBtn.addEventListener("click", () => {
                adminSidebar.classList.toggle("-translate-x-full");
            });
        }

        // Hanya jalankan jika di halaman admin
        if (!document.getElementById("view-dashboard")) return;

        let leads = [];
        let visitorStats = { today: 0, lastWeek: 0, allTime: 0 };

        // Tab Switching Logic
        const navs = {
            'dashboard': { btn: document.getElementById('nav-dashboard'), view: document.getElementById('view-dashboard') },
            'leads': { btn: document.getElementById('nav-leads'), view: document.getElementById('view-leads') },
            'premium': { btn: document.getElementById('nav-premium'), view: document.getElementById('view-premium') }
        };

        function switchTab(tabId) {
            Object.keys(navs).forEach(key => {
                const n = navs[key];
                if(n.btn && n.view) {
                    if(key === tabId) {
                        n.btn.classList.add('bg-blue-600/10', 'text-blue-400', 'active');
                        n.btn.classList.remove('text-slate-400', 'hover:bg-slate-800', 'hover:text-white');
                        n.view.classList.remove('hidden');
                        n.view.classList.add('block');
                    } else {
                        n.btn.classList.remove('bg-blue-600/10', 'text-blue-400', 'active');
                        n.btn.classList.add('text-slate-400', 'hover:bg-slate-800', 'hover:text-white');
                        n.view.classList.remove('block');
                        n.view.classList.add('hidden');
                    }
                }
            });
        }

        Object.keys(navs).forEach(key => {
            if(navs[key].btn) {
                navs[key].btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    switchTab(key);
                });
            }
        });

        // Helper functions
        const formatDate = (dateValue) => {
            if(!dateValue) return '-';
            if(typeof dateValue === 'string' && dateValue.includes('/')) return dateValue;
            const d = new Date(dateValue);
            if(isNaN(d.getTime())) return '-';
            return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
        };

        const isOnline = (dateValue) => {
            if(!dateValue) return false;
            const d = new Date(dateValue);
            if(isNaN(d.getTime())) return false;
            const diffMinutes = (new Date() - d) / (1000 * 60);
            return diffMinutes <= 15; // Online if active within last 15 mins
        };

        const generateWAUrl = (lead, type) => {
            let text = "";
            if(type === "free") {
                text = `Halo Bapak/Ibu ${lead.nama}, saya dari Logaritma.id melihat bisnis Anda berstatus ${lead.kesehatan}. Mari diskusikan bagaimana Logaritma bisa membantu.`;
            } else {
                text = `Halo Bapak/Ibu ${lead.nama}, terima kasih telah berlangganan Logaritma UMKM PRO. Apakah ada kendala saat menggunakan fitur kami?`;
            }
            return `https://wa.me/${lead.wa.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
        };

        // Render Functions
        function renderDashboard() {
            // Visitor Stats
            document.getElementById('stat-visitors-today').textContent = visitorStats.today;
            document.getElementById('stat-visitors-week').textContent = visitorStats.lastWeek; // We can improve this query later
            document.getElementById('stat-visitors-all').textContent = visitorStats.allTime;

            // Activity Log Table (All users sorted by last_active)
            const tbody = document.getElementById('admin-dashboard-table');
            if(!tbody) return;

            const activeLeads = leads.filter(l => l.last_active).sort((a,b) => new Date(b.last_active) - new Date(a.last_active)).slice(0, 50);
            
            if(activeLeads.length === 0) {
                tbody.innerHTML = `<tr><td colspan="4" class="px-6 py-8 text-center text-slate-500">Belum ada aktivitas terekam.</td></tr>`;
                return;
            }

            tbody.innerHTML = activeLeads.map(lead => {
                const online = isOnline(lead.last_active);
                return `
                <tr class="border-b border-slate-700/50 hover:bg-slate-800/30 transition">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-400">${formatDate(lead.last_active)}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="font-medium text-white flex items-center gap-2">
                            <span class="w-2 h-2 rounded-full ${online ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]' : 'bg-slate-600'}"></span>
                            ${lead.nama || lead.namaPemilik}
                        </div>
                        <div class="text-xs text-slate-500">${lead.kategori}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        Membuka: <span class="font-bold text-blue-400">${lead.last_feature_opened || 'Dashboard / General'}</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 py-1 text-[10px] font-bold rounded-full border ${online ? 'bg-green-500/10 text-green-400 border-green-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'}">${online ? 'ONLINE' : 'OFFLINE'}</span>
                    </td>
                </tr>
                `;
            }).join('');
        }

        function renderLeads() {
            const tbody = document.getElementById('admin-leads-table');
            if(!tbody) return;

            const freeLeads = leads.filter(l => {
                const s = (l.status || "").toUpperCase();
                return !s.includes("PREMIUM") && !s.includes("PRO");
            });

            if(freeLeads.length === 0) {
                tbody.innerHTML = `<tr><td colspan="5" class="px-6 py-8 text-center text-slate-500">Belum ada calon pelanggan.</td></tr>`;
                return;
            }

            tbody.innerHTML = freeLeads.map((lead, index) => {
                const online = isOnline(lead.last_active);
                return `
                <tr class="border-b border-slate-700/50 hover:bg-slate-800/30 transition">
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 py-1 text-xs font-bold rounded-full border bg-slate-800 text-slate-400 border-slate-700">FREE PLAN</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="font-medium text-white flex items-center gap-2">
                            <span class="w-2 h-2 rounded-full ${online ? 'bg-green-500' : 'bg-slate-600'}" title="${online ? 'Online' : 'Offline'}"></span>
                            ${lead.nama || lead.namaPemilik}
                        </div>
                        <div class="text-sm text-slate-400">${lead.wa || lead.whatsapp}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-slate-300">${lead.kategori}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-xs text-slate-400">${lead.last_active ? formatDate(lead.last_active) : 'Belum pernah login'}</div>
                        <div class="text-[10px] text-slate-500 mt-1">${lead.last_feature_opened ? 'Buka: ' + lead.last_feature_opened : ''}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap flex gap-2">
                        <a href="${generateWAUrl(lead, 'free')}" target="_blank" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs rounded shadow transition flex items-center gap-1">
                            Hubungi WA
                        </a>
                    </td>
                </tr>
                `;
            }).join('');
        }

        function renderPremium() {
            const tbody = document.getElementById('admin-premium-table');
            if(!tbody) return;

            const premiumLeads = leads.filter(l => {
                const s = (l.status || "").toUpperCase();
                return s.includes("PREMIUM") || s.includes("PRO");
            });

            if(premiumLeads.length === 0) {
                tbody.innerHTML = `<tr><td colspan="5" class="px-6 py-8 text-center text-slate-500">Belum ada pelanggan premium.</td></tr>`;
                return;
            }

            tbody.innerHTML = premiumLeads.map((lead, index) => {
                const online = isOnline(lead.last_active);
                return `
                <tr class="border-b border-slate-700/50 hover:bg-slate-800/30 transition">
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 py-1 text-xs font-bold rounded-full border bg-amber-500/20 text-amber-400 border-amber-500/30">PRO MEMBER</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="font-medium text-white flex items-center gap-2">
                            <span class="w-2 h-2 rounded-full ${online ? 'bg-green-500' : 'bg-slate-600'}" title="${online ? 'Online' : 'Offline'}"></span>
                            ${lead.nama || lead.namaPemilik}
                        </div>
                        <div class="text-sm text-slate-400">${lead.wa || lead.whatsapp}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-slate-300">${lead.kategori}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-xs text-slate-400">${lead.last_active ? formatDate(lead.last_active) : '-'}</div>
                        <div class="text-[10px] text-slate-500 mt-1">${lead.last_feature_opened ? 'Buka: ' + lead.last_feature_opened : ''}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap flex gap-2">
                        <a href="${generateWAUrl(lead, 'pro')}" target="_blank" class="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded shadow transition flex items-center gap-1">
                            Support WA
                        </a>
                    </td>
                </tr>
                `;
            }).join('');
        }

        // Main Data Fetcher
        window.refreshAdminData = async function() {
            if(window.LogaritmaDB) {
                leads = await window.LogaritmaDB.getAllLeads();
                visitorStats = await window.LogaritmaDB.getVisitorStats();
            } else {
                leads = JSON.parse(localStorage.getItem("logarithm_admin_leads") || "[]");
            }
            
            renderDashboard();
            renderLeads();
            renderPremium();
        };

        // Attach Refresh Buttons
        document.querySelectorAll('.btn-refresh').forEach(btn => {
            btn.addEventListener("click", () => {
                const originalText = btn.innerHTML;
                btn.innerHTML = "🔄 Memuat...";
                window.refreshAdminData().then(() => {
                    btn.innerHTML = originalText;
                });
            });
        });

        // Initial Load
        window.refreshAdminData();
    });

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

    const inputsNominal = ["input-profit", "input-harga", "input-ltm-biaya", "input-ltm-target", "fb-input-profit", "fb-input-harga"];
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
                Swal.fire({text: "Harap isi semua kolom dengan angka yang valid.", background: '#0f172a', color: '#cbd5e1', confirmButtonColor: '#10b981'});
                return;
            }

            if(window.LogaritmaDB && window.LogaritmaDB.trackActivity) {
                const currentUserStr = localStorage.getItem("logarithm_current_user");
                if(currentUserStr) {
                    const u = JSON.parse(currentUserStr);
                    window.LogaritmaDB.trackActivity(u.wa || u.whatsapp, "Kalkulator Profit");
                }
            }
            const omzet = profit / (margin / 100);
            const salesUnit = omzet / harga;
            const leadsTotal = salesUnit / (cr / 100);
            const leadsHarian = leadsTotal / 30;

            const targetDefaultData = {
                omzetBulan: omzet,
                targetUnitBulan: salesUnit,
                leadsHarian: leadsHarian
            };
            localStorage.setItem("logaritma_default_target", JSON.stringify(targetDefaultData));
            
            // Try updating sop badge if it exists
            if (typeof window.updateSopBadge === "function") {
                window.updateSopBadge();
            }

            const formatRp = (num) => "Rp " + Math.round(num).toLocaleString("id-ID");

            document.getElementById("hasil-omzet").textContent = formatRp(omzet);
            document.getElementById("hasil-unit").textContent = Math.round(salesUnit).toLocaleString("id-ID") + " Unit";
            document.getElementById("hasil-leads").textContent = Math.ceil(leadsHarian) + " Leads/hari";

            document.getElementById("hasil-profit").classList.remove("hidden");

            // Rekomendasi Eksekusi Tim Logaritma Logic
            const rekFreeState = document.getElementById("rek-free-state");
            const rekPremiumState = document.getElementById("rek-premium-state");
            const rekPremiumContent = document.getElementById("rek-premium-content");
            
            if (currentUser.status === "FREE") {
                if(rekFreeState) rekFreeState.classList.remove("hidden");
                if(rekPremiumState) rekPremiumState.classList.add("hidden");
            } else {
                if(rekFreeState) rekFreeState.classList.add("hidden");
                if(rekPremiumState) {
                    rekPremiumState.classList.remove("hidden");
                    let premiumHTML = `<ul class="list-disc list-inside space-y-2">`;
                    if (currentUser.kategori === "Kuliner & F&B") {
                        premiumHTML += `<li>SOP Quality Control Bahan Baku (Mencegah Wastage)</li>`;
                        premiumHTML += `<li>Draft Instruksi Kerja Kasir untuk Upselling</li>`;
                        premiumHTML += `<li>Format Rekap Penjualan Harian via WA Group</li>`;
                    } else if (currentUser.kategori === "Fashion & Olshop") {
                        premiumHTML += `<li>Skrip Balas Chat WA (Meningkatkan Konversi Sales)</li>`;
                        premiumHTML += `<li>SOP Packing Barang Anti Salah Kirim</li>`;
                        premiumHTML += `<li>Matriks Re-stock Barang Fast Moving</li>`;
                    } else if (currentUser.kategori === "Jasa & Percetakan" || currentUser.kategori === "Jasa & Kriya") {
                        premiumHTML += `<li>SOP Maintenance Mesin Mingguan (Mencegah Downtime)</li>`;
                        premiumHTML += `<li>SLA Pengerjaan Order & Sistem Antrian</li>`;
                        premiumHTML += `<li>Formulir Quality Control Hasil Cetak</li>`;
                    } else if (currentUser.kategori === "PKL & Lapakan") {
                        premiumHTML += `<li>Aturan Pisah Uang Kas Pribadi & Jualan</li>`;
                        premiumHTML += `<li>SOP Persiapan Buka Lapak & Bersih-bersih</li>`;
                        premiumHTML += `<li>Tabel Pencatatan Laba Bersih Sederhana</li>`;
                    } else {
                        premiumHTML += `<li>SOP Standar Operasional Harian</li>`;
                        premiumHTML += `<li>Draft Evaluasi Kinerja Karyawan Bulanan</li>`;
                    }
                    premiumHTML += `</ul>`;
                    if(rekPremiumContent) rekPremiumContent.innerHTML = premiumHTML;
                }
            }
        });
    }

    // AI SOP Logic & Quota
    const btnSop = document.getElementById("btn-generate-sop");
    if (btnSop) {
        let aiQuota = parseInt(localStorage.getItem("logaritma_ai_quota") || "2");
        updateQuotaUI(aiQuota);

        // Event listener dipindahkan ke js/workspace.js
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
                Swal.fire({text: "Masukkan angka biaya dan target hasil yang valid.", background: '#0f172a', color: '#cbd5e1', confirmButtonColor: '#10b981'});
                return;
            }

            if(window.LogaritmaDB && window.LogaritmaDB.trackActivity) {
                const currentUserStr = localStorage.getItem("logarithm_current_user");
                if(currentUserStr) {
                    const u = JSON.parse(currentUserStr);
                    window.LogaritmaDB.trackActivity(u.wa || u.whatsapp, "LTM Checker");
                }
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
                desc.textContent = "Rencana kegiatan ini memiliki rasio pengembalian (ROI) yang positif dan kuat. Silakan susun pelaksanaannya menggunakan Tim Logaritma.";
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




// ==========================================
// LOGIN & AUTHENTICATION LOGIC
// ==========================================
document.addEventListener("DOMContentLoaded", async function() {
    // 1. Member Login Page Logic (/login/index.html)
    const formLogin = document.getElementById("form-login");
    if(formLogin) {
        formLogin.addEventListener("submit", async function(e) {
            e.preventDefault();
            const inputWA = document.getElementById("input-login-wa").value;
            const errorMsg = document.getElementById("login-error");
            
            let foundUser = null;
            if(window.LogaritmaDB) {
                foundUser = await window.LogaritmaDB.getUserByWA(inputWA);
            } else {
                let leads = JSON.parse(localStorage.getItem("logarithm_admin_leads") || "[]");
                foundUser = leads.find(l => l.whatsapp === inputWA || l.wa === inputWA);
            }
            
            
            if(foundUser) {
                localStorage.setItem("logarithm_current_user", JSON.stringify(foundUser));
                let catId = foundUser.categoryId;
                if(!catId) {
                    const k = foundUser.kategori || "";
                    if(k.includes("Kuliner") || k.includes("F&B")) catId = "kuliner";
                    else if(k.includes("Fashion") || k.includes("Retail") || k.includes("Olshop")) catId = "fashion";
                    else if(k.includes("Percetakan") || k.includes("Jasa") || k.includes("Kriya") || k.includes("Bengkel")) catId = "percetakan";
                    else if(k.includes("PKL") || k.includes("Lapakan")) catId = "pkl";
                    else if(k.includes("Distributor") || k.includes("Agen") || k.includes("Grosir")) catId = "distributor";
                    else catId = "kuliner"; // default
                }
                window.location.href = "/tools/" + catId + "/";
            } else {
                errorMsg.classList.remove("hidden");
                setTimeout(() => {
                    document.getElementById('login-modal').classList.add('hidden');
                    document.getElementById('login-modal').classList.remove('flex');
                    
                    const diagModal = document.getElementById('diagnostic-modal');
                    if(diagModal) {
                        diagModal.classList.remove('hidden');
                        diagModal.classList.add('flex');
                        document.body.style.overflow = "hidden";
                    } else {
                        document.body.style.overflow = "auto";
                        window.location.href = "#kalkulator";
                    }
                }, 1500);
            }

        });
    }

    
    // Login Modal Toggle
    const loginModal = document.getElementById("login-modal");
    const openLoginBtns = document.querySelectorAll(".open-login-btn");
    const closeLoginBtn = document.getElementById("close-login-btn");
    
    if(loginModal) {
        openLoginBtns.forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                loginModal.classList.remove("hidden");
                loginModal.classList.add("flex");
                document.body.style.overflow = "hidden";
            });
        });
        if(closeLoginBtn) {
            closeLoginBtn.addEventListener("click", () => {
                loginModal.classList.add("hidden");
                loginModal.classList.remove("flex");
                document.body.style.overflow = "auto";
                document.getElementById("login-error").classList.add("hidden");
            });
        }
    }

    // 2. Member Dashboard Protection & Personalization (/tools/index.html)
    // Cek jika halaman saat ini adalah tools
    if(window.location.pathname.includes("/tools/")) {
        const currentUserStr = localStorage.getItem("logarithm_current_user");
        if(!currentUserStr) {
            // Belum login!
            window.location.href = "/login/";
            return;
        }

        const currentUser = JSON.parse(currentUserStr);

        // Update Header
        const statusBadge = document.getElementById("user-status-badge");
        const profileBadge = document.getElementById("user-profile-badge");
        if(statusBadge) {
            statusBadge.classList.add("hidden");
            statusBadge.classList.remove("sm:flex");
        }
        if(profileBadge) {
            profileBadge.classList.remove("hidden");
            profileBadge.classList.add("sm:flex");
        }
        
        const nameDisplay = document.getElementById("user-name-display");
        const catDisplay = document.getElementById("user-category-display");
        if(nameDisplay) nameDisplay.textContent = (currentUser.nama || currentUser.namaPemilik || "Member").split(" ")[0];
        if(catDisplay) catDisplay.textContent = currentUser.kategori || "UMKM";
        
        const subtitle = document.getElementById("dashboard-subtitle");
        if(subtitle) subtitle.textContent = `Khusus: ${currentUser.kategori || "UMKM"}`;

        // Dynamic Placeholders & Dashboard Setup berdasarkan kategori
        const inputSOP = document.getElementById("input-sop");
        const sopCatText = document.getElementById("sop-category-text");
        if(sopCatText) sopCatText.textContent = currentUser.kategori || "Anda";
        
        const wsHeading = document.getElementById("workspace-heading");
        const wtHeading = document.getElementById("webtool-heading");
        const sbTitle = document.getElementById("support-box-title");
        const rekCatName = document.getElementById("rek-cat-name");

        let ph = "Tulis kegiatan yang ingin dibuatkan aturannya...";
        let wsText = "Workspace Operasional";
        let wtText = "Kalkulator Target Untung Bulanan";
        let sbText = "Tim Spesialis Logaritma";

        switch(currentUser.kategori) {
            case "Kuliner & F&B":
                ph = "Contoh: Cara simpan bahan baku dapur, SOP kasir resto...";
                wsText = "Workspace Operasional Kuliner & F&B";
                wtText = "Kalkulator HPP, Yield & Food-Waste Dapur";
                sbText = "Tim Spesialis Operasional Kuliner Logaritma";
                break;
            case "Fashion & Olshop":
                ph = "Contoh: Cara balas chat WA agar closing, SOP packing barang...";
                wsText = "Workspace Sales & Inventory Fashion";
                wtText = "Matriks Turn-Over Stok & Lead Conversion Rate";
                sbText = "Tim Analis Sales & Stock Logaritma";
                break;
            case "Jasa & Percetakan":
            case "Jasa & Kriya":
                ph = "Contoh: Quality Control hasil cetakan, SOP melayani klien...";
                wsText = "Workspace QC & Production Engineering";
                wtText = "Kalkulator SLA Mesin & Margin Cetak";
                sbText = "Tim QC & Produksi Logaritma";
                break;
            case "PKL & Lapakan":
                ph = "Contoh: Cara atur modal jualan harian agar tidak minus...";
                wsText = "Workspace Manajemen Lapak & Modal Putar";
                wtText = "Pemisah Kas Usaha vs Kas Dapur";
                sbText = "Tim Pendamping Cashflow Lapak Logaritma";
                break;
        }
        
        if(inputSOP) inputSOP.placeholder = ph;
        if(wsHeading) wsHeading.textContent = wsText;
        if(wtHeading) wtHeading.textContent = wtText;
        if(sbTitle) sbTitle.textContent = sbText;
        if(rekCatName) rekCatName.textContent = currentUser.kategori || "";
        
        // Fitur Logout
        const btnLogout = document.getElementById("btn-logout");
        if(btnLogout) {
            btnLogout.addEventListener("click", () => {
                localStorage.removeItem("logarithm_current_user");
                window.location.href = "/login/";
            });
        }
    }
});



// ==========================================
// MAYAR PAYMENT AUTO-REDIRECT
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    if(window.location.pathname === '/' || window.location.pathname === '/index.html') {
        const urlParams = new URLSearchParams(window.location.search);
        if (localStorage.getItem('logarithm_current_user') && urlParams.get('payment') === 'success') {
            const user = JSON.parse(localStorage.getItem('logarithm_current_user'));
            
            // Auto upgrade status client-side
            user.status = "PRO";
            localStorage.setItem('logarithm_current_user', JSON.stringify(user));
            // Set flag to show popup in dashboard
            localStorage.setItem('show_premium_popup', 'true');
            
            let catId = user.categoryId;
            if(!catId) {
                const k = user.kategori || '';
                if(k.includes('Kuliner') || k.includes('F&B')) catId = 'kuliner';
                else if(k.includes('Fashion') || k.includes('Retail') || k.includes('Olshop')) catId = 'fashion';
                else if(k.includes('Percetakan') || k.includes('Sablon')) catId = 'percetakan';
                else if(k.includes('Kaki Lima') || k.includes('Gerobak')) catId = 'pkl';
                else if(k.includes('Agen') || k.includes('Distributor') || k.includes('Grosir')) catId = 'distributor';
                else catId = 'kuliner';
            }
            
            if(window.LogaritmaDB && window.LogaritmaDB.updateLeadStatus) {
                // Wait for DB update, but timeout after 2 seconds to not freeze user
                Promise.race([
                    window.LogaritmaDB.updateLeadStatus(user.whatsapp || user.wa, "PRO"),
                    new Promise(r => setTimeout(r, 2000))
                ]).then(() => {
                    window.top.location.href = '/tools/' + catId + '/#dasbor';
                }).catch(() => {
                    window.top.location.href = '/tools/' + catId + '/#dasbor';
                });
            } else {
                window.top.location.href = '/tools/' + catId + '/#dasbor';
            }
        }
    }
});
d o c u m e n t . a d d E v e n t L i s t e n e r ( ' D O M C o n t e n t L o a d e d ' ,   ( )   = >   {   i f ( w i n d o w . L o g a r i t m a D B   & &   w i n d o w . L o g a r i t m a D B . t r a c k V i s i t o r )   {   w i n d o w . L o g a r i t m a D B . t r a c k V i s i t o r ( ) ;   }   e l s e   {   s e t T i m e o u t ( ( )   = >   {   i f ( w i n d o w . L o g a r i t m a D B   & &   w i n d o w . L o g a r i t m a D B . t r a c k V i s i t o r )   w i n d o w . L o g a r i t m a D B . t r a c k V i s i t o r ( ) ;   } ,   1 5 0 0 ) ;   }   } ) ;  
 