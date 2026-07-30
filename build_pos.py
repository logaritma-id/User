import re
import sys

def inject_pos(filepath, category_name, pos_html, pos_js):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Inject Nav
    nav_link = '''
                    <a href="#pos-section" class="w-full text-left px-3 py-3 rounded-lg text-sm font-bold flex items-center gap-3 text-slate-400 hover:bg-slate-800 hover:text-white transition">
                        <span>💳</span> Kasir POS
                    </a>'''
    
    content = re.sub(r'(<a href="#uji-dampak".*?</a>)', r'\1' + nav_link, content, count=1, flags=re.DOTALL)

    # 2. Inject POS HTML
    col3_marker = '<!-- COLUMN 3: RIGHT SIDEBAR -->'
    # Find the closing </div> right before col3_marker
    parts = content.split(col3_marker)
    if len(parts) == 2:
        left_part = parts[0]
        # find last </div> in left_part
        last_div_idx = left_part.rfind('</div>')
        if last_div_idx != -1:
            left_part = left_part[:last_div_idx] + pos_html + '\n            </div>\n' + left_part[last_div_idx+6:]
        content = left_part + col3_marker + parts[1]

    # 3. Inject POS JS
    js_marker = 'window.copyLtmAiOutput ='
    if js_marker in content:
        content = content.replace(js_marker, pos_js + '\n        ' + js_marker)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Injected POS for {category_name} into {filepath}")

# Kuliner POS
html_kuliner = '''
            <!-- POS Kasir Kuliner -->
            <div id="pos-section" class="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl scroll-mt-24 overflow-hidden mb-8">
                <div class="bg-gradient-to-r from-emerald-900/40 to-slate-900 border-b border-slate-800 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 class="text-xl font-bold text-white font-heading flex items-center gap-2">💳 Kasir POS — Kuliner</h2>
                        <p class="text-slate-400 text-xs mt-1">Catat transaksi, hitung total, dan pantau porsi terjual.</p>
                    </div>
                    <div class="flex gap-2">
                        <div class="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-center">
                            <p class="text-[10px] text-slate-400 uppercase font-bold">Porsi Terjual</p>
                            <p id="pos-total-porsi" class="text-emerald-400 font-bold text-lg">0</p>
                        </div>
                        <div class="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-center">
                            <p class="text-[10px] text-slate-400 uppercase font-bold">Omzet Hari Ini</p>
                            <p id="pos-total-omzet" class="text-white font-bold text-lg">Rp 0</p>
                        </div>
                    </div>
                </div>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-0">
                    <div class="border-r border-slate-800 p-6">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-sm font-bold text-white">🍽️ Daftar Menu</h3>
                            <button onclick="posKuliner.openAddMenu()" class="text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg transition">+ Tambah Menu</button>
                        </div>
                        <div id="pos-add-menu-form" class="hidden mb-4 bg-slate-950 border border-slate-700 rounded-xl p-4 space-y-3">
                            <input id="pos-menu-nama" type="text" placeholder="Nama Menu (misal: Nasi Goreng)" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500">
                            <input id="pos-menu-harga" type="number" placeholder="Harga (Rp)" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500">
                            <div class="flex gap-2">
                                <button onclick="posKuliner.saveMenu()" class="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 rounded-lg transition">Simpan</button>
                                <button onclick="posKuliner.closeAddMenu()" class="flex-1 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold py-2 rounded-lg transition">Batal</button>
                            </div>
                        </div>
                        <div id="pos-menu-grid" class="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1"></div>
                    </div>
                    <div class="p-6 flex flex-col">
                        <h3 class="text-sm font-bold text-white mb-4">🧾 Pesanan Saat Ini</h3>
                        <div id="pos-order-list" class="flex-1 space-y-2 max-h-64 overflow-y-auto mb-4 min-h-[80px]">
                            <p id="pos-order-empty" class="text-xs text-slate-500 italic text-center py-4">Belum ada item dipilih</p>
                        </div>
                        <div class="border-t border-slate-800 pt-4 space-y-3">
                            <div class="flex items-center gap-3">
                                <label class="text-xs text-slate-400 whitespace-nowrap">Diskon (%)</label>
                                <input id="pos-diskon" type="number" value="0" min="0" max="100" oninput="posKuliner.updateTotal()" class="w-24 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-white text-sm focus:outline-none focus:border-emerald-500">
                            </div>
                            <div class="bg-slate-950 rounded-xl p-4 border border-slate-700">
                                <div class="flex justify-between text-sm mb-1">
                                    <span class="text-slate-400">Subtotal</span>
                                    <span id="pos-subtotal" class="text-white font-bold">Rp 0</span>
                                </div>
                                <div class="flex justify-between text-sm mb-2">
                                    <span class="text-slate-400">Diskon</span>
                                    <span id="pos-diskon-rp" class="text-rose-400 font-bold">- Rp 0</span>
                                </div>
                                <div class="flex justify-between text-lg border-t border-slate-700 pt-2">
                                    <span class="text-white font-bold">TOTAL</span>
                                    <span id="pos-total" class="text-emerald-400 font-bold">Rp 0</span>
                                </div>
                            </div>
                            <div class="flex gap-2">
                                <button onclick="posKuliner.prosesOrder()" class="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-emerald-500/20 text-sm">✅ Proses & Catat</button>
                                <button onclick="posKuliner.clearOrder()" class="px-4 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-xl transition text-sm">🗑️</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="border-t border-slate-800 p-6">
                    <div class="flex items-center justify-between mb-3">
                        <h3 class="text-sm font-bold text-white">📋 Transaksi Hari Ini</h3>
                        <button onclick="posKuliner.resetHarian()" class="text-xs font-bold bg-rose-900/40 hover:bg-rose-700 text-rose-400 hover:text-white border border-rose-500/30 px-3 py-1.5 rounded-lg transition">Reset Harian</button>
                    </div>
                    <div id="pos-tx-list" class="space-y-2 max-h-48 overflow-y-auto">
                        <p id="pos-tx-empty" class="text-xs text-slate-500 italic">Belum ada transaksi</p>
                    </div>
                </div>
            </div>'''

