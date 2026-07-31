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
    trackActivity: async function(whatsapp, featureName = "General") {
        const currentUserStr = localStorage.getItem("logarithm_current_user");
        if(currentUserStr) {
            const user = JSON.parse(currentUserStr);
            user.activity_count = (user.activity_count || 0) + 1;
            user.last_active = new Date().toISOString();
            user.last_feature_opened = featureName;
            localStorage.setItem("logarithm_current_user", JSON.stringify(user));
        }

        if (!db) {
            // Update localStorage fallback
            let leads = JSON.parse(localStorage.getItem("logarithm_admin_leads") || "[]");
            let index = leads.findIndex(l => l.whatsapp === whatsapp || l.wa === whatsapp);
            if(index !== -1) {
                leads[index].activity_count = (leads[index].activity_count || 0) + 1;
                leads[index].last_active = new Date().toISOString();
                leads[index].last_feature_opened = featureName;
                localStorage.setItem("logarithm_admin_leads", JSON.stringify(leads));
            }
            return;
        }

        try {
            await db.collection("leads").doc(whatsapp).set({
                activity_count: firebase.firestore.FieldValue.increment(1),
                last_active: new Date().toISOString(),
                last_feature_opened: featureName
            }, { merge: true });
        } catch (error) {
            console.error("Error tracking activity: ", error);
        }
    },

    // 6. Melacak Pengunjung Unik Harian
    trackVisitor: async function() {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const lastVisit = localStorage.getItem("logaritma_last_visit_date");
        
        if(lastVisit !== today) {
            // Pengunjung baru hari ini
            localStorage.setItem("logaritma_last_visit_date", today);
            
            if(db) {
                try {
                    // Update daily counter
                    const docRef = db.collection("stats").doc("visitors_" + today);
                    const docSnap = await docRef.get();
                    if(!docSnap.exists) {
                        await docRef.set({ date: today, count: 1 });
                    } else {
                        await docRef.update({ count: firebase.firestore.FieldValue.increment(1) });
                    }
                    
                    // Update all-time counter
                    const allTimeRef = db.collection("stats").doc("visitors_alltime");
                    const allTimeSnap = await allTimeRef.get();
                    if(!allTimeSnap.exists) {
                        await allTimeRef.set({ count: 1 });
                    } else {
                        await allTimeRef.update({ count: firebase.firestore.FieldValue.increment(1) });
                    }
                } catch(e) {
                    console.error("Error tracking visitor: ", e);
                }
            }
        }
    },

    // 7. Mengambil Statistik Pengunjung
    getVisitorStats: async function() {
        if(!db) return { today: 0, lastWeek: 0, allTime: 0 };
        
        try {
            const today = new Date().toISOString().split('T')[0];
            const lastWeekDate = new Date();
            lastWeekDate.setDate(lastWeekDate.getDate() - 7);
            const lastWeek = lastWeekDate.toISOString().split('T')[0];
            
            let stats = { today: 0, lastWeek: 0, allTime: 0 };
            
            // Get Today
            const todayDoc = await db.collection("stats").doc("visitors_" + today).get();
            if(todayDoc.exists) stats.today = todayDoc.data().count || 0;
            
            // Get Last Week (Approximate by grabbing exactly 7 days ago, or summing the last 7 days)
            // For simplicity, we just fetch exactly the day 7 days ago.
            const lastWeekDoc = await db.collection("stats").doc("visitors_" + lastWeek).get();
            if(lastWeekDoc.exists) stats.lastWeek = lastWeekDoc.data().count || 0;
            
            // Get All Time
            const allTimeDoc = await db.collection("stats").doc("visitors_alltime").get();
            if(allTimeDoc.exists) stats.allTime = allTimeDoc.data().count || 0;
            
            return stats;
        } catch(e) {
            console.error("Error fetching visitor stats: ", e);
            return { today: 0, lastWeek: 0, allTime: 0 };
        }
    }
};

// Auto-track activity on page load for any logged-in user
document.addEventListener('DOMContentLoaded', () => {
    const track = () => {
        if(!window.LogaritmaDB) return;
        const cuStr = localStorage.getItem("logarithm_current_user");
        if(cuStr && window.LogaritmaDB.trackActivity) {
            try {
                const u = JSON.parse(cuStr);
                const wa = u.wa || u.whatsapp;
                if(wa) {
                    let pageName = "Dashboard / General";
                    const path = window.location.pathname;
                    if(path.includes("/tools/kuliner/")) pageName = "Dashboard Kuliner";
                    else if(path.includes("/tools/fashion/")) pageName = "Dashboard Fashion";
                    else if(path.includes("/tools/percetakan/")) pageName = "Dashboard Percetakan";
                    else if(path.includes("/tools/distributor/")) pageName = "Dashboard Distributor";
                    else if(path.includes("/tools/pkl/")) pageName = "Dashboard PKL";
                    
                    window.LogaritmaDB.trackActivity(wa, pageName);
                }
            } catch(e) {}
        }
    };
    setTimeout(track, 1500); 
});
