// ai_ui.js - Logic for Logaritma AI Dashboard Panel
window.LogaritmaAIUI = {
    panelOpen: true,
    
    init: function() {
        // Load layout state
        const savedState = window.LogaritmaStorage.load('ai_panel_state');
        if(savedState !== null) {
            this.panelOpen = savedState.open;
        }
        this.applyPanelState();
        
        // Listen to context changes
        window.LogaritmaEventBus.on('context.changed', (ctx) => {
            this.handleContextChange(ctx);
        });
        
        // Listen to proactive AI generation
        window.LogaritmaEventBus.on('ai.command_center.ready', (result) => {
            this.renderResult(result);
        });
        
        // Initial generic context
        this.handleContextChange({ type: 'dashboard', data: {} });
        
        // Trigger the Proactive Hook manually for the first load
        window.LogaritmaEventBus.emit('dashboard.opened', {});
    },
    
    togglePanel: function() {
        this.panelOpen = !this.panelOpen;
        window.LogaritmaStorage.save('ai_panel_state', { open: this.panelOpen });
        this.applyPanelState();
    },
    
    applyPanelState: function() {
        const panel = document.getElementById('ai-panel');
        const icon = document.getElementById('ai-toggle-icon');
        
        if(this.panelOpen) {
            panel.classList.remove('w-0', 'overflow-hidden', 'opacity-0', 'invisible');
            panel.classList.add('w-80');
            if(icon) icon.className = 'fa-solid fa-angles-right';
        } else {
            panel.classList.remove('w-80');
            panel.classList.add('w-0', 'overflow-hidden', 'opacity-0', 'invisible');
            if(icon) icon.className = 'fa-solid fa-angles-left';
        }
    },
    
    handleContextChange: async function(ctx) {
        if(!window.LogaritmaAI) return;
        
        // 1. Get info from dispatcher (AI-First logic)
        const dispatchInfo = window.LogaritmaAI.getContextInfo(ctx.type, ctx.data);
        if(!dispatchInfo) return;
        
        // 2. Render Header
        if(ctx.type === 'dashboard') {
            document.getElementById('ai-context-title').innerHTML = '<span class="text-blue-400">🤖 LOGARITMA COMMAND CENTER</span>';
        } else {
            document.getElementById('ai-context-title').textContent = ctx.data.id ? `Work Order ${ctx.data.id}` : 'Logaritma AI';
        }
        
        document.getElementById('ai-context-role').innerHTML = `<i class="fa-solid fa-user-tie"></i> ${dispatchInfo.workerProfile.role}`;
        
        // 3. Render Actions
        const actionsContainer = document.getElementById('ai-actions-container');
        actionsContainer.innerHTML = dispatchInfo.actions.map(act => `
            <button onclick="window.LogaritmaAIUI.triggerAction('${act.id}', ${JSON.stringify(ctx.data).replace(/"/g, '&quot;')})" class="w-full text-left bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-bold p-3 rounded-lg transition border border-slate-700 hover:border-slate-500 flex items-center gap-3 shadow-sm">
                <div class="w-6 text-center text-blue-400"><i class="fa-solid ${act.icon}"></i></div>
                ${act.label}
            </button>
        `).join('');
        
        // Optional: Auto-trigger a default action to greet
        if(dispatchInfo.actions.length > 0) {
            this.triggerAction(dispatchInfo.actions[0].id, ctx.data);
        }
    },
    
    triggerAction: async function(actionId, contextData) {
        // Show Loading
        document.getElementById('ai-loading').classList.remove('hidden');
        
        // AI-First Execution
        const result = await window.LogaritmaAI.runAction(actionId, contextData);
        
        this.renderResult(result);
    },
    
    renderResult: function(result) {
        // Hide Loading
        document.getElementById('ai-loading').classList.add('hidden');
        
        // Update Insight Box
        const box = document.getElementById('ai-insight-box');
        const conf = document.getElementById('ai-confidence');
        
        box.innerHTML = `<p class="mb-2">${result.insight}</p>`;
        if(result.recommendation) {
            box.innerHTML += `<div class="mt-3 pt-3 border-t border-blue-500/20"><p class="text-xs font-bold text-blue-400 mb-1">RECOMMENDATION</p><p class="text-xs text-slate-400">${result.recommendation}</p></div>`;
        }
        
        // Update Confidence Indicator
        conf.textContent = `${result.confidence}% Confidence`;
        if(result.confidence > 90) conf.className = 'text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20';
        else if(result.confidence > 75) conf.className = 'text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20';
        else conf.className = 'text-[10px] font-bold text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    window.LogaritmaAIUI.init();
});
