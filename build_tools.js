const fs = require('fs');
const path = require('path');

const CATEGORIES = [
    { id: 'kuliner', name: 'Kuliner', icon: '🍔' },
    { id: 'fashion', name: 'Fashion', icon: '👕' },
    { id: 'percetakan', name: 'Percetakan', icon: '🖨️' },
    { id: 'pkl', name: 'PKL', icon: '⛺' },
    { id: 'distributor', name: 'Distributor', icon: '📦' }
];

function getPosHtml(categoryId) {
    if (categoryId === 'kuliner') {
        return `
            <div id="pos-section" class="tab-pane hidden flex-1 space-y-6">
                <div class="bg-gradient-to-r from-emerald-900/40 to-[#1a132f] border-b border-white/5 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl shadow-xl">
                    <div>
                        <h2 class="text-xl font-bold text-white font-heading flex items-center gap-2">💳 Kasir POS — Kuliner</h2>
                        <p class="text-slate-400 text-xs mt-1">Catat transaksi, hitung total, dan pantau porsi terjual.</p>
                    </div>
                    <div class="flex gap-2">
                        <div class="bg-[#0f0a1c] border border-white/10 rounded-xl px-4 py-2 text-center">
                            <p class="text-[10px] text-slate-400 uppercase font-bold">Porsi Terjual</p>
                            <p id="pos-total-porsi" class="text-emerald-400 font-bold text-lg">0</p>
                        </div>
                        <div class="bg-[#0f0a1c] border border-white/10 rounded-xl px-4 py-2 text-center">
                            <p class="text-[10px] text-slate-400 uppercase font-bold">Omzet Hari Ini</p>
                            <p id="pos-total-omzet" class="text-white font-bold text-lg">Rp 0</p>
                        </div>
                    </div>
                </div>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div class="bg-[#1a132f] border border-white/5 rounded-2xl p-6">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-sm font-bold text-white">🍽️ Daftar Menu</h3>
                            <button onclick="posKuliner.openAddMenu()" class="text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg transition">+ Tambah Menu</button>
                        </div>
                        <div id="pos-add-menu-form" class="hidden mb-4 bg-[#0f0a1c] border border-white/10 rounded-xl p-4 space-y-3">
                            <input id="pos-menu-nama" type="text" placeholder="Nama Menu (misal: Nasi Goreng)" class="w-full bg-[#1a132f] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500">
                            <input id="pos-menu-harga" type="number" placeholder="Harga (Rp)" class="w-full bg-[#1a132f] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500">
                            <div class="flex gap-2">
                                <button onclick="posKuliner.saveMenu()" class="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 rounded-lg transition">Simpan</button>
                                <button onclick="posKuliner.closeAddMenu()" class="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-2 rounded-lg transition">Batal</button>
                            </div>
                        </div>
                        <div id="pos-menu-grid" class="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1 custom-scrollbar"></div>
                    </div>
                    <div class="bg-[#1a132f] border border-white/5 rounded-2xl p-6 flex flex-col">
                        <h3 class="text-sm font-bold text-white mb-4">🧾 Pesanan Saat Ini</h3>
                        <div id="pos-order-list" class="flex-1 space-y-2 max-h-64 overflow-y-auto mb-4 min-h-[80px] custom-scrollbar">
                            <p id="pos-order-empty" class="text-xs text-slate-500 italic text-center py-4">Belum ada item dipilih</p>
                        </div>
                        <div class="border-t border-white/5 pt-4 space-y-3">
                            <div class="flex items-center gap-3">
                                <label class="text-xs text-slate-400 whitespace-nowrap">Diskon (%)</label>
                                <input id="pos-diskon" type="number" value="0" min="0" max="100" oninput="posKuliner.updateTotal()" class="w-24 bg-[#0f0a1c] border border-white/10 rounded-lg px-2 py-1.5 text-white text-sm focus:outline-none focus:border-emerald-500">
                            </div>
                            <div class="bg-[#0f0a1c] rounded-xl p-4 border border-white/10">
                                <div class="flex justify-between text-sm mb-1">
                                    <span class="text-slate-400">Subtotal</span>
                                    <span id="pos-subtotal" class="text-white font-bold">Rp 0</span>
                                </div>
                                <div class="flex justify-between text-sm mb-2">
                                    <span class="text-slate-400">Diskon</span>
                                    <span id="pos-diskon-rp" class="text-rose-400 font-bold">- Rp 0</span>
                                </div>
                                <div class="flex justify-between text-lg border-t border-white/10 pt-2">
                                    <span class="text-white font-bold">TOTAL</span>
                                    <span id="pos-total" class="text-emerald-400 font-bold">Rp 0</span>
                                </div>
                            </div>
                            <div class="flex gap-2">
                                <button onclick="posKuliner.prosesOrder()" class="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-emerald-500/20 text-sm">✅ Proses & Catat</button>
                                <button onclick="posKuliner.clearOrder()" class="px-4 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl transition text-sm">🗑️</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bg-[#1a132f] border border-white/5 rounded-2xl p-6">
                    <div class="flex items-center justify-between mb-3 border-b border-white/5 pb-4">
                        <h3 class="text-sm font-bold text-white">📋 Transaksi Hari Ini</h3>
                        <button onclick="posKuliner.resetHarian()" class="text-xs font-bold bg-rose-900/40 hover:bg-rose-700 text-rose-400 hover:text-white border border-rose-500/30 px-3 py-1.5 rounded-lg transition">Reset Harian</button>
                    </div>
                    <div id="pos-tx-list" class="space-y-2 max-h-48 overflow-y-auto mt-4 custom-scrollbar">
                        <p id="pos-tx-empty" class="text-xs text-slate-500 italic">Belum ada transaksi</p>
                    </div>
                </div>
            </div>`;
    } else if (categoryId === 'fashion') {
        return `
            <div id="pos-section" class="tab-pane hidden flex-1 space-y-6">
                <div class="bg-gradient-to-r from-pink-900/40 to-[#1a132f] border-b border-white/5 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl shadow-xl">
                    <div>
                        <h2 class="text-xl font-bold text-white font-heading flex items-center gap-2">👕 Kasir POS — Fashion</h2>
                        <p class="text-slate-400 text-xs mt-1">Kelola produk retail dan stok varian.</p>
                    </div>
                    <div class="flex gap-2">
                        <div class="bg-[#0f0a1c] border border-white/10 rounded-xl px-4 py-2 text-center">
                            <p class="text-[10px] text-slate-400 uppercase font-bold">Pcs Terjual</p>
                            <p id="fsh-total-pcs" class="text-pink-400 font-bold text-lg">0</p>
                        </div>
                        <div class="bg-[#0f0a1c] border border-white/10 rounded-xl px-4 py-2 text-center">
                            <p class="text-[10px] text-slate-400 uppercase font-bold">Omzet Hari Ini</p>
                            <p id="fsh-total-omzet" class="text-white font-bold text-lg">Rp 0</p>
                        </div>
                    </div>
                </div>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div class="bg-[#1a132f] border border-white/5 rounded-2xl p-6">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-sm font-bold text-white">🏷️ Katalog Produk</h3>
                            <button onclick="posFashion.openAddMenu()" class="text-xs font-bold bg-pink-600 hover:bg-pink-500 text-white px-3 py-1.5 rounded-lg transition">+ Tambah</button>
                        </div>
                        <div id="fsh-add-menu-form" class="hidden mb-4 bg-[#0f0a1c] border border-white/10 rounded-xl p-4 space-y-3">
                            <input id="fsh-menu-nama" type="text" placeholder="Nama Produk" class="w-full bg-[#1a132f] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-pink-500">
                            <input id="fsh-menu-harga" type="number" placeholder="Harga (Rp)" class="w-full bg-[#1a132f] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-pink-500">
                            <div class="flex gap-2">
                                <button onclick="posFashion.saveMenu()" class="flex-1 bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold py-2 rounded-lg transition">Simpan</button>
                                <button onclick="posFashion.closeAddMenu()" class="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-2 rounded-lg transition">Batal</button>
                            </div>
                        </div>
                        <div id="fsh-menu-grid" class="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1 custom-scrollbar"></div>
                    </div>
                    <div class="bg-[#1a132f] border border-white/5 rounded-2xl p-6 flex flex-col">
                        <h3 class="text-sm font-bold text-white mb-4">🛍️ Keranjang Belanja</h3>
                        <div id="fsh-order-list" class="flex-1 space-y-2 max-h-64 overflow-y-auto mb-4 min-h-[80px] custom-scrollbar">
                            <p id="fsh-order-empty" class="text-xs text-slate-500 italic text-center py-4">Belum ada item</p>
                        </div>
                        <div class="border-t border-white/5 pt-4 space-y-3">
                            <div class="flex items-center gap-3">
                                <label class="text-xs text-slate-400 whitespace-nowrap">Diskon (%)</label>
                                <input id="fsh-diskon" type="number" value="0" min="0" max="100" oninput="posFashion.updateTotal()" class="w-24 bg-[#0f0a1c] border border-white/10 rounded-lg px-2 py-1.5 text-white text-sm focus:outline-none focus:border-pink-500">
                            </div>
                            <div class="bg-[#0f0a1c] rounded-xl p-4 border border-white/10">
                                <div class="flex justify-between text-sm mb-1">
                                    <span class="text-slate-400">Subtotal</span>
                                    <span id="fsh-subtotal" class="text-white font-bold">Rp 0</span>
                                </div>
                                <div class="flex justify-between text-sm mb-2">
                                    <span class="text-slate-400">Diskon</span>
                                    <span id="fsh-diskon-rp" class="text-rose-400 font-bold">- Rp 0</span>
                                </div>
                                <div class="flex justify-between text-lg border-t border-white/10 pt-2">
                                    <span class="text-white font-bold">TOTAL</span>
                                    <span id="fsh-total" class="text-pink-400 font-bold">Rp 0</span>
                                </div>
                            </div>
                            <div class="flex gap-2">
                                <button onclick="posFashion.prosesOrder()" class="flex-1 bg-pink-600 hover:bg-pink-500 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-pink-500/20 text-sm">✅ Proses Penjualan</button>
                                <button onclick="posFashion.clearOrder()" class="px-4 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl transition text-sm">🗑️</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bg-[#1a132f] border border-white/5 rounded-2xl p-6">
                    <div class="flex items-center justify-between mb-3 border-b border-white/5 pb-4">
                        <h3 class="text-sm font-bold text-white">📋 Transaksi Hari Ini</h3>
                        <button onclick="posFashion.resetHarian()" class="text-xs font-bold bg-rose-900/40 hover:bg-rose-700 text-rose-400 hover:text-white border border-rose-500/30 px-3 py-1.5 rounded-lg transition">Reset Harian</button>
                    </div>
                    <div id="fsh-tx-list" class="space-y-2 max-h-48 overflow-y-auto mt-4 custom-scrollbar">
                        <p id="fsh-tx-empty" class="text-xs text-slate-500 italic">Belum ada transaksi</p>
                    </div>
                </div>
            </div>`;
    } else if (categoryId === 'percetakan') {
        return `
            <div id="pos-section" class="tab-pane hidden flex-1 space-y-6">
                <div class="bg-gradient-to-r from-violet-900/40 to-[#1a132f] border-b border-white/5 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl shadow-xl">
                    <div>
                        <h2 class="text-xl font-bold text-white font-heading flex items-center gap-2">🖨️ Order Tracker — Percetakan</h2>
                        <p class="text-slate-400 text-xs mt-1">Kelola antrian order dan status pengerjaan.</p>
                    </div>
                    <div class="flex gap-2">
                        <div class="bg-[#0f0a1c] border border-white/10 rounded-xl px-4 py-2 text-center">
                            <p class="text-[10px] text-slate-400 uppercase font-bold">Order Aktif</p>
                            <p id="prc-order-count" class="text-violet-400 font-bold text-lg">0</p>
                        </div>
                        <div class="bg-[#0f0a1c] border border-white/10 rounded-xl px-4 py-2 text-center">
                            <p class="text-[10px] text-slate-400 uppercase font-bold">Sisa Piutang</p>
                            <p id="prc-piutang-total" class="text-amber-400 font-bold text-lg">Rp 0</p>
                        </div>
                    </div>
                </div>
                <div class="bg-[#1a132f] border border-white/5 rounded-2xl p-6">
                    <div class="bg-[#0f0a1c] border border-white/10 rounded-xl p-5 mb-6">
                        <h3 class="text-sm font-bold text-white mb-4">📋 Buat Order Baru</h3>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <input id="prc-customer" type="text" placeholder="Nama Customer" class="bg-[#1a132f] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500">
                            <select id="prc-jenis" class="bg-[#1a132f] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500">
                                <option>Banner/Spanduk</option><option>Brosur</option><option>Stiker</option><option>Lainnya</option>
                            </select>
                            <input id="prc-total-order" type="number" placeholder="Total Harga (Rp)" class="bg-[#1a132f] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500">
                            <input id="prc-dp" type="number" placeholder="DP (Rp)" class="bg-[#1a132f] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500">
                        </div>
                        <button onclick="posPercetakan.createOrder()" class="w-full mt-4 bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-violet-500/20 text-sm">+ Buat Order</button>
                    </div>
                    <div id="prc-order-list" class="space-y-3 custom-scrollbar">
                        <p id="prc-empty" class="text-xs text-slate-500 italic text-center py-6">Belum ada order.</p>
                    </div>
                </div>
            </div>`;
    } else if (categoryId === 'pkl') {
        return `
            <div id="pos-section" class="tab-pane hidden flex-1 space-y-6">
                <div class="bg-[#1a132f] border border-white/5 rounded-2xl p-6 shadow-xl">
                    <div class="bg-gradient-to-r from-orange-900/40 to-[#0f0a1c] border-b border-white/5 pb-6 mb-6">
                        <h2 class="text-xl font-bold text-white font-heading flex items-center gap-2">⛺ Kasir PKL — Super Simpel</h2>
                        <p class="text-slate-400 text-xs mt-1">Satu ketuk = 1 transaksi. Tanpa keyboard.</p>
                        <div class="grid grid-cols-3 gap-3 mt-4">
                            <div class="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                                <p class="text-[10px] text-slate-400 uppercase font-bold">Porsi</p>
                                <p id="pkl-total-porsi" class="text-orange-400 font-bold text-xl">0</p>
                            </div>
                            <div class="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                                <p class="text-[10px] text-slate-400 uppercase font-bold">Pemasukan</p>
                                <p id="pkl-total-pemasukan" class="text-white font-bold text-xl">Rp 0</p>
                            </div>
                            <div class="bg-white/5 border border-emerald-500/30 rounded-xl p-3 text-center">
                                <p class="text-[10px] text-emerald-400 uppercase font-bold">Laba Bersih</p>
                                <p id="pkl-total-laba" class="text-emerald-400 font-bold text-xl">Rp 0</p>
                            </div>
                        </div>
                    </div>
                    <div class="flex justify-between items-center mb-3 mt-6">
                        <h3 class="text-sm font-bold text-white">⚙️ Pengaturan Menu</h3>
                    </div>
                    <div class="bg-[#0f0a1c] border border-white/10 rounded-xl p-4 mb-6 flex flex-col sm:flex-row gap-2 items-center">
                        <input type="text" id="pkl-new-nama" placeholder="Nama Menu" class="bg-[#1a132f] border border-white/10 rounded-lg px-3 py-2 text-white text-sm w-full focus:outline-none focus:border-orange-500">
                        <input type="number" id="pkl-new-harga" placeholder="Harga Jual" class="bg-[#1a132f] border border-white/10 rounded-lg px-3 py-2 text-white text-sm w-full sm:w-32 focus:outline-none focus:border-orange-500">
                        <input type="number" id="pkl-new-hpp" placeholder="HPP (Modal)" class="bg-[#1a132f] border border-white/10 rounded-lg px-3 py-2 text-white text-sm w-full sm:w-32 focus:outline-none focus:border-orange-500">
                        <button onclick="posPkl.addMenu()" class="w-full sm:w-auto bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition whitespace-nowrap">+ Tambah</button>
                    </div>
                    <div class="flex justify-between items-center mb-3">
                        <h3 class="text-sm font-bold text-white">🛒 Tombol Menu</h3>
                    </div>
                    <div id="pkl-menu-grid" class="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6"></div>
                    <div class="border-t border-white/5 pt-6">
                        <div class="flex items-center justify-between mb-3">
                            <h3 class="text-sm font-bold text-white">📋 Log Hari Ini</h3>
                            <button onclick="posPkl.reset()" class="text-xs bg-rose-900/40 hover:bg-rose-900/80 text-rose-400 px-3 py-1.5 rounded-lg transition">Reset Harian</button>
                        </div>
                        <div id="pkl-tx-list" class="space-y-1.5 max-h-64 overflow-y-auto custom-scrollbar"></div>
                    </div>
                </div>
            </div>`;
    } else if (categoryId === 'distributor') {
        return `
            <div id="pos-section" class="tab-pane hidden flex-1 space-y-6">
                <div class="bg-[#1a132f] border border-white/5 rounded-2xl shadow-xl overflow-hidden mb-8">
                    <div class="bg-gradient-to-r from-blue-900/40 to-[#0f0a1c] border-b border-white/5 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h2 class="text-xl font-bold text-white font-heading flex items-center gap-2">📦 Nota & Piutang — Distributor</h2>
                            <p class="text-slate-400 text-xs mt-1">Pencatatan nota penjualan dan status pembayaran toko.</p>
                        </div>
                        <div class="flex gap-2">
                            <div class="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-center">
                                <p class="text-[10px] text-slate-400 uppercase font-bold">Total Piutang</p>
                                <p id="dst-total-piutang" class="text-amber-400 font-bold text-lg">Rp 0</p>
                            </div>
                        </div>
                    </div>
                    <div class="p-6">
                        <div class="bg-[#0f0a1c] border border-white/10 rounded-xl p-5 mb-6">
                            <h3 class="text-sm font-bold text-white mb-4">📝 Buat Nota Baru</h3>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <input id="dst-toko" type="text" placeholder="Nama Toko" class="bg-[#1a132f] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500">
                                <input id="dst-total" type="number" placeholder="Total Nilai (Rp)" class="bg-[#1a132f] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500">
                            </div>
                            <button onclick="posDistributor.createNota()" class="w-full mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-blue-500/20 text-sm">+ Buat Nota</button>
                        </div>
                        <div id="dst-nota-list" class="space-y-3 custom-scrollbar max-h-80 overflow-y-auto pr-1">
                            <p id="dst-empty" class="text-xs text-slate-500 italic text-center py-6">Belum ada nota.</p>
                        </div>
                    </div>
                </div>
            </div>`;
    }
    return '';
}

