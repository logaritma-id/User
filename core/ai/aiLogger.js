// aiLogger.js - Logs AI interactions for auditing
window.LogaritmaAILogger = {
    log: function(worker, action, contextId, result) {
        const entry = {
            id: 'AILOG-' + Date.now(),
            timestamp: new Date().toISOString(),
            worker: worker,
            action: action,
            contextId: contextId,
            confidence: result.confidence || 0
        };
        
        let logs = window.LogaritmaStorage.load('ai_audit_logs') || [];
        logs.push(entry);
        window.LogaritmaStorage.save('ai_audit_logs', logs);
        
        console.log(`[AI Logger] [${entry.timestamp}] ${worker} performed ${action} on ${contextId} (Confidence: ${entry.confidence}%)`);
    }
};