import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

replacement = '''  <div class="panel-body">
    <h2 id="detail-title" class="business-title"></h2>
    
    <div class="section-block">
      <span class="section-subtitle">Hizmet Verilen Cihaz</span>
      <div id="detail-devices" class="tags-container"></div>
    </div>
    <div class="section-block">
      <span class="section-subtitle">Hizmet Verilen Markalar</span>
      <div id="detail-brands" class="tags-container"></div>
    </div>
    <div class="section-block info-box">
      <div class="info-row">
        <span>📧</span>
        <span id="detail-email" class="text-truncate"></span>
      </div>
    </div>

    <!-- YILDIZ VE PUAN BÖLÜMÜ -->
    <div id="detail-rating-container" style="display:flex; align-items:center; gap:10px; margin-bottom:15px; cursor:pointer; margin-top:20px;" onclick="openReviewsModal()">
      <div class="stars-outer" style="display:inline-block; position:relative; font-family:Arial; font-size:24px; color:#ddd; line-height:1; user-select:none;">
        <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
        <div class="stars-inner" id="detail-stars-inner" style="position:absolute; top:0; left:0; white-space:nowrap; overflow:hidden; color:#facc15;">
          <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
        </div>
      </div>
      <span id="detail-rating-text" style="font-weight:bold; font-size:16px; color:#333;">0.0</span>
      <span id="detail-rating-count" style="font-size:13px; color:#777;">(0)</span>
    </div>
    
    <button id="mobile-see-reviews-btn" class="submit-btn" style="display:none; width:100%; margin-bottom:15px; background:#3b82f6;" onclick="openReviewsModal()">Yorumları Gör</button>
    
    <!-- YORUMLAR LİSTESİ (SADECE BİLGİSAYARDA) -->
    <div id="desktop-reviews-section" style="margin-bottom:20px; border-top:1px solid #eee; padding-top:15px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
        <h3 style="font-size:15px; margin:0; color:#333;">Yorumlar</h3>
        <button onclick="openWriteReviewModal()" style="background:#4caf50; color:#fff; border:none; padding:6px 12px; border-radius:6px; font-size:13px; font-weight:600; cursor:pointer;">Yorum Yap</button>
      </div>
      <div id="desktop-reviews-list" style="display:flex; flex-direction:column; gap:10px; min-height:100px;"></div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:12px;">
        <button id="prev-reviews-btn" onclick="changeReviewPage(-1)" style="border:none; background:#e2e8f0; padding:6px 12px; border-radius:6px; cursor:pointer; font-size:13px; font-weight:600; color:#475569;" disabled>Geri</button>
        <span id="reviews-page-info" style="font-size:13px; color:#64748b; font-weight:600;">1/1</span>
        <button id="next-reviews-btn" onclick="changeReviewPage(1)" style="border:none; background:#e2e8f0; padding:6px 12px; border-radius:6px; cursor:pointer; font-size:13px; font-weight:600; color:#475569;" disabled>İleri</button>
      </div>
    </div>
  </div>'''

# We will regex replace from <div class="panel-body"> all the way to </div> right before <div class="panel-footer">
pattern = re.compile(r'<div class="panel-body">.*?</div>\s*<div class="panel-footer">', re.DOTALL)
content = pattern.sub(replacement + '\n  <div class="panel-footer">', content)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Done")