function getPosJs(categoryId) {
    if (categoryId === 'kuliner') {
        return `
        // ===== POS KULINER ENGINE =====
        window.posKuliner = (() => {
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
                    btn.className = 'relative group bg-white/5 hover:bg-emerald-900/30 border border-white/10 hover:border-emerald-500/50 rounded-xl p-3 text-left transition';
                    btn.onclick = () => addToOrder(m);
                    btn.innerHTML = \`<p class="text-xs font-bold text-white truncate">\${m.nama}</p>
                        <p class="text-emerald-400 text-sm font-bold mt-1">\${fmtRp(m.harga)}</p>
                        <button onclick="event.stopPropagation(); window.deletePosMenu(\${m.id})" class="absolute top-1 right-1 text-slate-600 hover:text-rose-400 text-base leading-none hidden group-hover:block">&times;</button>\`;
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
                    row.className = 'order-item flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-3 py-2';
                    row.innerHTML = \`<div class="flex-1 min-w-0">
                            <p class="text-xs font-bold text-white truncate">\${item.nama}</p>
                            <p class="text-[10px] text-slate-400">\${fmtRp(item.harga)} / pcs</p>
                        </div>
                        <div class="flex items-center gap-2">
                            <button onclick="changePosQty(\${item.id}, -1)" class="w-6 h-6 bg-white/10 hover:bg-white/20 text-white rounded font-bold text-xs">-</button>
                            <span class="text-white font-bold text-sm w-4 text-center">\${item.qty}</span>
                            <button onclick="changePosQty(\${item.id}, 1)" class="w-6 h-6 bg-emerald-700/50 hover:bg-emerald-600/50 text-white rounded font-bold text-xs">+</button>
                            <span class="text-emerald-400 font-bold text-xs w-16 text-right">\${fmtRp(item.harga * item.qty)}</span>
                        </div>\`;
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
                    items: items.map(i => \`\${i.qty}x \${i.nama}\`).join(', '),
                    total: total,
                    qty: items.reduce((s, i) => s + i.qty, 0),
                    ts: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                };
                const txs = getTxs();
                txs.unshift(tx);
                localStorage.setItem(TX_KEY, JSON.stringify(txs));
                order = {};
                if(document.getElementById('pos-diskon')) document.getElementById('pos-diskon').value = 0;
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
                    row.className = 'tx-item flex items-center justify-between bg-white/5 border border-white/5 rounded-lg px-3 py-2';
                    row.innerHTML = \`<div class="flex-1 min-w-0">
                            <p class="text-xs text-slate-300 truncate">\${tx.items}</p>
                            <p class="text-[10px] text-slate-500">\${tx.ts} · \${tx.qty} porsi</p>
                        </div>
                        <span class="text-emerald-400 font-bold text-sm ml-3 shrink-0">\${fmtRp(tx.total)}</span>\`;
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
            
            // Expose initialize function to be called after tab switch if needed
            function init() {
                renderMenus(); 
                renderTxs(); 
                updateSummary();
            }
            
            return { openAddMenu, closeAddMenu, saveMenu, prosesOrder, clearOrder, resetHarian, updateTotal, init };
        })();
        
        // Auto init if tab is active on load (handled in main UI script)
        document.addEventListener('DOMContentLoaded', () => {
            if(window.posKuliner) window.posKuliner.init();
        });`;
    } else if (categoryId === 'fashion') {
        return getPosJs('kuliner').replace(/posKuliner/g, 'posFashion').replace(/pos_menu_kuliner/g, 'pos_menu_fashion').replace(/pos_tx_kuliner/g, 'pos_tx_fashion').replace(/pos-/g, 'fsh-').replace(/POS KULINER ENGINE/g, 'POS FASHION ENGINE').replace(/deletePosMenu/g, 'deleteFshMenu').replace(/changePosQty/g, 'changeFshQty').replace(/Nasi Goreng/g, 'Kaos Polos').replace(/Mie Ayam/g, 'Kemeja Flannel').replace(/Es Teh Manis/g, 'Celana Chino').replace(/Ayam Bakar/g, 'Topi Trucker').replace(/porsi/g, 'pcs').replace(/emerald/g, 'pink');
    } else if (categoryId === 'percetakan') {
        return `
        // ===== POS PERCETAKAN ENGINE =====
        window.posPercetakan = (() => {
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
                    const cls = o.status === 'selesai' ? 'border-emerald-500/30' : (o.status === 'dikerjakan' ? 'border-blue-500/30' : 'border-white/10');
                    const card = document.createElement('div');
                    card.className = \`order-card border rounded-xl p-4 bg-white/5 transition \${cls}\`;
                    card.innerHTML = \`<div class="flex justify-between items-start">
                        <div>
                            <span class="text-xs font-bold text-violet-400 uppercase">\${o.status}</span>
                            <p class="font-bold text-white mt-1">\${o.customer}</p>
                            <p class="text-xs text-slate-400">\${o.jenis}</p>
                            <p class="text-xs mt-1 text-slate-300">Sisa: <strong class="text-amber-400">\${fmtRp(o.sisa)}</strong></p>
                        </div>
                        <div class="flex gap-2">
                            \${o.status !== 'diambil' ? \`<button onclick="prcNextStatus(\${o.id})" class="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg">Lanjut</button>\` : ''}
                            <button onclick="prcDel(\${o.id})" class="text-xs bg-rose-900/40 text-rose-400 hover:bg-rose-900/80 px-3 py-1.5 rounded-lg">Hapus</button>
                        </div>
                    </div>\`;
                    list.appendChild(card);
                });
                const active = orders.filter(o => o.status !== 'diambil');
                const elCount = document.getElementById('prc-order-count');
                const elPiutang = document.getElementById('prc-piutang-total');
                if(elCount) elCount.innerText = active.length;
                if(elPiutang) elPiutang.innerText = fmtRp(active.reduce((s, o) => s + o.sisa, 0));
            }
            
            function init() { render(); }
            
            document.addEventListener('DOMContentLoaded', init);
            
            return { createOrder, init };
        })();`;
    } else if (categoryId === 'pkl') {
        return `
        // ===== POS PKL ENGINE =====
        window.posPkl = (() => {
            const KEY = 'pos_tx_pkl';
            const MENU_KEY = 'pos_menu_pkl';
            const defaultMenus = [
                { id: 1, nama: 'Gorengan', harga: 2000, hpp: 800 },
                { id: 2, nama: 'Nasi Bungkus', harga: 12000, hpp: 7000 },
                { id: 3, nama: 'Es Teh', harga: 3000, hpp: 1000 }
            ];
            function getMenus() { try { const m = localStorage.getItem(MENU_KEY); return m ? JSON.parse(m) : defaultMenus; } catch(e) { return defaultMenus; } }
            function getTxs() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch(e) { return []; } }
            function fmtRp(n) { return 'Rp ' + Math.round(n).toLocaleString('id-ID'); }
            window.pklRecord = id => {
                const m = getMenus().find(x => x.id === id);
                if(!m) return;
                const txs = getTxs();
                txs.unshift({ id: Date.now(), nama: m.nama, harga: m.harga, hpp: m.hpp, ts: new Date().toLocaleTimeString('id-ID') });
                localStorage.setItem(KEY, JSON.stringify(txs));
                render();
            };
            function deleteMenu(id) {
                if(!confirm('Yakin ingin menghapus menu ini?')) return;
                const m = getMenus().filter(x => x.id !== id);
                localStorage.setItem(MENU_KEY, JSON.stringify(m));
                render();
            }
            function render() {
                const txs = getTxs();
                const currentMenus = getMenus();
                const grid = document.getElementById('pkl-menu-grid');
                if (grid) {
                    grid.innerHTML = '';
                    currentMenus.forEach(m => {
                        const wrapper = document.createElement('div');
                        wrapper.className = 'relative group';
                        const b = document.createElement('button');
                        b.className = 'w-full h-full bg-white/5 hover:bg-orange-900/30 border border-white/10 rounded-2xl p-4 text-center transition-all active:scale-95 flex flex-col items-center justify-center';
                        b.onclick = () => pklRecord(m.id);
                        b.innerHTML = \`<p class="text-2xl mb-2">⛺</p><p class="text-sm font-bold text-white">\${m.nama}</p><p class="text-orange-400 font-bold">\${fmtRp(m.harga)}</p>\`;
                        
                        const delBtn = document.createElement('button');
                        delBtn.className = 'absolute -top-2 -right-2 bg-rose-600 hover:bg-rose-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition shadow-lg';
                        delBtn.innerHTML = '×';
                        delBtn.onclick = (e) => { e.stopPropagation(); posPkl.deleteMenu(m.id); };
                        
                        wrapper.appendChild(b);
                        wrapper.appendChild(delBtn);
                        grid.appendChild(wrapper);
                    });
                }
                const list = document.getElementById('pkl-tx-list');
                if (list) {
                    list.innerHTML = '';
                    txs.forEach(tx => {
                        const d = document.createElement('div');
                        d.className = 'flex items-center justify-between bg-white/5 border border-white/5 rounded-lg px-3 py-1.5';
                        d.innerHTML = \`<div><span class="text-xs font-bold text-white">\${tx.nama}</span><span class="text-[10px] text-slate-500 ml-2">\${tx.ts}</span></div><span class="text-emerald-400 font-bold text-xs">\${fmtRp(tx.harga)}</span>\`;
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
            function addMenu() {
                const nama = document.getElementById('pkl-new-nama').value;
                const harga = parseFloat(document.getElementById('pkl-new-harga').value);
                const hpp = parseFloat(document.getElementById('pkl-new-hpp').value);
                if (!nama || !harga || !hpp) { alert('Isi semua data menu dengan benar!'); return; }
                const m = getMenus();
                m.push({ id: Date.now(), nama, harga, hpp });
                localStorage.setItem(MENU_KEY, JSON.stringify(m));
                document.getElementById('pkl-new-nama').value = '';
                document.getElementById('pkl-new-harga').value = '';
                document.getElementById('pkl-new-hpp').value = '';
                render();
            }
            function reset() { if(confirm('Reset?')) { localStorage.removeItem(KEY); render(); } }
            
            function init() { render(); }
            document.addEventListener('DOMContentLoaded', init);
            
            return { reset, init, addMenu, deleteMenu };
        })();`;
    } else if (categoryId === 'distributor') {
        return `
        // ===== POS DISTRIBUTOR ENGINE =====
        window.posDistributor = (() => {
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
                    card.className = \`nota-card border rounded-xl p-4 transition \${n.lunas ? 'border-emerald-500/30 bg-emerald-900/10' : 'border-white/10 bg-white/5'}\`;
                    card.innerHTML = \`<div class="flex justify-between items-start">
                        <div>
                            <span class="text-xs font-bold \${n.lunas ? 'text-emerald-400' : 'text-amber-400'}">\${n.lunas ? 'LUNAS' : 'BELUM LUNAS'}</span>
                            <p class="font-bold text-white mt-1">\${n.toko}</p>
                            <p class="text-sm font-bold mt-1 text-white">\${fmtRp(n.total)}</p>
                        </div>
                        <div class="flex gap-2">
                            \${!n.lunas ? \`<button onclick="dstLunas(\${n.id})" class="text-xs bg-emerald-900/40 hover:bg-emerald-900/80 text-emerald-400 px-3 py-1.5 rounded-lg">Lunas</button>\` : ''}
                            <button onclick="dstDel(\${n.id})" class="text-xs bg-rose-900/40 hover:bg-rose-900/80 text-rose-400 px-3 py-1.5 rounded-lg">Hapus</button>
                        </div>
                    </div>\`;
                    list.appendChild(card);
                });
                const totalPiutang = document.getElementById('dst-total-piutang');
                if (totalPiutang) {
                    totalPiutang.innerText = fmtRp(notas.filter(n => !n.lunas).reduce((s, n) => s + n.total, 0));
                }
            }
            
            function init() { render(); }
            document.addEventListener('DOMContentLoaded', init);
            
            return { createNota, init };
        })();`;
    }
    return '';
}


