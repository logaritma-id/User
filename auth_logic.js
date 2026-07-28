
// ==========================================
// LOGIN & AUTHENTICATION LOGIC
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    // 1. Member Login Page Logic (/login/index.html)
    const formLogin = document.getElementById("form-login");
    if(formLogin) {
        formLogin.addEventListener("submit", function(e) {
            e.preventDefault();
            const inputWA = document.getElementById("input-login-wa").value;
            const errorMsg = document.getElementById("login-error");
            
            // Ambil dari localStorage
            let leads = JSON.parse(localStorage.getItem("logarithm_admin_leads") || "[]");
            let foundUser = leads.find(l => l.whatsapp === inputWA);
            
            if(foundUser) {
                // Set sesi aktif
                localStorage.setItem("logarithm_current_user", JSON.stringify(foundUser));
                // Redirect ke dashboard
                window.location.href = "/tools/";
            } else {
                errorMsg.classList.remove("hidden");
            }
        });
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
        if(nameDisplay) nameDisplay.textContent = currentUser.nama.split(" ")[0];
        if(catDisplay) catDisplay.textContent = currentUser.kategori;

        // Dynamic Placeholders untuk SOP AI berdasarkan kategori
        const inputSOP = document.getElementById("input-sop");
        if(inputSOP) {
            let ph = "Tulis kegiatan yang ingin dibuatkan aturannya...";
            switch(currentUser.kategori) {
                case "Kuliner & F&B":
                    ph = "Contoh: Cara simpan bahan baku dapur, SOP kasir resto...";
                    break;
                case "Fashion & Olshop":
                    ph = "Contoh: Cara balas chat WA agar closing, SOP packing barang...";
                    break;
                case "Jasa & Kriya":
                    ph = "Contoh: Quality Control hasil cetakan, SOP melayani klien...";
                    break;
                case "PKL & Lapakan":
                    ph = "Contoh: Cara atur modal jualan harian agar tidak minus...";
                    break;
            }
            inputSOP.placeholder = ph;
        }
        
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
