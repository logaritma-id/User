document.addEventListener('DOMContentLoaded', () => {
    if (window.LogaritmaRegistryEngine) {
        window.LogaritmaRegistryEngine.init();
        renderServiceRegistry();

        if (window.LogaritmaEventBus) {
            window.LogaritmaEventBus.on('registry.updated', (e) => {
                if (e.type === 'services') renderServiceRegistry();
            });
        }
    }
});

function renderServiceRegistry() {
    const tbody = document.getElementById('tbl-reg-services');
    if (!tbody) return;

    const services = window.LogaritmaRegistryEngine.getAllServices();
    tbody.innerHTML = services.map(s => \
        <tr class="hover:bg-slate-800/50 transition">
            <td class="px-6 py-4 font-mono text-blue-400">\</td>
            <td class="px-6 py-4 font-bold text-white"><i class="fa-solid \ mr-2 text-slate-500"></i>\</td>
            <td class="px-6 py-4 text-slate-400">\</td>
            <td class="px-6 py-4">
                \
            </td>
            <td class="px-6 py-4 text-right">
                <button onclick="toggleServiceStatus('\')" class="text-xs font-bold \ mr-3">
                    \
                </button>
                <button class="text-xs font-bold text-blue-400 hover:text-blue-300">Edit</button>
            </td>
        </tr>
    \).join('');
}

window.toggleServiceStatus = function(id) {
    const service = window.LogaritmaRegistryEngine.getService(id);
    if(service) {
        window.LogaritmaRegistryEngine.updateService(id, { active: !service.active });
        // The event bus will trigger re-render
    }
};
