// جی ایم ڈی اسپارک | شیلڈ وژن | مالک: بابا سعد میر ہادی
// مقصد: ویب/ویو بیسڈ ٹریکنگ کو روکیں، فرضی ڈیٹا دیں، لوکل لاگ محفوظ کریں
const K7_SHIELD = {
  log: [],
  limit: 50,
  fake: {
    geo: { coords: { latitude: 0, longitude: 0 }, accuracy: 0 },
    email: "blocked@k7.local",
    cookies: "",
    ip: "127.0.0.1",
    device: "K7_Mock_Device",
    id: "K7_" + Math.random().toString(36).slice(2, 10)
  },
  blockGeo() {
    if (navigator.geolocation) {
      const orig = navigator.geolocation.getCurrentPosition;
      navigator.geolocation.getCurrentPosition = (s, e, o) => {
        this.log.push({ t: Date.now(), type: "GPS", status: "BLOCKED" });
        if (s) s(this.fake.geo);
      };
    }
  },
  blockCookies() {
    try {
      Object.defineProperty(document, 'cookie', {
        get: () => (this.log.push({ t: Date.now(), type: "COOKIES", status: "BLOCKED" }), this.fake.cookies),
        set: () => true
      });
    } catch(e) {}
  },
  blockDeviceInfo() {
    try {
      const origUA = navigator.userAgent;
      Object.defineProperty(navigator, 'userAgent', { get: () => "K7_Safe_Browser" });
    } catch(e) {}
  },
  save() {
    if (this.log.length > this.limit) this.log = this.log.slice(-this.limit);
    localStorage.setItem("k7_shield_log", JSON.stringify(this.log));
  },
  init() {
    this.blockGeo();
    this.blockCookies();
    this.blockDeviceInfo();
    setInterval(() => this.save(), 8000);
  }
};
K7_SHIELD.init();