window.LogaritmaLoggingEngine = {
    logActivity: function(workOrderId, type, message) {
        // In real app, save to a separate DB collection
        // Here we just attach it to the work order
        const wo = window.LogaritmaWorkOrderEngine.getWorkOrder(workOrderId);
        if (wo) {
            wo.activityLog = wo.activityLog || [];
            wo.activityLog.push({
                type: type,
                msg: message,
                time: new Date().toISOString()
            });
            window.LogaritmaWorkOrderEngine.saveWorkOrder(wo);
        }
    }
};
