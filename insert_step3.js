const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf-8');

const insertion = `                </div>
                
                <!-- STEP 3: Hasil Diagnostik -->
                <div id="diagnostic-step-3" class="relative z-10 hidden animate-fade-in text-center">
                    <div class="mb-6">
                        <div id="diag-result-icon" class="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl mb-4 shadow-xl">
                            <!-- Icon disisipkan via JS -->
                        </div>
                        <h3 class="text-3xl font-bold font-heading text-white mb-2">Skor: <span id="diag-result-score"></span></h3>
                        <div id="diag-result-badge" class="inline-block px-4 py-1.5 rounded-full text-sm font-bold border mb-6">
                            <!-- Badge disisipkan via JS -->
                        </div>
                    </div>
                    
                    <div class="bg-slate-950/50 border border-slate-700/50 rounded-xl p-6 text-left mb-8">
                        <h4 class="font-bold text-white mb-2 text-lg">Analisa Bisnis <span id="diag-result-kategori" class="text-emerald-400"></span> Anda:</h4>
                        <p id="diag-result-desc" class="text-slate-300 text-sm leading-relaxed">
                            <!-- Deskripsi disisipkan via JS -->
                        </p>
                    </div>
                    
                    <button id="btn-to-dashboard" class="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold py-4 px-6 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all transform hover:scale-105 cursor-pointer flex items-center justify-center gap-2">
                        Masuk ke Dashboard Member Area
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </button>
                </div>`;

const pattern = /(<button id="btn-submit-diagnostic"[\s\S]*?<\/button>\s*<\/div>\s*<\/div>)/;
content = content.replace(pattern, `$1\n\n${insertion}`);

fs.writeFileSync('index.html', content, 'utf-8');
console.log("Done");
