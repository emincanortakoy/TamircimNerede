/**
 * Tamircim Nerede - Çift Dilli (Türkçe / English) Çeviri ve Yönetim Modülü
 */

const FLAG_UK = `<svg viewBox="0 0 60 30" width="34" height="22" style="border-radius:4px;overflow:hidden;display:block;box-shadow:0 2px 8px rgba(0,0,0,0.35);pointer-events:none;">
  <rect width="60" height="30" fill="#012169"/>
  <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6"/>
  <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" stroke-width="2.5"/>
  <path d="M30,0 v30 M0,15 h60" stroke="#fff" stroke-width="10"/>
  <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" stroke-width="6"/>
</svg>`;

const FLAG_TR = `<svg viewBox="0 0 1200 800" width="34" height="22" style="border-radius:4px;overflow:hidden;display:block;box-shadow:0 2px 8px rgba(0,0,0,0.35);pointer-events:none;">
  <rect width="1200" height="800" fill="#E30A17"/>
  <circle cx="425" cy="400" r="200" fill="#ffffff"/>
  <circle cx="475" cy="400" r="160" fill="#E30A17"/>
  <polygon points="583.33,400 700.82,438.19 628.21,338.19 628.21,461.81 700.82,361.81" fill="#ffffff"/>
</svg>`;

