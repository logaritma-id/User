// aiEngine.js - Core orchestrator for AI operations (Live - Gemini API)
window.LogaritmaAIEngine = {
    init: function() {
        if(window.LogaritmaEventBus) {
            window.LogaritmaEventBus.on('workorder.updated', async (data) => {
                if(data.status === 'payment_verified') {
                    console.log('[AI Proactive Hook] Work Order Paid, analyzing brief...');
                    const result = await this.executeAction('analyze_brief', data);
                    if(window.LogaritmaKnowledgeBase) {
                        window.LogaritmaKnowledgeBase.saveAsset('report_summary', 'Auto Brief: ' + data.id, result.insight);
                    }
                    if(window.LogaritmaNotificationCenter) {
                        window.LogaritmaNotificationCenter.addNotification(
                            'AI Analysis Complete',
                            'Brief untuk ' + data.id + ' telah dianalisis oleh Gemini AI.',
                            'success'
                        );
                    }
                }
            });

            window.LogaritmaEventBus.on('dashboard.opened', async (data) => {
                console.log('[AI Proactive Hook] Dashboard dibuka, menghasilkan daily summary...');
                const result = await this.executeAction('daily_summary', { id: 'global' });
                window.LogaritmaEventBus.emit('ai.command_center.ready', result);
            });
        }
    },

    executeAction: async function(actionId, contextData) {
        // Check Gemini adapter is ready
        if (!window.LogaritmaGeminiAdapter || !window.LogaritmaGeminiAdapter.isReady()) {
            console.warn('[AI Engine] Gemini adapter not ready, using fallback');
            return { insight: 'AI tidak tersedia.', recommendation: '', confidence: 0 };
        }

        const workers = window.LogaritmaAIWorkers;
        let result = { insight: 'Aksi tidak dikenali.', recommendation: '', confidence: 0 };
        let workerId = 'system';

        try {
            switch(actionId) {
                case 'analyze_brief':
                    workerId = 'brief_analyzer';
                    result = await workers.brief_analyzer.analyze(contextData);
                    break;
                case 'generate_copy':
                    workerId = 'copywriter';
                    result = await workers.copywriter.generate(contextData);
                    break;
                case 'strategy_recommendation':
                    workerId = 'ads_strategist';
                    result = await workers.ads_strategist.recommend_strategy(contextData);
                    break;
                case 'analyze_report':
                    workerId = 'report_analyst';
                    result = await workers.report_analyst.analyze(contextData);
                    break;
                case 'check_sla':
                    workerId = 'operations_manager';
                    result = await workers.operations_manager.check_sla(contextData);
                    break;
                case 'daily_summary':
                    workerId = 'owner_assistant';
                    result = await workers.owner_assistant.daily_brief(contextData);
                    break;
            }
        } catch(e) {
            console.error('[AI Engine] Execution Error:', e);
            result = {
                insight: '⚠️ Terjadi kesalahan saat menghubungi AI.',
                recommendation: e.message,
                confidence: 0,
                _error: true
            };
        }

        // Log the action
        if(window.LogaritmaAILogger) {
            window.LogaritmaAILogger.log(workerId, actionId, contextData.id || 'global', result);
        }

        return result;
    }
};