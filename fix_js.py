import re

with open('giris.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the broken table string
old_code = """    tbody.innerHTML = sayfaVerisi.map(y => {
      const orijinalIdx = yorumlar.indexOf(y);
      const durumStr = y.gizli ? '<span style="color:#ef4444;">Gizli</span>' : '<span style="color:#22c55e;">Görünür</span>';
      return `<tr>
        <td></td>
        <td></td>
        <td></td>
        <td><div style="max-width:300px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title=""></div></td>
        <td></td>
        <td>
          <button class="btn-onayla" onclick="yorumDuzenle()">Düzenle</button>
          <button class="btn-sil" onclick="yorumSil()">Sil</button>
        </td>
      </tr>`;
    }).join('');"""

new_code = """    tbody.innerHTML = sayfaVerisi.map(y => {
      const orijinalIdx = yorumlar.indexOf(y);
      const durumStr = y.gizli ? '<span style="color:#ef4444;">Gizli</span>' : '<span style="color:#22c55e;">Görünür</span>';
      return `<tr>
        <td>${y.isletme_ismi}</td>
        <td>${y.yorum_isim}</td>
        <td>${y.puan}</td>
        <td><div style="max-width:300px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${y.yorum}">${y.yorum}</div></td>
        <td>${durumStr}</td>
        <td>
          <button class="btn-onayla" onclick="yorumDuzenle(${orijinalIdx})">Düzenle</button>
          <button class="btn-sil" onclick="yorumSil(${orijinalIdx})">Sil</button>
        </td>
      </tr>`;
    }).join('');"""

content = content.replace(old_code, new_code)

with open('giris.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Done")
