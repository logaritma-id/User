window.LogaritmaWorkOrderEngine = {
    generateId: function() {
        const date = new Date();
        const dStr = date.getFullYear() + ('0'+(date.getMonth()+1)).slice(-2) + ('0'+date.getDate()).slice(-2);
        const rStr = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return 'WO-' + dStr + '-' + rStr;
    },

    createDraft: async function(payload) {
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
        
        if (window.LogaritmaDB && window.LogaritmaDB.db) {
            try {
                await window.LogaritmaDB.db.collection("workorders").doc(wo.id).set(wo);
            } catch (e) {
                console.error("Firebase error saving WO:", e);
                this._saveLocal(wo);
            }
        } else {
            this._saveLocal(wo);
        }
        
        // Use async logging
        if (window.LogaritmaLoggingEngine && window.LogaritmaLoggingEngine.logActivityAsync) {
            await window.LogaritmaLoggingEngine.logActivityAsync(wo.id, 'system', 'Work Order created as ' + wo.status);
        }
        if(window.LogaritmaEventBus) window.LogaritmaEventBus.emit('workorder.created', wo);
        
        return wo;
    },

    _saveLocal: function(wo) {
        let allWo = window.LogaritmaStorage.load('logaritma_workorders') || [];
        const idx = allWo.findIndex(w => w.id === wo.id);
        if(idx > -1) allWo[idx] = wo;
        else allWo.push(wo);
        window.LogaritmaStorage.save('logaritma_workorders', allWo);
    },

    getAllWorkOrders: async function() {
        if (window.LogaritmaDB && window.LogaritmaDB.db) {
            try {
                const snapshot = await window.LogaritmaDB.db.collection("workorders").get();
                let allWo = [];
                snapshot.forEach(doc => allWo.push(doc.data()));
                return allWo;
            } catch (e) {
                console.error("Firebase error loading WOs:", e);
                return window.LogaritmaStorage.load('logaritma_workorders') || [];
            }
        }
        return window.LogaritmaStorage.load('logaritma_workorders') || [];
    },

    getWorkOrder: async function(id) {
        if (window.LogaritmaDB && window.LogaritmaDB.db) {
            try {
                const doc = await window.LogaritmaDB.db.collection("workorders").doc(id).get();
                if (doc.exists) return doc.data();
            } catch (e) {
                console.error("Firebase error getting WO:", e);
            }
        }
        const allWo = window.LogaritmaStorage.load('logaritma_workorders') || [];
        return allWo.find(wo => wo.id === id);
    },

    saveWorkOrder: async function(woToSave) {
        if (window.LogaritmaDB && window.LogaritmaDB.db) {
            try {
                await window.LogaritmaDB.db.collection("workorders").doc(woToSave.id).set(woToSave);
            } catch (e) {
                console.error("Firebase error saving WO:", e);
                this._saveLocal(woToSave);
            }
        } else {
            this._saveLocal(woToSave);
        }
        if(window.LogaritmaEventBus) window.LogaritmaEventBus.emit('workorder.updated', woToSave);
    },

    updateStatus: async function(id, newStatus) {
        const wo = await this.getWorkOrder(id);
        if(wo) {
            wo.status = newStatus;
            await this.saveWorkOrder(wo);
            if (window.LogaritmaLoggingEngine && window.LogaritmaLoggingEngine.logActivityAsync) {
                await window.LogaritmaLoggingEngine.logActivityAsync(id, 'system', 'Status changed to: ' + newStatus);
            }
        }
    },
    
    init: function() {
        if(window.LogaritmaEventBus) {
            window.LogaritmaEventBus.on('webhook.payment_success', async (payload) => {
                console.log('[WorkOrderEngine] Webhook payment_success received for:', payload.work_order_id);
                await this.updateStatus(payload.work_order_id, 'waiting_setup');
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