// Semantik Key Tabanlı Sözlük [TR, EN]
const I18N_DICT = {
  // Genel & Header
  "brand_name": ["Tamircim Nerede", "Where is My Repairer"],
  "search_placeholder": ["Tamirci Ara", "Search Repairer"],
  "login_btn": ["Giriş Yap", "Login"],
  "signup_btn": ["Üye Ol", "Sign Up"],
  "user_panel": ["Kullanıcı Paneli", "User Panel"],
  "admin_panel": ["Admin Paneli", "Admin Panel"],
  "logout_btn": ["Çıkış Yap", "Logout"],
  "back_to_map": ["← Haritaya Dön", "← Return to Map"],

  // Giriş / Kayıt / Doğrulama
  "email": ["E-posta", "Email"],
  "email_placeholder": ["E-posta adresinizi giriniz", "Enter your email address"],
  "password": ["Şifre", "Password"],
  "password_placeholder": ["Şifrenizi giriniz", "Enter your password"],
  "login_error": ["E-posta veya şifre hatalıdır.", "Email or password is incorrect."],
  "fullname": ["Ad Soyad", "Full Name"],
  "fullname_placeholder": ["Adınızı ve soyadınızı giriniz", "Enter your full name"],
  "confirm_password": ["Şifreyi Onayla", "Confirm Password"],
  "confirm_password_placeholder": ["Şifrenizi tekrar giriniz", "Re-enter your password"],
  "fill_required": ["Lütfen gerekli yerleri doldurunuz.", "Please fill in the required fields."],
  "verification_title": ["E-posta Doğrulama", "Email Verification"],
  "verification_code_placeholder": ["6 Haneli Kod", "6-Digit Code"],
  "verification_error": ["Kod hatalı.", "Incorrect code."],
  "verify_btn": ["Doğrula", "Verify"],

  // Tanıtım Turu
  "tour_title": ["Tamircim Nerede demo uygulamasını test ettiğiniz için teşekkür ederiz.", "Thank you for testing the Where is My Repairer demo application."],
  "tour_pc_title": ["Bilgisayar tanıtımı", "Desktop Overview"],
  "tour_pc_1": ["Sağ üst taraftaki butona basarak Hesaba Giriş Yapabilir/Üye olabilirsiniz.", "You can log in or sign up by clicking the top right button."],
  "tour_pc_2": ["Üstteki arama kısmıyla Tamircileri arayabilirsiniz.", "You can search for repairers using the search box above."],
  "tour_pc_3": ["Soldaki gri sekmeye imleci getirerek detaylı filtreleme kısmını açabilirsiniz", "Hover over the gray tab on the left to open detailed filters."],
  "tour_pc_4": ["Sol alttaki buton ile de haritaya tamirci ekleyebilirsiniz", "Use the bottom left button to add a repairer to the map."],
  "tour_mobile_title": ["Mobil tanıtımı", "Mobile Overview"],
  "tour_mobile_1": ["Yine sağ üst taraftaki butona basarak Hesaba Giriş Yapabilir/Üye olabilirsiniz.", "You can log in or sign up using the top right button."],
  "tour_mobile_2": ["Alttaki menüyü de geniştirerek detaylı filtreleme kısmını açabilir, tamirci ekleme butonunu görebilirsiniz", "Expand the bottom menu to access filters and the add repairer button."],

  // Filtreleme (Sidebar)
  "device_type": ["Cihaz Türü", "Device Type"],
  "dev_telefon": ["Telefon", "Phone"],
  "dev_masaustu": ["Masaüstü Bilgisayar", "Desktop PC"],
  "dev_dizustu": ["Dizüstü Bilgisayar", "Laptop"],
  "dev_tablet": ["Tablet", "Tablet"],
  "dev_televizyon": ["Televizyon", "Television"],
  "dev_klima": ["Klima", "Air Conditioner"],
  "dev_beyazEsya": ["Beyaz Eşya", "Appliances"],
  "dev_diger": ["Diğer", "Other"],
  "device_brand": ["Cihaz Markası", "Device Brand"],
  "select_device_type": ["Lütfen Cihaz Türü Seçiniz", "Please Select Device Type"],
  "authorized_service": ["Yetkili Servis", "Authorized Service"],
  "special_service": ["Özel Servis", "Special Service"],
  "service_info_note": [
    "<b>Bilgilendirme:</b> Sitedeki servis statüleri kullanıcı ve işletme beyanlarına dayanır. Cihazınızı teslim etmeden önce yetki ve garanti koşullarını ilgili işletmeden veya üreticiden teyit etmenizi rica ederiz.",
    "<b>Notice:</b> Service statuses on the site are based on user and business declarations. Please confirm authorization and warranty conditions with the relevant business or manufacturer before handing over your device."
  ],
  "add_business_btn": ["İşletme Tanımla", "Add Business"],

  // İşletme Ekleme Modalı
  "im_owner": ["İşletme sahibiyim", "I am business owner"],
  "im_user": ["Site kullanıcısıyım", "I am site user"],
  "business_name": ["İşletme Adı", "Business Name"],
  "business_name_placeholder": ["İşletme adını giriniz", "Enter business name"],
  "phone": ["Telefon", "Phone"],
  "phone_placeholder": ["Telefon numaranızı giriniz", "Enter phone number"],
  "company_email": ["Şirket E-postası", "Company Email"],
  "company_email_placeholder": ["Şirket E-postası adresinizi giriniz", "Enter company email"],
  "serviced_devices": ["Servis verilen cihaz türleri", "Serviced device types"],
  "serviced_brands": ["Markalar", "Brands"],
  "are_you_authorized": ["Yetkili Servis misiniz?", "Are you an Authorized Service?"],
  "business_location_note": [
    "<b>Not:</b> Haritada işaretlediğiniz yer teknik servisin konumu olarak belirlenecektir. Konum belirlemek için bilgisayarda iseniz sağ fare tuşunu kullanınız, telefon veya tablette iseniz ekrana basılı tutunuz.",
    "<b>Note:</b> The location you mark on the map will be set as the technical service's location. To set location, right-click on PC, or press and hold on mobile/tablet."
  ],
  "add_business_submit": ["İşletme Ekle", "Add Business"],
  "optional_tag": ["(Opsiyonel)", "(Optional)"],

  // Detay Paneli & Yorumlar
  "device_type_label": ["Hizmet Verilen Cihaz", "Serviced Devices"],
  "brands_label": ["Hizmet Verilen Markalar", "Serviced Brands"],
  "view_reviews": ["Yorumları Gör", "View Reviews"],
  "reviews_title": ["Yorumlar", "Reviews"],
  "write_review_btn": ["Yorum Yap", "Write Review"],
  "prev_btn": ["Geri", "Previous"],
  "next_btn": ["İleri", "Next"],
  "call_now": ["Hemen Ara", "Call Now"],
  "leave_review_title": ["Değerlendirme Yap", "Leave a Review"],
  "select_rating": ["Puan Seçiniz", "Select Rating"],
  "review_placeholder": ["En az 30 karakter olacak şekilde yorumunuzu buraya yazın...", "Write your review here (at least 30 characters)..."],
  "review_error": ["Lütfen puan verin ve en az 30 karakter yorum yazın.", "Please rate and write at least 30 characters."],
  "submit_btn": ["Gönder", "Submit"],
  "no_reviews_placeholder": ["Henüz yorum yapılmamış. İlk yorumu siz yapın!", "No reviews yet. Be the first to leave a review!"],

  // Admin & Üye Paneli Boş Durum Mesajları
  "empty_applications": ["Henüz başvuru bulunmamaktadır.", "No applications found yet."],
  "empty_map_businesses": ["Haritada onaylı işletme bulunmamaktadır.", "No approved businesses found on map."],
  "empty_my_applications": ["Henüz işletme başvurunuz bulunmamaktadır.", "No business applications found yet."],
  "empty_reviews": ["Kayıtlı yorum bulunmamaktadır.", "No registered reviews found."],
  "empty_my_reviews": ["Yaptığınız herhangi bir yorum bulunmamaktadır.", "You have not submitted any reviews yet."],
  "empty_members": ["Kayıtlı üye bulunmamaktadır.", "No registered members found."],

  // Panel Arama Placeholder'ları
  "search_business_placeholder": ["İşletme Ara...", "Search Business..."],
  "search_user_placeholder": ["Kullanıcı Ara...", "Search User..."],
  "search_member_placeholder": ["Ad Soyad Ara...", "Search Full Name..."],

  // İşletme Şikayet Et Modalı & Yönetimi
  "report_business_btn": ["İşletmeyi şikayet et", "Report Business"],
  "report_business_title": ["İşletmeyi Şikayet Et", "Report Business"],
  "report_reason_label": ["Şikayet sebebini seçiniz", "Select complaint reason"],
  "select_reason_placeholder": ["Şikayet sebebi seçiniz...", "Select complaint reason..."],
  "reason_not_at_location": ["İşletme yerinde bulunmuyor", "Business not at location"],
  "reason_location_incorrect": ["İşletme konumu yanlış", "Business location is incorrect"],
  "reason_fraud": ["Dolandırıcı işletme", "Fraudulent business"],
  "reason_device_incorrect": ["İşletme tamir ettiği cihaz yanlış", "Repaired device type is incorrect"],
  "reason_brand_incorrect": ["İşletme tamir ettiği cihaz markası yanlış", "Repaired device brand is incorrect"],
  "reason_other": ["Diğer", "Other"],
  "report_detail_label": ["Şikayet sebebini açıklayınız", "Explain complaint reason"],
  "report_detail_placeholder": ["Şikayetinizi detaylı olarak açıklayınız...", "Explain your complaint in detail..."],
  "report_email_label": ["E-posta Adresi (İsteğe bağlı)", "Email Address (Optional)"],
  "report_email_note": ["Verilen e-posta adresi sadece iletişim amaçlı kullanılacaktır. Bilgileriniz karşı tarafla asla paylaşılmayacaktır.", "The provided email address will only be used for communication purposes. Your information will never be shared with third parties."],
  "submit_report_btn": ["Şikayeti Gönder", "Submit Complaint"],
  "tab_complaints": ["Şikayetler", "Complaints"],
  "empty_complaints": ["Kayıtlı şikayet bulunmamaktadır.", "No registered complaints found."],
  "search_business_complaint_placeholder": ["İşletme ismini giriniz", "Enter business name"],
  "stat_total_reports": ["Toplam Şikayet", "Total Complaints"],
  "filter_complaint_reason": ["Şikayet Sebebi", "Complaint Reason"],
  "filter_all_reasons": ["Tüm Şikayet Sebepleri", "All Complaint Reasons"],
  "complaint_detail_modal_title": ["Şikayet Detayı", "Complaint Details"]
};

