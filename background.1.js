var chrome, $, itemData = {},
    winIds = [],
    Asins = null,
    al = 0,
    C_win = null;
try {
    var stop = function() {
            C_win = Asins = null;
            al = 0;
            itemData = {};
            for (var a = 0; a < winIds.length; a++) try {
                chrome.tabs.remove(winIds[a])
            } catch (b) {
                console.log(b)
            }
            winIds = []
        },
        executeScriptWithjQuery = function(a, b) {
            chrome.tabs.executeScript(a, {
                file: "jQuery3_1.js"
            }, function(c) {
                chrome.tabs.executeScript(a, {
                    file: b
                })
            })
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
            } catch (d) {
                c.reject("test_Deferred\u306b\u3066\u30a8\u30e9\u30fc\n" + d)
            }
            return c.promise()
        },
        nextAsin = function(a){
                Asins ? (al++, al <= Asins.length - 1 ? setTimeout(openPage,
                            1E4 * Math.random()) : (alert("\u5168\u3066\u306eASIN\u306e\u8a18\u5165\u304c\u5b8c\u4e86\u3057\u307e\u3057\u305f"), console.log(a), stop())) : (alert(a), stop())
            },
        lastAction = function() {
            if (void 0 !== itemData.fba_totalcost && void 0 !== itemData.monthly_sales && void 0 !== itemData.fba_seller) {
                chrome.storage.sync.get("SpreadsheetId", function(c) {
                    if (c) {
                        itemData.SpreadsheetId = c.SpreadsheetId;
                    } else {
                        alert('オプション画面にてスプレッドシートIDが入力されていません');
                        return stop();
                    }
                    console.log("\u6700\u7d42\u30c7\u30fc\u30bf");
                    console.log(itemData);
                    // for (var o in itemData) URL += "&" + o + "=" + itemData[o];
                    // console.log(URL)
                    // chrome.tabs.create({
                    //     url: URL,
                    //     active: true,
                    // }, function(a) {
                    //     chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
                    //         if (tabId === a.id && tab.status === 'complete') {
                    //             winIds.push(a.id);
                    //             for (var a = 0; a < winIds.length; a++) chrome.tabs.remove(winIds[a]);
                    //             itemData = {};
                    //             Asins ? (al++, al <= Asins.length - 1 ? setTimeout(openPage,
                    //                 1E4 * Math.random()) : (alert("\u5168\u3066\u306eASIN\u306e\u8a18\u5165\u304c\u5b8c\u4e86\u3057\u307e\u3057\u305f"), console.log(a), stop())) : (alert(a), stop())
                    //         }
                    //     })
                    // });

                    for (var a = 0; a < winIds.length; a++) chrome.tabs.remove(winIds[a]);
                    winIds = [];
                    $.ajax({
                        type: "GET",
                        url: "https://script.google.com/macros/s/AKfycbzgP7IURaj1kQwU84EbgIq3iYXjcDayl9CQ_eT7ku5ZuoZufVg/exec",
                        cache: !0,
                        data: itemData,
                        timeout: 1E4
                    }).always(function(a) {
                        itemData = {};
                        nextAsin(a);
                    })
                })
            }
        }



    chrome.browserAction.onClicked.addListener(function(a) {
        if (C_win) confirm("\u5b9f\u884c\u4e2d\u3067\u3059\u3002\u4e2d\u65ad\u3057\u307e\u3059\u304b\uff1f") && stop();
        else if (chrome.windows.getCurrent({}, function(a) {
                C_win = a.id
            }), itemData = {}, winIds = [], a.url.match(/https\:\/\/www\.amazon\.co\.jp\/.*dp\/|https\:\/\/www\.amazon\.co\.jp\/.*gp\/product\//)) executeScriptWithjQuery(a.id, "scraping/getdata.js");
        else if (-1 !== a.url.indexOf("mnrate.com")) executeScriptWithjQuery(a.id, "scraping/only_monorate.js");
        else if (a.url.match(/https\:\/\/www\.amazon\.co\.jp\/.*[\?\&]me\=.*|https\:\/\/www\.amazon\.co\.jp\/.*keywords\=.*|https\:\/\/www\.amazon\.co\.jp\/.*marketplaceID\=/)) executeScriptWithjQuery(a.id, "scraping/getProducts.js");
        else {
            var a = prompt("\u4e00\u62ec\u3067\u5165\u529b\u3057\u305f\u3044ASIN\u3092\n\u30ab\u30f3\u30de(,)\n\u6539\u884c\n\u30b9\u30da\u30fc\u30b9\n\u306e\u3044\u305a\u308c\u304b\u3067\u533a\u5207\u3063\u3066\u5165\u529b\u3057\u3066\u304f\u3060\u3055\u3044");
            a && (a = a.replace(/[,\s]/g, "\n"), confirm("\u5165\u529b\u3057\u305fASIN\u4e00\u89a7\n\n" + a + "\n\n\u3053\u308c\u3089\u3092\u30b7\u30fc\u30c8\u306b\u8a18\u5165\u3057\u307e\u3059\u304b\uff1f\n\n\u203b\u5168\u3066\u8a18\u5165\u5b8c\u4e86\u307e\u3067\u306b" + Math.ceil(20 * a.split(/\n/).length / 60) + "\u5206\u7a0b\u304b\u304b\u308a\u307e\u3059\u3002\u3054\u6ce8\u610f\u304f\u3060\u3055\u3044\u3002")) ? (Asins = a.split(/\n/), al = 0, openPage()) : C_win = null;
        }
    });
    chrome.runtime.onMessage.addListener(function(a, b, c) {
        a.pageResponse.want_itemData ? c({
                itemData: itemData
            }) :
            (itemData = Object.assign(itemData, a.pageResponse), "stop" === itemData.nextActionName ? stop() : "sellerCheck" === itemData.nextActionName ? (itemData.nextActionName = null, console.log("start"), test_Deferred("https://www.amazon.co.jp/gp/offer-listing/" + itemData.asin + "/ref=olp_f_new?ie=UTF8&f_new=true&f_primeEligible=true&shipPromoFilter=1", "scraping/sellerCheck.js"), test_Deferred("http://mnrate.com/item/aid/" + itemData.asin, "scraping/monorate.js")) : "calc" === itemData.nextActionName ? (console.log("calc"), test_Deferred("https://sellercentral-japan.amazon.com/fba/profitabilitycalculator/index?lang=ja_JP&asin=" +
                itemData.asin, "scraping/calculatorpage.js")) : "openPage" === itemData.nextActionName && (itemData.nextActionName = null, Asins = itemData.Asins, al = 0, openPage()), lastAction())
    })
} catch (a) {
    console.log(a), alert(a)
}