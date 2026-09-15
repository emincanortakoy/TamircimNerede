import re

with open('giris.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Add display toggle for Yorumlar
content = content.replace(
    "document.getElementById('sidebarUyeler').style.display = '';",
    "document.getElementById('sidebarUyeler').style.display = '';\n        document.getElementById('sidebarYorumlar').style.display = '';\n        yorumTablosuYukle();"
)

content = content.replace(
    "document.getElementById('sidebarUyeler').style.display = 'none';",
    "document.getElementById('sidebarUyeler').style.display = 'none';\n    document.getElementById('sidebarYorumlar').style.display = 'none';"
)

with open('giris.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Done")