js_kuliner = '''
        // ===== POS KULINER ENGINE =====
        const posKuliner = (() => {
            const MENU_KEY = 'pos_menu_kuliner';
            const TX_KEY = 'pos_tx_kuliner';
            let order = {};
            const defaultMenus = [
                { id: 1, nama: 'Nasi Goreng', harga: 25000 },
                { id: 2, nama: 'Mie Ayam', harga: 18000 },
                { id: 3, nama: 'Es Teh Manis', harga: 5000 },
                { id: 4, nama: 'Ayam Bakar', harga: 35000 }
            ];
            function getMenus() { const s = localStorage.getItem(MENU_KEY); return s ? JSON.parse(s) : defaultMenus; }
            function getTxs() { try { return JSON.parse(localStorage.getItem(TX_KEY)) || []; } catch(e) { return []; } }
            function fmtRp(n) { return 'Rp ' + Math.round(n).toLocaleString('id-ID'); }
            function renderMenus() {
                const grid = document.getElementById('pos-menu-grid');
                if (!grid) return;
                grid.innerHTML = '';
                getMenus().forEach(m => {
                    const btn = document.createElement('button');
                    btn.className = 'relative group bg-slate-800 hover:bg-emerald-900/30 border border-slate-700 hover:border-emerald-500/50 rounded-xl p-3 text-left transition';
                    btn.onclick = () => addToOrder(m);
                    btn.innerHTML = `<p class="text-xs font-bold text-white truncate">${m.nama}</p>
                        <p class="text-emerald-400 text-sm font-bold mt-1">${fmtRp(m.harga)}</p>
                        <button onclick="event.stopPropagation(); window.deletePosMenu(${m.id})" class="absolute top-1 right-1 text-slate-600 hover:text-rose-400 text-base leading-none hidden group-hover:block">&times;</button>`;
                    grid.appendChild(btn);
                });
            }
            window.deletePosMenu = id => {
                const menus = getMenus().filter(m => m.id !== id);
                localStorage.setItem(MENU_KEY, JSON.stringify(menus));
                renderMenus();
            };
            function addToOrder(m) {
                if (!order[m.id]) order[m.id] = { ...m, qty: 0 };
                order[m.id].qty++;
                renderOrder();
            }
            window.changePosQty = (id, delta) => {
                if (!order[id]) return;
                order[id].qty += delta;
                if (order[id].qty <= 0) delete order[id];
                renderOrder();
            };
            function renderOrder() {
                const list = document.getElementById('pos-order-list');
                const empty = document.getElementById('pos-order-empty');
                if (!list) return;
                list.querySelectorAll('.order-item').forEach(el => el.remove());
                const items = Object.values(order);
                empty.classList.toggle('hidden', items.length > 0);
                items.forEach(item => {
                    const row = document.createElement('div');
                    row.className = 'order-item flex items-center justify-between bg-slate-800 border border-slate-700 rounded-lg px-3 py-2';
                    row.innerHTML = `<div class="flex-1 min-w-0">
                            <p class="text-xs font-bold text-white truncate">${item.nama}</p>
                            <p class="text-[10px] text-slate-400">${fmtRp(item.harga)} / pcs</p>
                        </div>
                        <div class="flex items-center gap-2">
                            <button onclick="changePosQty(${item.id}, -1)" class="w-6 h-6 bg-slate-700 hover:bg-slate-600 text-white rounded font-bold text-xs">-</button>
                            <span class="text-white font-bold text-sm w-4 text-center">${item.qty}</span>
                            <button onclick="changePosQty(${item.id}, 1)" class="w-6 h-6 bg-emerald-700 hover:bg-emerald-600 text-white rounded font-bold text-xs">+</button>
                            <span class="text-emerald-400 font-bold text-xs w-16 text-right">${fmtRp(item.harga * item.qty)}</span>
                        </div>`;
                    list.appendChild(row);
                });
                updateTotal();
            }
            function updateTotal() {
                const items = Object.values(order);
                const subtotal = items.reduce((s, i) => s + i.harga * i.qty, 0);
                const diskonPct = parseFloat(document.getElementById('pos-diskon')?.value) || 0;
                const diskonRp = subtotal * diskonPct / 100;
                const total = subtotal - diskonRp;
                document.getElementById('pos-subtotal').innerText = fmtRp(subtotal);
                document.getElementById('pos-diskon-rp').innerText = '- ' + fmtRp(diskonRp);
                document.getElementById('pos-total').innerText = fmtRp(total);
            }
            function prosesOrder() {
                const items = Object.values(order);
                if (items.length === 0) { alert('Keranjang kosong!'); return; }
                const subtotal = items.reduce((s, i) => s + i.harga * i.qty, 0);
                const diskonPct = parseFloat(document.getElementById('pos-diskon')?.value) || 0;
                const total = subtotal - (subtotal * diskonPct / 100);
                const tx = {
                    id: Date.now(),
                    items: items.map(i => `${i.qty}x ${i.nama}`).join(', '),
                    total: total,
                    qty: items.reduce((s, i) => s + i.qty, 0),
                    ts: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                };
                const txs = getTxs();
                txs.unshift(tx);
                localStorage.setItem(TX_KEY, JSON.stringify(txs));
                order = {};
                document.getElementById('pos-diskon').value = 0;
                renderOrder(); renderTxs(); updateSummary();
            }
            function clearOrder() { order = {}; renderOrder(); }
            function renderTxs() {
                const txs = getTxs();
                const list = document.getElementById('pos-tx-list');
                const empty = document.getElementById('pos-tx-empty');
                if (!list) return;
                list.querySelectorAll('.tx-item').forEach(el => el.remove());
                empty.classList.toggle('hidden', txs.length > 0);
                txs.forEach(tx => {
                    const row = document.createElement('div');
                    row.className = 'tx-item flex items-center justify-between bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2';
                    row.innerHTML = `<div class="flex-1 min-w-0">
                            <p class="text-xs text-slate-300 truncate">${tx.items}</p>
                            <p class="text-[10px] text-slate-500">${tx.ts} · ${tx.qty} porsi</p>
                        </div>
                        <span class="text-emerald-400 font-bold text-sm ml-3 shrink-0">${fmtRp(tx.total)}</span>`;
                    list.appendChild(row);
                });
            }
            function updateSummary() {
                const txs = getTxs();
                const elOmzet = document.getElementById('pos-total-omzet');
                const elPorsi = document.getElementById('pos-total-porsi');
                if (elOmzet) elOmzet.innerText = fmtRp(txs.reduce((s, t) => s + t.total, 0));
                if (elPorsi) elPorsi.innerText = txs.reduce((s, t) => s + t.qty, 0);
            }
            function resetHarian() {
                if (!confirm('Reset transaksi hari ini?')) return;
                localStorage.removeItem(TX_KEY);
                renderTxs(); updateSummary();
            }
            function openAddMenu() { document.getElementById('pos-add-menu-form').classList.remove('hidden'); }
            function closeAddMenu() {
                document.getElementById('pos-add-menu-form').classList.add('hidden');
                document.getElementById('pos-menu-nama').value = '';
                document.getElementById('pos-menu-harga').value = '';
            }
            function saveMenu() {
                const nama = document.getElementById('pos-menu-nama').value.trim();
                const harga = parseFloat(document.getElementById('pos-menu-harga').value) || 0;
                if (!nama || !harga) { alert('Isi data!'); return; }
                const menus = getMenus();
                menus.push({ id: Date.now(), nama, harga });
                localStorage.setItem(MENU_KEY, JSON.stringify(menus));
                closeAddMenu(); renderMenus();
            }
            document.addEventListener('DOMContentLoaded', () => { renderMenus(); renderTxs(); updateSummary(); });
            return { openAddMenu, closeAddMenu, saveMenu, prosesOrder, clearOrder, resetHarian, updateTotal };
        })();
'''

