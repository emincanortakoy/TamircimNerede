const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

app.set('trust proxy', 1);
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

const dns = require('dns');
if (typeof dns.setDefaultResultOrder === 'function') {
    dns.setDefaultResultOrder('ipv4first');
}

const nodemailer = require('nodemailer');

// TODO: LÜTFEN KENDİ SMTP (E-POSTA) BİLGİLERİNİZİ AŞAĞIYA GİRİN
const SMTP_AUTH = {
    user: 'kendiepostaniz@gmail.com', // Kendi e-postanız
    pass: '' // E-posta şifreniz (Gmail ise uygulama şifresi gerekir)
};

const smtpConfigs = [
    {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        family: 4,
        connectionTimeout: 8000,
        greetingTimeout: 8000,
        socketTimeout: 12000,
        tls: { rejectUnauthorized: false, servername: 'smtp.gmail.com' },
        auth: SMTP_AUTH
    },
    {
        host: '74.125.133.108',
        port: 465,
        secure: true,
        connectionTimeout: 8000,
        greetingTimeout: 8000,
        socketTimeout: 12000,
        tls: { rejectUnauthorized: false, servername: 'smtp.gmail.com' },
        auth: SMTP_AUTH
    },
    {
        host: '142.251.127.108',
        port: 465,
        secure: true,
        connectionTimeout: 8000,
        greetingTimeout: 8000,
        socketTimeout: 12000,
        tls: { rejectUnauthorized: false, servername: 'smtp.gmail.com' },
        auth: SMTP_AUTH
    },
    {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        family: 4,
        connectionTimeout: 8000,
        greetingTimeout: 8000,
        socketTimeout: 12000,
        tls: { rejectUnauthorized: false, servername: 'smtp.gmail.com' },
        auth: SMTP_AUTH
    }
];

const transporter = {
    async sendMail(mailOptions) {
        let lastErr = null;
        for (const cfg of smtpConfigs) {
            try {
                const t = nodemailer.createTransport(cfg);
                const info = await t.sendMail(mailOptions);
                return info;
            } catch (err) {
                lastErr = err;
                console.warn(`SMTP denemesi başarısız (${cfg.host}:${cfg.port}):`, err.message);
            }
        }
        throw lastErr;
    }
};

// Static files
app.use(express.static(path.join(__dirname)));

// Initialize better-sqlite3 database (database.sqlite and database.db mirror)
const db = new Database('./database.sqlite');
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');
console.log('Connected to the SQLite database (database.sqlite) using better-sqlite3.');

let db2 = null;
try {
    db2 = new Database('./database.db');
    db2.pragma('journal_mode = WAL');
    db2.pragma('synchronous = NORMAL');
    console.log('Connected to database.db as mirror.');
} catch (e) {
    console.error('database.db mirror initialization error:', e.message);
}

// Create tables for store, isletmeler, and complaints
const initSql = `
CREATE TABLE IF NOT EXISTS store (
    key TEXT PRIMARY KEY,
    value TEXT
);
CREATE TABLE IF NOT EXISTS isletmeler (
    isletme_adi TEXT,
    ekleyen_tipi TEXT,
    ad_soyad TEXT,
    telefon TEXT,
    e_posta TEXT,
    cihaz_turu TEXT,
    markalar TEXT,
    yetkili_servis_ozel_servis TEXT,
    konum TEXT,
    onay_durumu TEXT,
    tarih TEXT,
    kayit_eposta TEXT
);
CREATE TABLE IF NOT EXISTS sikayetler (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sikayet_isletme TEXT,
    sikayet_konu TEXT,
    e_posta TEXT,
    sikayet_detay TEXT,
    durum TEXT DEFAULT 'beklemede',
    tarih TEXT
);
`;

db.exec(initSql);
if (db2) {
    try { db2.exec(initSql); } catch(err) { console.error('Error creating tables in database.db:', err.message); }
}

// Pre-compiled statements & in-memory cache for high-speed admin operations
const serverStoreCache = new Map();
const getStoreStmt = db.prepare(`SELECT value FROM store WHERE key = ?`);
const upsertStoreStmt = db.prepare(`INSERT INTO store (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = ?`);
const upsertStoreStmt2 = db2 ? db2.prepare(`INSERT INTO store (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = ?`) : null;

