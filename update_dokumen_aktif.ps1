foreach ($file in @("tools\kuliner\index.html","tools\fashion\index.html","tools\percetakan\index.html","tools\pkl\index.html","tools\distributor\index.html")) {
    $content = Get-Content $file -Raw
    
    # Add ID to the element
    $content = $content -replace '<p class=\\"text-sm font-bold text-slate-400\\">Belum di-generate</p>', '<p class=\\"text-sm font-bold text-slate-400\\" id=\\"sidebar-dokumen-aktif\\">Belum di-generate</p>'
    
    # Inject JS after ai-output-container scroll
    $jsInjection = "
                    document.getElementById('ai-output-container').scrollIntoView({ behavior: 'smooth' });
                    
                    const docStatus = document.getElementById('sidebar-dokumen-aktif');
                    if (docStatus) {
                        docStatus.innerText = 'SOP & Panduan Selesai';
                        docStatus.classList.replace('text-slate-400', 'text-emerald-400');
                    }"
    $content = $content -replace 'document\.getElementById\(''ai-output-container''\)\.scrollIntoView\(\{ behavior: ''smooth'' \}\);', $jsInjection
    
    Set-Content $file $content
}
