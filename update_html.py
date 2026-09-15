import re

with open('giris.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Add Sidebar Item
sidebar_yorumlar = '''        <div class="admin-sidebar-item" data-tab="yorumlar" style="display:none;" id="sidebarYorumlar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
          <span>Yorumlar</span>
        </div>\n'''

content = content.replace(
    '        <div class="admin-sidebar-item" data-tab="uyeler" style="display:none;" id="sidebarUyeler">',
    sidebar_yorumlar + '        <div class="admin-sidebar-item" data-tab="uyeler" style="display:none;" id="sidebarUyeler">'
)

# Add Tab Content
tab_yorumlar = '''      <div class="tab-content" id="tabYorumlar">
        <div class="table-section">
          <div class="table-header">
            <div style="display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;">
              <h3 style="margin:0;">İşletme Yorumları</h3>
              <input type="text" id="yorumAraIsletme" placeholder="İşletme Ara..." oninput="yorumSayfa=1;yorumTablosuYukle()" style="width:200px;padding:6px 12px;border:1px solid #334155;border-radius:20px;background:#0f172a;color:#fff;font:400 12px/1 'Segoe UI',Arial,sans-serif;outline:none;">
              <input type="text" id="yorumAraKullanici" placeholder="Kullanıcı Ara..." oninput="yorumSayfa=1;yorumTablosuYukle()" style="width:200px;padding:6px 12px;border:1px solid #334155;border-radius:20px;background:#0f172a;color:#fff;font:400 12px/1 'Segoe UI',Arial,sans-serif;outline:none;">
            </div>
          </div>
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>İşletme Adı</th>
                  <th>Kullanıcı (Sansürlü)</th>
                  <th>Puan</th>
                  <th>Yorum</th>
                  <th>Durum</th>
                  <th>İşlem</th>
                </tr>
              </thead>
              <tbody id="yorumlarTableBody"></tbody>
            </table>
            <div id="yorumlarEmptyMsg" class="empty-msg">Kayıtlı yorum bulunmamaktadır.</div>
          </div>
          <div id="yorumSayfalama" style="display:flex;justify-content:center;align-items:center;gap:6px;margin-top:14px;"></div>
        </div>
      </div>\n'''

content = content.replace(
    '      <div class="tab-content" id="tabUyeler">',
    tab_yorumlar + '      <div class="tab-content" id="tabUyeler">'
)

with open('giris.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Done")
