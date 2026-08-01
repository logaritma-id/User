// mayarAdapter.js - Adapter for Mayar Payment Gateway
window.LogaritmaMayarAdapter = {
    createInvoice: function(workOrder) {
        console.log('[MayarAdapter] Creating invoice for WO:', workOrder.id);
        
        // Simulating the API response from Mayar
        const dummyPaymentUrl = 'https://mayar.id/pay/dummy-' + workOrder.id;
        
        return {
            success: true,
            invoice_id: 'MYR-' + Date.now(),
            payment_url: dummyPaymentUrl,
            amount: workOrder.total || 0
        };
    }
};