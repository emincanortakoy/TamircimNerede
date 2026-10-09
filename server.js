const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

const nodemailer = require('nodemailer');

// TODO: LÜTFEN KENDİ SMTP (E-POSTA) BİLGİLERİNİZİ AŞAĞIYA GİRİN
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // veya kendi SMTP adresiniz (örnek: mail.kurumsal.com)
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'kendiepostaniz@gmail.com', // Kendi e-postanız
        pass: '' // E-posta şifreniz (Gmail ise uygulama şifresi gerekir)
    }
});

// Static files
app.use(express.static(path.join(__dirname)));

// Initialize better-sqlite3 database (database.sqlite and database.db mirror)
const db = new Database('./database.sqlite', { verbose: console.log });
console.log('Connected to the SQLite database (database.sqlite) using better-sqlite3.');

let db2 = null;
try {
    db2 = new Database('./database.db');
    console.log('Connected to database.db as mirror.');
} catch (e) {
    console.error('database.db mirror initialization error:', e.message);
}

// Create tables for store and complaints
const initSql = `
CREATE TABLE IF NOT EXISTS store (
    key TEXT PRIMARY KEY,
    value TEXT
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

// Initialize empty arrays if not exist
const insertOrIgnore = db.prepare(`INSERT OR IGNORE INTO store (key, value) VALUES (?, ?)`);
insertOrIgnore.run('isletmeler', '[]');
insertOrIgnore.run('kullanicilar', '[]');

// GET endpoint
app.get('/api/store/:key', (req, res) => {
    const key = req.params.key;
    try {
        const stmt = db.prepare(`SELECT value FROM store WHERE key = ?`);
        const row = stmt.get(key);
        if (row) {
            res.send(row.value);
        } else {
            res.send('[]');
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST endpoint
app.post('/api/store/:key', (req, res) => {
    const key = req.params.key;
    const value = JSON.stringify(req.body);
    
    try {
        const stmt = db.prepare(`INSERT INTO store (key, value) VALUES (?, ?)
                                 ON CONFLICT(key) DO UPDATE SET value = ?`);
        stmt.run(key, value, value);
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
            from: '"Tamircim Nerede" <sizin.epostaniz@gmail.com>', // Gönderen görünen ad ve mail
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
            from: '"Tamircim Nerede Bildirim" <sizin.epostaniz@gmail.com>', 
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

    try {
        await transporter.sendMail({
            from: '"Tamircim Nerede Bildirim" <sizin.epostaniz@gmail.com>', 
            to: email, 
            subject: 'İşletme Başvurusu Sonucu: ' + durumMetni,
            html: htmlContent
        });
        res.json({ success: true, message: 'Durum bildirimi gönderildi.' });
    } catch (err) {
        console.error('Durum bildirim maili gönderme hatası:', err);
        res.status(500).json({ error: 'Bildirim e-postası gönderilirken bir hata oluştu: ' + err.message });
    }
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
                from: '"Tamircim Nerede Bildirim" <sizin.epostaniz@gmail.com>',
                to: emailValue,
                subject: `İşletme Şikayetiniz Alındı - ${sikayet_isletme}`,
                html: htmlContent
            }).catch(mailErr => {
                console.error('Kullanıcıya şikayet alındı maili hatası:', mailErr.message);
            });
        }

        // Sistem yöneticisine şikayet bildirimi gönder
        transporter.sendMail({
            from: '"Tamircim Nerede Bildirim" <sizin.epostaniz@gmail.com>',
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
                from: '"Tamircim Nerede Bildirim" <sizin.epostaniz@gmail.com>',
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

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
