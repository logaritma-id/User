const fs = require('fs');
let js = fs.readFileSync('js/workspace.js', 'utf8');

const calcStr = /calculatedFbData = {[\s\S]*?hari: valHari\n              };/;
const match = js.match(calcStr);
if(match) {
    const injectStr = match[0] + '\n              localStorage.setItem("logaritma_fb_target", JSON.stringify(calculatedFbData));\n              updateSopBadge();';
    js = js.replace(match[0], injectStr);
}

const appendStr = \nfunction updateSopBadge() {
    const targetBadge = document.getElementById("sop-target-badge");
    const targetText = document.getElementById("sop-target-text");
    if (!targetBadge || !targetText) return;

    const dataStr = localStorage.getItem("logaritma_fb_target");
    if (dataStr) {
        try {
            const data = JSON.parse(dataStr);
            const fRupiah = (num) => new Intl.NumberFormat("id-ID", {style: "currency", currency: "IDR", maximumFractionDigits: 0}).format(num);
            targetText.textContent = \Target Operasional Anda Saat Ini: \ Porsi/Hari | HPP Max: \\;
            targetBadge.classList.remove("hidden");
        } catch (e) {
            targetBadge.classList.add("hidden");
        }
    } else {
        targetBadge.classList.add("hidden");
    }
}
updateSopBadge();\n;

js += appendStr;
fs.writeFileSync('js/workspace.js', js);
console.log('workspace.js updated');