// Düz Metin / Birebir Eşleşme Sözlüğü (TR -> EN)
const WORD_MAP = {
  // Marka & Başlıklar
  "Tamircim Nerede": "Where is My Repairer",
  "TAMİRCİM NEREDE": "WHERE IS MY REPAIRER",
  "TAMİRCİM": "WHERE IS MY",
  "NEREDE": "REPAIRER",
  "TEKNİK SERVİS BULUCU": "TECHNICAL SERVICE FINDER",
  "Tamircim Nerede Üye Girişi": "Where is My Repairer — Member Login",
  "Tamircim Nerede — Üye Girişi": "Where is My Repairer — Member Login",
  "Tamircim Nerede - Admin Paneli": "Where is My Repairer — Admin Panel",
  "Tamircim Nerede — Admin Paneli": "Where is My Repairer — Admin Panel",
  "Giriş Yap": "Login",
  "Üye Ol": "Sign Up",
  "Kullanıcı Paneli": "User Panel",
  "Admin Paneli": "Admin Panel",
  "Çıkış Yap": "Logout",
  "← Haritaya Dön": "← Return to Map",

  // Giriş / Kayıt
  "E-posta": "Email",
  "Şifre": "Password",
  "E-posta veya şifre hatalıdır.": "Email or password is incorrect.",
  "Ad Soyad": "Full Name",
  "Şifreyi Onayla": "Confirm Password",
  "Lütfen gerekli yerleri doldurunuz.": "Please fill in the required fields.",
  "Lütfen gerekli yerleri doldurunuz ve onay kutusunu işaretleyiniz.": "Please fill in the required fields and check the consent box.",
  "Lütfen e-posta ve şifrenizi giriniz.": "Please enter your email and password.",
  "Şifreler eşleşmiyor.": "Passwords do not match.",
  "Bu e-posta adresi zaten kayıtlıdır.": "This email address is already registered.",
  "E-posta Doğrulama": "Email Verification",
  "Kod hatalı.": "Incorrect code.",
  "Girdiğiniz kod hatalı.": "The code you entered is incorrect.",
  "Doğrula": "Verify",

  // Sidebar & Filtreler
  "Cihaz Türü": "Device Type",
  "Cihaz Markası": "Device Brand",
  "Marka": "Brand",
  "Markalar": "Brands",
  "Lütfen Cihaz Türü Seçiniz": "Please Select Device Type",
  "Yetkili Servis": "Authorized Service",
  "Özel Servis": "Special Service",
  "Servis Türü": "Service Type",
  "Servis Tipi": "Service Type",
  "Servis": "Service",
  "İşletme Tanımla": "Add Business",
  "İşletme Ekle": "Add Business",
  "+ Yeni İşletme Ekle": "+ Add New Business",

  // Cihaz Türleri
  "Telefon": "Phone",
  "Masaüstü Bilgisayar": "Desktop PC",
  "Dizüstü Bilgisayar": "Laptop",
  "Tablet": "Tablet",
  "Televizyon": "Television",
  "Klima": "Air Conditioner",
  "Beyaz Eşya": "Appliances",
  "Diğer": "Other",

  // İşletme Modalı
  "İşletme sahibiyim": "I am business owner",
  "Site kullanıcısıyım": "I am site user",
  "İşletme Adı": "Business Name",
  "Şirket E-postası": "Company Email",
  "Servis verilen cihaz türleri": "Serviced device types",
  "Yetkili Servis misiniz?": "Are you an Authorized Service?",
  "Yetkili Servis mi?": "Authorized Service?",
  "Authorized Service?": "Yetkili Servis mi?",
  "(Opsiyonel)": "(Optional)",
  "Opsiyonel": "Optional",
  "Lütfen Tamir Ettiğiniz Cihaz Markalarını Giriniz": "Please Enter the Brands You Repair",
  "Lütfen haritada yer işaretleyiniz.": "Please mark a location on the map.",
  "İşletme tanımlayabilmek için önce üye olmalısınız.": "You must register first to add a business.",
  "İşletme ekleme talebiniz alınmıştır. Lütfen onaylanmasını bekleyiniz.": "Your business request has been received. Please wait for approval.",
  "Hesabınız sistemden silindiği için oturumunuz otomatik olarak sonlandırıldı.": "Your session has been terminated because your account was deleted.",

  // Detay & Yorumlar
  "Hizmet Verilen Cihaz": "Serviced Devices",
  "Hizmet Verilen Markalar": "Serviced Brands",
  "Yorumları Gör": "View Reviews",
  "Yorumlar": "Reviews",
  "Tüm Yorumlar": "All Reviews",
  "İşletme Yorumları": "Business Reviews",
  "Yorum Yap": "Write Review",
  "Geri": "Previous",
  "İleri": "Next",
  "Hemen Ara": "Call Now",
  "Değerlendirme Yap": "Leave a Review",
  "Puan Seçiniz": "Select Rating",
  "Lütfen puan verin ve en az 30 karakter yorum yazın.": "Please rate and write at least 30 characters.",
  "Gönder": "Submit",
  "Henüz yorum yapılmamış. İlk yorumu siz yapın!": "No reviews yet. Be the first to leave a review!",
  "Yorum yapmak için hesaba giriş yapmalısınız.": "You must log in to write a review.",
  "Yorumunuz başarıyla gönderildi!": "Your review has been submitted successfully!",
  "Yorumunuz kurallarımıza uygunluk açısından incelemeye alınmıştır.": "Your review is under review for compliance with our guidelines.",
  "Yorumunuz kurallarımıza uygunluk açısından incelemeye alınmıştır": "Your review is under review for compliance with our guidelines",
  "Gizli (İnceleniyor)": "Hidden (Under Review)",
  "Gizli (Küfür/Uygunsuz)": "Hidden (Profanity/Inappropriate)",
  "Görünür (Küfür Yok)": "Visible (No Profanity)",
  "Gizli": "Hidden",
  "Görünür": "Visible",
  "Yayında": "Published",
  "Bu yorumu silme yetkiniz yok.": "You do not have permission to delete this review.",
  "Yorumunuz en az 30 karakter olmalıdır.": "Your review must be at least 30 characters.",
  "Geçerli bir puan giriniz (1 ile 5 arası).": "Please enter a valid rating (between 1 and 5).",
  "Bu yorumu düzenleme yetkiniz yok.": "You do not have permission to edit this review.",
  "İsimsiz Servis": "Unnamed Service",
  "Belirtilmemiş": "Not specified",
  "Yorum": "Review",
  " Yorum": " Review",
  " Yorumları": " Reviews",

  // Admin & Üye Paneli (giris.html)
  "İşletme Başvuruları": "Business Applications",
  "Haritadaki İşletmeler": "Businesses on Map",
  "Haritadaki Onaylı İşletmeler": "Approved Businesses on Map",
  "İşletme Bilgilerim": "My Business Information",
  "Yaptığım Yorumlar": "My Reviews",
  "Üye Bilgileri": "Member Information",
  "Toplam Başvuru": "Total Applications",
  "Bekleyen": "Pending",
  "Onaylanan": "Approved",
  "Reddedilen": "Rejected",
  "Tümü": "All",
  "Beklemede": "Pending",
  "Onaylandı": "Approved",
  "Reddedildi": "Rejected",
  "Konum": "Location",
  "Ortalama Puan": "Average Rating",
  "Ekleyen": "Added By",
  "Durum": "Status",
  "Tarih": "Date",
  "İşlem": "Action",
  "İşlemler": "Actions",
  "Tür / Marka": "Type / Brand",
  "Cihazlar & Markalar": "Devices & Brands",
  "Yorum Yapan": "Reviewer",
  "Puan": "Rating",
  "Kayıt Tarihi": "Registration Date",
  "İşletme Sahibi": "Business Owner",
  "Site Kullanıcısı": "Site User",
  "Onayla": "Approve",
  "Reddet": "Reject",
  "Düzenle": "Edit",
  "Sil": "Delete",
  "Haritada Gör": "View on Map",
  "Kaydet": "Save",
  "İptal": "Cancel",
  "Kapat": "Close",
  "Güncelle": "Update",
  "Üye Düzenle": "Edit Member",
  "Üye Bilgilerini Düzenle": "Edit Member Information",
  "İşletme Düzenle": "Edit Business",
  "İşletme Bilgilerini Düzenle": "Edit Business Information",
  "Yorum Düzenle": "Edit Review",
  "Yorumumu Düzenle": "Edit My Review",
  "Haritadan Konum Seçimi": "Select Location on Map",
  "Henüz başvuru bulunmamaktadır.": "No applications found yet.",
  "Henüz başvuru bulunmamaktadır": "No applications found yet.",
  "Haritada onaylı işletme bulunmamaktadır.": "No approved businesses found on map.",
  "Haritada onaylı işletme bulunmamaktadır": "No approved businesses found on map.",
  "Henüz işletme başvurunuz bulunmamaktadır.": "No business applications found yet.",
  "Henüz işletme başvurunuz bulunmamaktadır": "No business applications found yet.",
  "Kayıtlı yorum bulunmamaktadır.": "No registered reviews found.",
  "Kayıtlı yorum bulunmamaktadır": "No registered reviews found.",
  "Yaptığınız herhangi bir yorum bulunmamaktadır.": "You have not submitted any reviews yet.",
  "Yaptığınız herhangi bir yorum bulunmamaktadır": "You have not submitted any reviews yet.",
  "Kayıtlı üye bulunmamaktadır.": "No registered members found.",
  "Kayıtlı üye bulunmamaktadır": "No registered members found.",
  "Henüz yorum bulunmamaktadır.": "No reviews found yet.",
  "Henüz yorum bulunmamaktadır": "No reviews found yet.",
  "Henüz üye bulunmamaktadır.": "No members found yet.",
  "Henüz üye bulunmamaktadır": "No members found yet.",
  "Kayıtlı işletme bulunmamaktadır.": "No registered businesses found.",
  "Kayıtlı işletme bulunmamaktadır": "No registered businesses found.",
  "Herhangi bir kayıt bulunmamaktadır.": "No records found.",
  "Herhangi bir kayıt bulunmamaktadır": "No records found.",
  "Kayıt bulunamadı.": "No records found.",
  "Kayıt bulunamadı": "No records found.",
  "Sonuç bulunamadı.": "No results found.",
  "Sonuç bulunamadı": "No results found.",
  "İşletme Ara...": "Search Business...",
  "İşletme Ara": "Search Business",
  "Kullanıcı Ara...": "Search User...",
  "Kullanıcı Ara": "Search User",
  "Ad Soyad Ara...": "Search Full Name...",
  "Ad Soyad Ara": "Search Full Name",
  "Bu üyeyi silmek istediğinizden emin misiniz?": "Are you sure you want to delete this member?",
  "Bu üyeyi silmek istediğinizden emin misiniz": "Are you sure you want to delete this member?",
  "Bu işletmeyi silmek istediğinizden emin misiniz?": "Are you sure you want to delete this business?",
  "Bu işletmeyi silmek istediğinizden emin misiniz": "Are you sure you want to delete this business?",
  "Bu yorumu silmek istediğinizden emin misiniz?": "Are you sure you want to delete this review?",
  "Bu yorumu silmek istediğinizden emin misiniz": "Are you sure you want to delete this review?",
  "Bu yorumunuzu silmek istediğinizden emin misiniz?": "Are you sure you want to delete your review?",
  "Bu yorumunuzu silmek istediğinizden emin misiniz": "Are you sure you want to delete your review?"
};

