// جی ایم ڈی اسپارک
// مالک: بابا سعد میر ہادی
// مقصد: ٹریکنگ روکنا
// تاریخ: 2026

const K7 = {
  log: [],
  
  check: function() {
    var ua = navigator.userAgent;
    var ref = document.referrer;
    
    // اگر بوٹ یا ٹریکر ملا
    if(ua.match(/bot|crawl|track|analy/i) || ref.match(/tracking/i)) {
      this.log.push({
        time: new Date().getTime(),
        status: "BLOCKED"
      });
      
      // صرف 20 لاگ رکھو
      if(this.log.length > 20) {
        this.log = this.log.slice(-20);
      }
      
      // لوکل اسٹوریج میں محفوظ
      localStorage.setItem("k7_log", JSON.stringify(this.log));
      return false;
    }
    
    return true;
  }
};

// ہر 10 سیکنڈ میں چیک کرو
setInterval(function() {
  K7.check();
}, 10000);