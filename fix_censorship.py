import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Display censored name in UI
content = content.replace(
    '<div style="font-weight:600; font-size:13px; color:#1e293b;"></div>',
    '<div style="font-weight:600; font-size:13px; color:#1e293b;"></div>'
)

# 2. Save uncensored name
content = content.replace(
    'yorum_isim: isimSansurle(aktifOturum.ad),',
    'yorum_isim: aktifOturum.ad,'
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Done index.html")

# Now update giris.html table header
with open('giris.html', 'r', encoding='utf-8') as f:
    giris = f.read()

giris = giris.replace(
    '<th>Kullanıcı (Sansürlü)</th>',
    '<th>Kullanıcı</th>'
)

with open('giris.html', 'w', encoding='utf-8') as f:
    f.write(giris)
print("Done giris.html")
