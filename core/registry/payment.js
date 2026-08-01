window.DefaultPaymentProviders = [
    { id: 'PAY001', name: 'Mayar', provider: 'mayar', active: true, _ai: window.LogaritmaAI ? window.LogaritmaAI.generateMetadata('payment_provider') : {} },
    { id: 'PAY002', name: 'Midtrans', provider: 'midtrans', active: false, _ai: window.LogaritmaAI ? window.LogaritmaAI.generateMetadata('payment_provider') : {} },
    { id: 'PAY003', name: 'Xendit', provider: 'xendit', active: false, _ai: window.LogaritmaAI ? window.LogaritmaAI.generateMetadata('payment_provider') : {} }
];
