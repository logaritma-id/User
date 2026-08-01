// core/ai/index.js - Public Interface for the AI Subsystem
window.LogaritmaAI = {
    // Legacy context generator (moved from engine)
    generateMetadata: function(entityType) {
        if(window.LogaritmaAIContext) return window.LogaritmaAIContext.generateMetadata(entityType);
        return { _aiMeta: entityType };
    },
    
    // Core Dispatch API
    getContextInfo: function(contextType, contextData) {
        if(window.LogaritmaAIDispatcher) {
            return window.LogaritmaAIDispatcher.dispatch(contextType, contextData);
        }
        return null;
    },
    
    // Core Execution API
    runAction: async function(actionId, contextData) {
        if(window.LogaritmaAIEngine) {
            return await window.LogaritmaAIEngine.executeAction(actionId, contextData);
        }
        return { insight: "AI Engine not initialized", confidence: 0 };
    }
};