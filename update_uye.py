import re

with open('giris.html', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "bilgilerimTablosuYukle(bulunan.e_posta);\n      } else {",
    "bilgilerimTablosuYukle(bulunan.e_posta);\n        document.getElementById('sidebarYaptigimYorumlar').style.display = '';\n        benimYorumTablosuYukle();\n      } else {"
)

with open('giris.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Done")
