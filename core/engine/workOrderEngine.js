window.LogaritmaWorkOrderEngine = {
    generateId: function() {
        const date = new Date();
        const dStr = date.getFullYear() + ('0'+(date.getMonth()+1)).slice(-2) + ('0'+date.getDate()).slice(-2);
        const rStr = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return 'WO-' + dStr + '-' + rStr;
    },

    createDraft: function(payload) {
        const wo = {
            id: payload.id || this.generateId(),
            serviceId: payload.serviceId || (payload.service ? payload.service.id : null),
            workflowId: payload.workflowId,
            checklistId: payload.checklistId,
            priceId: payload.priceId || (payload.package ? payload.package.id : null),
            status: payload.status || 'draft',
            client: payload.client || payload.clientData || {},
            brief: payload.brief || {},
            assets: payload.assets || {},
            finances: payload.finances || { total: 0, adsBudget: 0, fee: 0 },
            metrics: { spent: 0, leads: 0, reach: 0, impressions: 0, clicks: 0, reportUrl: '' },
            checklist: payload.checklist || [],
            internalNotes: payload.internalNotes || '',
            activityLog: [],
            createdAt: new Date().toISOString(),
            _ai: window.LogaritmaAI ? window.LogaritmaAI.generateMetadata('workorder') : {}
        };
        
        let allWo = window.LogaritmaStorage.load('logaritma_workorders') || [];
        allWo.push(wo);
        window.LogaritmaStorage.save('logaritma_workorders', allWo);
        
        window.LogaritmaLoggingEngine.logActivity(wo.id, 'system', 'Work Order created as ' + wo.status);
        if(window.LogaritmaEventBus) window.LogaritmaEventBus.emit('workorder.created', wo);
        
        return wo;
    },

    getAllWorkOrders: function() {
        return window.LogaritmaStorage.load('logaritma_workorders') || [];
    },

    getWorkOrder: function(id) {
        return this.getAllWorkOrders().find(wo => wo.id === id);
    },

    saveWorkOrder: function(woToSave) {
        let allWo = this.getAllWorkOrders();
        const idx = allWo.findIndex(w => w.id === woToSave.id);
        if(idx > -1) {
            allWo[idx] = woToSave;
            window.LogaritmaStorage.save('logaritma_workorders', allWo);
            if(window.LogaritmaEventBus) window.LogaritmaEventBus.emit('workorder.updated', woToSave);
        }
    },

    updateStatus: function(id, newStatus) {
        const wo = this.getWorkOrder(id);
        if(wo) {
            wo.status = newStatus;
            this.saveWorkOrder(wo);
            window.LogaritmaLoggingEngine.logActivity(id, 'system', 'Status changed to: ' + newStatus);
        }
    },
    
    init: function() {
        if(window.LogaritmaEventBus) {
            window.LogaritmaEventBus.on('webhook.payment_success', (payload) => {
                console.log('[WorkOrderEngine] Webhook payment_success received for:', payload.work_order_id);
                
                // Find WO. Wait, the Draft payload we sent didn't actually create a real engine ID if we just passed the object, but processPayment passed the whole payload including id.
                // In our current implementation, createDraft creates a new ID. Let's make sure updateStatus can find it by passing the explicit ID generated, or updating the mock to use payload.work_order_id.
                // Actually, the dummy UI used payload.id (the dummy ORD-BP-xxx ID) but workOrderEngine.createDraft ignores it and makes a new WO-xxx ID.
                // I need to fix createDraft to respect an existing ID if provided, or find it by some reference. For this demo, let's update createDraft to respect payload.id if provided.
                
                this.updateStatus(payload.work_order_id, 'waiting_setup');
                
                if(window.LogaritmaNotificationCenter) {
                    window.LogaritmaNotificationCenter.addNotification(
                        'Payment Verified', 
                        'Invoice ' + payload.invoice_id + ' has been paid. Status updated to payment_verified.', 
                        'success'
                    );
                }
            });
        }
    }
};

// Auto-init
document.addEventListener('DOMContentLoaded', () => {
    if(window.LogaritmaWorkOrderEngine.init) {
        window.LogaritmaWorkOrderEngine.init();
    }
});
