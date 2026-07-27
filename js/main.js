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
// UMKM KALKULATOR KEBOCORAN (INDEX.HTML)
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    const btnHitungUMKM = document.getElementById("btn-hitung-umkm");
    if (btnHitungUMKM) {
        btnHitungUMKM.addEventListener("click", function() {
            let totalScore = 0;
            let answered = 0;
            
            ["uq1", "uq2", "uq3", "uq4", "uq5"].forEach(q => {
                const selected = document.querySelector(`input[name="${q}"]:checked`);
                if (selected) {
                    totalScore += parseInt(selected.value);
                    answered++;
                }
            });

            if (answered < 5) {
                const errorModal = document.getElementById("error-modal");
                if (errorModal) {
                    errorModal.classList.remove("hidden");
                    errorModal.classList.add("flex");
                    document.body.style.overflow = "hidden";
                } else {
                    alert("Mohon jawab seluruh 5 pertanyaan diagnostik.");
                }
                return;
            }

            // Simpan sebagai leads dummy
            simpanLeadsUMKM();

            const hasilDiv = document.getElementById("hasil-kalkulator-umkm");
            const skorContainer = document.getElementById("skor-container-umkm");
            const judul = document.getElementById("status-judul-umkm");
            const deskripsi = document.getElementById("status-deskripsi-umkm");

            hasilDiv.classList.remove("hidden");
            this.classList.add("hidden");

            let currentScore = 0;
            const targetScore = totalScore * 10; // Max 100
            
            const interval = setInterval(() => {
                if (currentScore >= targetScore) {
                    clearInterval(interval);
                    
                    skorContainer.className = "w-32 h-32 mx-auto rounded-full flex items-center justify-center text-4xl font-bold border-4 mb-6 shadow-[0_0_30px_rgba(0,0,0,0.5)]";
                    
                    if (targetScore <= 30) {
                        skorContainer.classList.add("border-red-500", "text-red-500", "bg-red-500/10");
                        judul.textContent = "BAHAYA KEBOCORAN KRITIS";
                        judul.className = "text-xl font-bold mb-4 font-heading text-red-400";
                        deskripsi.textContent = "Bisnis Anda beroperasi tanpa arah matematis. Mayoritas margin habis untuk aktivitas yang tidak berkonversi menjadi profit.";
                    } else if (targetScore <= 70) {
                        skorContainer.classList.add("border-yellow-500", "text-yellow-500", "bg-yellow-500/10");
                        judul.textContent = "FASE TRANSISI (RAWAN)";
                        judul.className = "text-xl font-bold mb-4 font-heading text-yellow-400";
                        deskripsi.textContent = "Ada upaya mengukur target, namun belum konsisten hingga ke level staf eksekutor harian. Butuh standardisasi sistem.";
                    } else {
                        skorContainer.classList.add("border-emerald-500", "text-emerald-500", "bg-emerald-500/10");
                        judul.textContent = "SANGAT SEHAT";
                        judul.className = "text-xl font-bold mb-4 font-heading text-emerald-400";
                        deskripsi.textContent = "Sistem operasional Anda sudah berjalan dengan prinsip Backward Mapping yang sangat baik. Siap untuk scale-up agresif.";
                    }
                    
                    // Auto scroll ke hasil
                    setTimeout(() => {
                        hasilDiv.scrollIntoView({ behavior: "smooth", block: "center" });
                    }, 500);

                } else {
                    currentScore++;
                    skorContainer.textContent = currentScore;
                }
            }, 20);
        });
    }
});