// I18N_DICT'ten WORD_MAP'i otomatik genişlet
for (const key in I18N_DICT) {
  const tr = I18N_DICT[key][0];
  const en = I18N_DICT[key][1];
  if (!tr.includes('<')) {
    WORD_MAP[tr] = en;
  }
}

// Placeholder Sözlüğü
const PLACEHOLDER_MAP = {
  "Tamirci Ara": "Search Repairer",
  "İşletme Ara...": "Search Business...",
  "İşletme Ara": "Search Business",
  "Kullanıcı Ara...": "Search User...",
  "Kullanıcı Ara": "Search User",
  "Ad Soyad Ara...": "Search Full Name...",
  "Ad Soyad Ara": "Search Full Name",
  "Haritada Ara...": "Search on Map...",
  "Haritada Ara": "Search on Map",
  "E-posta adresinizi giriniz": "Enter your email address",
  "Şifrenizi giriniz": "Enter your password",
  "Adınızı ve soyadınızı giriniz": "Enter your full name",
  "Şifrenizi tekrar giriniz": "Re-enter your password",
  "6 Haneli Kod": "6-Digit Code",
  "İşletme adını giriniz": "Enter business name",
  "Telefon numaranızı giriniz": "Enter phone number",
  "Şirket E-postası adresinizi giriniz": "Enter company email",
  "En az 30 karakter olacak şekilde yorumunuzu buraya yazın...": "Write your review here (at least 30 characters)...",
  "Lütfen Tamir Ettiğiniz Cihaz Markalarını Giriniz": "Please Enter the Brands You Repair",
  "İşletme ismini giriniz": "Enter business name",
  "Şikayetinizi detaylı olarak açıklayınız...": "Explain your complaint in detail...",
  "Şikayet sebebi seçiniz...": "Select complaint reason..."
};

