const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'admin', 'index.html');
let html = fs.readFileSync(targetPath, 'utf-8');

// The new Work Order HTML and JS block
const newBlock = `
            <!-- WORK ORDERS VIEW -->
            <div id="view-campaigns" class="admin-view hidden h-[calc(100vh-8rem)]">
                <div class="flex flex-col h-full relative">
                    <!-- Dashboard KPI Summary -->
                    <div class="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6 shrink-0">
                        <div class="bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-sm">
                            <p class="text-[10px] font-bold text-slate-400 uppercase">Rev Bulan Ini</p>
                            <p class="text-xl font-bold text-emerald-400 mt-1" id="kpi-revenue">Rp 0</p>
                        </div>
                        <div class="bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-sm">
                            <p class="text-[10px] font-bold text-slate-400 uppercase">Total Spent Ads</p>
                            <p class="text-xl font-bold text-red-400 mt-1" id="kpi-spent">Rp 0</p>
                        </div>
                        <div class="bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-sm">
                            <p class="text-[10px] font-bold text-slate-400 uppercase">Campaign Aktif</p>
                            <p class="text-xl font-bold text-blue-400 mt-1" id="kpi-active">0</p>
                        </div>
                        <div class="bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-sm">
                            <p class="text-[10px] font-bold text-slate-400 uppercase">Menunggu Brief</p>
                            <p class="text-xl font-bold text-amber-400 mt-1" id="kpi-brief">0</p>
                        </div>
                        <div class="bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-sm">
                            <p class="text-[10px] font-bold text-slate-400 uppercase">Completed</p>
                            <p class="text-xl font-bold text-slate-200 mt-1" id="kpi-completed">0</p>
                        </div>
                        <div class="bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-sm">
                            <p class="text-[10px] font-bold text-slate-400 uppercase">Avg CPL (All)</p>
                            <p class="text-xl font-bold text-purple-400 mt-1" id="kpi-cpl">Rp 0</p>
                        </div>
                    </div>

                    <!-- Toolbar -->
                    <div class="flex justify-between items-center mb-4 shrink-0">
                        <div>
                            <h2 class="text-xl font-bold text-white font-heading">Work Order Management</h2>
                            <p class="text-sm text-slate-400">Pusat kontrol operasional layanan Logaritma</p>
                        </div>
                        <div class="flex gap-2 bg-slate-900 border border-slate-700 p-1 rounded-lg">
                            <button id="btn-view-table" onclick="window.woSetViewMode('table')" class="px-3 py-1.5 text-xs font-bold rounded-md bg-slate-800 text-white transition">Table</button>
                            <button id="btn-view-kanban" onclick="window.woSetViewMode('kanban')" class="px-3 py-1.5 text-xs font-bold rounded-md text-slate-400 hover:text-white transition">Kanban</button>
                        </div>
                    </div>
                    
                    <!-- Main Content Area: Table / Kanban -->
                    <div class="flex-1 overflow-hidden relative">
                        <!-- TABLE VIEW -->
                        <div id="wo-table-view" class="absolute inset-0 overflow-auto bg-slate-900 border border-slate-700 rounded-xl">
                            <table class="w-full text-left text-sm text-slate-300">
                                <thead class="text-xs text-slate-400 uppercase bg-slate-900/50 border-b border-slate-700 sticky top-0 z-10">
                                    <tr>
                                        <th class="px-4 py-3 font-bold">ID / Layanan</th>
                                        <th class="px-4 py-3 font-bold">Klien</th>
                                        <th class="px-4 py-3 font-bold">Status</th>
                                        <th class="px-4 py-3 font-bold">Priority / SLA</th>
                                        <th class="px-4 py-3 font-bold">PIC</th>
                                        <th class="px-4 py-3 font-bold">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody id="wo-table-body" class="divide-y divide-slate-800">
                                    <!-- Table Rows -->
                                </tbody>
                            </table>
                        </div>

                        <!-- KANBAN VIEW -->
                        <div id="wo-kanban-view" class="absolute inset-0 overflow-x-auto overflow-y-hidden hidden pb-4">
                            <div class="flex gap-4 h-full min-w-max" id="wo-kanban-board">
                                <!-- Kanban columns injected via JS -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- WORK ORDER DETAIL DRAWER (OFF-CANVAS) -->
            <div id="wo-drawer-overlay" class="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[250] hidden transition-opacity opacity-0" onclick="window.woCloseDrawer()"></div>
            <div id="wo-drawer" class="fixed inset-y-0 right-0 w-full md:w-[600px] bg-slate-900 border-l border-slate-800 shadow-2xl z-[300] transform translate-x-full transition-transform duration-300 flex flex-col">
                <!-- Header -->
                <div class="p-6 border-b border-slate-800 bg-slate-850 shrink-0 flex justify-between items-start">
                    <div>
                        <div class="flex items-center gap-3 mb-2">
                            <span class="text-xs font-mono text-slate-500" id="drawer-wo-id">WO-000</span>
                            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full" id="drawer-wo-status">Status</span>
                            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full" id="drawer-wo-priority">Priority</span>
                        </div>
                        <h2 class="text-xl font-heading font-bold text-white" id="drawer-client-name">Nama Klien</h2>
                        <p class="text-sm text-slate-400 mt-1" id="drawer-service-type">Layanan: -</p>
                    </div>
                    <button onclick="window.woCloseDrawer()" class="text-slate-400 hover:text-white p-2 bg-slate-800 rounded-lg">✕</button>
                </div>
                
                <!-- Drawer Tabs -->
                <div class="px-6 border-b border-slate-800 bg-slate-900 shrink-0 flex gap-6 overflow-x-auto text-sm font-bold hide-scrollbar">
                    <button class="wo-tab-btn active border-b-2 border-blue-500 text-blue-400 py-3 px-1 whitespace-nowrap" data-target="tab-overview">Overview</button>
                    <button class="wo-tab-btn border-b-2 border-transparent text-slate-400 hover:text-slate-200 py-3 px-1 whitespace-nowrap" data-target="tab-brief">Brief & Asset</button>
                    <button class="wo-tab-btn border-b-2 border-transparent text-slate-400 hover:text-slate-200 py-3 px-1 whitespace-nowrap" data-target="tab-progress">Progress Checklist</button>
                    <button class="wo-tab-btn border-b-2 border-transparent text-slate-400 hover:text-slate-200 py-3 px-1 whitespace-nowrap" data-target="tab-report">Report Metrics</button>
                    <button class="wo-tab-btn border-b-2 border-transparent text-slate-400 hover:text-slate-200 py-3 px-1 whitespace-nowrap" data-target="tab-timeline">Activity Log</button>
                </div>

                <!-- Drawer Content -->
                <div class="flex-1 overflow-y-auto p-6 bg-slate-950/50">
                    
                    <!-- TAB: OVERVIEW -->
                    <div id="tab-overview" class="wo-tab-content block space-y-6">
                        <div class="grid grid-cols-2 gap-4">
                            <div class="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
                                <div>
                                    <p class="text-xs text-slate-500 mb-1">Financial Summary</p>
                                    <div class="space-y-1 mt-2 text-sm">
                                        <div class="flex justify-between"><span class="text-slate-400">Total Harga:</span> <span class="text-white font-bold" id="drawer-fin-total">Rp 0</span></div>
                                        <div class="flex justify-between"><span class="text-slate-400">Budget Ads:</span> <span class="text-white" id="drawer-fin-ads">Rp 0</span></div>
                                        <div class="flex justify-between"><span class="text-slate-400">Fee Logaritma:</span> <span class="text-white" id="drawer-fin-fee">Rp 0</span></div>
                                    </div>
                                </div>
                            </div>
                            <div class="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col items-center justify-center">
                                <p class="text-xs text-slate-500 mb-1">SLA & Timing (Dummy)</p>
                                <div class="inline-block px-4 py-2 bg-slate-800 rounded-lg text-emerald-400 font-bold font-mono tracking-widest text-xl" id="drawer-sla-timer">48:00:00</div>
                            </div>
                        </div>
                        <div class="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl">
                            <p class="text-xs font-bold text-amber-500 uppercase tracking-wide mb-2">Internal Notes (Admin Only)</p>
                            <textarea id="drawer-internal-notes" class="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-sm text-slate-300 focus:outline-none focus:border-amber-500" rows="3" placeholder="Catatan internal tentang klien ini..."></textarea>
                            <button onclick="window.woSaveNotes()" class="mt-2 text-xs bg-amber-600/20 text-amber-500 px-3 py-1.5 rounded font-bold hover:bg-amber-600/40 transition">Simpan Catatan</button>
                        </div>
                        <div>
                            <p class="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Tindakan Selanjutnya</p>
                            <div id="drawer-next-action-container" class="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                                <!-- Action button injected here -->
                            </div>
                        </div>
                    </div>

                    <!-- TAB: BRIEF & ASSET -->
                    <div id="tab-brief" class="wo-tab-content hidden">
                        <div class="space-y-4">
                            <div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                                <div class="p-4 border-b border-slate-800 bg-slate-850"><h3 class="font-bold text-white text-sm">Brief Klien</h3></div>
                                <div class="p-4 text-sm text-slate-300" id="drawer-brief-content">
                                    <!-- Injected via JS -->
                                </div>
                            </div>
                            <div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                                <div class="p-4 border-b border-slate-800 bg-slate-850"><h3 class="font-bold text-white text-sm">Asset (Copywriting & Visuals)</h3></div>
                                <div class="p-4 text-sm text-slate-300" id="drawer-asset-content">
                                    <!-- Injected via JS -->
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- TAB: PROGRESS CHECKLIST -->
                    <div id="tab-progress" class="wo-tab-content hidden">
                        <div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                            <div class="p-4 border-b border-slate-800 bg-slate-850 flex justify-between items-center">
                                <h3 class="font-bold text-white text-sm">Checklist Operasional</h3>
                                <span class="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded" id="drawer-progress-percent">0%</span>
                            </div>
                            <div class="p-4 space-y-3" id="drawer-progress-content">
                                <!-- Checkbox list injected via JS -->
                            </div>
                        </div>
                    </div>

                    <!-- TAB: REPORT METRICS -->
                    <div id="tab-report" class="wo-tab-content hidden">
                        <div class="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
                            <p class="text-xs text-slate-400 mb-2">Masukkan data metrik secara manual sebelum integrasi API tersedia.</p>
                            <div class="grid grid-cols-2 gap-4">
                                <div><label class="block text-xs font-bold text-slate-500 mb-1">Spent Ads (Rp)</label><input type="number" id="inp-spent" class="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white"></div>
                                <div><label class="block text-xs font-bold text-slate-500 mb-1">Leads / Hasil</label><input type="number" id="inp-leads" class="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white"></div>
                                <div><label class="block text-xs font-bold text-slate-500 mb-1">Reach / Jangkauan</label><input type="number" id="inp-reach" class="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white"></div>
                                <div><label class="block text-xs font-bold text-slate-500 mb-1">Impressions</label><input type="number" id="inp-impressions" class="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white"></div>
                                <div><label class="block text-xs font-bold text-slate-500 mb-1">Link Clicks</label><input type="number" id="inp-clicks" class="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white"></div>
                                <div><label class="block text-xs font-bold text-slate-500 mb-1">Report Dashboard URL</label><input type="text" id="inp-reporturl" class="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-blue-400" placeholder="https://datastudio..."></div>
                            </div>
                            <button onclick="window.woSaveReport()" class="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded shadow transition">Simpan Metrik</button>
                        </div>
                    </div>

                    <!-- TAB: TIMELINE & ACTIVITY -->
                    <div id="tab-timeline" class="wo-tab-content hidden">
                        <div class="relative border-l-2 border-slate-800 ml-3 pl-5 space-y-6" id="drawer-timeline-content">
                            <!-- Timeline items injected here -->
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </main>

    <!-- Work Order Logic -->
    <script>
        // STATUS DEFINITIONS (7 Stages)
        const WO_STATUS = [
            { id: "pending_payment", label: "Menunggu Pembayaran", color: "slate", icon: "💰" },
            { id: "payment_verified", label: "Pembayaran Diterima", color: "emerald", icon: "💳" },
            { id: "awaiting_brief", label: "Menunggu Brief", color: "amber", icon: "📝" },
            { id: "setup", label: "Sedang Setup", color: "purple", icon: "⚙️" },
            { id: "pending_approval", label: "Menunggu Approval", color: "orange", icon: "👀" },
            { id: "active", label: "Campaign Running", color: "blue", icon: "🔥" },
            { id: "completed", label: "Completed", color: "slate", icon: "✅" }
        ];

        // MOCK DATA (Scalable architecture)
        let workOrders = [
            { 
                id: "WO-0826-001", 
                clientName: "Budi Santoso", whatsapp: "08123456789", 
                serviceType: "Meta Ads", package: "Starter", 
                status: "pending_payment", priority: "Normal", 
                finances: { total: 274000, adsBudget: 150000, fee: 124000 },
                brief: null, assets: null, pic: null, internalNotes: "",
                checklist: [{ task: "Buat akun Business Manager", done: false }, { task: "Set payment method", done: false }],
                metrics: { spent: 0, leads: 0, reach: 0, impressions: 0, clicks: 0, reportUrl: "" },
                activityLog: [{ type: "system", msg: "Work Order dibuat", time: "2026-08-01T08:00:00Z" }]
            },
            { 
                id: "WO-0826-002", 
                clientName: "Siti Aminah", whatsapp: "08198765432", 
                serviceType: "Google Ads", package: "Growth", 
                status: "setup", priority: "High", 
                finances: { total: 1599000, adsBudget: 1000000, fee: 599000 },
                brief: { obj: "Sales", keywords: "jual coway jakarta" }, assets: { copywriting: "Google Docs Link", visuals: "Drive Link" }, pic: "Tim SEM", internalNotes: "Klien agak rewel minta cepat.",
                checklist: [{ task: "Riset Keyword", done: true }, { task: "Draft Ad Copy", done: false }, { task: "Setup Tracking", done: false }],
                metrics: { spent: 0, leads: 0, reach: 0, impressions: 0, clicks: 0, reportUrl: "" },
                activityLog: [
                    { type: "system", msg: "WO dibuat", time: "2026-07-31T09:00:00Z" },
                    { type: "user", msg: "Admin memverifikasi pembayaran", time: "2026-07-31T10:15:00Z" },
                    { type: "user", msg: "Klien mengisi brief", time: "2026-08-01T07:20:00Z" }
                ]
            },
            { 
                id: "WO-0726-042", 
                clientName: "Dewi Lestari", whatsapp: "08561234567", 
                serviceType: "Meta Ads", package: "Scale", 
                status: "active", priority: "Normal", 
                finances: { total: 2399000, adsBudget: 1500000, fee: 899000 },
                brief: { targetCity: "Bandung", obj: "Lead Generation" }, assets: { copywriting: "Link Docs", visuals: "Link Video" }, pic: "Tim Meta", internalNotes: "",
                checklist: [{ task: "Buat BM", done: true }, { task: "Copywriting", done: true }, { task: "Design Video", done: true }, { task: "Publish Ads", done: true }],
                metrics: { spent: 450000, leads: 32, reach: 18500, impressions: 24000, clicks: 520, reportUrl: "https://datastudio.google.com/dummy" },
                activityLog: [{ type: "system", msg: "WO dibuat", time: "2026-07-28T09:00:00Z" }, { type: "system", msg: "Iklan mulai running", time: "2026-07-30T15:00:00Z" }]
            }
        ];

        let activeWoId = null;

        // HELPER: Format Rupiah
        const formatRp = (num) => "Rp " + num.toLocaleString('id-ID');

        // HELPER: Get Status Config
        const getStatusCfg = (st) => WO_STATUS.find(s => s.id === st) || WO_STATUS[0];
        
        // HELPER: Time Ago
        const timeAgo = (dateStr) => {
            const diff = Math.floor((new Date() - new Date(dateStr)) / 60000); // mins
            if(diff < 60) return diff + "m ago";
            if(diff < 1440) return Math.floor(diff/60) + "h ago";
            return Math.floor(diff/1440) + "d ago";
        };

        // --- DASHBOARD RENDER ---
        window.woRenderDashboard = function() {
            // Calculate KPIs
            let rev = 0, spent = 0, active = 0, brief = 0, completed = 0;
            let totalLeads = 0, totalCplSpent = 0;
            
            workOrders.forEach(w => {
                rev += w.finances.total;
                spent += w.metrics.spent;
                if(w.status === 'active') active++;
                if(w.status === 'awaiting_brief') brief++;
                if(w.status === 'completed') completed++;
                
                if(w.metrics.leads > 0) {
                    totalLeads += w.metrics.leads;
                    totalCplSpent += w.metrics.spent;
                }
            });

            const avgCpl = totalLeads > 0 ? totalCplSpent / totalLeads : 0;

            if(document.getElementById('kpi-revenue')) {
                document.getElementById('kpi-revenue').textContent = formatRp(rev);
                document.getElementById('kpi-spent').textContent = formatRp(spent);
                document.getElementById('kpi-active').textContent = active;
                document.getElementById('kpi-brief').textContent = brief;
                document.getElementById('kpi-completed').textContent = completed;
                document.getElementById('kpi-cpl').textContent = formatRp(Math.floor(avgCpl));
            }

            // Render Views
            window.woRenderTable();
            window.woRenderKanban();
        };

        // --- TABLE VIEW RENDER ---
        window.woRenderTable = function() {
            const tbody = document.getElementById('wo-table-body');
            if(!tbody) return;
            tbody.innerHTML = '';

            workOrders.forEach(w => {
                const st = getStatusCfg(w.status);
                const prColor = w.priority === 'High' ? 'text-red-400 bg-red-400/10' : 'text-slate-400 bg-slate-800';
                
                const tr = document.createElement('tr');
                tr.className = 'hover:bg-slate-800/50 transition cursor-pointer';
                tr.onclick = () => window.woOpenDrawer(w.id);
                tr.innerHTML = \`
                    <td class="px-4 py-3">
                        <p class="text-xs font-mono font-bold text-white mb-0.5">\${w.id}</p>
                        <p class="text-[10px] text-slate-400">\${w.serviceType}</p>
                    </td>
                    <td class="px-4 py-3">
                        <p class="text-sm font-bold text-slate-200">\${w.clientName}</p>
                        <p class="text-[10px] text-slate-500">\${w.package}</p>
                    </td>
                    <td class="px-4 py-3">
                        <span class="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold bg-\${st.color}-500/10 text-\${st.color}-400 border border-\${st.color}-500/20">
                            \${st.icon} \${st.label}
                        </span>
                    </td>
                    <td class="px-4 py-3">
                        <span class="inline-block px-2 py-0.5 rounded text-[10px] font-bold \${prColor}">\${w.priority}</span>
                    </td>
                    <td class="px-4 py-3 text-xs text-slate-300">
                        \${w.pic || '<span class="text-slate-600 italic">Unassigned</span>'}
                    </td>
                    <td class="px-4 py-3 text-right">
                        <button class="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded transition">Detail</button>
                    </td>
                \`;
                tbody.appendChild(tr);
            });
        };

        // --- KANBAN VIEW RENDER ---
        window.woRenderKanban = function() {
            const board = document.getElementById('wo-kanban-board');
            if(!board) return;
            board.innerHTML = '';

            WO_STATUS.forEach(st => {
                const col = document.createElement('div');
                col.className = 'flex flex-col bg-slate-900/50 border border-slate-800 rounded-xl w-72 h-full shrink-0';
                
                const wosInStatus = workOrders.filter(w => w.status === st.id);
                
                col.innerHTML = \`
                    <div class="p-3 border-b border-slate-800 bg-slate-850/50 rounded-t-xl shrink-0 flex items-center justify-between">
                        <h3 class="font-bold text-xs text-\${st.color}-400">\${st.icon} \${st.label}</h3>
                        <span class="bg-slate-800 text-[10px] px-2 py-0.5 rounded-full text-slate-400">\${wosInStatus.length}</span>
                    </div>
                    <div class="p-3 flex-1 overflow-y-auto space-y-3 custom-scrollbar"></div>
                \`;
                
                const colBody = col.querySelector('.custom-scrollbar');
                wosInStatus.forEach(w => {
                    const card = document.createElement('div');
                    card.className = 'bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-sm hover:border-slate-500 cursor-pointer transition';
                    card.onclick = () => window.woOpenDrawer(w.id);
                    card.innerHTML = \`
                        <div class="flex justify-between items-start mb-1">
                            <span class="text-[10px] text-slate-500 font-mono">\${w.id}</span>
                            \${w.priority === 'High' ? '<span class="text-[10px] text-red-400 font-bold">🔥 HIGH</span>' : ''}
                        </div>
                        <h4 class="text-sm font-bold text-white mb-0.5">\${w.clientName}</h4>
                        <p class="text-[10px] text-slate-400 mb-2">\${w.serviceType} • \${w.package}</p>
                        <div class="flex justify-between items-center mt-2">
                            <span class="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">\${w.pic || 'No PIC'}</span>
                            <span class="text-[10px] text-slate-500">\${timeAgo(w.activityLog[w.activityLog.length-1].time)}</span>
                        </div>
                    \`;
                    colBody.appendChild(card);
                });
                board.appendChild(col);
            });
        };

        // --- VIEW MODE TOGGLE ---
        window.woSetViewMode = function(mode) {
            const t = document.getElementById('wo-table-view');
            const k = document.getElementById('wo-kanban-view');
            const bt = document.getElementById('btn-view-table');
            const bk = document.getElementById('btn-view-kanban');
            
            if(mode === 'table') {
                t.classList.remove('hidden'); k.classList.add('hidden');
                bt.className = 'px-3 py-1.5 text-xs font-bold rounded-md bg-slate-800 text-white transition';
                bk.className = 'px-3 py-1.5 text-xs font-bold rounded-md text-slate-400 hover:text-white transition';
            } else {
                k.classList.remove('hidden'); t.classList.add('hidden');
                bk.className = 'px-3 py-1.5 text-xs font-bold rounded-md bg-slate-800 text-white transition';
                bt.className = 'px-3 py-1.5 text-xs font-bold rounded-md text-slate-400 hover:text-white transition';
            }
        };

        // --- DRAWER LOGIC ---
        window.woOpenDrawer = function(id) {
            const w = workOrders.find(wo => wo.id === id);
            if(!w) return;
            activeWoId = id;

            // Update Header
            document.getElementById('drawer-wo-id').textContent = w.id;
            document.getElementById('drawer-client-name').textContent = w.clientName;
            document.getElementById('drawer-service-type').textContent = \`Layanan: \${w.serviceType} (\${w.package})\`;
            
            const st = getStatusCfg(w.status);
            const dSt = document.getElementById('drawer-wo-status');
            dSt.textContent = \`\${st.icon} \${st.label}\`;
            dSt.className = \`text-[10px] font-bold px-2 py-0.5 rounded-full bg-\${st.color}-500/20 text-\${st.color}-400\`;
            
            const dPr = document.getElementById('drawer-wo-priority');
            dPr.textContent = w.priority;
            dPr.className = w.priority === 'High' ? 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400' : 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300';

            // Populate Overview
            document.getElementById('drawer-fin-total').textContent = formatRp(w.finances.total);
            document.getElementById('drawer-fin-ads').textContent = formatRp(w.finances.adsBudget);
            document.getElementById('drawer-fin-fee').textContent = formatRp(w.finances.fee);
            document.getElementById('drawer-internal-notes').value = w.internalNotes;

            // Generate Next Action Button
            const actContainer = document.getElementById('drawer-next-action-container');
            let nextBtn = '';
            if(w.status === 'pending_payment') nextBtn = \`<button onclick="window.woChangeStatus('payment_verified')" class="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded text-sm transition">Verifikasi Pembayaran Diterima</button>\`;
            else if(w.status === 'payment_verified') nextBtn = \`<button onclick="window.woChangeStatus('awaiting_brief')" class="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-2 rounded text-sm transition">Kirim Form Brief Klien</button>\`;
            else if(w.status === 'awaiting_brief') nextBtn = \`<button onclick="window.woChangeStatus('setup')" class="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 rounded text-sm transition">Brief Diterima, Mulai Setup</button>\`;
            else if(w.status === 'setup') nextBtn = \`<button onclick="window.woChangeStatus('pending_approval')" class="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 rounded text-sm transition">Minta Approval Klien</button>\`;
            else if(w.status === 'pending_approval') nextBtn = \`<button onclick="window.woChangeStatus('active')" class="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded text-sm transition">Jalankan Campaign!</button>\`;
            else if(w.status === 'active') nextBtn = \`<button onclick="window.woChangeStatus('completed')" class="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 rounded text-sm transition">Selesaikan Campaign</button>\`;
            else nextBtn = \`<p class="text-sm text-slate-400 text-center">Campaign Selesai.</p>\`;
            actContainer.innerHTML = nextBtn;

            // Populate Brief & Asset
            document.getElementById('drawer-brief-content').innerHTML = w.brief ? \`<pre class="whitespace-pre-wrap font-sans text-xs">\${JSON.stringify(w.brief, null, 2)}</pre>\` : '<p class="text-slate-500 italic">Belum ada data brief.</p>';
            document.getElementById('drawer-asset-content').innerHTML = w.assets ? \`<pre class="whitespace-pre-wrap font-sans text-xs">\${JSON.stringify(w.assets, null, 2)}</pre>\` : '<p class="text-slate-500 italic">Belum ada data asset.</p>';

            // Populate Progress Checklist
            const chkContainer = document.getElementById('drawer-progress-content');
            chkContainer.innerHTML = '';
            let chkDone = 0;
            w.checklist.forEach((chk, i) => {
                if(chk.done) chkDone++;
                chkContainer.innerHTML += \`
                    <div class="flex items-center gap-3">
                        <input type="checkbox" id="chk-\${i}" \${chk.done ? 'checked' : ''} onchange="window.woToggleChecklist(\${i}, this.checked)" class="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-500">
                        <label for="chk-\${i}" class="text-sm \${chk.done ? 'text-slate-500 line-through' : 'text-slate-300'}">\${chk.task}</label>
                    </div>
                \`;
            });
            document.getElementById('drawer-progress-percent').textContent = w.checklist.length ? Math.round((chkDone / w.checklist.length) * 100) + '%' : '0%';

            // Populate Report
            document.getElementById('inp-spent').value = w.metrics.spent;
            document.getElementById('inp-leads').value = w.metrics.leads;
            document.getElementById('inp-reach').value = w.metrics.reach;
            document.getElementById('inp-impressions').value = w.metrics.impressions;
            document.getElementById('inp-clicks').value = w.metrics.clicks;
            document.getElementById('inp-reporturl').value = w.metrics.reportUrl;

            // Populate Timeline & Activity
            const tlContainer = document.getElementById('drawer-timeline-content');
            tlContainer.innerHTML = w.activityLog.slice().reverse().map(log => \`
                <div class="relative">
                    <div class="absolute -left-[27px] w-3 h-3 \${log.type === 'system' ? 'bg-slate-600' : 'bg-blue-500'} rounded-full ring-4 ring-slate-950"></div>
                    <p class="text-[10px] font-bold text-slate-500 mb-0.5">\${new Date(log.time).toLocaleString('id-ID')}</p>
                    <p class="text-sm text-slate-300">\${log.msg}</p>
                </div>
            \`).join('');

            // Open Drawer
            document.getElementById('wo-drawer-overlay').classList.remove('hidden');
            setTimeout(() => document.getElementById('wo-drawer-overlay').classList.remove('opacity-0'), 10);
            document.getElementById('wo-drawer').classList.remove('translate-x-full');

            // Default switch to overview tab
            window.woSwitchDrawerTab('tab-overview');
        };

        window.woCloseDrawer = function() {
            activeWoId = null;
            document.getElementById('wo-drawer').classList.add('translate-x-full');
            document.getElementById('wo-drawer-overlay').classList.add('opacity-0');
            setTimeout(() => document.getElementById('wo-drawer-overlay').classList.add('hidden'), 300);
        };

        window.woSwitchDrawerTab = function(targetId) {
            document.querySelectorAll('.wo-tab-content').forEach(el => { el.classList.remove('block'); el.classList.add('hidden'); });
            document.querySelectorAll('.wo-tab-btn').forEach(el => { el.classList.remove('border-blue-500', 'text-blue-400'); el.classList.add('border-transparent', 'text-slate-400'); });
            
            document.getElementById(targetId).classList.remove('hidden');
            document.getElementById(targetId).classList.add('block');
            document.querySelector(\`.wo-tab-btn[data-target="\${targetId}"]\`).classList.add('border-blue-500', 'text-blue-400');
            document.querySelector(\`.wo-tab-btn[data-target="\${targetId}"]\`).classList.remove('border-transparent', 'text-slate-400');
        };

        // Attach tab listeners
        document.querySelectorAll('.wo-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => window.woSwitchDrawerTab(e.target.dataset.target));
        });

        // --- ACTIONS ---
        window.woChangeStatus = function(newStatus) {
            if(!activeWoId) return;
            const w = workOrders.find(wo => wo.id === activeWoId);
            w.status = newStatus;
            w.activityLog.push({ type: "system", msg: "Status changed to: " + getStatusCfg(newStatus).label, time: new Date().toISOString() });
            window.woRenderDashboard();
            window.woOpenDrawer(activeWoId); // Refresh drawer
        };

        window.woToggleChecklist = function(idx, isChecked) {
            if(!activeWoId) return;
            const w = workOrders.find(wo => wo.id === activeWoId);
            w.checklist[idx].done = isChecked;
            w.activityLog.push({ type: "user", msg: "Checklist diperbarui: " + w.checklist[idx].task, time: new Date().toISOString() });
            window.woOpenDrawer(activeWoId); // Refresh drawer
        };

        window.woSaveNotes = function() {
            if(!activeWoId) return;
            const w = workOrders.find(wo => wo.id === activeWoId);
            w.internalNotes = document.getElementById('drawer-internal-notes').value;
            alert('Catatan Internal disimpan.');
        };

        window.woSaveReport = function() {
            if(!activeWoId) return;
            const w = workOrders.find(wo => wo.id === activeWoId);
            w.metrics.spent = parseInt(document.getElementById('inp-spent').value) || 0;
            w.metrics.leads = parseInt(document.getElementById('inp-leads').value) || 0;
            w.metrics.reach = parseInt(document.getElementById('inp-reach').value) || 0;
            w.metrics.impressions = parseInt(document.getElementById('inp-impressions').value) || 0;
            w.metrics.clicks = parseInt(document.getElementById('inp-clicks').value) || 0;
            w.metrics.reportUrl = document.getElementById('inp-reporturl').value;
            w.activityLog.push({ type: "user", msg: "Memperbarui Data Report", time: new Date().toISOString() });
            window.woRenderDashboard();
            alert('Data Report berhasil disimpan!');
        };

        // INITIALIZE ON LOAD
        document.addEventListener('DOMContentLoaded', () => {
            if(document.getElementById('wo-table-view')) {
                window.woRenderDashboard();
                
                // Add event listener to Navigation to trigger render if view is shown
                const navCmp = document.getElementById('nav-campaigns');
                if(navCmp) {
                    navCmp.innerHTML = '<span>🚀</span> Work Orders'; // Update nav text
                    navCmp.addEventListener('click', () => {
                        setTimeout(() => window.woRenderDashboard(), 100);
                    });
                }
            }
        });
    </script>
`;

const startIndex = html.indexOf('<!-- CAMPAIGNS VIEW -->');
const endIndex = html.indexOf('<!-- Firebase SDK (Compat) -->');

if (startIndex === -1 || endIndex === -1) {
    console.error("Tags not found");
    process.exit(1);
}

const newHtml = html.substring(0, startIndex) + newBlock + html.substring(endIndex);

fs.writeFileSync(targetPath, newHtml, 'utf-8');
console.log("Successfully rebuilt admin dashboard.");