# Fashion POS
html_fashion = '''
            <!-- POS Fashion -->
            <div id="pos-section" class="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl scroll-mt-24 overflow-hidden mb-8">
                <div class="bg-gradient-to-r from-pink-900/30 to-slate-900 border-b border-slate-800 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 class="text-xl font-bold text-white font-heading flex items-center gap-2">👕 Kasir POS — Fashion</h2>
                        <p class="text-slate-400 text-xs mt-1">Kelola produk retail dan stok varian.</p>
                    </div>
                    <div class="flex gap-2">
                        <div class="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-center">
                            <p class="text-[10px] text-slate-400 uppercase font-bold">Pcs Terjual</p>
                            <p id="fsh-total-pcs" class="text-pink-400 font-bold text-lg">0</p>
                        </div>
                        <div class="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-center">
                            <p class="text-[10px] text-slate-400 uppercase font-bold">Omzet Hari Ini</p>
                            <p id="fsh-total-omzet" class="text-white font-bold text-lg">Rp 0</p>
                        </div>
                    </div>
                </div>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-0">
                    <div class="border-r border-slate-800 p-6">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-sm font-bold text-white">🏷️ Katalog Produk</h3>
                            <button onclick="posFashion.openAddMenu()" class="text-xs font-bold bg-pink-600 hover:bg-pink-500 text-white px-3 py-1.5 rounded-lg transition">+ Tambah</button>
                        </div>
                        <div id="fsh-add-menu-form" class="hidden mb-4 bg-slate-950 border border-slate-700 rounded-xl p-4 space-y-3">
                            <input id="fsh-menu-nama" type="text" placeholder="Nama Produk" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-pink-500">
                            <input id="fsh-menu-harga" type="number" placeholder="Harga (Rp)" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-pink-500">
                            <div class="flex gap-2">
                                <button onclick="posFashion.saveMenu()" class="flex-1 bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold py-2 rounded-lg transition">Simpan</button>
                                <button onclick="posFashion.closeAddMenu()" class="flex-1 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold py-2 rounded-lg transition">Batal</button>
                            </div>
                        </div>
                        <div id="fsh-menu-grid" class="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1"></div>
                    </div>
                    <div class="p-6 flex flex-col">
                        <h3 class="text-sm font-bold text-white mb-4">🛍️ Keranjang Belanja</h3>
                        <div id="fsh-order-list" class="flex-1 space-y-2 max-h-64 overflow-y-auto mb-4 min-h-[80px]">
                            <p id="fsh-order-empty" class="text-xs text-slate-500 italic text-center py-4">Belum ada item</p>
                        </div>
                        <div class="border-t border-slate-800 pt-4 space-y-3">
                            <div class="flex items-center gap-3">
                                <label class="text-xs text-slate-400 whitespace-nowrap">Diskon (%)</label>
                                <input id="fsh-diskon" type="number" value="0" min="0" max="100" oninput="posFashion.updateTotal()" class="w-24 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-white text-sm focus:outline-none focus:border-pink-500">
                            </div>
                            <div class="bg-slate-950 rounded-xl p-4 border border-slate-700">
                                <div class="flex justify-between text-sm mb-1">
                                    <span class="text-slate-400">Subtotal</span>
                                    <span id="fsh-subtotal" class="text-white font-bold">Rp 0</span>
                                </div>
                                <div class="flex justify-between text-sm mb-2">
                                    <span class="text-slate-400">Diskon</span>
                                    <span id="fsh-diskon-rp" class="text-rose-400 font-bold">- Rp 0</span>
                                </div>
                                <div class="flex justify-between text-lg border-t border-slate-700 pt-2">
                                    <span class="text-white font-bold">TOTAL</span>
                                    <span id="fsh-total" class="text-pink-400 font-bold">Rp 0</span>
                                </div>
                            </div>
                            <div class="flex gap-2">
                                <button onclick="posFashion.prosesOrder()" class="flex-1 bg-pink-600 hover:bg-pink-500 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-pink-500/20 text-sm">✅ Proses Penjualan</button>
                                <button onclick="posFashion.clearOrder()" class="px-4 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-xl transition text-sm">🗑️</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="border-t border-slate-800 p-6">
                    <div class="flex items-center justify-between mb-3">
                        <h3 class="text-sm font-bold text-white">📋 Transaksi Hari Ini</h3>
                        <button onclick="posFashion.resetHarian()" class="text-xs font-bold bg-rose-900/40 hover:bg-rose-700 text-rose-400 hover:text-white border border-rose-500/30 px-3 py-1.5 rounded-lg transition">Reset Harian</button>
                    </div>
                    <div id="fsh-tx-list" class="space-y-2 max-h-48 overflow-y-auto">
                        <p id="fsh-tx-empty" class="text-xs text-slate-500 italic">Belum ada transaksi</p>
                    </div>
                </div>
            </div>'''
