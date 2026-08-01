window.LogaritmaLoggingEngine = {
    logActivity: function(workOrderId, type, message) {
        // Fallback sync version for legacy components
        if (!window.LogaritmaWorkOrderEngine.getWorkOrder) return;
        Promise.resolve(window.LogaritmaWorkOrderEngine.getWorkOrder(workOrderId)).then(wo => {
            if (wo) {
                wo.activityLog = wo.activityLog || [];
                wo.activityLog.push({ type: type, msg: message, time: new Date().toISOString() });
                window.LogaritmaWorkOrderEngine.saveWorkOrder(wo);
            }
        });
    },
    logActivityAsync: async function(workOrderId, type, message) {
        if (!window.LogaritmaWorkOrderEngine.getWorkOrder) return;
        const wo = await window.LogaritmaWorkOrderEngine.getWorkOrder(workOrderId);
        if (wo) {
            wo.activityLog = wo.activityLog || [];
            wo.activityLog.push({ type: type, msg: message, time: new Date().toISOString() });
            await window.LogaritmaWorkOrderEngine.saveWorkOrder(wo);
        }
    }
};
