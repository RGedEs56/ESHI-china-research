var chrome, $;
var itemData = {},
    itemDataArr = [],
    winIds = [],
    al = 0,
    Asins,
    C_win;
    
    var stop = function() {
        console.log(Asins);
        console.log(al);
        if(Asins && Asins.length > al){
            for(var text = "";al < Asins.length;al++){ text += (Asins[al] + '\n') ; }
            prompt("今回記入しなかったデータ一覧(このままコピーできます)",text);
        }
            C_win = Asins = null;
            al = 0;
            itemData = {};
            for (var a = 0; a < winIds.length; a++) try { chrome.tabs.remove(winIds[a]) } catch (b) { console.log("") }
            winIds = []
        },
        executeScriptWithjQuery = function(a, b) {
            chrome.tabs.executeScript(a, {  file: "jQuery3_2.js" });
            if(b !== "scraping/getdata.js"){
            chrome.tabs.executeScript(a, { file : "spin.min.js" });
            chrome.tabs.executeScript(a, { file: "spin_start.js" });
            }
            chrome.tabs.executeScript(a, { file: b });
        },
        openPage = function() {
            chrome.tabs.create({
                active: true,
                url: "https://www.amazon.co.jp/dp/" + Asins[al]
            }, function(a) {
                winIds.push(a.id);
                executeScriptWithjQuery(a.id, "scraping/getdata.js");
            })
        },
        test_Deferred = function(a, b) {
            var c = $.Deferred();
            try {
                chrome.tabs.create({
                    url: a,
                    active: true,
                }, function(a) {
                    winIds.push(a.id);
                    executeScriptWithjQuery(a.id, b);
                    c.resolve(a)
                })
            } catch (d) { c.reject("Error test_Deferred\n" + d) }
            return c.promise()
        },
        nextAsin = function(){
                if(Asins && ++al < Asins.length){
                    setTimeout(openPage,1E4 * Math.random())
                } else {
                    alert("Complite All Asin");
                    stop() 
                };
            },
        lastAction = function() {
            if (itemData.fba_totalcost && itemData.monthly_sales && itemData.fba_seller || itemData.fba_seller === 0) {
                chrome.storage.sync.get("SpreadsheetId", function(c) {
                    if (c) {
                        itemData.SpreadsheetId = c.SpreadsheetId;
                    } else {
                        alert('オプション画面にてスプレッドシートIDが入力されていません');
                        return stop();
                    }
                    console.log("last data");
                    console.log(itemData);
                    for (var a = 0; a < winIds.length; a++) try { chrome.tabs.remove(winIds[a]) } catch (b) { console.log("") }
                    winIds = [];
                    $.ajax({
                        type: "GET",
                        url: "https://script.google.com/macros/s/AKfycbzgP7IURaj1kQwU84EbgIq3iYXjcDayl9CQ_eT7ku5ZuoZufVg/exec",
                        cache: !0,
                        data: itemData,
                        timeout: 30000
                    }).always(function(data){
                        console.log("send complite" + data);
                    });
                    itemData = {};
                    nextAsin();
                })
            }
        }



    chrome.browserAction.onClicked.addListener(function(a) {
        if (C_win) confirm("中止しますか？") && stop();
        else if (chrome.windows.getCurrent({}, function(a) {
                C_win = a.id
            }), itemData = {}, winIds = [], a.url.match(/https\:\/\/www\.amazon\.co\.jp\/.*dp\/|https\:\/\/www\.amazon\.co\.jp\/.*gp\/product\/|https\:\/\/www\.amazon\.co\.jp\/.*o\/ASIN\//)) executeScriptWithjQuery(a.id, "scraping/getdata.js");
        else if (-1 !== a.url.indexOf("mnrate.com")) executeScriptWithjQuery(a.id, "scraping/only_monorate.js");
        else if (a.url.match(/https\:\/\/www\.amazon\.co\.jp\/.*[\?\&]me\=.*|https\:\/\/www\.amazon\.co\.jp\/.*keywords\=.*|https\:\/\/www\.amazon\.co\.jp\/.*marketplaceID\=/)) executeScriptWithjQuery(a.id, "scraping/getProducts.js");
        else {
            var a = prompt("\u4e00\u62ec\u3067\u5165\u529b\u3057\u305f\u3044ASIN\u3092\n\u30ab\u30f3\u30de(,)\n\u6539\u884c\n\u30b9\u30da\u30fc\u30b9\n\u306e\u3044\u305a\u308c\u304b\u3067\u533a\u5207\u3063\u3066\u5165\u529b\u3057\u3066\u304f\u3060\u3055\u3044");
            a && (a = a.replace(/[,\s]/g, "\n"), confirm("\u5165\u529b\u3057\u305fASIN\u4e00\u89a7\n\n" + a + "\n\n\u3053\u308c\u3089\u3092\u30b7\u30fc\u30c8\u306b\u8a18\u5165\u3057\u307e\u3059\u304b\uff1f\n\n\u203b\u5168\u3066\u8a18\u5165\u5b8c\u4e86\u307e\u3067\u306b" + Math.ceil(20 * a.split(/\n/).length / 60) + "\u5206\u7a0b\u304b\u304b\u308a\u307e\u3059\u3002\u3054\u6ce8\u610f\u304f\u3060\u3055\u3044\u3002")) ? (Asins = a.split(/\n/), al = 0, openPage()) : C_win = null;
        }
    });
    chrome.runtime.onMessage.addListener(function(a, b, c) {
        try {
        a.pageResponse.want_itemData ? c({
                itemData: itemData
            }) :
            (itemData = Object.assign(itemData, a.pageResponse), "stop" === itemData.nextActionName ? stop() 
            : "sellerCheck" === itemData.nextActionName ? (itemData.nextActionName = null, console.log("start"),test_Deferred("http://mnrate.com/item/aid/" + itemData.asin, "scraping/monorate.js") ,test_Deferred("https://www.amazon.co.jp/gp/offer-listing/" + itemData.asin + "/ref=olp_f_new?ie=UTF8&f_new=true&f_primeEligible=true&shipPromoFilter=1", "scraping/sellerCheck.js")) 
            : "calc" === itemData.nextActionName ? (console.log("calc"), test_Deferred("https://sellercentral-japan.amazon.com/fba/profitabilitycalculator/index?lang=ja_JP&asin=" + itemData.asin, "scraping/calculatorpage.js")) 
            : "openPage" === itemData.nextActionName && (itemData.nextActionName = null, Asins = itemData.Asins, al = 0, openPage()), lastAction())
} catch (a) {
    console.log(a), alert(a)
}
})