// Ters Sözlükler (EN -> TR)
const REVERSE_WORD_MAP = {};
for (const [tr, en] of Object.entries(WORD_MAP)) {
  REVERSE_WORD_MAP[en] = tr;
}
const REVERSE_PLACEHOLDER_MAP = {};
for (const [tr, en] of Object.entries(PLACEHOLDER_MAP)) {
  REVERSE_PLACEHOLDER_MAP[en] = tr;
}

// Aydınlatma & Koşullar Modalı Metinleri (TR & EN)
const KOSULLAR_CONTENT = {
  tr: {
    title: "TAMİRCİM NEREDE – AYDINLATMA METNİ, GİZLİLİK POLİTİKASI VE KULLANIM KOŞULLARI",
    body: `
      <div class="bolum">
        <h4>1. Veri Sorumlusu</h4>
        6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca, kişisel verileriniz veri sorumlusu sıfatıyla Tamircim Nerede Platform Yöneticisi (“Platform”) tarafından aşağıda izah edilen kapsam ve şartlarda işlenmektedir.
      </div>

      <div class="bolum">
        <h4>2. İşlenen Veriler, Amaçları ve Gizlilik Derecesi</h4>
        Platformumuzda veriler iki ayrı kategoride işlenir:
        <br><br>
        <b>A. Bireysel Üyelik Verileri (Gizli Kalacak Veriler):</b>
        <ul>
          <li><b>İşlenen Veriler:</b> Ad, Soyad, Kişisel E-posta Adresi.</li>
          <li><b>İşleme Amacı:</b> Üyelik hesabı oluşturulması, e-posta adresi doğrulaması (aktivasyon), hesap güvenliğinin sağlanması, yetkisiz girişlerin önlenmesi ve gerektiğinde hesap bildirimlerinin iletilmesi.</li>
          <li><b>Gizlilik ve Paylaşım:</b> Bu veriler kesinlikle 3. şahıslarla, diğer kullanıcılarla veya ticari taraflarla paylaşılmaz. Bu bilgilere yalnızca platformun teknik ve operasyonel yönetiminden sorumlu olan yetkili sistem yöneticisi erişebilir.</li>
        </ul>
        <b>B. İşletme Tanımlama Verileri (Kamuya Açık Veriler):</b>
        <ul>
          <li><b>İşlenen Veriler:</b> İşletme Adı, İşletme İletişim Telefon Numarası, İşletme İletişim E-posta Adresi, İşletme Adresi/Harita Konumu, Tamir Edilen Cihaz ve Marka Bilgileri.</li>
          <li><b>İşleme ve Yayın Amacı:</b> Platformun ana fonksiyonu olan harita tabanlı dizin hizmetinin yürütülmesi, dükkan profilinin harita üzerinde konumlandırılması ve hizmet almak isteyen 3. kişi kullanıcıların doğrudan işletmeyle iletişime geçebilmesinin sağlanması.</li>
          <li><b>Erişim Durumu:</b> Bu kapsamda girilen tüm işletme bilgileri, web sitesini ziyaret eden tüm 3. kişilerin erişimine açık şekilde haritada ve dükkan detay sayfalarında yayınlanır.</li>
        </ul>
      </div>

      <div class="bolum">
        <h4>3. Hukuki Sebepler ve Veri Toplama Yöntemi</h4>
        Kişisel verileriniz; web sitemiz üzerindeki üyelik ve dükkan ekleme formları aracılığıyla dijital ortamda toplanmaktadır. Verileriniz, KVKK’nın 5. maddesinde yer alan “ilgili kişinin açık rızası”, “bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması” ve “veri sorumlusunun meşru menfaatleri” hukuki sebeplerine dayalı olarak otomatik yollarla işlenir.
      </div>

      <div class="bolum">
        <h4>4. Sorumluluk Reddi ve Hizmet Şartları</h4>
        <ul>
          <li><b>Yer Sağlayıcı Konumu:</b> Platformumuz, 5651 sayılı İnternet Ortamında Yapılan Yayınların Düzenlenmesi ve Bu Yayınlar Yoluyla İşlenen Suçlarla Mücadele Edilmesi Hakkında Kanun kapsamında "Yer Sağlayıcı" niteliğindedir. Platform üzerinde yer alan işletme bilgileri, kullanıcı ve işletme beyanlarına dayanır.</li>
          <li><b>Servis ve Garanti Durumu Bilgilendirmesi:</b> Sitede yer alan "Yetkili Servis" veya "Teknik Servis" ayrımları yalnızca genel bilgilendirme amacıyla sunulmaktadır. Platformumuz bu bilgilerin doğruluğunu, güncelliğini veya garanti geçerliliğini taahhüt etmez. Kullanıcılar, cihazlarını teslim etmeden önce ilgili servisin yetki ve garanti koşullarını üretici firmadan veya işletmeden bizzat teyit etmekle yükümlüdür.</li>
          <li><b>Hizmet Kalitesi ve Uyuşmazlıklar:</b> Platform, hizmet almak isteyen kullanıcılar ile bağımsız işletmeleri buluşturan bir dizindir. Tamir işlemlerinin kalitesinden, parça orijinalliğinden, ücretlendirmelerden, cihazlarda oluşabilecek hasarlardan veya taraflar arasındaki uyuşmazlıklardan platformumuz hiçbir hukuki ve cezai sorumluluk kabul etmez.</li>
        </ul>
      </div>

      <div class="bolum">
        <h4>5. İçerik Kaldırma ve Düzeltme Talepleri</h4>
        Haritada kendi işletmesinin izinsiz veya hatalı listelendiğini düşünen işletme sahipleri ya da kullanıcılar, dükkanın sistemden tamamen silinmesi veya güncellenmesi taleplerini <b>emincanortakoy@gmail.com</b> adresine iletebilirler. Talepler en geç 48 saat içerisinde incelenerek gerekli işlem yapılır.
      </div>

      <div class="bolum">
        <h4>6. KVKK Kapsamındaki Haklarınız</h4>
        KVKK’nın 11. maddesi kapsamında; verilerinizin işlenip işlenmediğini öğrenme, yanlış verilerin düzeltilmesini isteme, üyeliğinizi sonlandırarak verilerinizin sistemden kalıcı olarak silinmesini talep etme hakkına sahipsiniz. Tüm taleplerinizi doğrudan <b>emincanortakoy@gmail.com</b> adresi üzerinden sistem yöneticisine ulaştırabilirsiniz.
      </div>
    `
  },
  en: {
    title: "WHERE IS MY REPAIRER – CLARIFICATION TEXT, PRIVACY POLICY AND TERMS OF USE",
    body: `
      <div class="bolum">
        <h4>1. Data Controller</h4>
        In accordance with Law No. 6698 on the Protection of Personal Data ("KVKK"), your personal data is processed by the Where is My Repairer Platform Administrator ("Platform") as the data controller within the scope and conditions explained below.
      </div>

      <div class="bolum">
        <h4>2. Processed Data, Purposes, and Confidentiality Level</h4>
        Data is processed in two separate categories on our platform:
        <br><br>
        <b>A. Individual Membership Data (Confidential Data):</b>
        <ul>
          <li><b>Processed Data:</b> Name, Surname, Personal Email Address.</li>
          <li><b>Processing Purpose:</b> Creating a membership account, email verification (activation), ensuring account security, preventing unauthorized access, and delivering account notifications when necessary.</li>
          <li><b>Confidentiality and Sharing:</b> This data is strictly not shared with third parties, other users, or commercial entities. Only the authorized system administrator responsible for technical and operational management of the platform has access to this information.</li>
        </ul>
        <b>B. Business Listing Data (Public Data):</b>
        <ul>
          <li><b>Processed Data:</b> Business Name, Business Contact Phone Number, Business Contact Email Address, Business Address/Map Location, Repaired Device and Brand Information.</li>
          <li><b>Processing and Publishing Purpose:</b> Operating the platform's core directory service on the map, placing the store profile on the map, and enabling third-party users seeking service to contact the business directly.</li>
          <li><b>Access Status:</b> All business information entered within this scope is published openly on the map and store detail pages for all site visitors.</li>
        </ul>
      </div>

      <div class="bolum">
        <h4>3. Legal Grounds and Data Collection Method</h4>
        Your personal data is collected digitally via membership and business registration forms on our website. Your data is processed automatically based on legal grounds under Article 5 of the KVKK: "explicit consent of the data subject", "directly related to the conclusion or performance of a contract", and "legitimate interests of the data controller".
      </div>

      <div class="bolum">
        <h4>4. Disclaimer and Terms of Service</h4>
        <ul>
          <li><b>Hosting Provider Status:</b> Our platform acts as a "Hosting Provider" under Law No. 5651. Business information on the platform is based on user and business declarations.</li>
          <li><b>Service and Warranty Status Notice:</b> Distinctions such as "Authorized Service" or "Special Service" on the site are provided for general information only. Our platform does not warrant the accuracy, timeliness, or warranty validity of this information. Users are responsible for confirming authorization and warranty terms directly with the manufacturer or business before submitting their devices.</li>
          <li><b>Service Quality and Disputes:</b> The platform is a directory connecting users with independent repair businesses. Our platform accepts no legal or criminal liability for the quality of repairs, parts authenticity, pricing, device damages, or disputes between parties.</li>
        </ul>
      </div>

      <div class="bolum">
        <h4>5. Content Removal and Correction Requests</h4>
        Business owners or users who believe their business is listed without permission or incorrectly may submit requests for complete removal or updates to <b>emincanortakoy@gmail.com</b>. Requests are reviewed and processed within 48 hours at latest.
      </div>

      <div class="bolum">
        <h4>6. Your Rights Under KVKK</h4>
        Under Article 11 of the KVKK, you have the right to learn whether your data is processed, request correction of inaccurate data, and request permanent deletion of your data by terminating your membership. You can send all requests directly to the system administrator at <b>emincanortakoy@gmail.com</b>.
      </div>
    `
  }
};

