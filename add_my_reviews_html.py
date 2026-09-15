import re

with open('giris.html', 'r', encoding='utf-8') as f:
    content = f.read()

sidebar_html = '''        <div class="admin-sidebar-item" data-tab="yaptigim_yorumlar" id="sidebarYaptigimYorumlar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>
          <span>Yaptığım Yorumlar</span>
        </div>\n'''

content = content.replace(
    '        <div class="admin-sidebar-item" data-tab="uyeler" style="display:none;" id="sidebarUyeler">',
    sidebar_html + '        <div class="admin-sidebar-item" data-tab="uyeler" style="display:none;" id="sidebarUyeler">'
)

tab_html = '''      <div class="tab-content" id="tabYaptigim_yorumlar">
        <div class="table-section">
          <div class="table-header">
            <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;width:100%;">
              <h3 style="margin:0;">Yaptığım Yorumlar</h3>
              <input type="text" id="benimYorumAraIsletme" placeholder="İşletme Ara..." oninput="benimYorumSayfa=1;benimYorumTablosuYukle()" style="width:200px;padding:6px 12px;border:1px solid #334155;border-radius:20px;background:#0f172a;color:#fff;font:400 12px/1 'Segoe UI',Arial,sans-serif;outline:none;">
            </div>
          </div>
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>İşletme Adı</th>
                  <th>Puan</th>
                  <th>Yorum</th>
                  <th>Durum</th>
                  <th>İşlem</th>
                </tr>
              </thead>
              <tbody id="benimYorumlarTableBody"></tbody>
            </table>
            <div id="benimYorumlarEmptyMsg" class="empty-msg">Yaptığınız herhangi bir yorum bulunmamaktadır.</div>
          </div>
          <div id="benimYorumSayfalama" style="display:flex;justify-content:center;align-items:center;gap:6px;margin-top:14px;"></div>
        </div>
      </div>\n'''

content = content.replace(
    '      <div class="tab-content" id="tabUyeler">',
    tab_html + '      <div class="tab-content" id="tabUyeler">'
)

modal_html = '''
<div id="benimYorumDuzenleOverlay" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:3000;justify-content:center;align-items:center;">
  <div style="width:360px;max-width:90vw;background:#1e293b;border-radius:12px;padding:24px;position:relative;">
    <button onclick="benimYorumDuzenleKapat()" style="position:absolute;top:12px;right:12px;background:none;border:none;color:#94a3b8;cursor:pointer;font-size:20px;">✕</button>
    <h3 style="margin-top:0;margin-bottom:16px;color:#f8fafc;font:600 16px/1 'Segoe UI',Arial,sans-serif;">Yorumumu Düzenle</h3>
    
    <div style="margin-bottom:10px;">
      <label style="color:#94a3b8;font:500 12px/1 'Segoe UI',Arial,sans-serif;display:block;margin-bottom:4px;">İşletme Adı</label>
      <input type="text" id="duzBenimYorumIsletme" disabled style="width:100%;padding:10px;border:1px solid #334155;border-radius:8px;background:#0f172a;color:#94a3b8;font:400 14px/1 'Segoe UI',Arial,sans-serif;">
    </div>
    
    <div style="margin-bottom:10px;">
      <label style="color:#94a3b8;font:500 12px/1 'Segoe UI',Arial,sans-serif;display:block;margin-bottom:4px;">Puan (1-5 arası, buçuklu olabilir)</label>
      <input type="number" step="0.5" min="1" max="5" id="duzBenimYorumPuan" style="width:100%;padding:10px;border:1px solid #334155;border-radius:8px;background:#0f172a;color:#fff;font:400 14px/1 'Segoe UI',Arial,sans-serif;">
    </div>

    <div style="margin-bottom:16px;">
      <label style="color:#94a3b8;font:500 12px/1 'Segoe UI',Arial,sans-serif;display:block;margin-bottom:4px;">Yorum İçeriği (En az 30 karakter)</label>
      <textarea id="duzBenimYorumMetin" rows="4" style="width:100%;padding:10px;border:1px solid #334155;border-radius:8px;background:#0f172a;color:#fff;font:400 14px/1.5 'Segoe UI',Arial,sans-serif;resize:none;"></textarea>
    </div>
    
    <button id="benimYorumDuzenleKaydet" style="width:100%;padding:10px;border:none;border-radius:8px;background:#22c55e;color:#fff;font:600 14px/1 'Segoe UI',Arial,sans-serif;cursor:pointer;">Kaydet</button>
  </div>
</div>\n'''

content = content.replace(
    '<div id="uyeDuzenleOverlay"',
    modal_html + '<div id="uyeDuzenleOverlay"'
)

with open('giris.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Done")
