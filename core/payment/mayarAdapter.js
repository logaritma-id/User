/**
 * Mayar Payment Adapter for Logaritma
 * Implements API Polling instead of Webhooks
 */

const MayarAdapter = {
    // API Key di-obfuscate menggunakan Base64 (atob)
    API_KEY: atob('ZXlKaGJHY2lPaUpTVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SjFjMlZ5U1dRaU9pSm1PR1poWmpoMk5DMDdOVGRrTFRSbE5UZ3RPV1V3TUMwNFpqYzBNelEwWlRBMk1HSWlMQ0poWTJOdmRXNTBTV1FpT2lKaU9EQmtZMjhpTmkwME9HVmxMVFEwTkRBdE9UUTFNaTA1WkRBME1HSTJNMEl3TldFaUxDSmpjbVZoZEdWa1FYSWlPaUl4TnpnMU5UY3lNel14TmpVd0lpd2ljbTlzWlNJNkltaGxkR2hsYm5Rb0lpd2ljMk52Y0dVaU9pSmZNV1ZqZFdWeWVTSTZJSFJ5ZFdVc0luZHlhWFJsSWpwYmJXRm5lU2I5LmliOWx2a2xub2xtRklYV0xibGhtX212ZzYyNmpvYkUxcWVHbzBiTkU1SDFmWW5wWWxObVRjWk0tdkxWM0Nrb00wTml6YW0yOG9tN2FwLUwyUWVZeV8yTW5tZDFYdWx4UEd4d3J2R3M0b19PcGNHb1FaUWxKcmZfbDBOMWRoWG1Qamw5Y3pWOG1XbmlPMjhsTVRIVmxEZnFZZG1rVW9NUXRUVlhOV1h5T1VlWDRGdmQzX0k1OEVzSjdtdU0wX3BRX0FwLXFTdXRfSUhzY21aX1dIUXpBcU9pUXZYTFN0MmpPajMyX012ck8xdE9yV0lJOTJ1Ums4cjdsYWNlUzlnQnVaWnF5eV9wUFVtb09lQmlrWVRRSm96U2N6MFlid01wNGhhMW9sSllmU2lPazB4V3J1OFAxV19HdVpkMWZPMDBpZVg4c2ZMVmRjVkhmQzdrYndPcjdaT2Zf'),
    BASE_URL: 'https://api.mayar.id/hl/v1',

    /**
     * Create a payment link using Mayar API
     */
    async createPaymentLink(orderData) {
        try {
            const payload = {
                name: orderData.customer.name || "Pelanggan Logaritma",
                email: orderData.customer.email || "customer@logaritma.id",
                mobile: orderData.customer.phone || "081234567890",
                amount: orderData.summary.total,
                description: `Pembayaran Layanan Logaritma (${orderData.service.id} - ${orderData.package.id})`,
                // Expired in 24 hours
                expiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
            };

            const response = await fetch(`${this.BASE_URL}/payment/create`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`Mayar API Error: ${response.statusText}`);
            }

            const data = await response.json();
            return {
                success: true,
                paymentId: data.data.id,
                checkoutUrl: data.data.link
            };
        } catch (error) {
            console.error("Mayar Create Payment Error:", error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Check payment status
     */
    async checkPaymentStatus(paymentId) {
        try {
            // Using transaction check API
            const response = await fetch(`${this.BASE_URL}/payment/${paymentId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.API_KEY}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to check status');
            }

            const data = await response.json();
            // Mayar status usually PAID or SETTLED
            const status = data.data.status;
            return status === 'PAID' || status === 'SETTLED' || status === 'COMPLETED';
        } catch (error) {
            console.error("Mayar Status Check Error:", error);
            return false;
        }
    },

    /**
     * Start Polling for payment status
     */
    startPolling(paymentId, onSuccess) {
        // Poll every 5 seconds
        const interval = setInterval(async () => {
            const isPaid = await this.checkPaymentStatus(paymentId);
            if (isPaid) {
                clearInterval(interval);
                onSuccess();
            }
        }, 5000);

        // Save interval ID to allow cancellation if user navigates away
        this.currentPolling = interval;
    },

    stopPolling() {
        if (this.currentPolling) {
            clearInterval(this.currentPolling);
            this.currentPolling = null;
        }
    }
};

window.MayarAdapter = MayarAdapter;
