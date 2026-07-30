$jsLogic = "
            // Premium Access Logic
            const isPremium = localStorage.getItem('is_premium') === 'true';
            
            if (isPremium) {
                // Unlock UI
                document.querySelectorAll('.trigger-paywall').forEach(btn => btn.style.display = 'none');
                
                // Update Status
                const statusBadge = document.querySelector('.bg-slate-800.border-slate-700.text-xs');
                if (statusBadge) {
                    statusBadge.innerHTML = '<span class=\\"w-2 h-2 rounded-full bg-emerald-400\\"></span>STATUS: PREMIUM PRO';
                    statusBadge.classList.replace('text-slate-300', 'text-emerald-400');
                    statusBadge.classList.replace('bg-slate-800', 'bg-emerald-900/40');
                }
                
                // Unlock Uji Dampak
                const ujiDampak = document.getElementById('uji-dampak');
                if (ujiDampak) {
                    ujiDampak.classList.remove('opacity-80');
                    ujiDampak.querySelector('.text-3xl').innerText = '?';
                    ujiDampak.querySelector('h2').innerText = 'Uji Dampak Kegiatan Terbuka';
                    ujiDampak.querySelector('p').innerText = 'Fitur kalkulasi LTM akan segera rilis di versi berikutnya.';
                }
                
                // Update Lisensi Box
                const lisensiText = document.querySelector('.text-\\\\[10px\\\\].text-slate-400.text-right');
                if (lisensiText) {
                    lisensiText.innerText = 'Unlimited Usage';
                    document.querySelector('.bg-emerald-500.h-1\\\\.5').style.width = '100%';
                }
            } else {
                document.querySelectorAll('.trigger-paywall').forEach(btn => {
                    btn.addEventListener('click', () => {
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
"

foreach ($file in @("tools\kuliner\index.html","tools\fashion\index.html","tools\percetakan\index.html","tools\pkl\index.html","tools\distributor\index.html")) {
    $content = Get-Content $file -Raw
    
    if ($content -notmatch "Premium Access Logic") {
        $content = $content -replace '(?s)document\.addEventListener\(''DOMContentLoaded'', \(\) => \{', "document.addEventListener('DOMContentLoaded', () => {`r`n$jsLogic`r`n"
        Set-Content $file $content
    }
}
Write-Host "Premium logic injected."
