const { spawn } = require('child_process');

async function test() {
  const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--headless',
    '--remote-debugging-port=9230',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=375,667'
  ]);

  await new Promise(r => setTimeout(r, 1200));

  try {
    const listRes = await fetch('http://127.0.0.1:9230/json');
    const tabs = await listRes.json();
    const pageTab = tabs.find(t => t.type === 'page');

    const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    let id = 1;
    function send(method, params = {}) {
      return new Promise((resolve) => {
        const curId = id++;
        const handler = (msg) => {
          const res = JSON.parse(msg.data);
          if (res.id === curId) {
            ws.removeEventListener('message', handler);
            resolve(res);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: curId, method, params }));
      });
    }

    await send('Page.enable');
    await send('Page.navigate', { url: 'http://localhost:3000/giris.html' });

    for (let i = 0; i < 20; i++) {
      const chk = await send('Runtime.evaluate', { expression: '!!document.getElementById("loginBox")' });
      if (chk && chk.result && chk.result.result && chk.result.result.value) break;
      await new Promise(r => setTimeout(r, 300));
    }

    const res = await send('Runtime.evaluate', {
      expression: `(() => {
        const box = document.getElementById('loginBox');
        const btn = document.getElementById('loginLangToggleBtn');
        const h2 = box.querySelector('h2');
        const bx = box.getBoundingClientRect();
        const br = btn.getBoundingClientRect();
        const hr = h2.getBoundingClientRect();
        return JSON.stringify({
          windowW: window.innerWidth,
          box: { top: bx.top, left: bx.left, width: bx.width, height: bx.height },
          btn: { top: br.top, left: br.left, width: br.width, height: br.height, right: br.right, bottom: br.bottom },
          h2: { top: hr.top, left: hr.left, width: hr.width, height: hr.height, right: hr.right, bottom: hr.bottom },
          overlap: !(br.right < hr.left || br.left > hr.right || br.bottom < hr.top || br.top > hr.bottom),
          overlapVertical: !(br.bottom < hr.top || br.top > hr.bottom),
          overlapHorizontal: !(br.right < hr.left || br.left > hr.right)
        });
      })()`
    });

    console.log('REAL MEASUREMENTS WITHOUT FIX:', res.result.result.value);

    ws.close();
  } catch(e) {
    console.error(e);
  } finally {
    edge.kill();
  }
}

test();
