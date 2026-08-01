// mockWebhookSource.js - Simulates an external webhook pinging our EventBus
window.LogaritmaMockWebhook = {
    simulatePaymentSuccess: function(workOrderId, invoiceId) {
        console.log('[MockWebhook] Simulating incoming Webhook from Mayar...');
        
        // Fire the exact same event contract our future backend will fire
        if(window.LogaritmaEventBus) {
            window.LogaritmaEventBus.emit('webhook.payment_success', {
                source: 'mayar',
                work_order_id: workOrderId,
                invoice_id: invoiceId,
                status: 'paid',
                timestamp: new Date().toISOString()
            });
        }
    }
};