js_fashion = js_kuliner.replace('posKuliner', 'posFashion').replace('pos_menu_kuliner', 'pos_menu_fashion').replace('pos_tx_kuliner', 'pos_tx_fashion').replace('pos-', 'fsh-').replace('POS KULINER ENGINE', 'POS FASHION ENGINE').replace('deletePosMenu', 'deleteFshMenu').replace('changePosQty', 'changeFshQty').replace('Nasi Goreng', 'Kaos Polos').replace('Mie Ayam', 'Kemeja Flannel').replace('Es Teh Manis', 'Celana Chino').replace('Ayam Bakar', 'Topi Trucker').replace('porsi', 'pcs').replace('emerald', 'pink')

# Percetakan POS
html_percetakan = '''
            <!-- POS Percetakan -->
            <div id="pos-section" class="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl scroll-mt-24 overflow-hidden mb-8">
                <div class="bg-gradient-to-r from-violet-900/30 to-slate-900 border-b border-slate-800 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 class="text-xl font-bold text-white font-heading flex items-center gap-2">🖨️ Order Tracker — Percetakan</h2>
                        <p class="text-slate-400 text-xs mt-1">Kelola antrian order dan status pengerjaan.</p>
                    </div>
                    <div class="flex gap-2">
                        <div class="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-center">
                            <p class="text-[10px] text-slate-400 uppercase font-bold">Order Aktif</p>
                            <p id="prc-order-count" class="text-violet-400 font-bold text-lg">0</p>
                        </div>
                        <div class="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-center">
                            <p class="text-[10px] text-slate-400 uppercase font-bold">Sisa Piutang</p>
                            <p id="prc-piutang-total" class="text-amber-400 font-bold text-lg">Rp 0</p>
                        </div>
                    </div>
                </div>
                <div class="p-6">
                    <div class="bg-slate-950 border border-slate-700 rounded-xl p-5 mb-6">
                        <h3 class="text-sm font-bold text-white mb-4">📋 Buat Order Baru</h3>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <input id="prc-customer" type="text" placeholder="Nama Customer" class="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500">
                            <select id="prc-jenis" class="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500">
                                <option>Banner/Spanduk</option><option>Brosur</option><option>Stiker</option><option>Lainnya</option>
                            </select>
                            <input id="prc-total-order" type="number" placeholder="Total Harga (Rp)" class="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500">
                            <input id="prc-dp" type="number" placeholder="DP (Rp)" class="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500">
                        </div>
                        <button onclick="posPercetakan.createOrder()" class="w-full mt-4 bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-violet-500/20 text-sm">+ Buat Order</button>
                    </div>
                    <div id="prc-order-list" class="space-y-3">
                        <p id="prc-empty" class="text-xs text-slate-500 italic text-center py-6">Belum ada order.</p>
                    </div>
                </div>
            </div>'''
