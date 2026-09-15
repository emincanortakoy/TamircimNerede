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

// Initialize better-sqlite3 database
const db = new Database('./database.sqlite', { verbose: console.log });
console.log('Connected to the SQLite database using better-sqlite3.');

// Create tables for the key-value store approach to minimize structural changes
db.exec(`CREATE TABLE IF NOT EXISTS store (
    key TEXT PRIMARY KEY,
    value TEXT
)`);

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
