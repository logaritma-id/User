// notifications.js - Manages Inbox, Toasts, and Badges
window.LogaritmaNotificationCenter = {
    inbox: [],
    
    init: function() {
        if(window.LogaritmaStorage) {
            this.inbox = window.LogaritmaStorage.load('notifications') || [];
        }
        
        // Listen to EventBus for alerts
        if(window.LogaritmaEventBus) {
            window.LogaritmaEventBus.on('notification.send', (data) => {
                this.addNotification(data.title, data.message, data.type);
            });
        }
    },
    
    addNotification: function(title, message, type = 'info') {
        const notif = {
            id: 'NOTIF-' + Date.now(),
            timestamp: new Date().toISOString(),
            title: title,
            message: message,
            type: type, // info, success, warning, error
            read: false
        };
        
        this.inbox.unshift(notif);
        if(this.inbox.length > 50) this.inbox.pop();
        
        if(window.LogaritmaStorage) {
            window.LogaritmaStorage.save('notifications', this.inbox);
        }
        
        this.showToast(notif);
        this.updateBadge();
    },
    
    showToast: function(notif) {
        if(window.Swal) {
            let color = '#3b82f6';
            if(notif.type === 'success') color = '#10b981';
            if(notif.type === 'warning') color = '#f59e0b';
            if(notif.type === 'error') color = '#ef4444';
            
            Swal.fire({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 4000,
                timerProgressBar: true,
                title: notif.title,
                text: notif.message,
                background: '#1e293b',
                color: '#f8fafc',
                icon: notif.type === 'info' ? undefined : notif.type,
                iconColor: color
            });
        } else {
            console.log(`[TOAST] ${notif.title}: ${notif.message}`);
        }
    },
    
    updateBadge: function() {
        const unread = this.inbox.filter(n => !n.read).length;
        const badgeEl = document.getElementById('notif-badge');
        if(badgeEl) {
            if(unread > 0) {
                badgeEl.textContent = unread;
                badgeEl.classList.remove('hidden');
            } else {
                badgeEl.classList.add('hidden');
            }
        }
    },
    
    markAllRead: function() {
        this.inbox.forEach(n => n.read = true);
        if(window.LogaritmaStorage) window.LogaritmaStorage.save('notifications', this.inbox);
        this.updateBadge();
    }
};