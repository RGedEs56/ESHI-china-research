var $, chrome;
$(function() {
    chrome.runtime.sendMessage({
        pageResponse: {
            want_itemData: !0
        }
    }, function(c) {
        c = c.itemData;
        for (var b = 0, d = document.getElementsByClassName("olpOfferPrice"); b < d.length; b++){
            if(d){
            if (0 === b) var a = d[b].textContent.replace(",", "").match(/\d+/)[0];
            else if (new Number(d[b].textContent.replace(",", "").match(/\d+/)[0]) > 1.3 * a) break;
            } else { a = c.cartPrice;}
        }
        a = {
            want_itemData: !1,
            nextActionName: "calc",
            cartPrice: a,
            rival: b
        };
        a = Object.assign(c, a);
        console.log(a);
        chrome.runtime.sendMessage({
            pageResponse: a
        })
    })
});