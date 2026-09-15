import re

with open('giris.html', 'r', encoding='utf-8') as f:
    content = f.read()

js_code = '''
  // --- YORUMLAR TABLOSU VE YÖNETİMİ ---
  let yorumSayfa = 1;
  const yorumSayfaBasina = 10;
  let duzenlenenYorumIdx = null;

  function yorumTablosuYukle() {
    const yorumlar = JSON.parse(localStorage.getItem('yorumlar') || '[]');
    let filtered = [...yorumlar];
    
    const isletmeAra = document.getElementById('yorumAraIsletme').value.trim().toLowerCase();
    const kullaniciAra = document.getElementById('yorumAraKullanici').value.trim().toLowerCase();
    
    if (isletmeAra) {
      filtered = filtered.filter(y => (y.isletme_ismi || '').toLowerCase().includes(isletmeAra));
    }
    if (kullaniciAra) {
      filtered = filtered.filter(y => (y.yorum_isim || '').toLowerCase().includes(kullaniciAra));
    }
    
    const tbody = document.getElementById('yorumlarTableBody');
    const emptyMsg = document.getElementById('yorumlarEmptyMsg');
    
    if (filtered.length === 0) {
      emptyMsg.style.display = 'block';
      tbody.innerHTML = '';
      document.getElementById('yorumSayfalama').innerHTML = '';
      return;
    }
    
    const toplamSayfa = Math.ceil(filtered.length / yorumSayfaBasina);
    if (yorumSayfa > toplamSayfa) yorumSayfa = toplamSayfa;
    const baslangic = (yorumSayfa - 1) * yorumSayfaBasina;
    const sayfaVerisi = filtered.slice(baslangic, baslangic + yorumSayfaBasina);
    
    emptyMsg.style.display = 'none';
    tbody.innerHTML = sayfaVerisi.map(y => {
      const orijinalIdx = yorumlar.indexOf(y);
      const durumStr = y.gizli ? '<span style="color:#ef4444;">Gizli</span>' : '<span style="color:#22c55e;">Görünür</span>';
      return <tr>
        <td></td>
        <td></td>
        <td></td>
        <td><div style="max-width:300px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title=""></div></td>
        <td></td>
        <td>
          <button class="btn-onayla" onclick="yorumDuzenle()">Düzenle</button>
          <button class="btn-sil" onclick="yorumSil()">Sil</button>
        </td>
      </tr>;
    }).join('');
    
    let sayfaHTML = '';
    if (toplamSayfa > 1) {
      sayfaHTML += <button class="filter-btn" onclick="yorumSayfaGit(1)" >«</button>;
      sayfaHTML += <button class="filter-btn" onclick="yorumSayfaGit()" >‹</button>;
      for (let s = 1; s <= toplamSayfa; s++) {
        sayfaHTML += <button class="filter-btn " onclick="yorumSayfaGit()"></button>;
      }
      sayfaHTML += <button class="filter-btn" onclick="yorumSayfaGit()" >›</button>;
      sayfaHTML += <button class="filter-btn" onclick="yorumSayfaGit()" >»</button>;
    }
    document.getElementById('yorumSayfalama').innerHTML = sayfaHTML;
  }
  
  window.yorumSayfaGit = function(sayfa) {
    yorumSayfa = sayfa;
    yorumTablosuYukle();
  };
  
  window.yorumSil = function(idx) {
    if (!confirm('Bu yorumu silmek istediğinizden emin misiniz?')) return;
    const yorumlar = JSON.parse(localStorage.getItem('yorumlar') || '[]');
    const islemGoren = yorumlar[idx];
    yorumlar.splice(idx, 1);
    localStorage.setItem('yorumlar', JSON.stringify(yorumlar));
    
    isletmeOrtalamaPuanGuncelleAdmin(islemGoren.isletme_ismi);
    
    yorumTablosuYukle();
  };
  
  window.yorumDuzenle = function(idx) {
    const yorumlar = JSON.parse(localStorage.getItem('yorumlar') || '[]');
    const y = yorumlar[idx];
    if (!y) return;
    duzenlenenYorumIdx = idx;
    
    document.getElementById('duzYorumIsletme').value = y.isletme_ismi || '';
    document.getElementById('duzYorumIsim').value = y.yorum_isim || '';
    document.getElementById('duzYorumPuan').value = y.puan || 0;
    document.getElementById('duzYorumMetin').value = y.yorum || '';
    document.getElementById('duzYorumGizli').value = y.gizli ? 'true' : 'false';
    
    document.getElementById('yorumDuzenleOverlay').style.display = 'flex';
  };
  
  window.yorumDuzenleKapat = function() {
    duzenlenenYorumIdx = null;
    document.getElementById('yorumDuzenleOverlay').style.display = 'none';
  };
  
  document.getElementById('yorumDuzenleKaydet').addEventListener('click', function() {
    if (duzenlenenYorumIdx === null) return;
    const yorumlar = JSON.parse(localStorage.getItem('yorumlar') || '[]');
    const y = yorumlar[duzenlenenYorumIdx];
    
    y.puan = parseFloat(document.getElementById('duzYorumPuan').value) || 0;
    y.yorum = document.getElementById('duzYorumMetin').value.trim();
    y.gizli = document.getElementById('duzYorumGizli').value === 'true';
    
    localStorage.setItem('yorumlar', JSON.stringify(yorumlar));
    
    isletmeOrtalamaPuanGuncelleAdmin(y.isletme_ismi);
    
    yorumDuzenleKapat();
    yorumTablosuYukle();
  });
  
  function isletmeOrtalamaPuanGuncelleAdmin(isletmeIsmi) {
    const yorumlar = JSON.parse(localStorage.getItem('yorumlar') || '[]');
    const gecerliYorumlar = yorumlar.filter(y => y.isletme_ismi === isletmeIsmi && !y.gizli);
    
    let ortalama = 0;
    if (gecerliYorumlar.length > 0) {
      const toplam = gecerliYorumlar.reduce((acc, y) => acc + parseFloat(y.puan), 0);
      ortalama = Math.floor((toplam / gecerliYorumlar.length) * 10) / 10;
    }
    
    const isletmeler = JSON.parse(localStorage.getItem('isletmeler') || '[]');
    const i = isletmeler.find(is => is.isletme_adi === isletmeIsmi);
    if (i) {
      i.ortalama_puan = ortalama;
      localStorage.setItem('isletmeler', JSON.stringify(isletmeler));
      
      // Update tables in UI
      haritaTablosuYukle();
      tabloyuYukle();
      bilgilerimTablosuYukle();
    }
  }
'''

content = content.replace(
    '  // Otomatik çıkış kontrolü',
    js_code + '\n  // Otomatik çıkış kontrolü'
)

with open('giris.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Done")
