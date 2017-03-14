var $, chrome;
$(function() {
    chrome.runtime.sendMessage({
        pageResponse: {
            want_itemData: !0
        }
    }, function(b) {
        console.log(b);
        b = b.itemData;
        try {
            var a = $("#SalesRank").text().replace(",", "").match(/.*\d+\u4f4d/)[0]
        } catch (c) {
            a = null
        }
        a = {
            want_itemData: !1,
            nextActionName: "sellerCheck",
            asin: $("#ASIN").val(),
            category: a && a.replace(/\d+\u4f4d/, "").match(/[^\s\-]+/) ? a.replace(/\d+\u4f4d/, "").match(/[^\s\-]+/)[0] : "\u53d6\u5f97\u3067\u304d\u307e\u305b\u3093\u3067\u3057\u305f",
            title: $("#productTitle").text().replace(/^\s*|\s*$/g, ""),
            size_color: $(".disclaim:first").text() ||
                "",
            ranking: a && a.match(/\d+\u4f4d/) ? a.replace(/\,/,"").match(/\d+\u4f4d/)[0].replace("\u4f4d", "") : "\u53d6\u5f97\u3067\u304d\u307e\u305b\u3093\u3067\u3057\u305f"
        };
        try {
            a.cartPrice = new Number($("#priceblock_ourprice").text().replace(",","").match(/\d+/)[0])
        } catch (c) {
            a.cartPrice = 0
        }
        a = Object.assign(b, a);
        chrome.runtime.sendMessage({
            pageResponse: a
        })
    })
});