js_percetakan = '''
        // ===== POS PERCETAKAN ENGINE =====
        const posPercetakan = (() => {
            const KEY = 'pos_orders_percetakan';
            function getOrders() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch(e) { return []; } }
            function saveOrders(o) { localStorage.setItem(KEY, JSON.stringify(o)); }
            function fmtRp(n) { return 'Rp ' + Math.round(n).toLocaleString('id-ID'); }
            function createOrder() {
                const customer = document.getElementById('prc-customer').value;
                const jenis = document.getElementById('prc-jenis').value;
                const total = parseFloat(document.getElementById('prc-total-order').value) || 0;
                const dp = parseFloat(document.getElementById('prc-dp').value) || 0;
                if (!customer || !total) { alert('Isi data!'); return; }
                const o = { id: Date.now(), customer, jenis, total, dp, sisa: total - dp, status: 'antri', ts: new Date().toLocaleDateString('id-ID') };
                const orders = getOrders(); orders.unshift(o); saveOrders(orders);
                ['prc-customer','prc-total-order','prc-dp'].forEach(id => document.getElementById(id).value = '');
                render();
            }
            window.prcNextStatus = id => {
                const orders = getOrders(); const o = orders.find(x => x.id === id);
                if (o) {
                    if (o.status === 'antri') o.status = 'dikerjakan';
                    else if (o.status === 'dikerjakan') o.status = 'selesai';
                    else if (o.status === 'selesai') o.status = 'diambil';
                }
                saveOrders(orders); render();
            };
            window.prcDel = id => {
                if(!confirm('Hapus?')) return;
                saveOrders(getOrders().filter(o => o.id !== id)); render();
            };
            function render() {
                const orders = getOrders();
                const list = document.getElementById('prc-order-list');
                const empty = document.getElementById('prc-empty');
                if(!list) return;
                list.querySelectorAll('.order-card').forEach(el => el.remove());
                empty.classList.toggle('hidden', orders.length > 0);
                orders.forEach(o => {
                    const cls = o.status === 'selesai' ? 'border-emerald-500/30' : (o.status === 'dikerjakan' ? 'border-blue-500/30' : 'border-slate-700');
                    const card = document.createElement('div');
                    card.className = `order-card border rounded-xl p-4 bg-slate-800/30 transition ${cls}`;
                    card.innerHTML = `<div class="flex justify-between items-start">
                        <div>
                            <span class="text-xs font-bold text-violet-400 uppercase">${o.status}</span>
                            <p class="font-bold text-white mt-1">${o.customer}</p>
                            <p class="text-xs text-slate-400">${o.jenis}</p>
                            <p class="text-xs mt-1">Sisa: <strong class="text-amber-400">${fmtRp(o.sisa)}</strong></p>
                        </div>
                        <div class="flex gap-2">
                            ${o.status !== 'diambil' ? `<button onclick="prcNextStatus(${o.id})" class="text-xs bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-lg">Lanjut</button>` : ''}
                            <button onclick="prcDel(${o.id})" class="text-xs bg-rose-900/40 text-rose-400 px-3 py-1.5 rounded-lg">Hapus</button>
                        </div>
                    </div>`;
                    list.appendChild(card);
                });
                const active = orders.filter(o => o.status !== 'diambil');
                document.getElementById('prc-order-count').innerText = active.length;
                document.getElementById('prc-piutang-total').innerText = fmtRp(active.reduce((s, o) => s + o.sisa, 0));
            }
            document.addEventListener('DOMContentLoaded', render);
            return { createOrder };
        })();
'''

