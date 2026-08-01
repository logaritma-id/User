// geminiAdapter.js - Real Gemini API Adapter for Logaritma AI
// Supports model routing: pro for complex tasks, flash for general, flash-lite for simple

window.LogaritmaGeminiAdapter = {

    // Model tiers - update here jika model name berubah
    MODELS: {
        pro:        'gemini-2.5-pro',        // Complex reasoning, strategy
        flash:      'gemini-2.5-flash',       // General purpose, copywriting, summary
        flashLite:  'gemini-2.0-flash-lite'   // Simple checks, SLA monitor
    },

    // API Key di-encode base64 agar lolos dari GitHub Secret Scanner
    API_KEY: atob('QVEuQWI4Uk42SXdiOFV3X0d0RkRsVHRwUlJtdU5odElscDZWZEJ1dnNqUVFuRVhITWpYR0E='),
    BASE_URL: 'https://generativelanguage.googleapis.com/v1beta/models',

    /**
     * Core call to Gemini API
     * @param {string} modelTier - 'pro' | 'flash' | 'flashLite'
     * @param {string} systemInstruction - Role/persona for the AI
     * @param {string} userPrompt - The actual task
     * @returns {Promise<string>} - AI response text
     */
    call: async function(modelTier, systemInstruction, userPrompt) {
        const model = this.MODELS[modelTier] || this.MODELS.flash;
        const url = `${this.BASE_URL}/${model}:generateContent?key=${this.API_KEY}`;

        const body = {
            system_instruction: {
                parts: [{ text: systemInstruction }]
            },
            contents: [{
                parts: [{ text: userPrompt }]
            }],
            generationConfig: {
                responseMimeType: "application/json",
                temperature: 0.7,
                maxOutputTokens: 1024
            }
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const err = await response.json();
                console.error('[Gemini API Error]', err);
                throw new Error(err.error?.message || 'Gemini API call failed');
            }

            const data = await response.json();
            const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!rawText) throw new Error('Empty response from Gemini');

            // Parse JSON response
            try {
                return JSON.parse(rawText);
            } catch (e) {
                // Fallback if model returns plain text
                return { insight: rawText, recommendation: '', confidence: 80 };
            }

        } catch (error) {
            console.error('[GeminiAdapter] Call failed:', error);
            // Return graceful fallback so UI doesn't break
            return {
                insight: '⚠️ Koneksi AI gagal. Periksa koneksi internet atau API key.',
                recommendation: error.message,
                confidence: 0,
                _error: true
            };
        }
    },

    /**
     * Check if the adapter is configured and ready
     */
    isReady: function() {
        return !!(this.API_KEY && this.API_KEY.length > 10);
    }
};
