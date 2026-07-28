// ==========================================
// FIREBASE DATABASE CONFIGURATION
// ==========================================

const firebaseConfig = {
    apiKey: "AIzaSyAFMnyib2wCOC0Lzo9Z84Phs5Eqmlc-VCQ",
    authDomain: "logaritma-id.firebaseapp.com",
    projectId: "logaritma-id",
    storageBucket: "logaritma-id.firebasestorage.app",
    messagingSenderId: "343719249271",
    appId: "1:343719249271:web:12fb2d7db1236180970d72",
    measurementId: "G-9YKVKH7QN9"
};

// Initialize Firebase only if config is set (preventing crash on empty config)
let db = null;
if (firebaseConfig.apiKey !== "GANTI_DENGAN_API_KEY") {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
}

// Helper Functions untuk Global Scope
window.LogaritmaDB = {
    // 1. Menyimpan Lead Baru dari Form Diagnostik
    saveLead: async function(leadData) {
        if (!db) {
            console.warn("Firebase belum dikonfigurasi. Menggunakan localStorage sementara.");
            // Fallback localStorage
            let leads = JSON.parse(localStorage.getItem("logarithm_admin_leads") || "[]");
            leads.unshift(leadData);
            localStorage.setItem("logarithm_admin_leads", JSON.stringify(leads));
            return leadData;
        }

        try {
            // Kita gunakan WA sebagai Document ID agar unik
            await db.collection("leads").doc(leadData.whatsapp).set(leadData);
            return leadData;
        } catch (error) {
            console.error("Error saving lead: ", error);
            throw error;
        }
    },

    // 2. Mengambil Semua Lead (Untuk Admin Dashboard)
    getAllLeads: async function() {
        if (!db) {
            return JSON.parse(localStorage.getItem("logarithm_admin_leads") || "[]");
        }

        try {
            const snapshot = await db.collection("leads").orderBy("tanggal", "desc").get();
            let leads = [];
            snapshot.forEach(doc => {
                leads.push(doc.data());
            });
            return leads;
        } catch (error) {
            console.error("Error fetching leads: ", error);
            return [];
        }
    },

    // 3. Update Status Lead (Oleh Admin)
    updateLeadStatus: async function(whatsapp, newStatus) {
        if (!db) {
            let leads = JSON.parse(localStorage.getItem("logarithm_admin_leads") || "[]");
            let index = leads.findIndex(l => l.whatsapp === whatsapp || l.wa === whatsapp);
            if(index !== -1) {
                leads[index].status = newStatus;
                localStorage.setItem("logarithm_admin_leads", JSON.stringify(leads));
            }
            return;
        }

        try {
            await db.collection("leads").doc(whatsapp).update({
                status: newStatus
            });
        } catch (error) {
            console.error("Error updating status: ", error);
        }
    },

    // 4. Mengecek User via Login
    getUserByWA: async function(whatsapp) {
        if (!db) {
            let leads = JSON.parse(localStorage.getItem("logarithm_admin_leads") || "[]");
            return leads.find(l => l.whatsapp === whatsapp || l.wa === whatsapp) || null;
        }

        try {
            const doc = await db.collection("leads").doc(whatsapp).get();
            if (doc.exists) {
                return doc.data();
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error fetching user: ", error);
            return null;
        }
    },

    // 5. Mencatat Aktivitas Member (Kalkulator, SOP, Premium)
    trackActivity: async function(whatsapp, activityType) {
        const currentUserStr = localStorage.getItem("logarithm_current_user");
        if(currentUserStr) {
            const user = JSON.parse(currentUserStr);
            user.activity_count = (user.activity_count || 0) + 1;
            user.last_active = new Date().toISOString();
            localStorage.setItem("logarithm_current_user", JSON.stringify(user));
        }

        if (!db) {
            // Update localStorage fallback
            let leads = JSON.parse(localStorage.getItem("logarithm_admin_leads") || "[]");
            let index = leads.findIndex(l => l.whatsapp === whatsapp || l.wa === whatsapp);
            if(index !== -1) {
                leads[index].activity_count = (leads[index].activity_count || 0) + 1;
                leads[index].last_active = new Date().toISOString();
                localStorage.setItem("logarithm_admin_leads", JSON.stringify(leads));
            }
            return;
        }

        try {
            await db.collection("leads").doc(whatsapp).set({
                activity_count: firebase.firestore.FieldValue.increment(1),
                last_active: new Date().toISOString()
            }, { merge: true });
        } catch (error) {
            console.error("Error tracking activity: ", error);
        }
    }
};