class I18nManager {
  constructor() {
    this.currentLang = localStorage.getItem('tamircim_dil') || 'tr';
    if (!['tr', 'en'].includes(this.currentLang)) {
      this.currentLang = 'tr';
    }
  }

  getLang() {
    return this.currentLang;
  }

  toggle() {
    const nextLang = this.currentLang === 'tr' ? 'en' : 'tr';
    this.setLanguage(nextLang);
  }

  setLanguage(lang) {
    if (!['tr', 'en'].includes(lang)) return;
    this.currentLang = lang;
    localStorage.setItem('tamircim_dil', lang);
    document.documentElement.lang = lang;

    this.updateButtons();
    this.applyTranslations();
  }

  updateButtons() {
    // TR -> UK Bayrağı (tıklayınca EN olur)
    // EN -> TR Bayrağı (tıklayınca TR olur)
    const flagSvg = this.currentLang === 'tr' ? FLAG_UK : FLAG_TR;
    const titleText = this.currentLang === 'tr' ? 'Switch to English' : "Türkçe'ye Geç";

    const buttons = document.querySelectorAll('.lang-toggle-btn, #langToggleBtn, #loginLangToggleBtn, #adminLangToggleBtn');
    buttons.forEach(btn => {
      btn.innerHTML = flagSvg;
      btn.title = titleText;
      btn.setAttribute('aria-label', titleText);
    });
  }

