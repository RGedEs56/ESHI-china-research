var $, chrome;
/*
var timeoutId = setTimeout(function(){
    chrome.runtime.sendMessage({
            pageResponse: { 
                fba_seller : "timeout",
                want_itemData: !1,
                nextActionName: "calc",
                }
        });
    },20000);
    */

$(function() {
    chrome.runtime.sendMessage({
        pageResponse: {
            want_itemData: !0
        }
    }, function(c) {
        c = c.itemData;
        for (var b = 0,d = document.getElementsByClassName("olpOffer"),sellerInfos = []; b < d.length; b++){
            if(d){
                var checkPrice = d[b].getElementsByClassName("olpOfferPrice")[0].textContent.replace(",", "").match(/\d+/)[0];
            if (0 === b){ 
                var a = checkPrice;
                } else if (checkPrice > 1.3 * a) break;
                
                var targetElement = d[b].getElementsByClassName("olpSellerName")[0].getElementsByTagName("a")[0];
                var reviewContent = d[b].getElementsByClassName("a-spacing-small")[1].textContent;
console.log(reviewContent)
                var sellerId = targetElement.getAttribute("href").match(/seller\=[0-Z]+/)[0].replace(/seller\=/i,"")
                var pushObj = { 
                    sellerId : sellerId,
                    sellerName : targetElement.textContent,
                    sellerReview : reviewContent.match(/星5つ中の星\d\.*\d*/)[0].replace(/星5つ中の星/,""),
                    sellerReviewCount : reviewContent.match(/\d+件/)[0].replace(/件/,"")
                    };
console.log(pushObj)
                    $.ajax({
                            type : 'GET',
                            url : "https://www.amazon.co.jp/s?me=" + pushObj.sellerId,
                            context: pushObj
                        }).then(function(data){
                            console.log($(data).find("#s-result-count").text().replace(/[\s\,]/g,""));
                                this.productLength = $(data).find("#s-result-count").text().replace(/[\s\,]/g,"").match(/\d+件/)[0].match(/\d+/)[0];
                                sellerInfos.push(JSON.stringify(this));
                                if(b === sellerInfos.length){
                                     a = {
                                        want_itemData: !1,
                                        nextActionName: "calc",
                                        cartPrice: a,
                                        fba_seller: b,
                                        sellerInfos : sellerInfos.join('\n')
                                    };
                                    a = Object.assign(c, a);
                                    console.log(a);
                                    chrome.runtime.sendMessage({
                                        pageResponse: a
                                    })
                                    //clearTimeout(timeoutId);    
                                    }
                            })         
            } else { a = c.cartPrice;}
        }
    })
});