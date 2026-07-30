const fs = require('fs');
let content = fs.readFileSync('build_tools.js', 'utf8');

const htmlOld = <div class="flex justify-between items-center mb-3">
                        <h3 class="text-sm font-bold text-white">?? Tombol Menu</h3>
                    </div>
                    <div id="pkl-menu-grid" class="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6"></div>;

const htmlNew = <div class="flex justify-between items-center mb-3 mt-6">
                        <h3 class="text-sm font-bold text-white">?? Pengaturan Menu</h3>
                    </div>
                    <div class="bg-[#0f0a1c] border border-white/10 rounded-xl p-4 mb-6 flex flex-col sm:flex-row gap-2 items-center">
                        <input type="text" id="pkl-new-nama" placeholder="Nama Menu" class="bg-[#1a132f] border border-white/10 rounded-lg px-3 py-2 text-white text-sm w-full focus:outline-none focus:border-orange-500">
                        <input type="number" id="pkl-new-harga" placeholder="Harga Jual" class="bg-[#1a132f] border border-white/10 rounded-lg px-3 py-2 text-white text-sm w-full sm:w-32 focus:outline-none focus:border-orange-500">
                        <input type="number" id="pkl-new-hpp" placeholder="HPP (Modal)" class="bg-[#1a132f] border border-white/10 rounded-lg px-3 py-2 text-white text-sm w-full sm:w-32 focus:outline-none focus:border-orange-500">
                        <button onclick="posPkl.addMenu()" class="w-full sm:w-auto bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition whitespace-nowrap">+ Tambah</button>
                    </div>
                    <div class="flex justify-between items-center mb-3">
                        <h3 class="text-sm font-bold text-white">?? Tombol Menu</h3>
                    </div>
                    <div id="pkl-menu-grid" class="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6"></div>;

content = content.replace(htmlOld.replace('??', '??'), htmlNew);

const jsOld =         window.posPkl = (() => {
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
                        b.className = 'bg-white/5 hover:bg-orange-900/30 border border-white/10 rounded-2xl p-4 text-center transition-all active:scale-95';
                        b.onclick = () => pklRecord(m.id);
                        b.innerHTML = \<p class="text-2xl mb-2">?</p><p class="text-sm font-bold text-white">\</p><p class="text-orange-400 font-bold">\</p>\;
                        grid.appendChild(b);
                    });
                };

const jsNew =         window.posPkl = (() => {
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
                        b.innerHTML = \<p class="text-2xl mb-2">?</p><p class="text-sm font-bold text-white">\</p><p class="text-orange-400 font-bold">\</p>\;
                        
                        const delBtn = document.createElement('button');
                        delBtn.className = 'absolute -top-2 -right-2 bg-rose-600 hover:bg-rose-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition shadow-lg';
                        delBtn.innerHTML = '×';
                        delBtn.onclick = (e) => { e.stopPropagation(); posPkl.deleteMenu(m.id); };
                        
                        wrapper.appendChild(b);
                        wrapper.appendChild(delBtn);
                        grid.appendChild(wrapper);
                    });
                };

content = content.replace(jsOld, jsNew);

const returnOld =             function reset() { if(confirm('Reset?')) { localStorage.removeItem(KEY); render(); } }
            
            function init() { render(); }
            document.addEventListener('DOMContentLoaded', init);
            
            return { reset, init };;

const returnNew =             function reset() { if(confirm('Reset?')) { localStorage.removeItem(KEY); render(); } }
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
            function deleteMenu(id) {
                if(!confirm('Hapus menu ini?')) return;
                const m = getMenus().filter(x => x.id !== id);
                localStorage.setItem(MENU_KEY, JSON.stringify(m));
                render();
            }
            
            function init() { render(); }
            document.addEventListener('DOMContentLoaded', init);
            
            return { reset, init, addMenu, deleteMenu };;

content = content.replace(returnOld, returnNew);

fs.writeFileSync('build_tools.js', content, 'utf8');
console.log('done');
