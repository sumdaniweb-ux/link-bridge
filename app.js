// link-bridge — API Integration
const API = {
    BASE: "https://YOUR-API.com/v1",
    KEY: "GMD_ULTRA_SECURE_KEY",
    REPO: "https://github.com/sumdaniweb-ux/link-bridge"
};

async function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if (!text) return;
    
    // یوزر میسج
    addMessage(text, 'user');
    input.value = '';
    
    // API کال (ڈیمو فال بیک)
    try {
        const res = await fetch(`${API.BASE}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API.KEY}`
            },
            body: JSON.stringify({ msg: text, key: API.KEY })
        });
        const data = await res.json();
        addMessage(data.reply || 'جواب موصول', 'bot');
    } catch {
        // لوکل فال بیک
        setTimeout(() => {
            const reply = text.includes('سلام') ? 'وعلیکم السلام!' : 'جواب تیار ہے۔';
            addMessage(reply, 'bot');
        }, 400);
    }
}

function addMessage(text, sender) {
    const chat = document.getElementById('chat-messages');
    const row = document.createElement('div');
    row.className = `msg-row ${sender}-msg`;
    row.innerHTML = `
        <div class="bubble">${text}</div>
        <div class="time-stamp">${new Date().toLocaleTimeString('ur-PK',{hour:'2-digit',minute:'2-digit'})}</div>
    `;
    chat.appendChild(row);
    chat.scrollTop = chat.scrollHeight;
}

function uploadFile() {
    const file = document.getElementById('file-input').files[0];
    const status = document.getElementById('status-message');
    if (!file) { status.innerText = '⚠️ فائل منتخب کریں'; return; }
    
    status.innerText = '⏳ اپ لوڈ ہو رہا ہے...';
    // API کال یہاں آئے گی
    setTimeout(() => { status.innerText = '✅ کامیاب (ڈیمو)'; }, 800);
}

function previewFile() {
    const file = document.getElementById('file-input').files[0];
    const preview = document.getElementById('preview-area');
    if (!file) return;
    const url = URL.createObjectURL(file);
    preview.innerHTML = file.type.startsWith('image') 
        ? `<img src="${url}" style="max-height:100px;border-radius:24px">`
        : `<video src="${url}" controls style="max-height:100px;border-radius:24px"></video>`;
}

function action(type) {
    if (type === 'copy') {
        navigator.clipboard?.writeText('link-bridge • Mateen Sumdani');
        alert('📋 کاپی ہو گیا!');
    } else if (type === 'share') {
        navigator.share?.({ title: 'link-bridge', url: location.href });
    } else {
        alert('❤️ شکریہ!');
    }
}

// ایونٹس
document.getElementById('chat-input')?.addEventListener('keypress', e => {
    if (e.key === 'Enter') sendChatMessage();
});
console.log('✅ link-bridge Loaded');
