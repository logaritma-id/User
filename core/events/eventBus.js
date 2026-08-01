window.LogaritmaEventBus = {
    events: {},
    on: function(eventName, callback) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(callback);
    },
    emit: function(eventName, data) {
        if (this.events[eventName]) {
            this.events[eventName].forEach(callback => {
                try {
                    callback(data);
                } catch(e) {
                    console.error('Error in event listener for', eventName, e);
                }
            });
        }
    }
};
