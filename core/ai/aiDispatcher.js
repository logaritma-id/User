// aiDispatcher.js - Routes context to appropriate AI Workers
window.LogaritmaAIDispatcher = {
    dispatch: function(contextType, contextData) {
        let matchedWorker = null;
        let availableActions = [];
        
        switch(contextType) {
            case 'work_order_draft':
                matchedWorker = 'brief_analyzer';
                availableActions = [
                    { id: 'analyze_brief', label: 'Analisis Brief', icon: 'fa-magnifying-glass' },
                    { id: 'generate_copy', label: 'Buat Copywriting', icon: 'fa-pen-nib' }
                ];
                break;
            case 'work_order_active':
                matchedWorker = 'ads_strategist';
                availableActions = [
                    { id: 'strategy_recommendation', label: 'Strategi Optimasi', icon: 'fa-lightbulb' },
                    { id: 'check_sla', label: 'Cek SLA', icon: 'fa-clock' }
                ];
                break;
            case 'dashboard':
            default:
                matchedWorker = 'owner_assistant';
                availableActions = [
                    { id: 'daily_summary', label: 'Ringkasan Harian', icon: 'fa-calendar-day' }
                ];
                break;
        }
        
        return {
            workerId: matchedWorker,
            workerProfile: window.LogaritmaPromptRegistry ? window.LogaritmaPromptRegistry[matchedWorker] : { role: 'AI Assistant' },
            actions: availableActions
        };
    }
};