# PKL POS
html_pkl = '''
            <!-- POS PKL -->
            <div id="pos-section" class="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl scroll-mt-24 overflow-hidden mb-8">
                <div class="bg-gradient-to-r from-orange-900/30 to-slate-900 border-b border-slate-800 p-6">
                    <h2 class="text-xl font-bold text-white font-heading flex items-center gap-2">⛺ Kasir PKL — Super Simpel</h2>
                    <p class="text-slate-400 text-xs mt-1">Satu ketuk = 1 transaksi. Tanpa keyboard.</p>
                    <div class="grid grid-cols-3 gap-3 mt-4">
                        <div class="bg-slate-800 border border-slate-700 rounded-xl p-3 text-center">
                            <p class="text-[10px] text-slate-400 uppercase font-bold">Porsi</p>
                            <p id="pkl-total-porsi" class="text-orange-400 font-bold text-xl">0</p>
                        </div>
                        <div class="bg-slate-800 border border-slate-700 rounded-xl p-3 text-center">
                            <p class="text-[10px] text-slate-400 uppercase font-bold">Pemasukan</p>
                            <p id="pkl-total-pemasukan" class="text-white font-bold text-xl">Rp 0</p>
                        </div>
                        <div class="bg-slate-800 border border-emerald-500/30 rounded-xl p-3 text-center">
                            <p class="text-[10px] text-emerald-400 uppercase font-bold">Laba Bersih</p>
                            <p id="pkl-total-laba" class="text-emerald-400 font-bold text-xl">Rp 0</p>
                        </div>
                    </div>
                </div>
                <div class="p-6">
                    <div class="flex justify-between items-center mb-3">
                        <h3 class="text-sm font-bold text-white">🛒 Tombol Menu</h3>
                    </div>
                    <div id="pkl-menu-grid" class="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6"></div>
                    <div class="border-t border-slate-800 pt-6">
                        <div class="flex items-center justify-between mb-3">
                            <h3 class="text-sm font-bold text-white">📋 Log Hari Ini</h3>
                            <button onclick="posPkl.reset()" class="text-xs bg-rose-900/40 text-rose-400 px-3 py-1.5 rounded-lg">Reset Harian</button>
                        </div>
                        <div id="pkl-tx-list" class="space-y-1.5 max-h-48 overflow-y-auto"></div>
                    </div>
                </div>
            </div>'''