function simpanLeadsUMKM() {
    let leads = JSON.parse(localStorage.getItem("logaritma_leads") || "[]");
    
    // Jangan spam leads jika dari IP/Browser yang sama dalam waktu berdekatan
    if(leads.length > 0 && (new Date().getTime() - leads[0].timestamp < 60000)) return;

    const dummyNames = ["Budi Santoso", "Siti Aminah", "Ahmad Fauzi", "Dewi Lestari"];
    const dummyBiz = ["Kopi Senja", "Toko Hijabku", "Agensi Kreatif XYZ", "Pabrik Tahu Joss"];
    const rIdx = Math.floor(Math.random() * dummyNames.length);

    leads.unshift({
        timestamp: new Date().getTime(),
        nama: dummyNames[rIdx],
        bisnis: dummyBiz[rIdx],
        wa: "0812" + Math.floor(10000000 + Math.random() * 90000000),
        status: "FREE",
        followUp: false
    });

    localStorage.setItem("logaritma_leads", JSON.stringify(leads));
}

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

        // Buka LTM Checker
        const tabLtm = document.getElementById("tab-ltm");
        if(tabLtm) {
            tabLtm.innerHTML = `
                <div class="max-w-2xl">
                    <h2 class="text-2xl font-bold text-white font-heading mb-4">Cek Kesehatan Bisnis (LTM)</h2>
                    <p class="text-slate-400 text-sm mb-6">Fitur Premium aktif. Silakan lakukan diagnosis mendalam terhadap operasional bisnis Anda.</p>
                    <div class="bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-inner">
                        <p class="text-emerald-400 font-bold mb-4">✓ Modul LTM Terbuka</p>
                        <p class="text-slate-300 text-sm">Dashboard analitik lengkap akan segera tersedia di pembaruan berikutnya. Sementara itu, gunakan Kalkulator Target Untung dan AI SOP Generator sepuasnya.</p>
                    </div>
                </div>
            `;
        }

        // Ubah link download laporan menjadi fungsi alert sukses
        document.querySelectorAll("#hasil-profit .trigger-paywall").forEach(btn => {
            btn.classList.remove("trigger-paywall", "bg-slate-800");
            btn.classList.add("bg-emerald-600", "hover:bg-emerald-500", "border-emerald-500");
            btn.innerHTML = `📄 Download Laporan (PDF)`;
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                alert("Laporan sedang diproses dan akan otomatis terunduh.");
            });
        });
        
        // Buka hasil blur pada AI SOP dan hapus tombol langganan
        const blurElements = document.querySelectorAll("#ai-result .blur-sm");
        blurElements.forEach(el => el.classList.remove("blur-sm", "select-none"));
        
        const overlayPremium = document.querySelector("#ai-result .bg-gradient-to-t");
        if(overlayPremium) overlayPremium.classList.add("hidden");
        
        // Hapus batas kuota AI
        localStorage.setItem("logaritma_ai_quota", "9999");
    }

    // Profit Calculator Logic
    const btnProfit = document.getElementById("btn-kalkulasi-profit");
    if (btnProfit) {
        btnProfit.addEventListener("click", () => {
            const profit = parseFloat(document.getElementById("input-profit").value);
            const margin = parseFloat(document.getElementById("input-margin").value);
            const harga = parseFloat(document.getElementById("input-harga").value);
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
                    <p class="font-bold text-white mb-2">Nama Proses: <span class="text-emerald-400">${inputVal.toUpperCase()}</span></p>
                    <p><strong>1. Ultimate Outcome (Target Akhir):</strong> Memastikan konversi pelanggan mencapai > 80% dari total keluhan.</p>
                    <p><strong>2. KPI Pelaksana:</strong> Respon < 5 Menit, Rating CS > 4.8.</p>
                    <p><strong>3. Langkah Standar (SOP):</strong></p>
                    <ul class="list-decimal pl-5 space-y-1">
                        <li>Ucapkan salam standar: "Halo, dengan [Nama CS], ada yang bisa dibantu?"</li>
                        <li>Identifikasi emosi pelanggan dan lakukan mirroring empati.</li>
                        <li>Input keluhan ke sistem CRM logaritma.</li>
                        <li>Eskalasi ke Lapis 2 jika masalah tidak selesai di menit ke-3.</li>
                        <li><span class="blur-sm select-none">Berikan voucher diskon retensi 10% jika terbukti ada kesalahan sistem.</span></li>
                        <li><span class="blur-sm select-none">Follow up H+1 untuk memastikan kepuasan paripurna.</span></li>
                    </ul>
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


// ==========================================
// ADMIN DASHBOARD LOGIC (/admin/index.html)
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    // Admin Mobile Menu Toggle
    const adminMenuBtn = document.getElementById("admin-menu-btn");
    const adminSidebar = document.getElementById("admin-sidebar");
    
    if (adminMenuBtn && adminSidebar) {
        adminMenuBtn.addEventListener("click", () => {
            adminSidebar.classList.toggle("hidden");
            adminSidebar.classList.toggle("flex");
        });
        
        // Close when clicking outside on mobile
        document.addEventListener("click", (e) => {
            if (window.innerWidth < 768 && !adminSidebar.classList.contains("hidden") && !adminSidebar.contains(e.target) && e.target !== adminMenuBtn) {
                adminSidebar.classList.add("hidden");
                adminSidebar.classList.remove("flex");
            }
        });
    }

    const tableBody = document.getElementById("admin-table-body");
    
    if (tableBody) {
        // Init Mock Data
        let leads = JSON.parse(localStorage.getItem("logaritma_leads") || "[]");
        if (leads.length === 0) {
            leads = [
                { timestamp: new Date().getTime() - 86400000, nama: "Joko Anwar", bisnis: "Film Production", wa: "081199998888", status: "PREMIUM", followUp: true },
                { timestamp: new Date().getTime() - 172800000, nama: "Rina Nose", bisnis: "Kuliner Geprek", wa: "081233445566", status: "FREE", followUp: false }
            ];
            localStorage.setItem("logaritma_leads", JSON.stringify(leads));
        }

        function renderAdmin() {
            leads = JSON.parse(localStorage.getItem("logaritma_leads") || "[]");
            
            // Update Stats
            document.getElementById("stat-total-leads").textContent = leads.length;
            
            const freeCount = leads.filter(l => l.status === "FREE").length;
            document.getElementById("stat-free-users").textContent = freeCount;
            
            const premiumCount = leads.filter(l => l.status === "PREMIUM").length;
            document.getElementById("stat-premium-users").textContent = premiumCount;
            document.getElementById("stat-revenue").textContent = "Est. Rp " + (premiumCount * 99000).toLocaleString("id-ID") + "/bln";
            
            const fuCount = leads.filter(l => l.status === "FREE" && !l.followUp).length;
            document.getElementById("stat-follow-up").textContent = fuCount;

            // Render Table
            tableBody.innerHTML = "";
            leads.forEach((lead, index) => {
                const dateObj = new Date(lead.timestamp);
                const dateStr = dateObj.toLocaleDateString("id-ID") + " " + dateObj.toLocaleTimeString("id-ID", {hour: "2-digit", minute:"2-digit"});
                
                const tr = document.createElement("tr");
                tr.className = "hover:bg-slate-800/50 transition";
                
                const statusBadge = lead.status === "PREMIUM" 
                    ? `<span class="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold px-2 py-1 rounded">PREMIUM</span>`
                    : `<span class="bg-slate-700 text-slate-300 text-[10px] font-bold px-2 py-1 rounded">FREE</span>`;

                const btnAction = lead.status === "PREMIUM"
                    ? `<button class="text-[10px] font-bold text-slate-500 px-3 py-1.5 border border-slate-700 rounded cursor-not-allowed">SUDAH AKTIF</button>`
                    : `<a href="https://wa.me/${lead.wa}?text=Halo%20Kak%20${encodeURIComponent(lead.nama)}%2C%20kami%20lihat%20Anda%20telah%20mencoba%20Logaritma%20Tools.%20Yuk%20aktifkan%20akses%20Premium%20Anda%20melalui%20link%20ini:%20https://baimwarunkarsi.myr.id/pay-membership" target="_blank" onclick="markFollowUp(${index})" class="text-[10px] font-bold bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded transition shadow-lg shadow-emerald-500/20">Kirim Link Perpanjangan WA</a>`;

                tr.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap text-xs">${dateStr}</td>
                    <td class="px-6 py-4">
                        <div class="font-bold text-white">${lead.nama}</div>
                        <div class="text-[10px] text-slate-500">${lead.bisnis}</div>
                    </td>
                    <td class="px-6 py-4 font-mono text-xs">${lead.wa}</td>
                    <td class="px-6 py-4">${statusBadge}</td>
                    <td class="px-6 py-4">${btnAction}</td>
                `;
                tableBody.appendChild(tr);
            });
        }

        // Expose global markFollowUp function
        window.markFollowUp = function(index) {
            leads[index].followUp = true;
            localStorage.setItem("logaritma_leads", JSON.stringify(leads));
            setTimeout(renderAdmin, 1000);
        };

        // Render on load
        setTimeout(renderAdmin, 500);

        // Refresh button
        const btnRefresh = document.getElementById("btn-refresh-data");
        if(btnRefresh) {
            btnRefresh.addEventListener("click", () => {
                tableBody.innerHTML = `<tr><td colspan="5" class="px-6 py-8 text-center text-slate-500"><div class="inline-block w-6 h-6 border-2 border-slate-700 border-t-blue-500 rounded-full animate-spin mb-2"></div><p>Memuat data terbaru...</p></td></tr>`;
                setTimeout(renderAdmin, 800);
            });
        }
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

