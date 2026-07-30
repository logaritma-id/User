// Konfigurasi Kategori Industri untuk Dashboard Logaritma
const CATEGORY_CONFIG = {
    kuliner: {
        id: "kuliner",
        name: "Kuliner & F&B",
        icon: "🍔",
        unit: "Porsi",
        description: "Manajemen HPP, Food Waste, Gramasi, dan Upselling Kasir.",
        metrics: [
            { label: "Target Profit Bersih Bulanan (Rp)", id: "target_profit", type: "currency", default: "15000000" },
            { label: "Harga Jual Rata-rata per Porsi (Rp)", id: "harga_jual", type: "currency", default: "25000" },
            { label: "Target Margin Profit Bersih (%)", id: "margin", type: "percentage", default: "25" },
            { label: "Hari Buka Usaha per Bulan", id: "hari_buka", type: "number", default: "30" }
        ],
        prompt_persona: `Kamu adalah Tim Spesialis Operasional Kuliner Logaritma yang ahli dalam F&B management.
Buat 3 dokumen operasional yang saling berkaitan berdasarkan data target penjualan dan budget HPP harian.
Gunakan format markdown dengan gaya profesional dan to-the-point. Jangan berikan pengantar, langsung berikan outputnya.

Dokumen 1: SOP Dapur & Pengendalian Food Waste (Berdasarkan HPP)
Dokumen 2: Skrip Upselling Kasir & Penanganan Komplain
Dokumen 3: Checklist Audit Tutup Kasir & Inventori Harian`
    },
    fashion: {
        id: "fashion",
        name: "Fashion & Retail",
        icon: "👕",
        unit: "Pcs/Item",
        description: "Manajemen Deadstock, Bundling Promo, dan Proteksi Margin.",
        metrics: [
            { label: "Target Profit Bersih Bulanan (Rp)", id: "target_profit", type: "currency", default: "20000000" },
            { label: "Harga Rata-rata Item (Rp)", id: "harga_jual", type: "currency", default: "150000" },
            { label: "Target Margin Profit Bersih (%)", id: "margin", type: "percentage", default: "30" },
            { label: "Hari Operasional per Bulan", id: "hari_buka", type: "number", default: "30" }
        ],
        prompt_persona: `Kamu adalah Tim Spesialis Operasional Retail Fashion Logaritma.
Buat 3 dokumen operasional yang saling berkaitan berdasarkan data target penjualan harian.
Gunakan format markdown dengan gaya profesional dan to-the-point. Jangan berikan pengantar, langsung berikan outputnya.

Dokumen 1: SOP Rotasi Display & Strategi Cuci Gudang (Deadstock)
Dokumen 2: Skrip Sales Online/Offline & Strategi Bundling
Dokumen 3: Checklist Audit Stok Barang & Laporan Kas Harian`
    },
    percetakan: {
        id: "percetakan",
        name: "Percetakan & Jasa",
        icon: "🖨️",
        unit: "Order",
        description: "Manajemen Kapasitas Mesin, Misprint, dan Aturan DP.",
        metrics: [
            { label: "Target Profit Bersih Bulanan (Rp)", id: "target_profit", type: "currency", default: "25000000" },
            { label: "Rata-rata Nilai Order (Rp)", id: "harga_jual", type: "currency", default: "500000" },
            { label: "Target Margin Profit Bersih (%)", id: "margin", type: "percentage", default: "35" },
            { label: "Hari Buka Usaha per Bulan", id: "hari_buka", type: "number", default: "26" }
        ],
        prompt_persona: `Kamu adalah Tim Spesialis Operasional Percetakan Logaritma.
Buat 3 dokumen operasional yang saling berkaitan berdasarkan data target harian.
Gunakan format markdown dengan gaya profesional dan to-the-point. Jangan berikan pengantar, langsung berikan outputnya.

Dokumen 1: SOP Penerimaan File & Minimalisir Misprint
Dokumen 2: Skrip Follow-up Klien & Penagihan Sisa Pembayaran (DP)
Dokumen 3: Checklist Maintenance Mesin & Serah Terima Shift`
    },
    pkl: {
        id: "pkl",
        name: "PKL & Street Food",
        icon: "⛺",
        unit: "Porsi",
        description: "Manajemen Pemisahan Kas, Target Porsi, dan Gaji Owner.",
        metrics: [
            { label: "Target Profit Bersih Harian (Rp)", id: "target_profit", type: "currency", default: "300000" },
            { label: "Harga Jual per Porsi (Rp)", id: "harga_jual", type: "currency", default: "15000" },
            { label: "Target Margin Bersih (%)", id: "margin", type: "percentage", default: "40" },
            { label: "Hari Dagang per Bulan", id: "hari_buka", type: "number", default: "28" }
        ],
        prompt_persona: `Kamu adalah Tim Spesialis Operasional PKL Logaritma.
Buat 3 dokumen sederhana namun powerful untuk operasional PKL harian.
Gunakan format markdown dengan gaya profesional dan to-the-point. Jangan berikan pengantar, langsung berikan outputnya.

Dokumen 1: Aturan Pemisahan Uang Modal dan Untung (Gaji Owner)
Dokumen 2: SOP Persiapan Gerobak/Lapak & Pelayanan Cepat
Dokumen 3: Checklist Tutup Lapak & Belanja Pasar Esok Hari`
    },
    distributor: {
        id: "distributor",
        name: "Distributor & Agen",
        icon: "📦",
        unit: "Nota/Toko",
        description: "Manajemen Limiter Piutang, Route Sales, dan Inventory Turnover.",
        metrics: [
            { label: "Target Profit Bersih Bulanan (Rp)", id: "target_profit", type: "currency", default: "50000000" },
            { label: "Rata-rata Order Toko/Nota (Rp)", id: "harga_jual", type: "currency", default: "1500000" },
            { label: "Target Margin Bersih (%)", id: "margin", type: "percentage", default: "15" },
            { label: "Hari Operasional per Bulan", id: "hari_buka", type: "number", default: "26" }
        ],
        prompt_persona: `Kamu adalah Tim Spesialis Operasional Distributor Logaritma.
Buat 3 dokumen operasional yang berfokus pada volume dan kelancaran cashflow.
Gunakan format markdown dengan gaya profesional dan to-the-point. Jangan berikan pengantar, langsung berikan outputnya.

Dokumen 1: SOP Limitasi Piutang & Syarat Jatuh Tempo Toko
Dokumen 2: Skrip Route Sales & Negosiasi Penempatan Produk
Dokumen 3: Checklist Loading Barang & Opname Gudang`
    }
};

// Ekspor untuk bisa dipakai file lain
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CATEGORY_CONFIG;
}