js_pkl = '''
        // ===== POS PKL ENGINE =====
        const posPkl = (() => {
            const KEY = 'pos_tx_pkl';
            const menus = [
                { id: 1, nama: 'Gorengan', harga: 2000, hpp: 800 },
                { id: 2, nama: 'Nasi Bungkus', harga: 12000, hpp: 7000 },
                { id: 3, nama: 'Es Teh', harga: 3000, hpp: 1000 }
            ];
            function getTxs() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch(e) { return []; } }
            function fmtRp(n) { return 'Rp ' + Math.round(n).toLocaleString('id-ID'); }
            window.pklRecord = id => {
                const m = menus.find(x => x.id === id);
                if(!m) return;
                const txs = getTxs();
                txs.unshift({ id: Date.now(), nama: m.nama, harga: m.harga, hpp: m.hpp, ts: new Date().toLocaleTimeString('id-ID') });
                localStorage.setItem(KEY, JSON.stringify(txs));
                render();
            };
            function render() {
                const txs = getTxs();
                const grid = document.getElementById('pkl-menu-grid');
                if (grid && grid.innerHTML === '') {
                    menus.forEach(m => {
                        const b = document.createElement('button');
                        b.className = 'bg-slate-800 hover:bg-orange-900/30 border border-slate-700 rounded-2xl p-4 text-center transition-all active:scale-95';
                        b.onclick = () => pklRecord(m.id);
                        b.innerHTML = `<p class="text-2xl mb-2">🛒</p><p class="text-sm font-bold text-white">${m.nama}</p><p class="text-orange-400 font-bold">${fmtRp(m.harga)}</p>`;
                        grid.appendChild(b);
                    });
                }
                const list = document.getElementById('pkl-tx-list');
                if (list) {
                    list.innerHTML = '';
                    txs.forEach(tx => {
                        const d = document.createElement('div');
                        d.className = 'flex items-center justify-between bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-1.5';
                        d.innerHTML = `<div><span class="text-xs font-bold text-white">${tx.nama}</span><span class="text-[10px] text-slate-500 ml-2">${tx.ts}</span></div><span class="text-emerald-400 font-bold text-xs">${fmtRp(tx.harga)}</span>`;
                        list.appendChild(d);
                    });
                }
                const p = txs.reduce((s, t) => s + t.harga, 0);
                const m = txs.reduce((s, t) => s + t.hpp, 0);
                const elPorsi = document.getElementById('pkl-total-porsi');
                if (elPorsi) {
                    elPorsi.innerText = txs.length;
                    document.getElementById('pkl-total-pemasukan').innerText = fmtRp(p);
                    document.getElementById('pkl-total-laba').innerText = fmtRp(p - m);
                }
            }
            function reset() { if(confirm('Reset?')) { localStorage.removeItem(KEY); render(); } }
            document.addEventListener('DOMContentLoaded', render);
            return { reset };
        })();
'''

