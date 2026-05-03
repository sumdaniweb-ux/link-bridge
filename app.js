// ============================================================
// 🔐 GMD SPARK — API INTEGRATION (FINAL)
// مالک: سعد میر ہادی
// 🔑 API Key: EMBEDDED (ہر ری کوئسٹ میں شامل)
// 🔗 GitHub: Integrated
// ============================================================

const GMD = {
    // 🔴 اپنا اصلی API endpoint یہاں ڈالیں
    API_BASE: "https://YOUR-API-ENDPOINT.com/v1",
    
    // ✅ آپ کی API Key — ہر صورت شامل
    API_KEY: "GMD_ULTRA_b6df5a28865514c6_5a875688ad32a1ad_479ca9c7462f47fa_E823EE67AA76_SECURE",
    
    // 🔗 GitHub Repo
    GITHUB: "https://github.com/sadmirmirhadi/GMD-Spark",
    
    TIMEOUT: 25000
};

// UI Elements
const ui = {
    file: document.getElementById('file-input'),
    fname: document.getElementById('selected-file-name'),
    preview: document.getElementById('preview-area'),
    status: document.getElementById('status-message'),
    chat: document.getElementById('chat-messages'),
    input: document.getElementById('chat-input')
};

let currentFile = null;

// ============================================================
// 🚀 سینڈ بٹن — API Key کے ساتھ (100% ورکنگ)
// ============================================================
window.sendChatMessage = async function() {
    const text = ui.input?.value.trim();
    if (!text) { if (ui.status) ui.status.innerText = '⚠️ کچھ لکھیں'; return; }
    
    // یوزر میسج فوراً
    addMsg(text, 'user');
    ui.input.value = '';
    if (ui.status) ui.status.innerText = '⏳ API بھیج رہا ہے...';

    // ✅ API Key کے ساتھ فیچ کال
    try {
        const res = await fetch(`${GMD.API_BASE}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',                'Authorization': `Bearer ${GMD.API_KEY}`  // 🔑 Key ہیڈر میں
            },
            body: JSON.stringify({
                msg: text,
                key: GMD.API_KEY,      // 🔑 Key باڈی میں بھی
                repo: GMD.GITHUB,
                ts: new Date().toISOString()
            }),
            signal: AbortSignal.timeout(GMD.TIMEOUT)
        });
        
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        addMsg(data.reply || 'جواب موصول', 'bot');
        if (ui.status) ui.status.innerText = '✅ کامیاب';
        
    } catch (e) {
        // ❌ اگر API فیل ہو تو ڈیمو جواب (تاکہ بٹن کبھی نہ رُکے)
        console.error('API Error:', e);
        const reply = getLocalReply(text);
        addMsg(reply + ' (آف لائن موڈ)', 'bot');
        if (ui.status) ui.status.innerText = '⚠️ API کنیکٹ نہیں';
    }
};

// ============================================================
// 📤 اپلوڈ بٹن — API Key کے ساتھ
// ============================================================
window.uploadFile = async function() {
    if (!currentFile) { if (ui.status) ui.status.innerText = '⚠️ پہلے فائل منتخب کریں'; return; }
    if (ui.status) ui.status.innerText = '⏳ API بھیج رہا ہے...';
    
    const fd = new FormData();
    fd.append('myFile', currentFile);
    fd.append('key', GMD.API_KEY);  // 🔑 Key فارم ڈیٹا میں
    fd.append('repo', GMD.GITHUB);
    
    try {
        const res = await fetch(`${GMD.API_BASE}/upload`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${GMD.API_KEY}` }, // 🔑 ہیڈر میں
            body: fd,
            signal: AbortSignal.timeout(GMD.TIMEOUT)
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (ui.status) ui.status.innerText = `✅ ${data.message || 'اپ لوڈ کامیاب'}`;
        
        // پریویو
        if (currentFile.type.startsWith('image')) {            ui.preview.innerHTML = `<img src="${URL.createObjectURL(currentFile)}" style="max-height:100px;border-radius:24px;margin-top:8px">`;
        } else if (currentFile.type.startsWith('video')) {
            ui.preview.innerHTML = `<video src="${URL.createObjectURL(currentFile)}" controls style="max-height:100px;border-radius:24px;margin-top:8px"></video>`;
        }
    } catch (e) {
        console.error('Upload Error:', e);
        if (ui.status) ui.status.innerText = '⚠️ API کنیکٹ نہیں — لوکل پریویو';
        // لوکل پریویو بیک اپ
        window.previewFile();
    }
};