  translateText(text) {
    if (!text) return text;
    const trimmed = text.trim();
    if (!trimmed) return text;

    if (this.currentLang === 'en') {
      return WORD_MAP[trimmed] || (I18N_DICT[trimmed] ? I18N_DICT[trimmed][1] : text);
    } else {
      return REVERSE_WORD_MAP[trimmed] || (I18N_DICT[trimmed] ? I18N_DICT[trimmed][0] : text);
    }
  }

  translatePlaceholder(ph) {
    if (!ph) return ph;
    const trimmed = ph.trim();
    if (!trimmed) return ph;

    if (this.currentLang === 'en') {
      return PLACEHOLDER_MAP[trimmed] || WORD_MAP[trimmed] || (I18N_DICT[trimmed] ? I18N_DICT[trimmed][1] : ph);
    } else {
      return REVERSE_PLACEHOLDER_MAP[trimmed] || REVERSE_WORD_MAP[trimmed] || (I18N_DICT[trimmed] ? I18N_DICT[trimmed][0] : ph);
    }
  }

  updateKosullarModal() {
    const modalEl = document.getElementById('kosullarModal');
    if (modalEl && modalEl.getAttribute('data-applied-lang') === this.currentLang) return;

    const titleEl = document.querySelector('#kosullarModal .kosullar-title');
    const bodyEl = document.querySelector('#kosullarModal .kosullar-body');
    if (!titleEl || !bodyEl) return;

    const content = KOSULLAR_CONTENT[this.currentLang] || KOSULLAR_CONTENT.tr;
    titleEl.textContent = content.title;
    bodyEl.innerHTML = content.body;
    if (modalEl) modalEl.setAttribute('data-applied-lang', this.currentLang);
  }

  updateConsentCheckboxes() {
    const isEn = this.currentLang === 'en';

    // Kayıt Onay Metni
    const kayitOnaySpan = document.getElementById('kayitOnayText');
    if (kayitOnaySpan && kayitOnaySpan.getAttribute('data-applied-lang') !== this.currentLang) {
      if (isEn) {
        kayitOnaySpan.innerHTML = `<span style="color:#ff5050;">*</span> I have read and approve the <button type="button" id="kayitAydinlatmaLink" class="legal-link-btn" onclick="window.openKosullarModal(event)">Clarification Text</button> regarding the processing of my name, surname and email for account creation and verification.`;
      } else {
        kayitOnaySpan.innerHTML = `<span style="color:#ff5050;">*</span> Ad, soyad ve e-posta bilgilerimin hesap oluşturma ve doğrulama süreçleri amacıyla işlenmesine ilişkin <button type="button" id="kayitAydinlatmaLink" class="legal-link-btn" onclick="window.openKosullarModal(event)">Aydınlatma Metni</button>’ni okudum, onaylıyorum.`;
      }
      kayitOnaySpan.setAttribute('data-applied-lang', this.currentLang);
    }

    // İşletme Aydınlatma Onay Metni
    const formOnaySpan = document.getElementById('formOnayText');
    if (formOnaySpan && formOnaySpan.getAttribute('data-applied-lang') !== this.currentLang) {
      if (isEn) {
        formOnaySpan.innerHTML = `<span style="color:#ff5050;">*</span> I consent to the processing of my personal data (Name, Surname, Email Address, Phone Number) for shop verification, membership and platform publication under the <button type="button" id="aydinlatmaLink" class="legal-link-btn" onclick="window.openKosullarModal(event)">Clarification Text</button>.`;
      } else {
        formOnaySpan.innerHTML = `<span style="color:#ff5050;">*</span> Kişisel verilerimin (İsim, Soyisim, E-posta Adresi, Telefon Numarası) dükkan doğrulama, üyelik süreçleri ve platformda yayınlanma amaçlarıyla işlenmesine <button type="button" id="aydinlatmaLink" class="legal-link-btn" onclick="window.openKosullarModal(event)">Aydınlatma Metni</button> kapsamında rıza gösteriyorum.`;
      }
      formOnaySpan.setAttribute('data-applied-lang', this.currentLang);
    }

    // İşletme Koşullar Onay Metni
    const formKosullarSpan = document.getElementById('formKosullarText');
    if (formKosullarSpan && formKosullarSpan.getAttribute('data-applied-lang') !== this.currentLang) {
      if (isEn) {
        formKosullarSpan.innerHTML = `<span style="color:#ff5050;">*</span> I have read and agree to the <button type="button" id="kosullarLink" class="legal-link-btn" onclick="window.openKosullarModal(event)">Terms of Use and Disclaimer</button>.`;
      } else {
        formKosullarSpan.innerHTML = `<span style="color:#ff5050;">*</span> <button type="button" id="kosullarLink" class="legal-link-btn" onclick="window.openKosullarModal(event)">Kullanım Koşulları ve Sorumluluk Reddi Metni</button>'ni okudum, kabul ediyorum.`;
      }
      formKosullarSpan.setAttribute('data-applied-lang', this.currentLang);
    }
  }

