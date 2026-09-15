import re

with open('giris.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Make it visible for normal members
content = content.replace(
    "document.getElementById('sidebarBilgilerim').style.display = 'none';\n    document.getElementById('sidebarUyeler').style.display = 'none';\n    document.getElementById('sidebarYorumlar').style.display = 'none';",
    "document.getElementById('sidebarBilgilerim').style.display = 'none';\n    document.getElementById('sidebarUyeler').style.display = 'none';\n    document.getElementById('sidebarYorumlar').style.display = 'none';\n    document.getElementById('sidebarYaptigimYorumlar').style.display = '';\n    benimYorumTablosuYukle();"
)

# And also for owner
content = content.replace(
    "document.getElementById('sidebarUyeler').style.display = '';\n        document.getElementById('sidebarYorumlar').style.display = '';\n        yorumTablosuYukle();",
    "document.getElementById('sidebarUyeler').style.display = '';\n        document.getElementById('sidebarYorumlar').style.display = '';\n        document.getElementById('sidebarYaptigimYorumlar').style.display = '';\n        yorumTablosuYukle();\n        benimYorumTablosuYukle();"
)

# And also for normal business owner
content = content.replace(
    "document.getElementById('sidebarBilgilerim').style.display = '';\n        document.getElementById('sidebarUyeler').style.display = 'none';\n        document.getElementById('sidebarYorumlar').style.display = 'none';",
    "document.getElementById('sidebarBilgilerim').style.display = '';\n        document.getElementById('sidebarUyeler').style.display = 'none';\n        document.getElementById('sidebarYorumlar').style.display = 'none';\n        document.getElementById('sidebarYaptigimYorumlar').style.display = '';\n        benimYorumTablosuYukle();"
)

with open('giris.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Done")
