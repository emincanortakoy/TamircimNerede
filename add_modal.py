import re

with open('giris.html', 'r', encoding='utf-8') as f:
    content = f.read()

modal_html = '''
<div id="yorumDuzenleOverlay" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:3000;justify-content:center;align-items:center;">
  <div style="width:360px;max-width:90vw;background:#1e293b;border-radius:12px;padding:24px;position:relative;">
    <button onclick="yorumDuzenleKapat()" style="position:absolute;top:12px;right:12px;background:none;border:none;color:#94a3b8;cursor:pointer;font-size:20px;">✕</button>
    <h3 style="margin-top:0;margin-bottom:16px;color:#f8fafc;font:600 16px/1 'Segoe UI',Arial,sans-serif;">Yorum Düzenle</h3>
    
    <div style="margin-bottom:10px;">
      <label style="color:#94a3b8;font:500 12px/1 'Segoe UI',Arial,sans-serif;display:block;margin-bottom:4px;">İşletme Adı</label>
      <input type="text" id="duzYorumIsletme" disabled style="width:100%;padding:10px;border:1px solid #334155;border-radius:8px;background:#0f172a;color:#94a3b8;font:400 14px/1 'Segoe UI',Arial,sans-serif;">
    </div>
    
    <div style="margin-bottom:10px;">
      <label style="color:#94a3b8;font:500 12px/1 'Segoe UI',Arial,sans-serif;display:block;margin-bottom:4px;">Yorumu Yapan (İsim)</label>
      <input type="text" id="duzYorumIsim" disabled style="width:100%;padding:10px;border:1px solid #334155;border-radius:8px;background:#0f172a;color:#94a3b8;font:400 14px/1 'Segoe UI',Arial,sans-serif;">
    </div>
    
    <div style="margin-bottom:10px;">
      <label style="color:#94a3b8;font:500 12px/1 'Segoe UI',Arial,sans-serif;display:block;margin-bottom:4px;">Puan</label>
      <input type="number" step="0.5" min="1" max="5" id="duzYorumPuan" style="width:100%;padding:10px;border:1px solid #334155;border-radius:8px;background:#0f172a;color:#fff;font:400 14px/1 'Segoe UI',Arial,sans-serif;">
    </div>

    <div style="margin-bottom:16px;">
      <label style="color:#94a3b8;font:500 12px/1 'Segoe UI',Arial,sans-serif;display:block;margin-bottom:4px;">Yorum İçeriği</label>
      <textarea id="duzYorumMetin" rows="4" style="width:100%;padding:10px;border:1px solid #334155;border-radius:8px;background:#0f172a;color:#fff;font:400 14px/1.5 'Segoe UI',Arial,sans-serif;resize:none;"></textarea>
    </div>

    <div style="margin-bottom:16px;">
      <label style="color:#94a3b8;font:500 12px/1 'Segoe UI',Arial,sans-serif;display:block;margin-bottom:4px;">Görünürlük Durumu (Gizli)</label>
      <select id="duzYorumGizli" style="width:100%;padding:10px;border:1px solid #334155;border-radius:8px;background:#0f172a;color:#fff;font:400 14px/1 'Segoe UI',Arial,sans-serif;">
        <option value="false">Görünür (Küfür Yok)</option>
        <option value="true">Gizli (Küfür/Uygunsuz)</option>
      </select>
    </div>
    
    <button id="yorumDuzenleKaydet" style="width:100%;padding:10px;border:none;border-radius:8px;background:#22c55e;color:#fff;font:600 14px/1 'Segoe UI',Arial,sans-serif;cursor:pointer;">Kaydet</button>
  </div>
</div>\n'''

content = content.replace(
    '<div id="uyeDuzenleOverlay"',
    modal_html + '<div id="uyeDuzenleOverlay"'
)

with open('giris.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Done")
