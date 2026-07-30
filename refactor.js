const fs = require('fs');
let html = fs.readFileSync('tools/index.html', 'utf8');

const headerRegex = /<div class="mb-8 print-hide">\s*<h1 id="workspace-heading"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
const match = html.match(headerRegex);
if(match) {
    const headerBlock = match[0];
    html = html.replace(headerBlock, '');
    const mainRegex = /<main[^>]*>/;
    html = html.replace(mainRegex, '$&\n        <div class="mb-6 px-4 md:px-0">\n' + headerBlock.replace('mb-8', 'mb-2') + '\n        </div>');
}

html = html.replace(/<div class="max-w-2xl print-max-w-full">/g, '<div class="w-full print-max-w-full">');
html = html.replace(/<div class="max-w-2xl">/g, '<div class="w-full">');

const sopLabelRegex = /<label class="block text-xs font-bold text-slate-400 uppercase mb-2">Kegiatan Bisnis/;
html = html.replace(sopLabelRegex, '<div id="sop-target-badge" class="hidden mb-4 bg-emerald-900/30 border border-emerald-500/30 p-3 rounded-lg text-emerald-300 text-xs font-bold flex items-center gap-2">\n                                  <span>??</span> <span id="sop-target-text">Target Operasional Anda Saat Ini: ...</span>\n                              </div>\n                              $&');

fs.writeFileSync('tools/index.html', html);
console.log('HTML refactored successfully');
