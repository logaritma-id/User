/**
 * Mayar Payment Adapter for Logaritma
 * Implements API Polling instead of Webhooks
 */

const MayarAdapter = {
    // API Key di-obfuscate menggunakan Base64 (atob)
    API_KEY: atob('ZXlKaGJHY2lPaUpTVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SjFjMlZ5U1dRaU9pSm1PR1poWmpjMk5DMHdOVGRrTFRSbE5UZ3RPV1V3TUMwNFpqYzBNelEwWlRBMk1HSWlMQ0poWTJOdmRXNTBTV1FpT2lKaU9EQmtZemhpTmkwME9HVmxMVFEwTkRBdE9UUTFNaTA1WkRBME1HSTJNRE13TldFaUxDSmpjbVZoZEdWa1FYUWlPaUl4TnpnMU5UY3lNek14TmpVd0lpd2ljbTlzWlNJNkltUmxkbVZzYjNCbGNpSXNJbk5qYjNCbElqcDdJbkpsWVdRaU9uUnlkV1VzSW5keWFYUmxJanAwY25WbGZTd2ljM1ZpSWpvaVlXUnRMbmRoY25WdWEyRnljMmxBWjIxaGFXd3VZMjl0SWl3aWJtRnRaU0k2SWxkQlVsVk9TeUJCVWxOSklpd2liR2x1YXlJNkltSmhhVzEzWVhKMWJtdGhjbk5wSWl3aWFYTlRaV3htUkc5dFlXbHVJanBtWVd4elpTd2lhV0YwSWpveE56ZzFOVGN5TXpNeGZRLlNPSlZtQXRseFlUNE1BNUQzMVNCRkx0NnVxaloyU1VGNmJybjRLUGtiejBjS1oyeEZWbzc2WmJDZElQNGlDaXBXbUdvdm91cjZEYl9zdzlrRGVwdmdIZlp6aWRuQktMUkhGbEotRmNlUTlnb0U0TzM4MWF5TUpnNk84ZUl5ZDh2Wl93b3B2Z0djUnIzb2NoaTQ0LThBWnNicjMxalV5bktWdzNzbHhva09Ka0JDNUo1bWxISWl3VC0yblhLeThNbmZPQl8wRVF0Y09reG5DWkRJQ2ZfRG5KT0lCZkRjakM5Y19YTVhTQ0dPN1I5REJaRzhLQXJ0b3hMbWx1TVdVU3JnQ3FjckdlbWR3dkVDUmk5S2hCVnhaNTl4RnR5U3JxV1NHNGlMdHU2dGd0dmtVODVoM0JlaWREeFREREMydHdoM09XUkRJUEE2ckowQUstY0Fpem04dw=='),
    BASE_URL: 'https://api.mayar.id/hl/v1',

    /**
     * Create a payment link using Mayar API
     */
    async createPaymentLink(payloadData) {
        try {
            const payload = {
                name: payloadData.clientData?.name || "Pelanggan Logaritma",
                email: payloadData.clientData?.email || "customer@logaritma.id",
                mobile: payloadData.clientData?.whatsapp || "081234567890",
                amount: payloadData.finances?.total || 0,
                description: `Pembayaran Layanan Logaritma (${payloadData.package?.name || 'Paket'})`,
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
                const errorText = await response.text();
                throw new Error(`Mayar API Error (${response.status}): ${errorText}`);
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