function createSyncTransaction(targetDb) {
    if (!targetDb) return null;
    const delStmt = targetDb.prepare(`DELETE FROM isletmeler`);
    const insStmt = targetDb.prepare(`
        INSERT INTO isletmeler (
            isletme_adi, ekleyen_tipi, ad_soyad, telefon, e_posta,
            cihaz_turu, markalar, yetkili_servis_ozel_servis, konum,
            onay_durumu, tarih, kayit_eposta
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    return targetDb.transaction((items) => {
        delStmt.run();
        for (const i of items) {
            const cihazStr = Array.isArray(i.cihaz_turu) ? i.cihaz_turu.join(', ') : (i.cihaz_turu || '');
            const markaStr = Array.isArray(i.markalar) ? i.markalar.join(', ') : (i.markalar || '');
            const konumStr = (i.konum && typeof i.konum === 'object' && i.konum.enlem !== undefined)
                ? `${i.konum.enlem}, ${i.konum.boylam}`
                : (typeof i.konum === 'string' ? i.konum : '');
            insStmt.run(
                i.isletme_adi || '',
                i.ekleyen_tipi || 'site_kullanicisi',
                i.ad_soyad || 'Emincan Ortaköy',
                i.telefon || '',
                i.e_posta || '',
                cihazStr,
                markaStr,
                i.yetkili_servis_ozel_servis || 'Özel Servis',
                konumStr,
                i.onay_durumu || 'beklemede',
                i.tarih || '',
                i.kayit_eposta || 'ortakoyemincan@gmail.com'
            );
        }
    });
}

const syncDb1Trx = createSyncTransaction(db);
const syncDb2Trx = createSyncTransaction(db2);

function syncIsletmelerTableToTarget(targetDb, list) {
    if (!targetDb || !Array.isArray(list)) return;
    if (targetDb === db && syncDb1Trx) {
        syncDb1Trx(list);
    } else if (targetDb === db2 && syncDb2Trx) {
        syncDb2Trx(list);
    }
}

function getStoreValueRaw(key) {
    if (serverStoreCache.has(key)) {
        return serverStoreCache.get(key);
    }
    const row = getStoreStmt.get(key);
    const val = row ? row.value : '[]';
    serverStoreCache.set(key, val);
    return val;
}

function saveStoreValue(key, rawObjOrArr) {
    const value = typeof rawObjOrArr === 'string' ? rawObjOrArr : JSON.stringify(rawObjOrArr);
    serverStoreCache.set(key, value);
    upsertStoreStmt.run(key, value, value);

    // Mirror & relational table sync run asynchronously on next tick so API responds immediately
    setImmediate(() => {
        if (upsertStoreStmt2) {
            try {
                upsertStoreStmt2.run(key, value, value);
            } catch (err2) {
                console.error('database.db store mirror error:', err2.message);
            }
        }

        if (key === 'isletmeler') {
            try {
                const parsed = typeof rawObjOrArr === 'string' ? JSON.parse(rawObjOrArr) : rawObjOrArr;
                if (syncDb1Trx) syncDb1Trx(parsed);
                if (syncDb2Trx) syncDb2Trx(parsed);
            } catch (errSync) {
                console.error('isletmeler table sync error:', errSync.message);
            }
        }
    });
}

// Initialize empty arrays if not exist
const insertOrIgnore = db.prepare(`INSERT OR IGNORE INTO store (key, value) VALUES (?, ?)`);
insertOrIgnore.run('isletmeler', '[]');
insertOrIgnore.run('kullanicilar', '[]');
if (db2) {
    try {
        const insertOrIgnore2 = db2.prepare(`INSERT OR IGNORE INTO store (key, value) VALUES (?, ?)`);
        insertOrIgnore2.run('isletmeler', '[]');
        insertOrIgnore2.run('kullanicilar', '[]');
    } catch (e) {}
}

// Warm up store cache at startup
['isletmeler', 'kullanicilar', 'yorumlar', 'sikayetler'].forEach(k => {
    try { getStoreValueRaw(k); } catch (e) {}
});

// Single-request bundle endpoint for fast admin panel initialization
app.get('/api/store-bundle', (req, res) => {
    try {
        const sikayetRows = db.prepare(`SELECT * FROM sikayetler ORDER BY id DESC`).all();
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.send(`{"isletmeler":${getStoreValueRaw('isletmeler')},"kullanicilar":${getStoreValueRaw('kullanicilar')},"yorumlar":${getStoreValueRaw('yorumlar')},"sikayetler":${JSON.stringify(sikayetRows)}}`);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Fast single-business status update endpoint
app.post('/api/isletmeler/durum', (req, res) => {
    const { idx, isletme_adi, onay_durumu } = req.body;
    if (!onay_durumu) {
        return res.status(400).json({ error: 'onay_durumu gereklidir.' });
    }
    try {
        const list = JSON.parse(getStoreValueRaw('isletmeler'));
        let updated = false;
        if (typeof idx === 'number' && list[idx] && (!isletme_adi || list[idx].isletme_adi === isletme_adi)) {
            list[idx].onay_durumu = onay_durumu;
            updated = true;
        } else if (isletme_adi) {
            const found = list.find(item => item.isletme_adi === isletme_adi);
            if (found) {
                found.onay_durumu = onay_durumu;
                updated = true;
            }
        }
        if (updated) {
            saveStoreValue('isletmeler', list);
        }
        res.json({ success: true, updated });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET endpoint
app.get('/api/store/:key', (req, res) => {
    const key = req.params.key;
    try {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.send(getStoreValueRaw(key));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST endpoint
app.post('/api/store/:key', (req, res) => {
    const key = req.params.key;
    try {
        saveStoreValue(key, req.body);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST send-verification endpoint
app.post('/api/send-verification', async (req, res) => {
    const { email, code } = req.body;
    
    if (!email || !code) {
        return res.status(400).json({ error: 'Email ve kod gereklidir.' });
    }

    try {
        await transporter.sendMail({
            from: '"Tamircim Nerede" <ortakoyemincan@gmail.com>', // Gönderen görünen ad ve mail
            to: email, // Alıcı
            subject: 'Tamircim Nerede - Hesap Doğrulama Kodunuz', // Konu
            text: `Merhaba,\n\nHesabınızı doğrulamak için doğrulama kodunuz: ${code}\n\nİyi günler dileriz.`, // Düz metin
            html: `<h3>Merhaba,</h3><p>Hesabınızı doğrulamak için doğrulama kodunuz: <b>${code}</b></p><p>İyi günler dileriz.</p>` // HTML versiyonu
        });
        res.json({ success: true, message: 'Doğrulama e-postası gönderildi.' });
    } catch (err) {
        console.error('Mail gönderme hatası:', err);
        res.status(500).json({ error: 'E-posta gönderilirken bir hata oluştu: ' + err.message });
    }
});

// POST notify-business-request endpoint (İşletme talebi bildirim)
app.post('/api/notify-business-request', async (req, res) => {
    const { isletme, ad_soyad } = req.body;
    
    if (!isletme) {
        return res.status(400).json({ error: 'İşletme bilgileri gereklidir.' });
    }

    const htmlContent = `
        <h3>Yeni Bir İşletme Talebi Alındı!</h3>
        <p><b>Talep Açan Kişi:</b> ${ad_soyad || 'Bilinmiyor'}</p>
        <p><b>Ekleyen Tipi:</b> ${isletme.ekleyen_tipi === 'isletme_sahibi' ? 'İşletme Sahibi' : 'Site Kullanıcısı'}</p>
        <hr/>
        <h4>İşletme Detayları:</h4>
        <ul>
            <li><b>İşletme Adı:</b> ${isletme.isletme_adi}</li>
            <li><b>Telefon:</b> ${isletme.telefon || '-'}</li>
            <li><b>E-posta:</b> ${isletme.e_posta || '-'}</li>
            <li><b>Cihaz Türleri:</b> ${isletme.cihaz_turu ? isletme.cihaz_turu.join(', ') : '-'}</li>
            <li><b>Markalar:</b> ${isletme.markalar ? isletme.markalar.join(', ') : '-'}</li>
            <li><b>Servis Tipi:</b> ${isletme.yetkili_servis_ozel_servis}</li>
            <li><b>Konum (Enlem, Boylam):</b> ${isletme.konum ? isletme.konum.enlem + ', ' + isletme.konum.boylam : '-'}</li>
        </ul>
        <p>Lütfen admin panelinden bu talebi inceleyerek onaylayın veya reddedin.</p>
    `;

    try {
        await transporter.sendMail({
            from: '"Tamircim Nerede Bildirim" <ortakoyemincan@gmail.com>', 
            to: 'ortakoyemincan@gmail.com', // Kullanıcının mail adresi
            subject: 'Yeni İşletme Talebi - ' + isletme.isletme_adi,
            html: htmlContent
        });
        res.json({ success: true, message: 'Bildirim gönderildi.' });
    } catch (err) {
        console.error('Bildirim maili gönderme hatası:', err);
        res.status(500).json({ error: 'Bildirim e-postası gönderilirken bir hata oluştu: ' + err.message });
    }
});

// POST notify-business-status endpoint (İşletme onay/red bildirimi)
app.post('/api/notify-business-status', async (req, res) => {
    const { isletmeAdi, status, email } = req.body;
    
    if (!email) {
        return res.status(400).json({ error: 'E-posta adresi bulunamadı.' });
    }

    let durumMetni = status === 'onaylandi' ? 'ONAYLANDI' : (status === 'reddedildi' ? 'REDDEDİLDİ' : 'BEKLEMEYE ALINDI');
    let mesaj = status === 'onaylandi' 
        ? 'Tebrikler! İşletme başvurunuz admin tarafından onaylandı ve haritada yayınlanmaya başladı.' 
        : (status === 'reddedildi' ? 'Maalesef, işletme başvurunuz admin tarafından reddedildi.' : 'İşletme başvurunuz beklemeye alındı.');

    const htmlContent = `
        <h3>İşletme Başvurusu Sonucu</h3>
        <p>Merhaba,</p>
        <p><b>${isletmeAdi}</b> adlı işletmeniz için yaptığınız başvuru değerlendirilmiştir.</p>
        <p><b>Durum:</b> ${durumMetni}</p>
        <p>${mesaj}</p>
        <p>İyi günler dileriz.</p>
    `;

    // Bildirim e-postasını arka planda gönder (onay/red işlemini bekletmez ve hata fırlatmaz)
    transporter.sendMail({
        from: '"Tamircim Nerede Bildirim" <ortakoyemincan@gmail.com>', 
        to: email, 
        subject: 'İşletme Başvurusu Sonucu: ' + durumMetni,
        html: htmlContent
    }).catch(err => {
        console.warn('Durum bildirim maili gönderilemedi (SMTP erişim kısıtlaması):', err.message);
    });
    res.json({ success: true, message: 'Durum bildirimi kuyruğa alındı.' });
});

// GET /api/sikayetler (Tüm şikayetleri listele)
app.get('/api/sikayetler', (req, res) => {
    try {
        const stmt = db.prepare(`SELECT * FROM sikayetler ORDER BY id DESC`);
        const rows = stmt.all();
        res.json(rows);
    } catch (err) {
        console.error('Şikayetleri çekme hatası:', err);
        res.status(500).json({ error: err.message });
    }
});

// POST /api/sikayetler (Yeni şikayet kaydet)
app.post('/api/sikayetler', async (req, res) => {
    const { sikayet_isletme, sikayet_konu, e_posta, sikayet_detay } = req.body;
    if (!sikayet_isletme || !sikayet_konu || !sikayet_detay) {
        return res.status(400).json({ error: 'Gerekli şikayet bilgileri eksik.' });
    }

    const emailValue = (e_posta && typeof e_posta === 'string' && e_posta.trim()) ? e_posta.trim() : 'bulunamadı';
    const tarih = new Date().toISOString();

    try {
        const stmt = db.prepare(`INSERT INTO sikayetler (sikayet_isletme, sikayet_konu, e_posta, sikayet_detay, durum, tarih) VALUES (?, ?, ?, ?, 'beklemede', ?)`);
        const info = stmt.run(sikayet_isletme, sikayet_konu, emailValue, sikayet_detay, tarih);

        if (db2) {
            try {
                const stmt2 = db2.prepare(`INSERT INTO sikayetler (id, sikayet_isletme, sikayet_konu, e_posta, sikayet_detay, durum, tarih) VALUES (?, ?, ?, ?, ?, 'beklemede', ?)`);
                stmt2.run(info.lastInsertRowid, sikayet_isletme, sikayet_konu, emailValue, sikayet_detay, tarih);
            } catch (errDb2) {
                console.error('database.db mirror insert hatası:', errDb2.message);
            }
        }

        // Eğer kişi e-postasını girdiyse bilgi maili gönder
        if (emailValue !== 'bulunamadı') {
            const htmlContent = `
                <h3>İşletme Şikayetiniz Alınmıştır</h3>
                <p>Merhaba,</p>
                <p><b>${sikayet_isletme}</b> isimli işletme için ilettiğiniz şikayet tarafımıza başarıyla ulaşmıştır ve incelemeye alınmıştır.</p>
                <hr/>
                <h4>Şikayet Bilgileriniz:</h4>
                <ul>
                    <li><b>İşletme Adı:</b> ${sikayet_isletme}</li>
                    <li><b>Şikayet Sebebi:</b> ${sikayet_konu}</li>
                    <li><b>Açıklama:</b> ${sikayet_detay}</li>
                </ul>
                <p>Şikayetiniz yetkili sistem yöneticisi tarafından incelenecek ve sonuçlandığında tarafınıza bilgilendirme yapılacaktır.</p>
                <p>İyi günler dileriz.</p>
            `;
            transporter.sendMail({
                from: '"Tamircim Nerede Bildirim" <ortakoyemincan@gmail.com>',
                to: emailValue,
                subject: `İşletme Şikayetiniz Alındı - ${sikayet_isletme}`,
                html: htmlContent
            }).catch(mailErr => {
                console.error('Kullanıcıya şikayet alındı maili hatası:', mailErr.message);
            });
        }

        // Sistem yöneticisine şikayet bildirimi gönder
        transporter.sendMail({
            from: '"Tamircim Nerede Bildirim" <ortakoyemincan@gmail.com>',
            to: 'ortakoyemincan@gmail.com',
            subject: `Yeni İşletme Şikayeti: ${sikayet_isletme} (${sikayet_konu})`,
            html: `
                <h3>Yeni Bir İşletme Şikayeti Alındı!</h3>
                <p><b>Şikayet Edilen İşletme:</b> ${sikayet_isletme}</p>
                <p><b>Şikayet Sebebi:</b> ${sikayet_konu}</p>
                <p><b>Bildiren E-posta:</b> ${emailValue}</p>
                <p><b>Şikayet Detayı:</b></p>
                <div style="background:#f1f5f9;padding:12px;border-radius:6px;white-space:pre-wrap;">${sikayet_detay}</div>
                <p>Lütfen admin panelinden şikayeti inceleyiniz.</p>
            `
        }).catch(adminMailErr => {
            console.error('Yöneticiye şikayet bildirim maili hatası:', adminMailErr.message);
        });

        res.json({ success: true, id: info.lastInsertRowid });
    } catch (err) {
        console.error('Şikayet oluşturma hatası:', err);
        res.status(500).json({ error: err.message });
    }
});

// POST /api/sikayetler/:id/durum (Şikayet onayla / reddet)
app.post('/api/sikayetler/:id/durum', async (req, res) => {
    const id = req.params.id;
    const { status } = req.body; // 'onaylandi' veya 'reddedildi'

    if (!['onaylandi', 'reddedildi', 'beklemede'].includes(status)) {
        return res.status(400).json({ error: 'Geçersiz durum.' });
    }

    try {
        const getStmt = db.prepare(`SELECT * FROM sikayetler WHERE id = ?`);
        const row = getStmt.get(id);
        if (!row) {
            return res.status(404).json({ error: 'Şikayet bulunamadı.' });
        }

        const updateStmt = db.prepare(`UPDATE sikayetler SET durum = ? WHERE id = ?`);
        updateStmt.run(status, id);

        if (db2) {
            try {
                const updateStmt2 = db2.prepare(`UPDATE sikayetler SET durum = ? WHERE id = ?`);
                updateStmt2.run(status, id);
            } catch (errDb2) {}
        }

        // Eğer e-posta varsa sonuç maili gönder
        if (row.e_posta && row.e_posta !== 'bulunamadı') {
            const durumMetni = status === 'onaylandi' ? 'onaylanmıştır' : 'reddedilmiştir';
            const durumBaslik = status === 'onaylandi' ? 'ONAYLANDI' : 'REDDEDİLDİ';

            const htmlContent = `
                <h3>İşletme Şikayeti Değerlendirme Sonucu</h3>
                <p>Merhaba,</p>
                <p><b>${row.sikayet_isletme}</b> isimli İşletme için <b>${row.sikayet_konu}</b> konulu şikayetiniz <b>${durumMetni}</b>.</p>
                <p>${status === 'onaylandi' 
                    ? 'İlettiğiniz şikayet yetkili incelemesi sonucu haklı bulunmuş ve gerekli işlemler/düzeltmeler uygulanmıştır.' 
                    : 'İlettiğiniz şikayet sistem yöneticilerimiz tarafından incelenmiş ancak onaylanmamış/reddedilmiştir.'}</p>
                <p>Geri bildiriminiz ve hassasiyetiniz için teşekkür ederiz.</p>
                <p>İyi günler dileriz.</p>
            `;

            transporter.sendMail({
                from: '"Tamircim Nerede Bildirim" <ortakoyemincan@gmail.com>',
                to: row.e_posta,
                subject: `Şikayetiniz ${durumBaslik} - ${row.sikayet_isletme}`,
                html: htmlContent
            }).catch(mailErr => {
                console.error('Şikayet durum maili hatası:', mailErr.message);
            });
        }

        res.json({ success: true, durum: status });
    } catch (err) {
        console.error('Şikayet durum güncelleme hatası:', err);
        res.status(500).json({ error: err.message });
    }
});

// --- OPENSTREETMAP (OVERPASS API) İŞLETME ENTEGRASYONU ---
const https = require('https');

const OSM_BRAND_DATA = {
    telefon: ['Apple', 'Samsung', 'Xiaomi', 'Huawei', 'Oppo', 'Vivo', 'Realme', 'Honor', 'General Mobile', 'Casper', 'Reeder', 'Omix', 'Vestel'],
    masaustu: ['MSI', 'ASUS', 'Nvidia', 'AMD', 'Intel', 'Gigabyte', 'ASROCK', 'NZXT'],
    dizustu: ['Apple', 'Lenovo', 'HP', 'ASUS', 'MSI', 'Monster', 'Acer', 'Huawei', 'Dell'],
    tablet: ['Apple', 'Samsung', 'Xiaomi', 'Huawei', 'Lenovo', 'Casper'],
    televizyon: ['Samsung', 'LG', 'Philips', 'Sony'],
    klima: ['Daikin', 'Mitsubishi', 'Toshiba', 'Arçelik', 'LG', 'Samsung', 'Baymak', 'Demirdöküm', 'Altus'],
    beyazEsya: ['Arçelik', 'Beko', 'Vestel', 'Altus', 'Profilo', 'Bosch', 'Siemens', 'Samsung', 'LG', 'Miele', 'Gaggenau']
};

const OSM_CIHAZ_TO_KEY = {
    'Telefon': 'telefon',
    'Masaüstü Bilgisayar': 'masaustu',
    'Dizüstü Bilgisayar': 'dizustu',
    'Tablet': 'tablet',
    'Televizyon': 'televizyon',
    'Klima': 'klima',
    'Beyaz Eşya': 'beyazEsya'
};

function cleanOsmPhone(rawPhone) {
    if (!rawPhone) return '';
    const p = String(rawPhone).split(/[;,/]/)[0].trim();
    let digits = p.replace(/[^\d+]/g, '');
    if (digits.startsWith('+90')) {
        digits = '0' + digits.slice(3);
    } else if (digits.startsWith('90') && digits.length === 12) {
        digits = '0' + digits.slice(2);
    }
    return digits || p;
}

function cleanOsmEmail(rawEmail) {
    if (!rawEmail) return '';
    return String(rawEmail).split(/[;,/\s]/)[0].trim();
}

function isIrrelevantOsmBusiness(name, tags) {
    if (!name || name.length < 2 || name === '?') return true;
    const lower = name.toLocaleLowerCase('tr');
    if (/\b(asansör|asansor|nalbur|sobacı|sobaci|sobaları|sobalari|izolasyon|mimarlık|mimarlik|inşaat|insaat|oto |otomotiv|lastik|kaporta|egzoz|fren|bisiklet|ayakkabı|ayakkabi|terzi|saatçi|saatci|saat |dikiş makinesi|dikis makinesi)\b/i.test(lower)) {
        return true;
    }
    if (tags.shop === 'confectionery' || tags.shop === 'interior_decoration' || tags.shop === 'department_store') {
        if (!/\b(teknik|servis|tamir|elektronik|bilgisayar|telefon|klima)\b/i.test(lower)) {
            return true;
        }
    }
    return false;
}

function detectOsmDeviceTypes(tags) {
    const devices = new Set();
    const fullText = [
        tags.name,
        tags['name:tr'],
        tags.description,
        tags.operator,
        tags.brand,
        tags.repair,
        tags['service:repair'],
        tags.craft,
        tags.shop
    ].filter(Boolean).join(' ').toLocaleLowerCase('tr');

    if (tags.shop === 'mobile_phone' || tags['mobile_phone:repair'] === 'yes' || (tags.repair && tags.repair.includes('mobile_phone'))) {
        devices.add('Telefon');
        devices.add('Tablet');
    }
    if (tags.shop === 'computer' || tags.craft === 'computer' || tags['computer:repair'] === 'yes' || (tags.repair && tags.repair.includes('computer'))) {
        devices.add('Masaüstü Bilgisayar');
        devices.add('Dizüstü Bilgisayar');
    }
    if (tags.shop === 'appliance' || tags.craft === 'appliance_repair' || (tags.repair && tags.repair.includes('appliance'))) {
        devices.add('Beyaz Eşya');
    }
    if (tags.craft === 'hvac') {
        devices.add('Klima');
    }
    if (tags.shop === 'television' || tags.shop === 'radiotechnics') {
        devices.add('Televizyon');
    }

    if (/\b(telefon|cep|gsm|mobil|iphone|xiaomi|oppo|vivo|realme|reeder|general mobile|omix|iletişim|iletisim|turkcell|vodafone|telekom|kvk|genpa)\b/i.test(fullText)) {
        devices.add('Telefon');
    }
    if (/\b(tablet|ipad|kvk|genpa)\b/i.test(fullText)) {
        devices.add('Tablet');
    }
    if (/\b(bilgisayar|computer|laptop|notebook|pc|bilişim|bilisim|macbook|monster|lenovo|asus|msi|acer|dell|hp|casper|gigabyte|nvidia|amd|intel)\b/i.test(fullText)) {
        devices.add('Masaüstü Bilgisayar');
        devices.add('Dizüstü Bilgisayar');
    }
    if (/\b(televizyon|tv|uydu|philips|sony|monitör|monitor)\b/i.test(fullText)) {
        devices.add('Televizyon');
    }
    if (/\b(klima|iklimlendirme|soğutma|sogutma|ısıtma|isitma|kombi|combi|daikin|mitsubishi|toshiba|baymak|demirdöküm|demirdokum|demir döküm|havalandırma|havalandirma|ısı|isi|mekanik|termo|iklim|iklimsa|vaillant|buderus|protherm|airfel|e\.c\.a|eca|fujitsu|panasonic|viessmann)\b/i.test(fullText)) {
        devices.add('Klima');
    }
    if (/\b(beyaz eşya|beyaz esya|bayaz eşya|çamaşır|camasir|bulaşık|bulasik|buzdolabı|buzdolabi|arçelik|arcelik|beko|vestel|bosch|siemens|profilo|altus|miele|gaggenau|ev aletleri|lg|samsung)\b/i.test(fullText)) {
        devices.add('Beyaz Eşya');
    }

    if (devices.size === 0) {
        if (/\b(elektronik|elektironik)\b/i.test(fullText)) {
            devices.add('Televizyon');
        } else if (tags.craft === 'electronics_repair' || tags.shop === 'electronics_repair') {
            devices.add('Televizyon');
            devices.add('Beyaz Eşya');
        } else {
            devices.add('Diğer');
        }
    }

    return [...devices];
}

function detectOsmBrands(tags, deviceTypes) {
    const searchArea = [
        tags.brand,
        tags.operator,
        tags.name,
        tags['name:tr'],
        tags.description
    ].filter(Boolean).join(' ').toLocaleLowerCase('tr');

    const matchedBrands = new Set();

    const brandAliases = {
        'Apple': ['apple', 'iphone', 'ipad', 'macbook'],
        'Samsung': ['samsung'],
        'Xiaomi': ['xiaomi', 'redmi', 'poco'],
        'Huawei': ['huawei'],
        'Oppo': ['oppo'],
        'Vivo': ['vivo'],
        'Realme': ['realme'],
        'Honor': ['honor'],
        'General Mobile': ['general mobile'],
        'Casper': ['casper'],
        'Reeder': ['reeder'],
        'Omix': ['omix'],
        'Vestel': ['vestel'],
        'MSI': ['msi'],
        'ASUS': ['asus'],
        'Nvidia': ['nvidia'],
        'AMD': ['amd'],
        'Intel': ['intel'],
        'Gigabyte': ['gigabyte'],
        'ASROCK': ['asrock'],
        'NZXT': ['nzxt'],
        'Lenovo': ['lenovo'],
        'HP': ['hp'],
        'Monster': ['monster'],
        'Acer': ['acer'],
        'Dell': ['dell'],
        'LG': ['lg'],
        'Philips': ['philips'],
        'Sony': ['sony'],
        'Daikin': ['daikin'],
        'Mitsubishi': ['mitsubishi'],
        'Toshiba': ['toshiba'],
        'Arçelik': ['arçelik', 'arcelik'],
        'Baymak': ['baymak'],
        'Demirdöküm': ['demirdöküm', 'demirdokum', 'demir döküm'],
        'Altus': ['altus'],
        'Beko': ['beko'],
        'Profilo': ['profilo'],
        'Bosch': ['bosch'],
        'Siemens': ['siemens'],
        'Miele': ['miele'],
        'Gaggenau': ['gaggenau']
    };

    for (const [canonicalBrand, aliases] of Object.entries(brandAliases)) {
        for (const alias of aliases) {
            const regex = new RegExp(`(^|[^a-zA-Z0-9ğüşıöçĞÜŞİÖÇ])${alias}([^a-zA-Z0-9ğüşıöçĞÜŞİÖÇ]|$)`, 'i');
            if (regex.test(searchArea)) {
                matchedBrands.add(canonicalBrand);
                break;
            }
        }
    }

    if (matchedBrands.size > 0) {
        return [...matchedBrands];
    }

    const allForDevices = new Set();
    for (const dev of deviceTypes) {
        const key = OSM_CIHAZ_TO_KEY[dev];
        if (key && OSM_BRAND_DATA[key]) {
            OSM_BRAND_DATA[key].forEach(b => allForDevices.add(b));
        }
    }
    allForDevices.add('Diğer');
    return [...allForDevices];
}

function queryOverpassServer(url, query) {
    return new Promise((resolve) => {
        const body = 'data=' + encodeURIComponent(query);
        const req = https.request(url, {
            method: 'POST',
            agent: false,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(body),
                'User-Agent': 'TamircimNerede/1.0',
                'Connection': 'close'
            },
            timeout: 40000
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ status: res.statusCode, data }));
        });
        req.on('timeout', () => { req.destroy(); resolve({ status: 0, data: 'timeout' }); });
        req.on('error', (e) => resolve({ status: 0, data: e.message }));
        req.write(body);
        req.end();
    });
}

async function fetchOsmElementsFromOverpass() {
    const query = `[out:json][timeout:45];
area["ISO3166-1"="TR"][admin_level=2]->.tr;
(
  nwr["shop"="electronics_repair"](area.tr);
  nwr["craft"="electronics_repair"](area.tr);
  nwr["shop"="computer"]["repair"](area.tr);
  nwr["shop"="mobile_phone"]["repair"](area.tr);
  nwr["shop"="appliance"]["repair"](area.tr);
  nwr["craft"="hvac"](area.tr);
  nwr["craft"="computer"](area.tr);
);
out center;`;

    const servers = [
        'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
        'https://overpass-api.de/api/interpreter',
        'https://lz4.overpass-api.de/api/interpreter'
    ];

    for (const srv of servers) {
        const res = await queryOverpassServer(srv, query);
        if (res.status === 200 && res.data && res.data.trim().startsWith('{')) {
            const parsed = JSON.parse(res.data);
            if (Array.isArray(parsed.elements)) {
                return parsed.elements;
            }
        }
    }
    throw new Error('Overpass API sunucularından yanıt alınamadı.');
}

function mapElementsToIsletmeler(elements, nowStr) {
    const results = [];
    const seenKeys = new Set();

    for (const el of (elements || [])) {
        const tags = el.tags || {};
        const name = (tags.name || tags['name:tr'] || '').trim();
        if (isIrrelevantOsmBusiness(name, tags)) continue;

        const lat = el.lat ?? (el.center && el.center.lat);
        const lon = el.lon ?? (el.center && el.center.lon);
        if (typeof lat !== 'number' || typeof lon !== 'number') continue;

        const dedupKey = `${name.toLocaleLowerCase('tr')}_${lat.toFixed(3)}_${lon.toFixed(3)}`;
        if (seenKeys.has(dedupKey)) continue;
        seenKeys.add(dedupKey);

        const cihaz_turu = detectOsmDeviceTypes(tags);
        const markalar = detectOsmBrands(tags, cihaz_turu);
        const telefon = cleanOsmPhone(tags.phone || tags['contact:phone'] || tags['phone:mobile'] || tags['contact:mobile'] || tags['phone:TR']);
        const e_posta = cleanOsmEmail(tags.email || tags['contact:email']);

        results.push({
            isletme_adi: name,
            ekleyen_tipi: 'site_kullanicisi',
            ad_soyad: 'Emincan Ortaköy',
            telefon: telefon,
            e_posta: e_posta,
            cihaz_turu: cihaz_turu,
            markalar: markalar,
            yetkili_servis_ozel_servis: 'Özel Servis',
            konum: {
                enlem: lat,
                boylam: lon
            },
            onay_durumu: 'beklemede',
            tarih: nowStr,
            kayit_eposta: 'ortakoyemincan@gmail.com'
        });
    }
    return results;
}

app.post('/api/osm-sync', async (req, res) => {
    try {
        const elements = await fetchOsmElementsFromOverpass();
        const now = new Date();
        const nowStr = now.getFullYear() + '-' +
            String(now.getMonth() + 1).padStart(2, '0') + '-' +
            String(now.getDate()).padStart(2, '0') + ' ' +
            String(now.getHours()).padStart(2, '0') + ':' +
            String(now.getMinutes()).padStart(2, '0') + ':' +
            String(now.getSeconds()).padStart(2, '0');

        const mapped = mapElementsToIsletmeler(elements, nowStr);

        const row = db.prepare(`SELECT value FROM store WHERE key = 'isletmeler'`).get();
        const existing = row ? JSON.parse(row.value) : [];

        const existingKeys = new Set(existing.map(i => {
            const lat = i.konum && i.konum.enlem !== undefined ? Number(i.konum.enlem).toFixed(3) : '0';
            const lon = i.konum && i.konum.boylam !== undefined ? Number(i.konum.boylam).toFixed(3) : '0';
            return `${(i.isletme_adi || '').toLocaleLowerCase('tr')}_${lat}_${lon}`;
        }));

        let addedCount = 0;
        for (const item of mapped) {
            const key = `${item.isletme_adi.toLocaleLowerCase('tr')}_${item.konum.enlem.toFixed(3)}_${item.konum.boylam.toFixed(3)}`;
            if (!existingKeys.has(key)) {
                existing.push(item);
                existingKeys.add(key);
                addedCount++;
            }
        }

        saveStoreValue('isletmeler', existing);
        res.json({ success: true, addedCount, totalCount: existing.length });
    } catch (err) {
        console.error('OSM Sync Hatası:', err);
        res.status(500).json({ error: err.message });
    }
});

const cron = require('node-cron');
const fs = require('fs');
const os = require('os');
const { google } = require('googleapis');

async function uploadToDrive(filePath, fileName) {
    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: path.join(__dirname, 'drive-credentials.json'),
            scopes: ['https://www.googleapis.com/auth/drive'],
        });

        const drive = google.drive({ version: 'v3', auth });
        const folderId = '14hVAXwujkzpqc2GMxoQpFcaL_krG7vCD'; // Kullanıcının doğrudan paylaştığı klasörün ID'si

        const fileMetadata = { name: fileName, parents: [folderId] };
        const media = { mimeType: 'application/x-sqlite3', body: fs.createReadStream(filePath) };

        const file = await drive.files.create({ resource: fileMetadata, media: media, fields: 'id' });
        console.log(`[Google Drive] Yedek başarıyla klasöre yüklendi: ${fileName}, ID: ${file.data.id}`);
    } catch (err) {
        console.error('[Google Drive Hatası]', err);
    }
}

// Her gün 23:59'da çalışacak
cron.schedule('59 23 * * *', async () => {
    try {
        const yedekKlasor = path.join(os.homedir(), 'Desktop', 'tamircimnerede_yedek');
        if (!fs.existsSync(yedekKlasor)) fs.mkdirSync(yedekKlasor, { recursive: true });

        const now = new Date();
        const tarih = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0') + '_' + String(now.getHours()).padStart(2, '0') + '-' + String(now.getMinutes()).padStart(2, '0');
        const yedekDosyaAdi = `database_${tarih}.sqlite`;
        const yedekYolu = path.join(yedekKlasor, yedekDosyaAdi);

        await db.backup(yedekYolu);
        console.log(`[Yedekleme] Masaüstüne yedeklendi: ${yedekYolu}`);

        if (fs.existsSync(path.join(__dirname, 'drive-credentials.json'))) {
            await uploadToDrive(yedekYolu, yedekDosyaAdi);
        } else {
            console.log('[Google Drive] drive-credentials.json bulunamadığı için Drive\'a yüklenmedi.');
        }
    } catch (error) {
        console.error('[Yedekleme Hatası]', error);
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running at http://localhost:${port}`);
});
