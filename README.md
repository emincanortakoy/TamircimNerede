# [TR]

## TamircimNerede
Tamircim Nerede harita üzerinden her türlü tamirciyi (masaüstü bilgisayar, dizüstü bilgisayar, telefon, tablet....vs) bulabildiğiniz bir website platformudur

Harita üzerinden tamircileri filtreyebilir, İsmine göre aratabilir, detaylı bir filtreleme yapabilirsiniz.

Arayüz tamamıyla basit ve etkili bırakılmıştır. Bulmak istediğiniz tamirci sadece bir tık uzakta.

Tamirciyi bulduktan sonra detaylı bir şekilde bilgilerini öğrenebilir, tek butonla arayabilir ve google haritalar üzerinden yol tarifi alabilirsiniz

### Peki bunu google haritalardan ayıran farkı nedir?

1-) Tek sayfadan tüm tamircileri görebilirsiniz: Google haritalar üzerinden tek tek yakınımdaki telefon tamircileri veya yakınımdaki beyaz eşya tamircileri diye aratmanız gerekir bu da zaman kaybına sebep olur

2-) Özel Servis/Yetkili Servis ayrımı: Google haritalarda sadece özel servisler (garantiyi bozan tamirciler) gözükür. Bizim websitemizde ise Firmadan gelecek olan yetkili servisleri dahi görebilirsiniz böylelikle ne kadar hızlı gelecekler veya nereden gelecekler diye düşünmenize gerek kalmaz

### Spam veya sahte tamirci şüpheleri

Bu konuda şüpheleriniz varsa hiç merak etmeyin! Öyle elini kolunu sallayan herkes tamirci ekleyemiyor. Tamirci eklendiği zaman bir başvuru formu dolduruluyor ve Website yetkililerinin onayı olmadan tamirci eklenmiyor!

### Kullandığım Teknolojiler

**Frontend için:** HTML5, CSS3, JavaScript Vanilla, Maplibre GL JS

**Backend için:** Node.js, Express.js, Nodemailer, CORS & Body-Parser

**Veritabanı:** SQLite

### Nasıl Kurulur

Site dosyalarını bilgisayarınızda kurduktan sonra powershell'i açıp (veya cmd) dosya komudunda önce **npm install express better-sqlite3 cors body-parser nodemailer node-cron googleapis** ardından **node server.js** komudunu kullanmanız yeterlidir. 
Ardından localhost:8000 site adresi ile (vds kullanıyorsanız <vds'in ip adresi>:8000) websiteye erişebilirsiniz!

## E-posta ile bilgilendirme kurulumu

Websitesinde İşletme başvuruları ile ilgili e-posta ile bilgilendirme sistemi vardır. Bunu kurmak için:

1-) Bir google hesabı kurmalısınız

2-) Gmail'e girip Google Hesabınızı Yönetin butonuna basmalısınız

3-) Güvenlik ve oturum açma kısmından 2 aşamalı doğrulamayı aktif etmelisiniz (2 aşamalı doğrulama zaten aktif ise bu adımı geçebilirsiniz)

4-) Tekrar Hesabınızı Yönetin menüsüne girip arama kısmından "Uygulama Şifreleri" diye aratın

5-) Uygulama adını girin ve gelen **abcd defg hijk lmno** şeklindeki uygulama şifresini kopyalayın

6-) server.js dosyasın içindeki 

    auth: {
        user: 'kendiepostaniz@gmail.com', // Kendi e-postanız
        pass: '' // E-posta şifreniz (Gmail ise uygulama şifresi gerekir)
    }

kodundaki user kısmını kendi mailiniz ile, pass kısmını ise uygulama şifresi ile değiştirin

### demo: [http://185.23.17.147:3000](http://185.23.17.147:3000)

#### Not: Şu an websitenin temel işlevleri tamamlanmış olup ileriki zamanda güncelleme getirilmeye devam edilecektir.

# [EN]

## TamircimNerede (WhereIsMyRepairman)
TamircimNerede (WhereIsMyRepairman) is a web platform where you can find all kinds of repair shops (desktop PC, laptop, phone, tablet, etc.) on an interactive map.

You can filter repair shops directly on the map, search by name, and apply detailed filters.

The interface is intentionally kept simple and effective. The repair shop you are looking for is just a click away.

Once you find a repair shop, you can view detailed information, call them with a single click, and get directions via Google Maps.

### What makes this different from Google Maps?

1-) See all repair shops in one place: On Google Maps, you have to search individually for things like "phone repair near me" or "appliance repair near me," which wastes time.

2-) Distinction between Independent and Authorized Service Centers: Google Maps typically lists independent repair shops (which may void warranties). On our platform, you can even see manufacturer-authorized service centers—eliminating guesswork about where they are based or how quickly they can arrive.

### Concerns about spam or fake listings

No need to worry! Anyone can't just casually add a repair shop. When a listing is submitted, an application form must be filled out, and no repair shop is added without approval from site administrators!

### Tech Stack

**Frontend:** HTML5, CSS3, Vanilla JavaScript, Maplibre GL JS

**Backend:** Node.js, Express.js, Nodemailer, CORS & Body-Parser

**Database:** SQLite

### How to Install

After setting up the project files on your computer, open PowerShell (or CMD), navigate to the project directory, first run:
`npm install express better-sqlite3 cors body-parser nodemailer node-cron googleapis` 
then:
`node server.js`

You can then access the website at `localhost:8000` (or `<vds_ip_address>:8000` if you are using a VPS/VDS)!

## Email Notification Setup

The website includes an email notification system for business listing applications. To set it up:

1-) Set up a Google account.

2-) Open Gmail and click on "Manage your Google Account".

3-) Go to "Security" and enable 2-Step Verification (skip this step if already active).

4-) Return to the "Manage your Google Account" menu and search for "App Passwords" in the search bar.

5-) Enter an app name and copy the generated app password (in the format **abcd defg hijk lmno**).

6-) In the `server.js` file:

    auth: {
        user: 'youremail@gmail.com', // Your email address
        pass: '' // Your email password (requires an App Password for Gmail)
    }

Replace `user` with your email address and `pass` with your generated app password.

### demo: [http://185.23.17.147:3000](http://185.23.17.147:3000)

#### Note: The core functionalities of the website are currently complete, and updates will continue to be rolled out in the future.