  applyTranslations() {
    if (this.isTranslating) return;
    this.isTranslating = true;
    if (this.observer) this.observer.disconnect();

    try {
      const isEn = this.currentLang === 'en';

      // 1. Sayfa Başlığı (Document Title)
      if (document.title && (document.title.includes('Tamircim Nerede') || document.title.includes('Where is My Repairer'))) {
        if (document.title.includes('Üye Paneli') || document.title.includes('Member Panel')) {
          document.title = isEn ? 'Where is My Repairer - Member Panel' : 'Tamircim Nerede - Üye Paneli';
        } else if (document.title.includes('Admin Paneli') || document.title.includes('Admin Panel')) {
          document.title = isEn ? 'Where is My Repairer - Admin Panel' : 'Tamircim Nerede - Admin Paneli';
        } else {
          document.title = isEn ? 'Where is My Repairer' : 'Tamircim Nerede';
        }
      }

      // 2. data-i18n etiketli elemanlar (Semantik Key ve Doğrudan Çeviri Desteği)
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (I18N_DICT[key]) {
          const val = isEn ? I18N_DICT[key][1] : I18N_DICT[key][0];
          if (val.includes('<')) {
            el.innerHTML = val;
          } else {
            el.textContent = val;
          }
        } else if (WORD_MAP[key]) {
          el.textContent = isEn ? WORD_MAP[key] : key;
        } else if (el.textContent.trim()) {
          const trans = this.translateText(el.textContent);
          if (trans !== el.textContent) {
            el.textContent = trans;
          }
        }
      });

      // 3. data-i18n-placeholder etiketli elemanlar
      document.querySelectorAll('[data-i18n-placeholder]').forEach(input => {
        const key = input.getAttribute('data-i18n-placeholder');
        if (I18N_DICT[key]) {
          input.placeholder = isEn ? I18N_DICT[key][1] : I18N_DICT[key][0];
        }
      });

      // 4. Genel input / textarea placeholder'ları
      document.querySelectorAll('input, textarea').forEach(input => {
        if (input.getAttribute('data-i18n-placeholder')) return;
        if (input.placeholder) {
          const trans = this.translatePlaceholder(input.placeholder);
          if (trans) input.placeholder = trans;
        }
      });

      // 5. Aydınlatma Metni & Koşullar Modalı & Form Onay Kutuları
      this.updateKosullarModal();
      this.updateConsentCheckboxes();

      // 6. Dinamik İşletme Ekleme Tab'ı (switchTabUI)
      if (typeof window.switchTabUI === 'function') {
        window.switchTabUI(window.aktifTab || '1');
      }

      // 7. Detay Paneli Açıksa Güncelle
      const detailPanel = document.getElementById('repairman-detail-panel');
      if (detailPanel && detailPanel.classList.contains('active') && window.currentBusinessData && typeof window.openRepairmanDetail === 'function') {
        window.openRepairmanDetail(window.currentBusinessData);
      }

      // 8. Genel DOM Metin Taraması (Başlıklar, Butonlar, Etiketler, Listeler vb.)
      const selectors = [
        'h1', 'h2', 'h3', 'h4', 'h5',
        'button', 'label', 'th', 'a',
        '.stat-label', '.filter-btn', '.admin-sidebar-item span',
        '.section-subtitle', '.btn-label', '.empty-msg',
        '.status-pill', '.status-badge', '.tag', '.detail-badge',
        'option', 'span', 'p', '.filter-empty', '.form-empty'
      ];

      document.querySelectorAll(selectors.join(',')).forEach(el => {
        // Dil tuşları, SVG'ler ve yasal metin butonlarını atla
        if (el.closest('.lang-toggle-btn, #langToggleBtn, #loginLangToggleBtn, #adminLangToggleBtn, .legal-link-btn, #kayitOnayText, #formOnayText, #formKosullarText, #kosullarModal, #kosullarModalOverlay')) return;
        if (el.tagName === 'SVG' || el.closest('svg')) return;
        if (el.getAttribute('data-i18n')) return; // Zaten çevrildi

        if (el.children.length === 0 && el.textContent.trim()) {
          const trans = this.translateText(el.textContent);
          if (trans !== el.textContent) {
            el.textContent = trans;
          }
        } else if (el.childNodes.length > 0) {
          el.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim()) {
              const trans = this.translateText(node.nodeValue.trim());
              if (trans !== node.nodeValue.trim()) {
                node.nodeValue = node.nodeValue.replace(node.nodeValue.trim(), trans);
              }
            }
          });
        }
      });
    } finally {
      this.isTranslating = false;
      if (this.observer) {
        this.observer.takeRecords();
        this.observer.observe(document.body, {
          childList: true,
          subtree: true
        });
      }
    }
  }

  initObserver() {
    let debounceTimer;
    this.observer = new MutationObserver(() => {
      if (this.isTranslating) return;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        if (this.currentLang === 'en') {
          this.applyTranslations();
        }
      }, 150);
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
}

// Global alert() Fonksiyonunu Çevirici ile Sarmala
const _origAlert = window.alert;
window.alert = function(msg) {
  if (window.i18n && typeof msg === 'string') {
    return _origAlert(window.i18n.translateText(msg));
  }
  return _origAlert(msg);
};

// Global Koşullar / Aydınlatma Modalı Aç/Kapat Yardımcıları
window.openKosullarModal = function(e) {
  if (e) {
    if (typeof e.preventDefault === 'function') e.preventDefault();
    if (typeof e.stopPropagation === 'function') e.stopPropagation();
    if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
  }
  const modal = document.getElementById('kosullarModalOverlay');
  if (modal) {
    modal.classList.add('active');
    modal.style.setProperty('display', 'flex', 'important');
    modal.style.setProperty('z-index', '99999', 'important');
  }
  return false;
};

window.closeKosullarModal = function(e) {
  if (e) {
    if (typeof e.preventDefault === 'function') e.preventDefault();
    if (typeof e.stopPropagation === 'function') e.stopPropagation();
    if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
  }
  const modal = document.getElementById('kosullarModalOverlay');
  if (modal) {
    modal.classList.remove('active');
    modal.style.setProperty('display', 'none', 'important');
  }
  return false;
};

// Global Örnek ve Yardımcılar
window.i18n = new I18nManager();
window.t = (key) => window.i18n.translateText(key);
window.toggleLanguage = () => window.i18n.toggle();
window.setLanguage = (lang) => window.i18n.setLanguage(lang);

// Sayfa Yüklendiğinde Otomatik Başlat
document.addEventListener('DOMContentLoaded', () => {
  window.i18n.updateButtons();
  window.i18n.applyTranslations();
  window.i18n.initObserver();
});
