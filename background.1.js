//変数定義
var chrome;
var $;
var itemData = {};
var winIds = [];
var Asins = null;
var al = 0;
var C_win = null;

//関数定義

try {
    const stop = function() {
        Asins = null;
        C_win = null;
        al = 0;
        itemData = {};
        for (var wi = 0; wi < winIds.length; wi++) {
            try {
                chrome.windows.remove(winIds[wi]);
            } catch (err) {
                console.log(err);
            }
        }
        winIds = [];
    };

    const executeScriptWithjQuery = function(tabId, scriptFileName) {
        chrome.tabs.executeScript(tabId, {
            file: 'jQuery3_1.js'
        }, function(tab) {
            chrome.tabs.executeScript(tabId, {
                file: scriptFileName
            });
        });
    };

    const openPage = function() {
        chrome.windows.create({
            focused: false,
            width: 1,
            height: 1,
            url: 'https://www.amazon.co.jp/dp/' + Asins[al],
            //incognito: true シークレットウィンドウだとWin.idが取れない
        }, function(Win) {
            winIds.push(Win.id);
            executeScriptWithjQuery(Win.tabs[0].id, 'scraping/getdata.js');
            chrome.windows.update(C_win, {
                focused: true
            });
        });
    };

    const test_Deferred = function(url, scriptName) {
        var def = $.Deferred();
        try {
            chrome.windows.create({
                focused: false,
                url: url,
                width: 1,
                height: 1,
                //incognito: true
            }, function(Win) {
                winIds.push(Win.id);
                executeScriptWithjQuery(Win.tabs[0].id, scriptName);
                chrome.windows.update(C_win, {
                    focused: true
                });
                def.resolve(Win);
            });
        } catch (err) {
            def.reject('test_Deferredにてエラー\n' + err);
        }
        return def.promise();
    };

    var lastAction = function() {
        if (itemData.totalcost === undefined || itemData.rank === undefined || itemData.rival === undefined) return;
        itemData.SpreadsheetId = (chrome.runtime.id === 'lbpodihdhpepnobmhpefflmeojlmojee') ? '1f-N20_rVblZFwnsskUs2zA5pCijSvLXCsnKZ59gP3n0' : '1psk6Bvn47WozfiqDGSatPr0uac7qFjtYB9cWPPtBhMc';
        console.log('最終データ');
        console.log(itemData);
        console.log(winIds);
        for (var wi = 0; wi < winIds.length; wi++) {
            chrome.windows.remove(winIds[wi]);
        }
        winIds = [];


        $.ajax({
            type: 'POST',
            url: 'https://script.google.com/macros/s/AKfycbzpP61dEEQBwOk231LSSxjySDklx0XbOoE5WHoxjgmQqIU8RiI/exec',
            cache: true,
            data: itemData,
            //dataType: 'json',
            //beforeSend : function(jqXHR){},
            timeout: 10000,
            //context: domobject 
        }).always(function(data) {
            itemData = {};
            if (Asins) {
                al++;
                if (al <= Asins.length - 1) {
                    setTimeout(openPage, Math.random() * 10000);
                } else {
                    alert('全てのASINの記入が完了しました');
                    console.log(data);
                    stop();
                }
            } else {
                alert(data);
                stop();
            }
        });
    };

    //実際のスクリプトここから
    chrome.browserAction.onClicked.addListener(function(tab) {
        if (!C_win) {
            chrome.windows.getCurrent({}, function(w) {
                C_win = w.id;
            });
            itemData = {};
            winIds = [];
            if (tab.url.match(/https\:\/\/www\.amazon\.co\.jp\/.*dp\//)) {
                executeScriptWithjQuery(tab.id, 'scraping/getdata.js');
            } else if (tab.url.indexOf('mnrate.com') !== -1) {
                executeScriptWithjQuery(tab.id, 'scraping/only_monorate.js');
            } else if (tab.url.match(/https\:\/\/www\.amazon\.co\.jp\/.*marketplaceID\=.*/) || tab.url.match(/https\:\/\/www\.amazon\.co\.jp\/.*keywords\=.*/)) {
                executeScriptWithjQuery(tab.id, 'scraping/getProducts.js');
            } else {
                //例外ページでASIN一括入力によるスクレイピングを実現するマクロ
                var inpT = function() {
                    var inputText = prompt('一括で入力したいASINを\nカンマ(,)\n改行\nスペース\nのいずれかで区切って入力してください');
                    if (inputText) {
                        inputText = inputText.replace(/[,\s]/g, '\n');
                        if (confirm('入力したASIN一覧\n\n' + inputText + '\n\nこれらをシートに記入しますか？\n\n※全て記入完了までに' + Math.ceil(inputText.split(/\n/).length * 20 / 60) + '分程かかります。ご注意ください。')) {
                            Asins = inputText.split(/\n/);
                            al = 0;
                            openPage();
                        }
                    }
                };
                //下3つは主に雑務で使用する用
                if (chrome.runtime.id === 'lbpodihdhpepnobmhpefflmeojlmojee') {
                    if (tab.url.match(/https\:\/\/sellercentral\-japan\.amazon\.com\/fba\/profitabilitycalculator\/index/)) {
                        executeScriptWithjQuery(tab.id, 'clerical_work/Ichibuhenkin-checker.js');
                    } else if (tab.url.match(/https\:\/\/amc\.busoken\.com\/wp-admin\/edit.php\?.*post_type\=shop_order.*/)) {
                        executeScriptWithjQuery(tab.id, 'clerical_work/orderStatus.js');
                    } else if (tab.url.match(/https\:\/\/amc\.busoken\.com\/wp-admin\/admin.php\?.*page\=woocommerce\-points\-and\-rewards.*/)) {
                        executeScriptWithjQuery(tab.id, 'clerical_work/shop_price_resset.js');
                    } else {
                        inpT();
                    }
                } else {
                    inpT();
                }
            }
        } else {
            if (confirm('実行中です。中断しますか？')) stop();
        }
    });

    chrome.runtime.onMessage.addListener(function(req, sender, sendResponse) {
        if (!req.pageResponse.want_itemData) {
            itemData = Object.assign(itemData, req.pageResponse);

            if(itemData.nextActionName === 'stop'){ 
                stop();
            }else if (itemData.nextActionName === 'sellerCheck') {
                itemData.nextActionName = null;
                console.log('start');
                test_Deferred('https://www.amazon.co.jp/gp/offer-listing/' + itemData.asin + '/ref=olp_f_new?ie=UTF8&f_new=true&f_primeEligible=true&shipPromoFilter=1', 'scraping/sellerCheck.js');
                test_Deferred('http://mnrate.com/item/aid/' + itemData.asin, 'scraping/monorate.js');
            } else if (itemData.nextActionName === 'calc') {
                console.log('calc');
                test_Deferred('https://sellercentral-japan.amazon.com/fba/profitabilitycalculator/index?lang=ja_JP&asin=' + itemData.asin, 'scraping/calculatorpage.js');
            } else if (itemData.nextActionName === 'openPage') {
                itemData.nextActionName = null;
                Asins = itemData.Asins;
                al = 0;
                openPage();
            }

            lastAction();

        } else {
            sendResponse({
                itemData: itemData
            });
        }

    });
} catch (allErr) {
    console.log(allErr);
    alert(allErr);
}