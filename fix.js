const fs = require('fs');
let content = fs.readFileSync('js/main.js', 'utf8');

// 1. Diagnostics Form submit (form2)
content = content.replace(/form2\.addEventListener\("submit", function\(e\) \{/g, 'form2.addEventListener("submit", async function(e) {');

// Replace localStorage save with Firebase
content = content.replace(/\/\/ Save to localStorage for Admin[\s\S]*?localStorage\.setItem\("logarithm_admin_leads", JSON\.stringify\(adminLeads\)\);/g, 
`// Save to Database
            if(window.LogaritmaDB) {
                await window.LogaritmaDB.saveLead(leadData);
            } else {
                let adminLeads = JSON.parse(localStorage.getItem("logarithm_admin_leads") || "[]");
                adminLeads.unshift(leadData);
                localStorage.setItem("logarithm_admin_leads", JSON.stringify(adminLeads));
            }`);

// 2. Admin Logic
content = content.replace(
    /\/\/ ADMIN DASHBOARD LOGIC \(\/admin\/index\.html\)\r?\n\/\/ ==========================================\r?\ndocument\.addEventListener\("DOMContentLoaded", function\(\) \{/,
    '// ADMIN DASHBOARD LOGIC (/admin/index.html)\n// ==========================================\ndocument.addEventListener("DOMContentLoaded", async function() {'
);

// Admin Render Fetch
content = content.replace(
    /let leads = JSON\.parse\(localStorage\.getItem\("logarithm_admin_leads"\) \|\| "\[\]"\);\r?\n\r?\n\s+\/\/ Helper date format/,
    `let leads = [];
        if(window.LogaritmaDB) {
            leads = await window.LogaritmaDB.getAllLeads();
        } else {
            leads = JSON.parse(localStorage.getItem("logarithm_admin_leads") || "[]");
        }

        window.refreshAdminData = async function() {
            if(window.LogaritmaDB) leads = await window.LogaritmaDB.getAllLeads();
            renderAdmin();
        };

        const btnRefresh = document.getElementById("btn-refresh-data");
        if(btnRefresh) {
            btnRefresh.addEventListener("click", () => {
                btnRefresh.innerHTML = "🔄 Memuat...";
                window.refreshAdminData().then(() => {
                    btnRefresh.innerHTML = "🔄 Refresh Data";
                });
            });
        }

        // Helper date format`
);

// Admin table Row
content = content.replace(
    /<td class="px-6 py-4 whitespace-nowrap">\s*<div class="font-medium text-white">\$\{lead\.nama\}<\/div>\s*<div class="text-sm text-slate-400">\$\{lead\.wa\}<\/div>\s*<\/td>/g,
    `<td class="px-6 py-4 whitespace-nowrap">
                        <div class="font-medium text-white">\${lead.nama || lead.namaPemilik}</div>
                        <div class="text-sm text-slate-400">\${lead.wa || lead.whatsapp}</div>
                    </td>`
);
content = content.replace(
    /<td class="px-6 py-4 whitespace-nowrap">\s*<span class="px-2 py-1 text-xs font-bold rounded-full border \$\{badgeClass\}">\$\{lead\.kesehatan\}<\/span>\s*<\/td>\s*<td class="px-6 py-4 whitespace-nowrap">\s*<select/g,
    `<td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 py-1 text-xs font-bold rounded-full border \${badgeClass}">\${lead.kesehatan || lead.skorKesehatan}</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-white">\${lead.activity_count || 0} Aksi</div>
                        <div class="text-xs text-slate-500">\${lead.last_active ? formatDate(lead.last_active) : '-'}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <select`
);

// updateLeadStatus
content = content.replace(
    /window\.updateLeadStatus = function\(index, newStatus\) \{[\s\S]*?renderAdmin\(\);\r?\n\s+\};/,
    `window.updateLeadStatus = async function(index, newStatus) {
            leads[index].status = newStatus;
            if(window.LogaritmaDB) {
                await window.LogaritmaDB.updateLeadStatus(leads[index].wa || leads[index].whatsapp, newStatus);
            } else {
                localStorage.setItem("logarithm_admin_leads", JSON.stringify(leads));
            }
            renderAdmin();
        };`
);

// sendWA
content = content.replace(
    /window\.sendWA = function\(index\) \{/g,
    'window.sendWA = async function(index) {'
);
content = content.replace(
    /if\(lead\.status === "Calon Pelanggan"\) \{[\s\S]*?renderAdmin\(\);\r?\n\s+\}/,
    `if(lead.status === "Calon Pelanggan") {
                leads[index].status = "Di-Follow Up";
                if(window.LogaritmaDB) {
                    await window.LogaritmaDB.updateLeadStatus(leads[index].wa || leads[index].whatsapp, "Di-Follow Up");
                } else {
                    localStorage.setItem("logarithm_admin_leads", JSON.stringify(leads));
                }
                renderAdmin();
            }`
);


// 3. Auth Logic
content = content.replace(
    /\/\/ LOGIN & AUTHENTICATION LOGIC\r?\n\/\/ ==========================================\r?\ndocument\.addEventListener\("DOMContentLoaded", function\(\) \{/,
    '// LOGIN & AUTHENTICATION LOGIC\n// ==========================================\ndocument.addEventListener("DOMContentLoaded", async function() {'
);

content = content.replace(
    /formLogin\.addEventListener\("submit", function\(e\) \{/,
    'formLogin.addEventListener("submit", async function(e) {'
);

content = content.replace(
    /\/\/ Ambil dari localStorage[\s\S]*?if\(foundUser\) \{/,
    `let foundUser = null;
            if(window.LogaritmaDB) {
                foundUser = await window.LogaritmaDB.getUserByWA(inputWA);
            } else {
                let leads = JSON.parse(localStorage.getItem("logarithm_admin_leads") || "[]");
                foundUser = leads.find(l => l.whatsapp === inputWA || l.wa === inputWA);
            }
            
            if(foundUser) {`
);

fs.writeFileSync('js/main.js', content);
console.log('Refactor regex complete');
