var $, chrome;
$(function() {
    for (var a = "", b = document.getElementsByClassName("s-access-detail-page"), c = 0; c < b.length; c++) try {
        a += b[c].getAttribute("href").match(/\/dp\/B0[0-Z]{8}/)[0].match(/B0[0-Z]{8}/)[0] + "\n"
    } catch (d) {
        a += b[c].getAttribute("href").match(/B0[0-Z]{8}/)[0] + "\n"
    }
    confirm("\u8868\u793a\u4e2d\u306eAmazon\u30da\u30fc\u30b8\u306eASIN\u4e00\u89a7\n\n" + a + "\n\u3053\u308c\u3089\u3092\u30b7\u30fc\u30c8\u306b\u8a18\u5165\u3057\u307e\u3059\u304b\uff1f\n\n\u203b\u5168\u3066\u8a18\u5165\u5b8c\u4e86\u307e\u3067\u306b" + Math.ceil(20 *
        b.length / 60) + "\u5206\u7a0b\u304b\u304b\u308a\u307e\u3059\u3002\u3054\u6ce8\u610f\u304f\u3060\u3055\u3044\u3002") ? chrome.runtime.sendMessage({
        pageResponse: {
            Asins: a.split("\n"),
            nextActionName: "openPage",
            want_itemData: !1
        }
    }) : chrome.runtime.sendMessage({
        pageResponse: {
            want_itemData: !1,
            nextActionName: "stop"
        }
    })
});