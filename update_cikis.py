import re

with open('giris.html', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "document.getElementById('sidebarYorumlar').style.display = 'none';\n    document.getElementById('sidebarYaptigimYorumlar').style.display = '';\n    benimYorumTablosuYukle();",
    "document.getElementById('sidebarYorumlar').style.display = 'none';\n    document.getElementById('sidebarYaptigimYorumlar').style.display = 'none';"
)

with open('giris.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Done")
