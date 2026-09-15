import re

with open('giris.html', 'r', encoding='utf-8') as f:
    content = f.read()

js_code = """
  // --- YAPTIĞIM YORUMLAR YÖNETİMİ ---
  let benimYorumSayfa = 1;
  const benimYorumSayfaBasina = 10;
  let duzenlenenBenimYorumIdx = null;
  
  function kufurIceriyorMuPanel(metin) {
    if(!metin) return false;
    const kufurler = ['aptal', 'salak', 'gerizekalı', 'amk', 'aq', 'şerefsiz', 'piç', 'orospu'];
    const kucukMetin = metin.toLocaleLowerCase('tr-TR');
    return kufurler.some(k => kucukMetin.includes(k));
  }

  function benimYorumTablosuYukle() {
    if (!aktifKullanici) return;
    
    const yorumlar = JSON.parse(localStorage.getItem('yorumlar') || '[]');
    let filtered = yorumlar.filter(y => y.yorum_isim === aktifKullanici.ad);
    
    const isletmeAra = document.getElementById('benimYorumAraIsletme').value.trim().toLowerCase();
    
    if (isletmeAra) {
      filtered = filtered.filter(y => (y.isletme_ismi || '').toLowerCase().includes(isletmeAra));
    }
    
    const tbody = document.getElementById('benimYorumlarTableBody');
    const emptyMsg = document.getElementById('benimYorumlarEmptyMsg');
    
    if (filtered.length === 0) {
      emptyMsg.style.display = 'block';
      tbody.innerHTML = '';
      document.getElementById('benimYorumSayfalama').innerHTML = '';
      return;
    }
    
    const toplamSayfa = Math.ceil(filtered.length / benimYorumSayfaBasina);
    if (benimYorumSayfa > toplamSayfa) benimYorumSayfa = toplamSayfa;
    const baslangic = (benimYorumSayfa - 1) * benimYorumSayfaBasina;
    const sayfaVerisi = filtered.slice(baslangic, baslangic + benimYorumSayfaBasina);
    
    emptyMsg.style.display = 'none';
    tbody.innerHTML = sayfaVerisi.map(y => {
      const orijinalIdx = yorumlar.indexOf(y);
      let durumStr = '<span style="color:#22c55e;">Yayında</span>';
      if(y.gizli) {
        durumStr = '<span style="color:#ef4444;" title="Yorumunuz kurallarımıza uymadığı için gizlenmiştir.">Gizli (İnceleniyor)</span>';
      }
      return `<tr>
        <td>${y.isletme_ismi}</td>
        <td>${y.puan}</td>
        <td><div style="max-width:300px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${y.yorum}">${y.yorum}</div></td>
        <td>${durumStr}</td>
        <td>
          <button class="btn-onayla" onclick="benimYorumDuzenle(${orijinalIdx})">Düzenle</button>
          <button class="btn-sil" onclick="benimYorumSil(${orijinalIdx})">Sil</button>
        </td>
      </tr>`;
    }).join('');
    
    let sayfaHTML = '';
    if (toplamSayfa > 1) {
      sayfaHTML += `<button class="filter-btn" onclick="benimYorumSayfaGit(1)" ${benimYorumSayfa===1?'disabled':''}>«</button>`;
      sayfaHTML += `<button class="filter-btn" onclick="benimYorumSayfaGit(${benimYorumSayfa-1})" ${benimYorumSayfa===1?'disabled':''}>‹</button>`;
      for (let s = 1; s <= toplamSayfa; s++) {
        sayfaHTML += `<button class="filter-btn ${s===benimYorumSayfa?'active':''}" onclick="benimYorumSayfaGit(${s})">${s}</button>`;
      }
      sayfaHTML += `<button class="filter-btn" onclick="benimYorumSayfaGit(${benimYorumSayfa+1})" ${benimYorumSayfa===toplamSayfa?'disabled':''}>›</button>`;
      sayfaHTML += `<button class="filter-btn" onclick="benimYorumSayfaGit(${toplamSayfa})" ${benimYorumSayfa===toplamSayfa?'disabled':''}>»</button>`;
    }
    document.getElementById('benimYorumSayfalama').innerHTML = sayfaHTML;
  }
  
  window.benimYorumSayfaGit = function(sayfa) {
    benimYorumSayfa = sayfa;
    benimYorumTablosuYukle();
  };
  
  window.benimYorumSil = function(idx) {
    if (!confirm('Bu yorumunuzu silmek istediğinizden emin misiniz?')) return;
    const yorumlar = JSON.parse(localStorage.getItem('yorumlar') || '[]');
    const islemGoren = yorumlar[idx];
    if(islemGoren.yorum_isim !== aktifKullanici.ad) {
      alert("Bu yorumu silme yetkiniz yok.");
      return;
    }
    yorumlar.splice(idx, 1);
    localStorage.setItem('yorumlar', JSON.stringify(yorumlar));
    
    if(typeof isletmeOrtalamaPuanGuncelleAdmin === 'function') {
      isletmeOrtalamaPuanGuncelleAdmin(islemGoren.isletme_ismi);
    }
    benimYorumTablosuYukle();
  };
  
  window.benimYorumDuzenle = function(idx) {
    const yorumlar = JSON.parse(localStorage.getItem('yorumlar') || '[]');
    const y = yorumlar[idx];
    if (!y || y.yorum_isim !== aktifKullanici.ad) return;
    duzenlenenBenimYorumIdx = idx;
    
    document.getElementById('duzBenimYorumIsletme').value = y.isletme_ismi || '';
    document.getElementById('duzBenimYorumPuan').value = y.puan || 0;
    document.getElementById('duzBenimYorumMetin').value = y.yorum || '';
    
    document.getElementById('benimYorumDuzenleOverlay').style.display = 'flex';
  };
  
  window.benimYorumDuzenleKapat = function() {
    duzenlenenBenimYorumIdx = null;
    document.getElementById('benimYorumDuzenleOverlay').style.display = 'none';
  };
  
  document.getElementById('benimYorumDuzenleKaydet').addEventListener('click', function() {
    if (duzenlenenBenimYorumIdx === null) return;
    
    const metin = document.getElementById('duzBenimYorumMetin').value.trim();
    if(metin.length < 30) {
      alert("Yorumunuz en az 30 karakter olmalıdır.");
      return;
    }
    
    let puan = parseFloat(document.getElementById('duzBenimYorumPuan').value);
    if(isNaN(puan) || puan < 1 || puan > 5) {
      alert("Geçerli bir puan giriniz (1 ile 5 arası).");
      return;
    }
    
    const gizliDurum = kufurIceriyorMuPanel(metin);
    
    const yorumlar = JSON.parse(localStorage.getItem('yorumlar') || '[]');
    const y = yorumlar[duzenlenenBenimYorumIdx];
    
    if(y.yorum_isim !== aktifKullanici.ad) {
      alert("Bu yorumu düzenleme yetkiniz yok.");
      return;
    }
    
    y.puan = puan;
    y.yorum = metin;
    y.gizli = gizliDurum;
    
    localStorage.setItem('yorumlar', JSON.stringify(yorumlar));
    
    if(typeof isletmeOrtalamaPuanGuncelleAdmin === 'function') {
      isletmeOrtalamaPuanGuncelleAdmin(y.isletme_ismi);
    }
    
    benimYorumDuzenleKapat();
    benimYorumTablosuYukle();
  });
"""

content = content.replace(
    '  // Otomatik çıkış kontrolü',
    js_code + '\n  // Otomatik çıkış kontrolü'
)

with open('giris.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Done")
