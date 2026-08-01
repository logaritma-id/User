// aiEngine.js - Core orchestrator for AI operations
window.LogaritmaAIEngine = {
    init: function() {
        if(window.LogaritmaEventBus) {
            window.LogaritmaEventBus.on('work_order.created', async (data) => {
                // Ignore draft creation, we wait for payment verified
            });
            
            window.LogaritmaEventBus.on('workorder.updated', async (data) => {
                // Proactive hook: AI automatically creates a brief summary after payment
                if(data.status === 'payment_verified') {
                    console.log('[AI Proactive Hook] Work Order Paid, analyzing brief...');
                    const result = await this.executeAction('analyze_brief', data);
                    if(window.LogaritmaKnowledgeBase) {
                        window.LogaritmaKnowledgeBase.saveAsset('report_summary', 'Automated Brief: ' + data.id, result.insight);
                    }
                    if(window.LogaritmaNotificationCenter) {
                        window.LogaritmaNotificationCenter.addNotification('AI Analysis Complete', 'Brief for ' + data.id + ' has been analyzed automatically.', 'success');
                    }
                }
            });
            
            window.LogaritmaEventBus.on('dashboard.opened', async (data) => {
                // Proactive hook: Generate Daily Summary
                console.log('[AI Proactive Hook] Dashboard Opened, generating daily summary...');
                const result = await this.executeAction('daily_summary', { id: 'global' });
                // We'll dispatch this to the UI
                window.LogaritmaEventBus.emit('ai.command_center.ready', result);
            });
        }
    },
    
    executeAction: async function(actionId, contextData) {
        // AI First Architecture: Resolves action asynchronously (Mocked delay)
        return new Promise((resolve) => {
            setTimeout(() => {
                let result = {
                    insight: "Action not recognized.",
                    recommendation: "",
                    confidence: 0
                };
                let workerId = 'system';
                
                try {
                    const workers = window.LogaritmaAIWorkers;
                    
                    switch(actionId) {
                        case 'analyze_brief':
                            workerId = 'brief_analyzer';
                            result = workers.brief_analyzer.analyze(contextData);
                            break;
                        case 'generate_copy':
                            workerId = 'copywriter';
                            result = workers.copywriter.generate(contextData);
                            break;
                        case 'strategy_recommendation':
                            workerId = 'ads_strategist';
                            result = workers.ads_strategist.recommend_strategy(contextData);
                            break;
                        case 'check_sla':
                            workerId = 'operations_manager';
                            result = workers.operations_manager.check_sla(contextData);
                            break;
                        case 'daily_summary':
                            workerId = 'owner_assistant';
                            result = workers.owner_assistant.daily_brief(contextData);
                            break;
                    }
                } catch(e) {
                    console.error("AI Engine Execution Error:", e);
                }
                
                // Log the action
                if(window.LogaritmaAILogger) {
                    window.LogaritmaAILogger.log(workerId, actionId, contextData.id || 'global', result);
                }
                
                resolve(result);
            }, 1200); // Mock processing time
        });
    }
};