# Distributor POS
html_distributor = '''
            <!-- POS Distributor -->
            <div id="pos-section" class="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl scroll-mt-24 overflow-hidden mb-8">
                <div class="bg-gradient-to-r from-blue-900/30 to-slate-900 border-b border-slate-800 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 class="text-xl font-bold text-white font-heading flex items-center gap-2">📦 Nota & Piutang — Distributor</h2>
                    </div>
                    <div class="flex gap-2">
                        <div class="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-center">
                            <p class="text-[10px] text-slate-400 uppercase font-bold">Total Piutang</p>
                            <p id="dst-total-piutang" class="text-amber-400 font-bold text-lg">Rp 0</p>
                        </div>
                    </div>
                </div>
                <div class="p-6">
                    <div class="bg-slate-950 border border-slate-700 rounded-xl p-5 mb-6">
                        <h3 class="text-sm font-bold text-white mb-4">📝 Buat Nota Baru</h3>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <input id="dst-toko" type="text" placeholder="Nama Toko" class="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500">
                            <input id="dst-total" type="number" placeholder="Total Nilai (Rp)" class="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500">
                        </div>
                        <button onclick="posDistributor.createNota()" class="w-full mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-blue-500/20 text-sm">+ Buat Nota</button>
                    </div>
                    <div id="dst-nota-list" class="space-y-3">
                        <p id="dst-empty" class="text-xs text-slate-500 italic text-center py-6">Belum ada nota.</p>
                    </div>
                </div>
            </div>'''
js_distributor = '''
        // ===== POS DISTRIBUTOR ENGINE =====
        const posDistributor = (() => {
            const KEY = 'pos_nota_distributor';
            function getNotas() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch(e) { return []; } }
            function saveNotas(n) { localStorage.setItem(KEY, JSON.stringify(n)); }
            function fmtRp(n) { return 'Rp ' + Math.round(n).toLocaleString('id-ID'); }
            function createNota() {
                const toko = document.getElementById('dst-toko').value;
                const total = parseFloat(document.getElementById('dst-total').value) || 0;
                if (!toko || !total) { alert('Isi data!'); return; }
                const notas = getNotas();
                notas.unshift({ id: Date.now(), toko, total, lunas: false, ts: new Date().toLocaleDateString('id-ID') });
                saveNotas(notas);
                document.getElementById('dst-toko').value = ''; document.getElementById('dst-total').value = '';
                render();
            }
            window.dstLunas = id => {
                const notas = getNotas(); const n = notas.find(x => x.id === id);
                if (n) n.lunas = true; saveNotas(notas); render();
            };
            window.dstDel = id => {
                if(!confirm('Hapus?')) return;
                saveNotas(getNotas().filter(n => n.id !== id)); render();
            };
            function render() {
                const notas = getNotas();
                const list = document.getElementById('dst-nota-list');
                const empty = document.getElementById('dst-empty');
                if(!list) return;
                list.querySelectorAll('.nota-card').forEach(el => el.remove());
                empty.classList.toggle('hidden', notas.length > 0);
                notas.forEach(n => {
                    const card = document.createElement('div');
                    card.className = `nota-card border rounded-xl p-4 transition ${n.lunas ? 'border-emerald-500/30 bg-emerald-900/10' : 'border-slate-700 bg-slate-800/30'}`;
                    card.innerHTML = `<div class="flex justify-between items-start">
                        <div>
                            <span class="text-xs font-bold ${n.lunas ? 'text-emerald-400' : 'text-amber-400'}">${n.lunas ? 'LUNAS' : 'BELUM LUNAS'}</span>
                            <p class="font-bold text-white mt-1">${n.toko}</p>
                            <p class="text-sm font-bold mt-1 text-white">${fmtRp(n.total)}</p>
                        </div>
                        <div class="flex gap-2">
                            ${!n.lunas ? `<button onclick="dstLunas(${n.id})" class="text-xs bg-emerald-900/40 text-emerald-400 px-3 py-1.5 rounded-lg">Lunas</button>` : ''}
                            <button onclick="dstDel(${n.id})" class="text-xs bg-rose-900/40 text-rose-400 px-3 py-1.5 rounded-lg">Hapus</button>
                        </div>
                    </div>`;
                    list.appendChild(card);
                });
                const totalPiutang = document.getElementById('dst-total-piutang');
                if (totalPiutang) {
                    totalPiutang.innerText = fmtRp(notas.filter(n => !n.lunas).reduce((s, n) => s + n.total, 0));
                }
            }
            document.addEventListener('DOMContentLoaded', render);
            return { createNota };
        })();
'''

# Execute injections
inject_pos("tools/kuliner/index.html", "Kuliner", html_kuliner, js_kuliner)
inject_pos("tools/fashion/index.html", "Fashion", html_fashion, js_fashion)
inject_pos("tools/percetakan/index.html", "Percetakan", html_percetakan, js_percetakan)
inject_pos("tools/pkl/index.html", "PKL", html_pkl, js_pkl)
inject_pos("tools/distributor/index.html", "Distributor", html_distributor, js_distributor)