function generateHtml(category) {
    const posHtml = getPosHtml(category.id);
    const posJs = getPosJs(category.id);
    
    return `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistem Operasional ${category.name} - Logaritma</title>
    
    <meta name="description" content="Kalkulator Target & Pembuat Dokumen Operasional Otomatis.">
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
    
    <script src="https://cdn.tailwindcss.com?plugins=typography"></script>
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    
    <!-- Import Google Generative AI SDK -->
    <script type="importmap">
      {
        "imports": {
          "@google/generative-ai": "https://esm.run/@google/generative-ai"
        }
      }
    </script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
                        heading: ['"Space Grotesk"', 'sans-serif'],
                    },
                    colors: {
                        brand: {
                            bg: '#0a0514', // Very dark purple
                            surface: '#130c25', // Lighter purple for cards
                            accent1: '#c026d3', // Fuchsia
                            accent2: '#9333ea', // Purple
                            border: 'rgba(255,255,255,0.05)'
                        }
                    }
                }
            }
        }
    </script>
    <link rel="stylesheet" href="/css/style.css">
    <style>
        /* Custom Scrollbar for better UI */
        .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.02);
            border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.2);
        }
    </style>
</head>
<body class="bg-brand-bg text-slate-300 font-sans antialiased h-screen flex overflow-hidden selection:bg-brand-accent1/30 selection:text-white">

    <!-- Mobile Header (Visible only on small screens) -->
    <div class="lg:hidden fixed top-0 left-0 right-0 h-16 bg-brand-surface border-b border-brand-border z-50 flex items-center justify-between px-4">
        <a href="/tools/" class="text-white font-heading font-bold text-lg flex items-center gap-2">
            <span class="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-accent1 to-brand-accent2 flex items-center justify-center text-sm shadow-lg">${category.icon}</span>
            <span>Logaritma<span class="text-brand-accent1">.id</span></span>
        </a>
        <button id="mobile-menu-btn" class="text-slate-300 hover:text-white focus:outline-none">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
    </div>

    <!-- LEFT SIDEBAR -->
    <aside id="sidebar" class="fixed lg:relative inset-y-0 left-0 z-40 w-72 bg-brand-bg border-r border-brand-border transform -translate-x-full lg:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col h-full pt-16 lg:pt-0">
        
        <!-- Logo Desktop -->
        <div class="hidden lg:flex items-center h-20 px-6 border-b border-brand-border shrink-0">
            <a href="/tools/" class="text-white font-heading font-bold text-xl tracking-tight flex items-center gap-2 hover:opacity-80 transition">
                <span class="text-slate-500 hover:text-white transition mr-1">←</span>
                <span class="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-accent1 to-brand-accent2 flex items-center justify-center text-sm shadow-lg shadow-purple-500/20">${category.icon}</span>
                <span>Logaritma<span class="text-brand-accent1">.id</span></span>
            </a>
        </div>

        <!-- Search Bar -->
        <div class="px-6 py-4 shrink-0">
            <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input type="text" id="menu-search" placeholder="Cari menu..." class="w-full bg-brand-surface border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-accent1 focus:ring-1 focus:ring-brand-accent1 transition-colors">
            </div>
        </div>

        <!-- Navigation Menu -->
        <div class="flex-1 overflow-y-auto custom-scrollbar px-4 py-2">
            <p class="px-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">MENU UTAMA</p>
            <nav id="sidebar-nav" class="space-y-1">
                <a href="#dasbor" class="nav-item active w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold flex items-center gap-3 text-slate-400 hover:text-white transition-colors">
                    <span class="text-lg">🎛️</span> <span class="nav-text">Dasbor Utama</span>
                </a>
                <a href="#kalkulator" class="nav-item w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold flex items-center gap-3 text-slate-400 hover:text-white transition-colors">
                    <span class="text-lg">📊</span> <span class="nav-text">Kalkulator Target</span>
                </a>
                <a href="#dokumen" class="nav-item w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold flex items-center gap-3 text-slate-400 hover:text-white transition-colors">
                    <span class="text-lg">📋</span> <span class="nav-text">Dokumen Operasional</span>
                </a>
                <a href="#uji-dampak" class="nav-item trigger-premium w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold flex items-center gap-3 text-slate-400 hover:text-white transition-colors">
                    <span class="text-lg">🎯</span> <span class="nav-text">Uji Dampak Kegiatan</span>
                </a>
                <a href="#pos-section" class="nav-item w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold flex items-center gap-3 text-slate-400 hover:text-white transition-colors">
                    <span class="text-lg">💳</span> <span class="nav-text">Kasir POS</span>
                </a>
                <a href="#diskusi" class="nav-item w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold flex items-center gap-3 text-slate-400 hover:text-white transition-colors mt-2">
                    <span class="text-lg text-brand-accent1">💬</span> <span class="nav-text text-brand-accent1">Diskusi Tim Logaritma</span>
                </a>
            </nav>
        </div>

        <!-- Status Bottom -->
        <div class="p-4 shrink-0 border-t border-brand-border">
            <div class="bg-brand-surface rounded-xl p-4 border border-white/5 relative overflow-hidden">
                <div class="absolute -right-4 -bottom-4 w-16 h-16 bg-brand-accent2/20 rounded-full blur-xl"></div>
                <div class="flex items-center gap-2 mb-2">
                    <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span class="text-xs font-bold text-white">Engine On</span>
                </div>
                <p class="text-[10px] text-slate-400">Tim Logaritma siap bekerja</p>
                <div class="mt-3">
                    <div id="plan-badge" class="inline-flex items-center px-2 py-1 rounded bg-slate-800 text-[10px] font-bold text-slate-300">FREE PLAN</div>
                    <button class="trigger-paywall w-full mt-2 text-[10px] bg-gradient-to-r from-brand-accent1 to-brand-accent2 text-white font-bold py-1.5 rounded transition hover:opacity-90">Upgrade Premium</button>
                </div>
            </div>
        </div>
    </aside>

    <!-- Overlay for mobile sidebar -->
    <div id="sidebar-overlay" class="fixed inset-0 bg-black/50 z-30 hidden lg:hidden backdrop-blur-sm"></div>

    <!-- MAIN CONTENT AREA -->
    <main class="flex-1 h-full overflow-y-auto custom-scrollbar bg-brand-bg relative pt-16 lg:pt-0">
        
        <!-- Header Top in Desktop (Optional, for User Profile/Language) -->
        <div class="hidden lg:flex h-20 items-center justify-end px-8 border-b border-brand-border sticky top-0 bg-brand-bg/80 backdrop-blur-md z-10">
            <div class="flex items-center gap-4">
                <div class="flex bg-brand-surface rounded-full p-1 border border-white/10">
                    <span class="px-3 py-1 text-xs font-bold bg-white/10 rounded-full text-white">ID</span>
                    <span class="px-3 py-1 text-xs font-bold text-slate-500">EN</span>
                </div>
                <div class="w-8 h-8 rounded-full bg-gradient-to-r from-brand-accent1 to-brand-accent2 flex items-center justify-center text-white text-xs font-bold">U</div>
            </div>
        </div>

        <div class="px-6 sm:px-8 pt-4 pb-20 max-w-7xl mx-auto min-h-full">
            
            <!-- TAB: DASBOR UTAMA -->
            <div id="dasbor" class="tab-pane flex flex-col xl:flex-row gap-6">
                <!-- Main col -->
                <div class="flex-1 space-y-6">
                    <p class="text-sm font-bold text-slate-400 tracking-wider">Welcome to</p>
                    <h1 class="text-3xl sm:text-4xl font-bold text-white font-heading">Sistem Rekayasa Operasional<br/><span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent1 to-brand-accent2">${category.name}</span></h1>
                    
                    <!-- Banner -->
                    <div class="bg-gradient-to-br from-brand-accent1 via-purple-600 to-indigo-700 rounded-2xl p-8 sm:p-10 relative overflow-hidden shadow-2xl shadow-brand-accent1/20 mt-6">
                        <div class="relative z-10">
                            <p class="text-xs font-bold text-white/80 uppercase tracking-widest mb-2">Logaritma.id</p>
                            <h2 class="text-3xl sm:text-4xl font-black text-white mb-6 max-w-lg leading-tight">ALL IN ONE<br/>OPERATIONAL TOOLS</h2>
                            <div class="flex gap-3">
                                <button onclick="switchTab('kalkulator')" class="bg-white text-brand-bg px-6 py-2.5 rounded-full font-bold text-sm hover:bg-slate-200 transition">Start Calculating</button>
                            </div>
                        </div>
                        <!-- Abstract shapes -->
                        <div class="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                        <div class="absolute right-20 -top-20 w-48 h-48 bg-black/20 rounded-full blur-2xl"></div>
                    </div>

                    <!-- Features List -->
                    <div class="mt-8">
                        <h3 class="text-lg font-bold text-white mb-4">Core Tools</h3>
                        <div class="bg-brand-surface border border-white/5 rounded-2xl overflow-hidden">
                            <table class="w-full text-left text-sm">
                                <thead class="bg-black/20 text-xs uppercase text-slate-500 font-bold border-b border-white/5">
                                    <tr>
                                        <th class="px-6 py-4">#</th>
                                        <th class="px-6 py-4">Title</th>
                                        <th class="px-6 py-4">Category</th>
                                        <th class="px-6 py-4 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-white/5">
                                    <tr class="hover:bg-white/5 transition cursor-pointer" onclick="switchTab('kalkulator')">
                                        <td class="px-6 py-4 text-slate-500">01</td>
                                        <td class="px-6 py-4 font-bold text-white flex items-center gap-3"><span class="text-xl">📊</span> Kalkulator Target</td>
                                        <td class="px-6 py-4 text-slate-400">Planning</td>
                                        <td class="px-6 py-4 text-right"><span class="px-2 py-1 text-[10px] font-bold bg-white/10 text-white rounded-full">CORE</span></td>
                                    </tr>
                                    <tr class="hover:bg-white/5 transition cursor-pointer" onclick="switchTab('dokumen')">
                                        <td class="px-6 py-4 text-slate-500">02</td>
                                        <td class="px-6 py-4 font-bold text-white flex items-center gap-3"><span class="text-xl">📋</span> Dokumen Operasional</td>
                                        <td class="px-6 py-4 text-slate-400">AI Gen</td>
                                        <td class="px-6 py-4 text-right"><span class="px-2 py-1 text-[10px] font-bold bg-brand-accent1/20 text-brand-accent1 rounded-full">POPULAR</span></td>
                                    </tr>
                                    <tr class="hover:bg-white/5 transition cursor-pointer trigger-premium" onclick="switchTab('uji-dampak')">
                                        <td class="px-6 py-4 text-slate-500">03</td>
                                        <td class="px-6 py-4 font-bold text-white flex items-center gap-3"><span class="text-xl">🎯</span> Uji Dampak Kegiatan</td>
                                        <td class="px-6 py-4 text-slate-400">Simulation</td>
                                        <td class="px-6 py-4 text-right"><span class="px-2 py-1 text-[10px] font-bold bg-amber-500/20 text-amber-400 rounded-full">PREMIUM</span></td>
                                    </tr>
                                    <tr class="hover:bg-white/5 transition cursor-pointer" onclick="switchTab('pos-section')">
                                        <td class="px-6 py-4 text-slate-500">04</td>
                                        <td class="px-6 py-4 font-bold text-white flex items-center gap-3"><span class="text-xl">💳</span> Kasir POS</td>
                                        <td class="px-6 py-4 text-slate-400">Utility</td>
                                        <td class="px-6 py-4 text-right"><span class="px-2 py-1 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 rounded-full">ACTIVE</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Right Sidebar (Quick Access & Stats) -->
                <div class="w-full xl:w-80 shrink-0 space-y-6">
                    <h3 class="text-lg font-bold text-white">Quick Access</h3>
                    <div class="space-y-3">
                        <button onclick="switchTab('kalkulator')" class="w-full bg-brand-surface border border-white/5 hover:border-brand-accent1/50 rounded-xl p-4 flex items-center gap-4 transition group">
                            <div class="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-xl group-hover:bg-brand-accent1/20 transition">📊</div>
                            <span class="font-bold text-sm text-white">Kalkulator</span>
                        </button>
                        <button onclick="switchTab('dokumen')" class="w-full bg-brand-surface border border-white/5 hover:border-brand-accent1/50 rounded-xl p-4 flex items-center gap-4 transition group">
                            <div class="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-xl group-hover:bg-brand-accent1/20 transition">📋</div>
                            <span class="font-bold text-sm text-white">Buat Dokumen</span>
                        </button>
                        <button onclick="switchTab('pos-section')" class="w-full bg-brand-surface border border-white/5 hover:border-brand-accent1/50 rounded-xl p-4 flex items-center gap-4 transition group">
                            <div class="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-xl group-hover:bg-brand-accent1/20 transition">💳</div>
                            <span class="font-bold text-sm text-white">Buka Kasir</span>
                        </button>
                    </div>

                    <!-- Highlight Card -->
                    <div class="bg-gradient-to-br from-brand-accent1 to-orange-500 rounded-2xl p-6 relative overflow-hidden shadow-xl mt-6 h-48 flex flex-col justify-end">
                        <div class="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
                        <h4 class="text-2xl font-bold text-white relative z-10">Tim Logaritma</h4>
                        <p class="text-xs font-bold text-white/80 uppercase tracking-widest relative z-10">ALL-IN-ONE AI HUB</p>
                    </div>
                </div>
            </div>

            <!-- TAB: KALKULATOR -->
            <div id="kalkulator" class="tab-pane hidden flex-1 space-y-6 max-w-4xl">
                <div class="bg-brand-surface border border-white/5 rounded-2xl p-6 sm:p-8 shadow-xl">
                    <div class="flex items-center gap-3 mb-6 border-b border-white/5 pb-6">
                        <div class="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl border border-white/10">📊</div>
                        <div>
                            <h2 class="text-xl font-bold text-white font-heading">Kalkulator Target & Backward Mapping</h2>
                            <p class="text-xs text-slate-400 mt-1">Hitung otomatis target omzet dan batas belanja HPP harian.</p>
                        </div>
                    </div>
                    
                    <div class="space-y-5" id="form-kalkulator">
                        <!-- Dinamis Diisi JS berdasarkan config -->
                    </div>
                    
                    <button id="btn-hitung" class="w-full mt-8 bg-brand-accent1 hover:bg-brand-accent2 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-brand-accent1/20 text-sm">
                        Hitung Target Operasional Harian
                    </button>
                </div>

                <!-- Hasil Kalkulasi (muncul setelah hitung) -->
                <div id="hasil-kalkulasi" class="hidden space-y-6">
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div class="bg-brand-surface p-5 rounded-2xl border border-white/5 shadow-lg">
                            <p class="text-[10px] text-slate-400 font-bold uppercase mb-1">Target Omzet Bulanan</p>
                            <p id="hasil-omzet-bln" class="text-lg font-bold text-brand-accent1">Rp 0</p>
                        </div>
                        <div class="bg-brand-surface p-5 rounded-2xl border border-white/5 shadow-lg">
                            <p class="text-[10px] text-slate-400 font-bold uppercase mb-1">Target Omzet Harian</p>
                            <p id="hasil-omzet-hr" class="text-lg font-bold text-brand-accent1">Rp 0</p>
                        </div>
                        <div class="bg-brand-surface p-5 rounded-2xl border border-white/5 shadow-lg">
                            <p class="text-[10px] text-slate-400 font-bold uppercase mb-1">Target Penjualan</p>
                            <p id="hasil-porsi" class="text-lg font-bold text-white">0 <span class="lbl-unit text-sm text-slate-400"></span></p>
                        </div>
                        <div class="bg-brand-surface p-5 rounded-2xl border border-rose-500/30 relative overflow-hidden shadow-lg">
                            <div class="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-transparent"></div>
                            <p class="text-[10px] text-rose-300 font-bold uppercase mb-1 relative z-10">Batas Pengeluaran/HPP</p>
                            <p id="hasil-belanja" class="text-lg font-bold text-rose-400 relative z-10">Rp 0</p>
                        </div>
                    </div>
                    
                    <div class="bg-brand-surface border border-brand-accent1/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(192,38,211,0.1)] flex flex-col sm:flex-row gap-6 items-center">
                        <div class="flex-1">
                            <h3 class="text-lg font-bold text-white mb-2">Lanjutkan ke Pembuatan Dokumen?</h3>
                            <p class="text-sm text-slate-400">Gunakan hasil perhitungan ini untuk meracik standar operasional dengan Tim Logaritma.</p>
                        </div>
                        <button onclick="switchTab('dokumen')" class="w-full sm:w-auto shrink-0 bg-white text-brand-bg hover:bg-slate-200 font-bold py-3 px-6 rounded-xl transition-all text-sm">
                            Buka Menu Dokumen ➔
                        </button>
                    </div>
                </div>
            </div>

            <!-- TAB: DOKUMEN OPERASIONAL -->
            <div id="dokumen" class="tab-pane hidden flex-1 space-y-6">
                <div class="flex flex-col xl:flex-row gap-6">
                    <div class="flex-1 space-y-6">
                        <div class="bg-gradient-to-br from-brand-accent2/20 to-brand-surface border border-brand-accent2/30 rounded-2xl p-6 sm:p-8 shadow-xl">
                            <div class="flex items-center gap-4 mb-6">
                                <span class="w-12 h-12 bg-brand-accent2/20 border border-brand-accent2/30 rounded-xl flex items-center justify-center text-2xl">🤖</span>
                                <div>
                                    <h3 class="text-xl font-bold text-white font-heading">Tim Logaritma</h3>
                                    <p class="text-sm text-slate-400">Siap meracik dokumen operasional.</p>
                                </div>
                            </div>
                            
                            <div class="bg-[#0f0a1c] rounded-xl p-4 border border-white/5 mb-6">
                                <p class="text-xs text-slate-400 mb-1">Target yang digunakan:</p>
                                <p class="text-sm font-bold text-white" id="dokumen-target-summary">Silakan hitung target di menu Kalkulator terlebih dahulu.</p>
                            </div>
                            
                            <button id="btn-generate-ai" class="w-full bg-brand-accent2 hover:bg-purple-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-purple-500/20 text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                ⚡ Racik Dokumen Operasional
                            </button>
                        </div>

                        <!-- Container Hasil AI -->
                        <div id="ai-output-container" class="hidden bg-brand-surface border border-white/5 rounded-2xl p-6 sm:p-8 shadow-xl">
                            <div id="ai-loading" class="text-center py-12">
                                <div class="inline-block w-10 h-10 border-4 border-[#0f0a1c] border-t-brand-accent1 rounded-full animate-spin mb-4"></div>
                                <p class="text-slate-400 text-sm animate-pulse">Tim Logaritma sedang merumuskan standar operasional...</p>
                            </div>
                            <div id="ai-result" class="hidden">
                                <div class="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
                                    <h4 class="font-bold text-brand-accent1 text-sm uppercase tracking-wider">HASIL DOKUMEN SIAP PAKAI</h4>
                                    <button onclick="copyAiOutput()" class="text-[10px] font-bold bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition">📋 COPY ALL</button>
                                </div>
                                <div id="ai-markdown-content" class="prose prose-invert prose-purple max-w-none text-sm break-words whitespace-pre-wrap overflow-x-auto">
                                    <!-- Rendered Markdown -->
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Riwayat Dokumen -->
                    <div class="w-full xl:w-80 shrink-0">
                        <div class="bg-brand-surface rounded-2xl p-6 border border-white/5 shadow-xl h-full">
                            <div class="flex items-center justify-between mb-4">
                                <h3 class="text-sm font-bold text-white uppercase tracking-wider">Riwayat Dokumen</h3>
                                <span id="doc-count-badge" class="hidden text-[10px] font-bold bg-brand-accent1 text-white px-2 py-0.5 rounded-full">0</span>
                            </div>
                            <div id="doc-history-list" class="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                <p id="doc-empty-state" class="text-xs text-slate-500 italic text-center py-8 bg-[#0f0a1c] rounded-xl border border-white/5">Belum ada dokumen</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- TAB: UJI DAMPAK -->
            <div id="uji-dampak" class="tab-pane hidden flex-1 space-y-6 max-w-4xl">
                <div class="bg-brand-surface border border-white/5 rounded-2xl p-6 sm:p-8 shadow-xl">
                    <div class="flex items-center gap-4 mb-6 border-b border-white/5 pb-6">
                        <div class="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-xl flex items-center justify-center text-2xl border border-rose-500/20">🎯</div>
                        <div>
                            <h2 class="text-xl font-bold text-white font-heading">Uji Dampak Kegiatan (LTM Checker)</h2>
                            <p class="text-slate-400 text-xs mt-1">Simulasi dampak Diskon terhadap beban kerja operasional.</p>
                        </div>
                    </div>
                    
                    <div class="bg-[#0f0a1c] border border-white/5 rounded-xl p-6 mb-6 text-left">
                        <label class="block text-xs font-bold text-slate-400 uppercase mb-3">Rencana Diskon (%)</label>
                        <div class="flex flex-col sm:flex-row gap-4 items-end">
                            <div class="relative w-full">
                                <input type="number" id="input-ltm-diskon" placeholder="Misal: 20" class="w-full bg-[#1a132f] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition pr-8">
                                <span class="absolute right-4 top-4 text-slate-500 font-bold">%</span>
                            </div>
                            <button id="btn-hitung-ltm" class="w-full sm:w-auto px-8 py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition shadow-lg shadow-rose-600/20 whitespace-nowrap text-sm">Uji Dampak</button>
                        </div>
                    </div>
                    
                    <div id="hasil-ltm" class="hidden bg-gradient-to-br from-rose-900/20 to-[#0f0a1c] border border-rose-500/20 rounded-2xl p-6 sm:p-8 relative overflow-hidden text-left mt-6">
                        <div class="absolute -right-10 -top-10 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl"></div>
                        <h4 class="text-rose-400 font-bold text-sm mb-6 flex items-center gap-2">⚠️ HASIL SIMULASI TARGET BARU</h4>
                        
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            <div class="bg-white/5 rounded-xl p-4 border border-white/5">
                                <p class="text-[10px] text-slate-400 uppercase font-bold mb-1">Sisa Margin Profit</p>
                                <p id="ltm-sisa-margin" class="text-xl font-bold text-white">0%</p>
                            </div>
                            <div class="bg-rose-500/10 rounded-xl p-4 border border-rose-500/20">
                                <p class="text-[10px] text-rose-300 uppercase font-bold mb-1">Target Baru (Break-Even)</p>
                                <p id="ltm-target-baru" class="text-xl font-bold text-rose-400">0</p>
                            </div>
                        </div>
                        
                        <div class="bg-[#0f0a1c] border border-white/5 rounded-xl p-5 mb-6">
                            <p id="ltm-kesimpulan" class="text-sm text-slate-300 leading-relaxed"></p>
                        </div>
                        
                        <button id="btn-terapkan-ltm" class="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-xl border border-white/10 transition text-sm flex justify-center items-center gap-2">
                            <span>🤖</span> Terapkan Target & Racik Dokumen Promo
                        </button>
                    </div>
                </div>
            </div>

            <!-- TAB: POS -->
            ${posHtml}

            <!-- TAB: DISKUSI -->
            <div id="diskusi" class="tab-pane hidden flex flex-col fixed top-16 lg:top-20 bottom-0 left-0 lg:left-72 right-0 z-20 bg-brand-bg">
                <!-- Chat History Area -->
                <div id="chat-history" class="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-4 sm:p-6 space-y-6 w-full max-w-4xl mx-auto pb-4">
                    <!-- Initial Welcome Message -->
                    <div class="flex items-start gap-4">
                        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-brand-accent1 to-brand-accent2 flex items-center justify-center shrink-0 shadow-lg shadow-brand-accent1/20">
                            <span class="text-white font-bold text-sm">TL</span>
                        </div>
                        <div class="bg-brand-surface border border-white/5 rounded-2xl rounded-tl-sm p-4 text-white text-sm markdown-content shadow-lg max-w-[90%] sm:max-w-[80%]">
                            <p>Halo! Saya dari <strong>Tim Logaritma</strong>. Ada pertanyaan seputar pengelolaan bisnis <strong class="text-brand-accent1">${category.name}</strong> Anda? Saya siap berdiskusi tentang strategi, operasional, pemasaran, hingga hitung-hitungan finansial.</p>
                        </div>
                    </div>
                </div>
                
                <!-- Chat Input Area (Gemini Style) -->
                <div class="shrink-0 w-full p-4 sm:p-6 bg-gradient-to-t from-brand-bg/50 to-brand-bg">
                    <div class="bg-brand-surface border border-white/10 rounded-[2rem] p-2 sm:p-3 shadow-2xl flex flex-col max-w-4xl mx-auto backdrop-blur-md">
                        <textarea id="chat-input" rows="1" class="bg-transparent text-white text-sm sm:text-base px-4 py-2 sm:py-3 focus:outline-none resize-none custom-scrollbar w-full" placeholder="Tanya Tim Logaritma..." oninput="this.style.height = ''; this.style.height = Math.min(this.scrollHeight, 200) + 'px'"></textarea>
                        <div class="flex justify-between items-center px-2 mt-1">
                            <div class="text-[10px] sm:text-xs text-slate-500 font-bold ml-2 flex items-center gap-2">
                                <div class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                                Asisten Spesialis ${category.name}
                            </div>
                            <button id="chat-send" class="w-10 h-10 rounded-full bg-white/10 hover:bg-brand-accent1 text-white flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </main>

    <!-- Global State & Configuration -->
    <script src="/js/config.js"></script>
    <script src="/js/category-config.js"></script>
    
    <!-- MAIN APPLICATION LOGIC -->
    <script type="module">
        import { GoogleGenerativeAI } from "@google/generative-ai";
        
        // Setup API (Obfuscated slightly for frontend)
        const p1 = "AIzaSy";
        const p2 = "B8uWjK9";
        const p3 = "yRzN_uX";
        const p4 = "5mH3T-V";
        const p5 = "d-7G_yE8Q";
        // Note: You might want to update this with real API key loading method 
        // We will use the existing parts from original script to prevent breakage
        const part1 = "AQ.Ab8RN6IgnkAz";
        const part2 = "Ez8Pg6k2BX6RxUZ";
        const part3 = "JyIITkmB8FnmDUM";
        const part4 = "znjCWtOg";
        const API_KEY = part1 + part2 + part3 + part4;
        
        const genAI = new GoogleGenerativeAI(API_KEY);
        
        const CATEGORY_ID = "${category.id}";
        const config = CATEGORY_CONFIG[CATEGORY_ID];
        
        // --- SPA TAB LOGIC ---
        window.switchTab = (tabId) => {
            // Update Navigation active state
            document.querySelectorAll('.nav-item').forEach(el => {
                el.classList.remove('active', 'bg-white/10', 'text-white');
                el.classList.add('text-slate-400');
                if (el.getAttribute('href') === '#' + tabId) {
                    el.classList.add('active', 'bg-white/10', 'text-white');
                    el.classList.remove('text-slate-400');
                }
            });

            // Hide all tabs
            document.querySelectorAll('.tab-pane').forEach(el => el.classList.add('hidden'));
            
            // Show target tab
            const target = document.getElementById(tabId);
            if (target) {
                target.classList.remove('hidden');
                
                // If it's POS, try to initialize
                if (tabId === 'pos-section') {
                    if(CATEGORY_ID === 'kuliner' && window.posKuliner && window.posKuliner.init) window.posKuliner.init();
                    if(CATEGORY_ID === 'fashion' && window.posFashion && window.posFashion.init) window.posFashion.init();
                    if(CATEGORY_ID === 'percetakan' && window.posPercetakan && window.posPercetakan.init) window.posPercetakan.init();
                    if(CATEGORY_ID === 'pkl' && window.posPkl && window.posPkl.init) window.posPkl.init();
                    if(CATEGORY_ID === 'distributor' && window.posDistributor && window.posDistributor.init) window.posDistributor.init();
                }

                // Clear chat if Diskusi tab is opened
                if (tabId === 'diskusi') {
                    const historyEl = document.getElementById('chat-history');
                    if (historyEl) {
                        historyEl.innerHTML = \`
                            <div class="flex items-start gap-4">
                                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-brand-accent1 to-brand-accent2 flex items-center justify-center shrink-0 shadow-lg shadow-brand-accent1/20">
                                    <span class="text-white font-bold text-sm">TL</span>
                                </div>
                                <div class="bg-brand-surface border border-white/5 rounded-2xl rounded-tl-sm p-4 text-white text-sm markdown-content shadow-lg max-w-[90%] sm:max-w-[80%]">
                                    <p>Halo! Saya dari <strong>Tim Logaritma</strong>. Ada pertanyaan seputar pengelolaan bisnis <strong class="text-brand-accent1">\${CATEGORY_CONFIG[CATEGORY_ID].name}</strong> Anda? Saya siap berdiskusi tentang strategi, operasional, pemasaran, hingga hitung-hitungan finansial.</p>
                                </div>
                            </div>
                        \`;
                    }
                    if (window.chatContext) {
                        window.chatContext = [];
                    }
                }
            }
            
            // Close mobile menu if open
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebar-overlay');
            if(sidebar.classList.contains('translate-x-0') && window.innerWidth < 1024) {
                sidebar.classList.remove('translate-x-0');
                sidebar.classList.add('-translate-x-full');
                overlay.classList.add('hidden');
            }
        };

        document.addEventListener('DOMContentLoaded', () => {
            // Setup mobile menu
            const btnMenu = document.getElementById('mobile-menu-btn');
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebar-overlay');
            
            function toggleMenu() {
                const isOpen = sidebar.classList.contains('translate-x-0');
                if(isOpen) {
                    sidebar.classList.remove('translate-x-0');
                    sidebar.classList.add('-translate-x-full');
                    overlay.classList.add('hidden');
                } else {
                    sidebar.classList.remove('-translate-x-full');
                    sidebar.classList.add('translate-x-0');
                    overlay.classList.remove('hidden');
                }
            }
            btnMenu.addEventListener('click', toggleMenu);
            overlay.addEventListener('click', toggleMenu);

            // Setup Hash routing
            const hash = window.location.hash.replace('#', '') || 'dasbor';
            switchTab(hash);
            
            // Override nav links click
            document.querySelectorAll('.nav-item').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = link.getAttribute('href').replace('#', '');
                    history.pushState(null, null, '#' + targetId);
                    switchTab(targetId);
                });
            });

            // Search Menu Logic
            const searchInput = document.getElementById('menu-search');
            searchInput.addEventListener('input', (e) => {
                const term = e.target.value.toLowerCase();
                document.querySelectorAll('#sidebar-nav .nav-item').forEach(link => {
                    const text = link.querySelector('.nav-text').innerText.toLowerCase();
                    if(text.includes(term)) {
                        link.style.display = 'flex';
                    } else {
                        link.style.display = 'none';
                    }
                });
            });

            // Premium Access Logic
            const isPremium = localStorage.getItem('is_premium') === 'true';
            if (isPremium) {
                document.querySelectorAll('.trigger-paywall').forEach(btn => btn.style.display = 'none');
                const badge = document.getElementById('plan-badge');
                if(badge) {
                    badge.innerText = 'PREMIUM PRO';
                    badge.classList.replace('bg-slate-800', 'bg-brand-accent1/20');
                    badge.classList.replace('text-slate-300', 'text-brand-accent1');
                }
                const ujiDampak = document.querySelector('a[href="#uji-dampak"]');
                if (ujiDampak) {
                    ujiDampak.classList.remove('trigger-premium');
                    // remove lock icon if any
                }
            } else {
                document.querySelectorAll('.trigger-paywall, .trigger-premium').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        if(btn.tagName === 'A') { e.preventDefault(); e.stopPropagation(); }
                        const phone = prompt('Masukkan Nomor WhatsApp yang terdaftar (Premium):');
                        if (phone === '085179660408') {
                            localStorage.setItem('is_premium', 'true');
                            alert('Akses Premium Berhasil Diverifikasi! Selamat datang kembali.');
                            location.reload();
                        } else if (phone !== null) {
                            alert('Nomor belum terdaftar atau langganan tidak aktif. Silakan hubungi admin.');
                        }
                    });
                });
            }

            // Update UI based on config
            document.title = \`Sistem \${config.name} - Logaritma\`;
            document.querySelectorAll('.lbl-unit').forEach(el => el.innerText = config.unit);

            // Render Form Metrics for Kalkulator
            const formContainer = document.getElementById('form-kalkulator');
            config.metrics.forEach(metric => {
                const isCurrency = metric.type === 'currency';
                const defaultVal = isCurrency ? Number(metric.default).toLocaleString('id-ID') : metric.default;
                
                const div = document.createElement('div');
                div.innerHTML = \`
                    <label class="block text-xs font-bold text-slate-400 uppercase mb-2">\${metric.label}</label>
                    <input type="\${isCurrency ? 'text' : 'number'}" id="input-\${metric.id}" value="\${defaultVal}" data-type="\${metric.type}" class="w-full bg-[#0f0a1c] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-brand-accent1 focus:ring-1 focus:ring-brand-accent1 transition text-sm">
                \`;
                formContainer.appendChild(div);
            });
            
            // Format currency while typing
            document.querySelectorAll('input[data-type="currency"]').forEach(input => {
                input.addEventListener('input', function(e) {
                    let val = this.value.replace(/\\D/g, '');
                    if (val) {
                        this.value = Number(val).toLocaleString('id-ID');
                    } else {
                        this.value = '';
                    }
                });
            });

            // Core Logic Variables
            let globalTargetPorsi = 0;
            let globalBatasBelanja = 0;

            // Handle Hitung
            document.getElementById('btn-hitung').addEventListener('click', () => {
                const parseNum = (val) => parseFloat(val.toString().replace(/\\./g, '')) || 0;
                
                const targetProfit = parseNum(document.getElementById('input-target_profit').value);
                const hargaJual = parseNum(document.getElementById('input-harga_jual').value);
                const margin = parseNum(document.getElementById('input-margin').value);
                const hariBuka = parseNum(document.getElementById('input-hari_buka').value);

                const omzetBulanan = targetProfit / (margin / 100);
                const omzetHarian = omzetBulanan / hariBuka;
                const targetPorsi = Math.ceil(omzetHarian / hargaJual);
                
                const persenHpp = 100 - margin - 20;
                const batasBelanja = omzetHarian * (persenHpp / 100);

                globalTargetPorsi = targetPorsi;
                globalBatasBelanja = batasBelanja;

                document.getElementById('hasil-kalkulasi').classList.remove('hidden');
                document.getElementById('hasil-omzet-bln').innerText = "Rp " + omzetBulanan.toLocaleString('id-ID');
                document.getElementById('hasil-omzet-hr').innerText = "Rp " + Math.round(omzetHarian).toLocaleString('id-ID');
                document.getElementById('hasil-porsi').innerHTML = targetPorsi + \` <span class="lbl-unit text-sm text-slate-400">\${config.unit}</span>\`;
                document.getElementById('hasil-belanja').innerText = "Rp " + Math.round(batasBelanja).toLocaleString('id-ID');
                
                const summaryText = \`\${targetPorsi} \${config.unit}/hari (Batas HPP: Rp \${Math.round(batasBelanja).toLocaleString('id-ID')})\`;
                document.getElementById('dokumen-target-summary').innerText = summaryText;
                
                document.getElementById('btn-generate-ai').disabled = false;
                
                document.getElementById('hasil-kalkulasi').scrollIntoView({ behavior: 'smooth' });
            });

            // Handle Generate AI (Dokumen Tab)
            document.getElementById('btn-generate-ai').addEventListener('click', async () => {
                if (globalTargetPorsi === 0) {
                    alert('Harap hitung target di menu Kalkulator terlebih dahulu.');
                    return;
                }

                const outContainer = document.getElementById('ai-output-container');
                const loading = document.getElementById('ai-loading');
                const result = document.getElementById('ai-result');
                const content = document.getElementById('ai-markdown-content');
                
                outContainer.classList.remove('hidden');
                loading.classList.remove('hidden');
                result.classList.add('hidden');
                content.innerHTML = "";

                const fullPrompt = \`\${config.prompt_persona}\\n\\nKonteks Data:\\n- Target Jualan: \${globalTargetPorsi} \${config.unit}\\n- Batas Pengeluaran/HPP Harian: Rp \${Math.round(globalBatasBelanja).toLocaleString('id-ID')}\\n\\nBuat dokumen tersebut sekarang secara profesional. Gunakan format Markdown yang rapi (Heading, Bullet points, Table jika perlu, dan pastikan ADA SPASI antar paragraf agar mudah dibaca). Ganti kata AI dengan tim logaritma.\`;

                try {
                    const aiModels = ["gemini-3.6-flash", "gemini-3.1-pro", "gemini-3.5-flash-lite"];
                    let text = null;
                    let lastError = null;
                    for (let i = 0; i < aiModels.length; i++) {
                        try {
                            const model = genAI.getGenerativeModel({ model: aiModels[i] });
                            const aiResult = await model.generateContent(fullPrompt);
                            const response = await aiResult.response;
                            text = response.text();
                            break;
                        } catch(e) {
                            lastError = e;
                            console.log(\`Model \${aiModels[i]} failed:\`, e);
                        }
                    }
                    if (!text) throw lastError || new Error("Semua model gagal.");
                    
                    // Ganti AI dengan Tim Logaritma sesuai instruksi pengguna
                    text = text.replace(/\\bAI\\b/gi, 'Tim Logaritma');

                    loading.classList.add('hidden');
                    result.classList.remove('hidden');
                    content.innerHTML = marked.parse(text);
                    
                    outContainer.scrollIntoView({ behavior: 'smooth' });
                    
                    saveDoc('SOP Normal - ' + globalTargetPorsi + ' ' + config.unit, text);
                } catch (error) {
                    loading.classList.add('hidden');
                    let msg = error.message;
                    if (msg.includes('429') || msg.includes('quota')) {
                        msg = "Limit kuota harian Tim Logaritma gratis tercapai. Mohon coba beberapa saat lagi.";
                    }
                    alert("Gagal meracik Dokumen Operasional: " + msg);
                }
            });

            // LTM Logic
            document.getElementById('btn-hitung-ltm')?.addEventListener('click', () => {
                const parseNum = (val) => parseFloat(val.toString().replace(/\\./g, '')) || 0;
                const margin = parseNum(document.getElementById('input-margin').value);
                const diskon = parseFloat(document.getElementById('input-ltm-diskon').value) || 0;
                
                if(!margin || diskon <= 0) {
                    alert('Harap hitung target utama di menu Kalkulator dulu dan masukkan diskon yang valid.');
                    return;
                }
                
                const newMargin = margin - diskon;
                if (newMargin <= 0) {
                    alert('Diskon terlalu besar! Margin Anda habis/minus.');
                    return;
                }
                
                if (globalTargetPorsi === 0) {
                    document.getElementById('btn-hitung').click(); // Auto hitung jika belum
                }
                
                const multiplier = margin / newMargin;
                const newTargetPorsi = Math.ceil(globalTargetPorsi * multiplier);
                const kenaikanPersen = Math.round((multiplier - 1) * 100);
                
                document.getElementById('hasil-ltm').classList.remove('hidden');
                document.getElementById('ltm-sisa-margin').innerText = newMargin.toFixed(1) + '%';
                document.getElementById('ltm-target-baru').innerText = newTargetPorsi + \` \` + config.unit;
                
                const kesimpulan = \`Untuk menutupi kebocoran profit akibat diskon \` + diskon + \`%, tim Anda wajib menaikkan volume penjualan sebesar <strong>\` + kenaikanPersen + \`%</strong> (dari \` + globalTargetPorsi + \` menjadi \` + newTargetPorsi + \` \` + config.unit + \`/hari) hanya untuk sekadar BALIK MODAL.\`;
                document.getElementById('ltm-kesimpulan').innerHTML = kesimpulan;
                
                document.getElementById('btn-terapkan-ltm').onclick = () => {
                    globalTargetPorsi = newTargetPorsi;
                    document.getElementById('dokumen-target-summary').innerText = \`\${newTargetPorsi} \${config.unit}/hari (Masa Promo \${diskon}%)\`;
                    switchTab('dokumen');
                    
                    // Auto trigger generate with promo context
                    const fullPrompt = \`\${config.prompt_persona}\\n\\nKonteks Keadaan Darurat / Promo:\\n- Target Jualan HARUS NAIK menjadi: \${newTargetPorsi} \${config.unit}/hari (Naik \${kenaikanPersen}% akibat diskon \${diskon}%)\\n- Batas Pengeluaran/HPP Harian tetap: Rp \${Math.round(globalBatasBelanja).toLocaleString('id-ID')}\\n\\nBuat dokumen STANDAR OPERASIONAL PROSEDUR (SOP) KHUSUS MASA PROMO yang mengatur bagaimana tim harus bekerja ekstra keras dan efisien untuk mencapai target yang melonjak drastis ini tanpa mengorbankan kualitas atau over-budget. Ganti kata AI dengan Tim Logaritma.\`;
                    
                    document.getElementById('btn-generate-ai').click(); 
                    // Overwrite default click behavior for this one time execution
                    // To do it properly, we set the prompt value but since btn-generate-ai reads from inputs, we can inject a temporary prompt wrapper.
                    // For simplicity, let's just do it directly here:
                    
                    const outContainer = document.getElementById('ai-output-container');
                    const loading = document.getElementById('ai-loading');
                    const result = document.getElementById('ai-result');
                    const content = document.getElementById('ai-markdown-content');
                    
                    outContainer.classList.remove('hidden');
                    loading.classList.remove('hidden');
                    result.classList.add('hidden');
                    content.innerHTML = "";
                    
                    const aiModels = ["gemini-3.6-flash", "gemini-3.1-pro", "gemini-3.5-flash-lite"];
                    const fetchWithFallback = async () => {
                        let lastError = null;
                        for (let i = 0; i < aiModels.length; i++) {
                            try {
                                const model = genAI.getGenerativeModel({ model: aiModels[i] });
                                const aiResult = await model.generateContent(fullPrompt);
                                const response = await aiResult.response;
                                return response.text();
                            } catch(e) {
                                lastError = e;
                                console.log(\`Model \${aiModels[i]} failed:\`, e);
                            }
                        }
                        throw lastError || new Error("Semua model gagal.");
                    };

                    fetchWithFallback().then(text => {
                        text = text.replace(/\\bAI\\b/gi, 'Tim Logaritma');
                        loading.classList.add('hidden');
                        result.classList.remove('hidden');
                        content.innerHTML = marked.parse(text);
                        saveDoc('SOP Promo ' + diskon + '% - ' + newTargetPorsi + ' ' + config.unit, text);
                    }).catch(e => {
                        loading.classList.add('hidden');
                        let msg = e.message;
                        if (msg.includes('429') || msg.includes('quota')) {
                            msg = "Limit kuota harian Tim Logaritma gratis tercapai. Mohon coba beberapa saat lagi.";
                        }
                        alert("Gagal meracik dokumen promo: " + msg);
                    });
                };
            });
        });

        // ===== DOCUMENT HISTORY ENGINE =====
        const DOC_STORAGE_KEY = 'logaritma_docs_' + CATEGORY_ID;

        function getDocs() {
            try { return JSON.parse(localStorage.getItem(DOC_STORAGE_KEY)) || []; } catch(e) { return []; }
        }

        function saveDocs(docs) {
            localStorage.setItem(DOC_STORAGE_KEY, JSON.stringify(docs));
        }

        function saveDoc(title, markdown) {
            const docs = getDocs();
            docs.unshift({
                id: Date.now(),
                title: title,
                markdown: markdown,
                ts: new Date().toLocaleString('id-ID', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })
            });
            saveDocs(docs);
            renderDocs();
        }

        function deleteDoc(id) {
            const docs = getDocs().filter(d => d.id !== id);
            saveDocs(docs);
            renderDocs();
        }

        function viewDoc(id) {
            const doc = getDocs().find(d => d.id === id);
            if (!doc) return;

            switchTab('dokumen');
            
            const outContainer = document.getElementById('ai-output-container');
            const result = document.getElementById('ai-result');
            const content = document.getElementById('ai-markdown-content');
            
            outContainer.classList.remove('hidden');
            document.getElementById('ai-loading').classList.add('hidden');
            result.classList.remove('hidden');
            
            content.innerHTML = marked.parse(doc.markdown);
            outContainer.scrollIntoView({ behavior: 'smooth' });
        }

        function renderDocs() {
            const docs = getDocs();
            const list = document.getElementById('doc-history-list');
            const emptyState = document.getElementById('doc-empty-state');
            const badge = document.getElementById('doc-count-badge');
            if (!list) return;

            list.querySelectorAll('.doc-item').forEach(el => el.remove());

            if (docs.length === 0) {
                if (emptyState) emptyState.classList.remove('hidden');
                if (badge) badge.classList.add('hidden');
                return;
            }

            if (emptyState) emptyState.classList.add('hidden');
            if (badge) { badge.textContent = docs.length; badge.classList.remove('hidden'); }

            docs.forEach(doc => {
                const item = document.createElement('div');
                item.className = 'doc-item group flex items-start gap-2 bg-[#0f0a1c] hover:bg-white/5 border border-white/5 rounded-xl p-3 cursor-pointer transition';
                item.innerHTML = \`
                    <div class="flex-1 min-w-0" onclick="viewDoc(\${doc.id})">
                        <p class="text-xs font-bold text-white truncate">\${doc.title}</p>
                        <p class="text-[10px] text-slate-500 mt-1">\${doc.ts}</p>
                    </div>
                    <button onclick="event.stopPropagation(); deleteDoc(\${doc.id})" class="shrink-0 text-slate-600 hover:text-rose-400 transition text-lg leading-none mt-0.5" title="Hapus dokumen">&times;</button>
                \`;
                list.appendChild(item);
            });
        }

        window.viewDoc = viewDoc;
        window.deleteDoc = deleteDoc;
        window.copyAiOutput = () => {
            const el = document.getElementById('ai-markdown-content');
            if(el) {
                navigator.clipboard.writeText(el.innerText).then(() => alert('Tersalin ke clipboard!'));
            }
        };

        // --- DISKUSI TIM LOGARITMA LOGIC ---
        const chatHistory = document.getElementById('chat-history');
        const chatInput = document.getElementById('chat-input');
        const chatSend = document.getElementById('chat-send');
        window.chatContext = [];

        async function sendChatMessage() {
            const userText = chatInput.value.trim();
            if(!userText) return;

            chatInput.value = '';
            chatInput.style.height = '';
            
            const userMsgHtml = \`
                <div class="flex items-start gap-4 justify-end">
                    <div class="bg-brand-accent1/20 border border-brand-accent1/30 rounded-2xl p-4 text-white text-sm max-w-[85%] shadow-lg">
                        \${userText}
                    </div>
                </div>
            \`;
            chatHistory.insertAdjacentHTML('beforeend', userMsgHtml);
            chatHistory.scrollTop = chatHistory.scrollHeight;

            const loadingId = 'loading-' + Date.now();
            const loadingHtml = \`
                <div id="\${loadingId}" class="flex items-start gap-4">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-br from-brand-accent1 to-brand-accent2 flex items-center justify-center shrink-0 shadow-lg shadow-brand-accent1/20">
                        <span class="text-white font-bold text-sm animate-pulse">TL</span>
                    </div>
                    <div class="bg-[#0f0a1c] border border-white/10 rounded-2xl p-4 text-white text-sm flex items-center gap-2 shadow-lg">
                        <div class="w-2 h-2 bg-brand-accent1 rounded-full animate-bounce"></div>
                        <div class="w-2 h-2 bg-brand-accent2 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                        <div class="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
                    </div>
                </div>
            \`;
            chatHistory.insertAdjacentHTML('beforeend', loadingHtml);
            chatHistory.scrollTop = chatHistory.scrollHeight;
            chatSend.disabled = true;

            const aiModels = ["gemini-3.6-flash", "gemini-3.1-pro", "gemini-3.5-flash-lite"];
            let text = null;
            let success = false;
            let lastError = null;

            for (let i = 0; i < aiModels.length; i++) {
                try {
                    const modelName = aiModels[i];
                    const model = genAI.getGenerativeModel({ 
                        model: modelName,
                        systemInstruction: "Anda adalah Tim Logaritma, asisten cerdas dan profesional dari aplikasi Logaritma.id. Anda melayani pengguna bisnis '${category.name}'. ATURAN PENTING:\\n1. Jawablah dengan SINGKAT, padat, dan langsung pada intinya (maksimal 2-3 paragraf pendek, jangan bertele-tele).\\n2. Secara halus dan tanpa sadar, arahkan pengguna untuk menggunakan fitur/metode 'Logaritma' di aplikasi ini (seperti menghitung target di Kalkulator Logaritma, mencatat penjualan di Kasir POS, atau membuat SOP operasional otomatis) sebagai solusi dari masalah mereka.\\n3. HANYA jawab pertanyaan seputar pengelolaan bisnis '${category.name}'. Jika di luar itu, tolak dengan sopan.\\n4. Jangan pernah menyebut Anda 'AI' atau 'Gemini', sebut saja 'Tim Logaritma'."
                    });
                    
                    const chat = model.startChat({
                        history: window.chatContext || [],
                        generationConfig: { maxOutputTokens: 1000 },
                    });
                    
                    const result = await chat.sendMessage(userText);
                    const response = await result.response;
                    text = response.text();
                    text = text.replace(/\\bAI\\b/gi, 'Tim Logaritma');
                    success = true;
                    break;
                } catch (e) {
                    lastError = e;
                    console.log(\`Model \${aiModels[i]} failed:\`, e);
                }
            }

            if (success) {
                if (!window.chatContext) window.chatContext = [];
                window.chatContext.push({ role: "user", parts: [{ text: userText }] });
                window.chatContext.push({ role: "model", parts: [{ text: text }] });

                document.getElementById(loadingId).remove();
                const aiMsgHtml = \`
                    <div class="flex items-start gap-4">
                        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-brand-accent1 to-brand-accent2 flex items-center justify-center shrink-0 shadow-lg shadow-brand-accent1/20">
                            <span class="text-white font-bold text-sm">TL</span>
                        </div>
                        <div class="bg-brand-surface border border-white/5 rounded-2xl rounded-tl-sm p-4 text-white text-sm markdown-content ai-response shadow-lg max-w-[90%] sm:max-w-[80%]">
                            \${marked.parse(text)}
                        </div>
                    </div>
                \`;
                chatHistory.insertAdjacentHTML('beforeend', aiMsgHtml);
                chatHistory.scrollTop = chatHistory.scrollHeight;
            } else {
                document.getElementById(loadingId).remove();
                let errMsg = lastError ? lastError.message : 'Semua model sedang sibuk.';
                if(errMsg.includes('429')) errMsg = 'Limit kuota harian Tim Logaritma gratis tercapai. Mohon coba beberapa saat lagi.';
                const errHtml = \`
                    <div class="flex items-start gap-4">
                        <div class="w-10 h-10 rounded-full bg-rose-600 flex items-center justify-center shrink-0">
                            <span class="text-white font-bold text-sm">!</span>
                        </div>
                        <div class="bg-rose-900/30 border border-rose-500/30 rounded-2xl p-4 text-white text-sm shadow-lg">
                            Maaf, terjadi kesalahan: \${errMsg}
                        </div>
                    </div>
                \`;
                chatHistory.insertAdjacentHTML('beforeend', errHtml);
                chatHistory.scrollTop = chatHistory.scrollHeight;
            }
            chatSend.disabled = false;
        }

        if(chatSend) {
            chatSend.addEventListener('click', sendChatMessage);
            chatInput.addEventListener('keypress', (e) => {
                if(e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendChatMessage();
                }
            });
        }

        document.addEventListener('DOMContentLoaded', () => renderDocs());

    </script>
    
    <script>
    ${posJs}
    </script>
</body>
</html>`;
}

CATEGORIES.forEach(cat => {
    const filePath = path.join(__dirname, 'tools', cat.id, 'index.html');
    const html = generateHtml(cat);
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`Generated ${cat.id} dashboard UI.`);
});
