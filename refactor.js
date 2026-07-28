const fs = require('fs');
let content = fs.readFileSync('js/main.js', 'utf8');

// 1. Diagnostics Form submit (form2)
content = content.replace('form2.addEventListener("submit", function(e) {', 'form2.addEventListener("submit", async function(e) {');

const oldSave = `            // Save to localStorage for Admin
            let adminLeads = JSON.parse(localStorage.getItem("logarithm_admin_leads") || "[]");
            adminLeads.unshift(leadData);
            localStorage.setItem("logarithm_admin_leads", JSON.stringify(adminLeads));`;
const newSave = `            // Save to Database
            if(window.LogaritmaDB) {
                await window.LogaritmaDB.saveLead(leadData);
            } else {
                let adminLeads = JSON.parse(localStorage.getItem("logarithm_admin_leads") || "[]");
                adminLeads.unshift(leadData);
                localStorage.setItem("logarithm_admin_leads", JSON.stringify(adminLeads));
            }`;
content = content.replace(oldSave, newSave);

// 2. Admin Logic
content = content.replace(
    '// ADMIN DASHBOARD LOGIC (/admin/index.html)\n// ==========================================\ndocument.addEventListener("DOMContentLoaded", function() {',
    '// ADMIN DASHBOARD LOGIC (/admin/index.html)\n// ==========================================\ndocument.addEventListener("DOMContentLoaded", async function() {'
);

const oldAdminRender = `        let leads = JSON.parse(localStorage.getItem("logarithm_admin_leads") || "[]");

        // Helper date format`;
const newAdminRender = `        let leads = [];
        if(window.LogaritmaDB) {
            leads = await window.LogaritmaDB.getAllLeads();
        } else {
            leads = JSON.parse(localStorage.getItem("logarithm_admin_leads") || "[]");
        }

        // Expose a global refresh function for the refresh button
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

        // Helper date format`;
content = content.replace(oldAdminRender, newAdminRender);

content = content.replace(
    '        window.updateLeadStatus = function(index, newStatus) {\n            leads[index].status = newStatus;\n            localStorage.setItem("logarithm_admin_leads", JSON.stringify(leads));\n            renderAdmin();\n        };',
    '        window.updateLeadStatus = async function(index, newStatus) {\n            leads[index].status = newStatus;\n            if(window.LogaritmaDB) {\n                await window.LogaritmaDB.updateLeadStatus(leads[index].wa || leads[index].whatsapp, newStatus);\n            } else {\n                localStorage.setItem("logarithm_admin_leads", JSON.stringify(leads));\n            }\n            renderAdmin();\n        };'
);

// Modify sendWA to not crash if LogaritmaDB is used, it should be async if it updates status
content = content.replace(
    '        window.sendWA = function(index) {',
    '        window.sendWA = async function(index) {'
);
content = content.replace(
    '            if(lead.status === "Calon Pelanggan") {\n                leads[index].status = "Di-Follow Up";\n                localStorage.setItem("logarithm_admin_leads", JSON.stringify(leads));\n                renderAdmin();\n            }',
    '            if(lead.status === "Calon Pelanggan") {\n                leads[index].status = "Di-Follow Up";\n                if(window.LogaritmaDB) {\n                    await window.LogaritmaDB.updateLeadStatus(leads[index].wa || leads[index].whatsapp, "Di-Follow Up");\n                } else {\n                    localStorage.setItem("logarithm_admin_leads", JSON.stringify(leads));\n                }\n                renderAdmin();\n            }'
);


// 3. Auth Logic
content = content.replace(
    '// LOGIN & AUTHENTICATION LOGIC\n// ==========================================\ndocument.addEventListener("DOMContentLoaded", function() {',
    '// LOGIN & AUTHENTICATION LOGIC\n// ==========================================\ndocument.addEventListener("DOMContentLoaded", async function() {'
);

content = content.replace(
    'formLogin.addEventListener("submit", function(e) {',
    'formLogin.addEventListener("submit", async function(e) {'
);

const oldLogin = `            // Ambil dari localStorage
            let leads = JSON.parse(localStorage.getItem("logarithm_admin_leads") || "[]");
            let foundUser = leads.find(l => l.whatsapp === inputWA);
            
            if(foundUser) {`;
const newLogin = `            let foundUser = null;
            if(window.LogaritmaDB) {
                foundUser = await window.LogaritmaDB.getUserByWA(inputWA);
            } else {
                let leads = JSON.parse(localStorage.getItem("logarithm_admin_leads") || "[]");
                foundUser = leads.find(l => l.whatsapp === inputWA);
            }
            
            if(foundUser) {`;
content = content.replace(oldLogin, newLogin);

// 4. Track Activity in Tools
// Profit calculator
content = content.replace(
    '            const btnDownload = document.getElementById("btn-download-profit");',
    '            if(window.LogaritmaDB) { const currentUserStr = localStorage.getItem("logarithm_current_user"); if(currentUserStr) { window.LogaritmaDB.trackActivity(JSON.parse(currentUserStr).whatsapp, "kalkulator"); } }\n            const btnDownload = document.getElementById("btn-download-profit");'
);

// SOP AI
content = content.replace(
    '            setTimeout(() => {',
    '            if(window.LogaritmaDB) { const currentUserStr = localStorage.getItem("logarithm_current_user"); if(currentUserStr) { window.LogaritmaDB.trackActivity(JSON.parse(currentUserStr).whatsapp, "sop"); } }\n            setTimeout(() => {'
);


// 5. Update Admin Table UI
const oldTableRow = `                    <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-400">\${formatDate(lead.tanggal)}</td>
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
                        <select onchange="updateLeadStatus(\${index}, this.value)"`;

const newTableRow = `                    <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-400">\${formatDate(lead.tanggal)}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="font-medium text-white">\${lead.nama}</div>
                        <div class="text-sm text-slate-400">\${lead.wa || lead.whatsapp}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-slate-300">\${lead.kategori}</div>
                        <div class="text-xs text-slate-500">\${lead.skor}/5</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 py-1 text-xs font-bold rounded-full border \${badgeClass}">\${lead.kesehatan}</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-white">\${lead.activity_count || 0} Aksi</div>
                        <div class="text-xs text-slate-500">\${lead.last_active ? formatDate(lead.last_active) : '-'}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <select onchange="updateLeadStatus(\${index}, this.value)"`;

content = content.replace(oldTableRow, newTableRow);

// Modify table header
const oldTableHeader = `                                <th class="px-6 py-4 font-bold">Status Kesehatan</th>
                                <th class="px-6 py-4 font-bold">Status Lead</th>
                                <th class="px-6 py-4 font-bold">Action</th>`;

const newTableHeader = `                                <th class="px-6 py-4 font-bold">Status Kesehatan</th>
                                <th class="px-6 py-4 font-bold">Aktivitas Member</th>
                                <th class="px-6 py-4 font-bold">Status Lead</th>
                                <th class="px-6 py-4 font-bold">Action</th>`;
const adminHtmlPath = 'admin/index.html';
let adminHtml = fs.readFileSync(adminHtmlPath, 'utf8');
adminHtml = adminHtml.replace(oldTableHeader, newTableHeader);
fs.writeFileSync(adminHtmlPath, adminHtml);


fs.writeFileSync('js/main.js', content);
console.log('Refactor complete');
