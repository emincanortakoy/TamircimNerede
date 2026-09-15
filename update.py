import re

with open('giris.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add Ortalama Puan header
content = content.replace(
    '<th>Servis Türü</th>\n                  <th>Konum</th>\n                  <th>İşlem</th>',
    '<th>Servis Türü</th>\n                  <th>Konum</th>\n                  <th>Ortalama Puan</th>\n                  <th>İşlem</th>'
)

# 2. Add Ortalama Puan data cell
content = content.replace(
    '        <td></td><td></td>\n        <td><button class="btn-onayla"',
    '        <td></td><td></td>\n        <td></td>\n        <td><button class="btn-onayla"'
)

# 3. Add modal input field
modal_input = '''    <div style="margin-bottom:10px;">
      <label style="color:#94a3b8;font:500 12px/1 'Segoe UI',Arial,sans-serif;display:block;margin-bottom:4px;">Ortalama Puan</label>
      <input type="number" step="0.1" min="0" max="5" id="duzIsletmePuan" style="width:100%;padding:10px;border:1px solid #334155;border-radius:8px;background:#0f172a;color:#fff;font:400 14px/1 'Segoe UI',Arial,sans-serif;">
    </div>\n'''

content = content.replace(
    '''    <div style="margin-bottom:16px;">
      <label style="color:#94a3b8;font:500 12px/1 'Segoe UI',Arial,sans-serif;display:block;margin-bottom:4px;">Onay Durumu</label>''',
    modal_input + '''    <div style="margin-bottom:16px;">
      <label style="color:#94a3b8;font:500 12px/1 'Segoe UI',Arial,sans-serif;display:block;margin-bottom:4px;">Onay Durumu</label>'''
)

# 4. Update isletmeDuzenle
content = content.replace(
    "document.getElementById('duzIsletmeServis').value = i.yetkili_servis_ozel_servis || 'Özel Servis';",
    "document.getElementById('duzIsletmeServis').value = i.yetkili_servis_ozel_servis || 'Özel Servis';\n    document.getElementById('duzIsletmePuan').value = i.ortalama_puan || 0;"
)

# 5. Update isletmeDuzenleKaydet
content = content.replace(
    "i.yetkili_servis_ozel_servis = document.getElementById('duzIsletmeServis').value;",
    "i.yetkili_servis_ozel_servis = document.getElementById('duzIsletmeServis').value;\n    i.ortalama_puan = parseFloat(document.getElementById('duzIsletmePuan').value) || 0;"
)

with open('giris.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Done")