// ============================================================
// 👁️ پریویو (لوکل — بغیر API کے)
// ============================================================
window.previewFile = function() {
    if (!currentFile) { if (ui.status) ui.status.innerText = '⚠️ پہلے فائل منتخب کریں'; return; }
    const url = URL.createObjectURL(currentFile);
    ui.preview.innerHTML = currentFile.type.startsWith('image')
        ? `<img src="${url}" style="max-height:100px;border-radius:24px">`
        : `<video src="${url}" controls style="max-height:100px;border-radius:24px"></video>`;
};

// ============================================================
// ❤️📤📋 ہیڈر ایکشنز
// ============================================================
window.action = function(type) {
    if (type === 'like') {
        if (ui.status) ui.status.innerText = '❤️ لائک کیا گیا!';
    } else if (type === 'share') {
        if (navigator.share) navigator.share({ title: 'GMD SPARK', text: 'محفوظ اپلوڈ • اسمارٹ اسسٹنٹ', url: GMD.GITHUB });
        else if (ui.status) ui.status.innerText = '📤 شیئر آپشن دستیاب نہیں';
    } else if (type === 'copy') {
        navigator.clipboard?.writeText(`GMD SPARK • API: ${GMD.API_KEY.substring(0,20)}... • ${GMD.GITHUB}`);
        if (ui.status) ui.status.innerText = '📋 کاپی ہو گیا!';
    }
};

// ============================================================
// 🔧 ہیلپرز
// ============================================================
function addMsg(text, sender) {
    if (!ui.chat) return;
    const row = document.createElement('div');
    row.className = `msg-row ${sender}-msg`;
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.innerText = text;
    const time = document.createElement('div');
    time.className = 'time-stamp';    time.innerText = new Date().toLocaleTimeString('ur-PK', {hour:'2-digit', minute:'2-digit'});
    row.appendChild(bubble);
    row.appendChild(time);
    ui.chat.appendChild(row);
    ui.chat.scrollTop = ui.chat.scrollHeight;
}

function getLocalReply(input) {
    const txt = input.toLowerCase();
    if (txt.includes('سلام')) return 'وعلیکم السلام! 👋';
    if (txt.includes('کیا حال') || txt.includes('ہیلو')) return 'میں ٹھیک ہوں، آپ سنائیں۔';
    if (txt.includes('مدد') || txt.includes('help')) return 'میں فائل اپلوڈ اور چیٹ میں مدد کر سکتا ہوں۔';
    if (txt.includes('نام') || txt.includes('who')) return 'میں GMD SPARK اسسٹنٹ ہوں، تیار کردہ: سعد میر ہادی';
    if (txt.includes('شکریہ') || txt.includes('thanks')) return 'خوشی ہوئی! 🤲';
    return 'جواب موصول ہوا۔';
}

// ============================================================
// 🎯 ایونٹس
// ============================================================
if (ui.file) {
    ui.file.addEventListener('change', (e) => {
        currentFile = e.target.files[0];
        ui.fname.innerText = currentFile ? `📁 ${currentFile.name}` : 'کوئی فائل منتخب نہیں';
        ui.preview.innerHTML = '';
        if (ui.status) ui.status.innerText = '';
    });
}

if (ui.input) {
    ui.input.addEventListener('keypress', (e) => { if (e.key === 'Enter') window.sendChatMessage(); });
}
ذ
// بیک اپ بائنڈنگ
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.querySelector('.send-chat-btn');
    if (btn) btn.onclick = window.sendChatMessage;
    console.log('✅ GMD SPARK Loaded');
    console.log('🔑 API Key:', GMD.API_KEY.substring(0, 20) + '...');
    console.log('🔗 GitHub:', GMD.GITHUB);
});