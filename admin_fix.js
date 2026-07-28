// ==========================================
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
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-400">\${formatDate(lead.tanggal)}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="font-medium text-white">\${lead.nama}</div>
                        <div class="text-sm text-slate-400">\${lead.wa}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-slate-300">\${lead.kategori}</div>
                        <div class="text-xs text-slate-500">\${lead.skor}/5</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 py-1 text-xs font-bold rounded-full border \${badgeClass}">\${lead.kesehatan}</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <select onchange="updateLeadStatus(\${index}, this.value)" class="bg-slate-800 border border-slate-600 rounded px-2 py-1 text-sm text-slate-300 focus:outline-none focus:border-blue-500">
                            <option value="Calon Pelanggan" \${lead.status === 'Calon Pelanggan' ? 'selected' : ''}>Calon Pelanggan</option>
                            <option value="Di-Follow Up" \${lead.status === 'Di-Follow Up' ? 'selected' : ''}>Di-Follow Up</option>
                            <option value="Member Premium" \${lead.status === 'Member Premium' ? 'selected' : ''}>Member Premium</option>
                        </select>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <button onclick="sendWA(\${index})" class="px-3 py-1 bg-green-600 hover:bg-green-500 text-white text-sm rounded shadow transition">Kirim WA</button>
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
            const text = \`Halo Bapak/Ibu \${lead.nama}, saya dari Logaritma.id melihat bisnis \${lead.kategori} Anda berstatus \${lead.kesehatan}. Mari diskusikan bagaimana Logaritma bisa membantu.\`;
            const waUrl = \`https://wa.me/\${lead.wa.replace(/[^0-9]/g, '')}?text=\${encodeURIComponent(text)}\`;
            
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
