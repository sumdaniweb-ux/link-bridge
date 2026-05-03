# فائل اپ لوڈ کرنے سے پہلے یہ چلائیں
echo "S7_$(date +%s)_$(sha256sum gmd_sentinel.js | cut -d' ' -f1)" > .s7_sig