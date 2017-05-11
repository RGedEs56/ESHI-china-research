var $, chrome;

var send_default = function(){
        a = {
        want_itemData: !1,
        nextActionName: "calc",
        fba_seller: "error"
    };
    chrome.runtime.sendMessage({
        pageResponse: a
    })
    clearTimeout(timeoutId);       
}

try{

var a,b,d,sellerInfos = [],sellerCount

function checkSellerCount(isTimeout){
    if(sellerCount === sellerInfos.length || isTimeout){
         a = {
            want_itemData: !1,
            nextActionName: "calc",
            cartPrice: a,
            fba_seller: b,
            sellerInfos : sellerInfos.join('\n')
        };
        chrome.runtime.sendMessage({
            pageResponse: a
        })
        clearTimeout(timeoutId);    
    }    
};

var timeoutId = setTimeout(function(){
        checkSellerCount(true);
    },7000);

$(function() {
    chrome.runtime.sendMessage({
        pageResponse: {
            want_itemData: !0
        }
    }, function(c) {
        c = c.itemData;
        var d = document.getElementsByClassName("olpOffer");
        if(d.length === 0){ 
            send_default(); 
        } else {
        for (b = 0,sellerInfos = [],sellerCount = 0; b < d.length; b++){
            var checkPrice = d[b].getElementsByClassName("olpOfferPrice")[0].textContent.replace(",", "").match(/\d+/)[0];
            if (0 === b){ 
                a = checkPrice;
                } else if (checkPrice > 1.3 * a){
                    sellerCount = b;
                    break;
                }
                if(b === d.length -1){ sellerCount = b + 1; }
                
                try{
                var targetElement = d[b].getElementsByClassName("olpSellerName")[0].getElementsByTagName("a")[0];
                var sellerLink = targetElement.getAttribute("href");
                } catch(e) {
                    console.log(e);
                    sellerLink = ""
                }
                    
                if(sellerLink){
                    setTimeout(function(sL,tE){
                    var xhr = new XMLHttpRequest();
                    var pushObj = {};
                    pushObj.sellerId = tE.getAttribute("href").match(/seller\=[0-Z]+/)[0].replace(/seller\=/i,"");
                    pushObj.sellerName = tE.textContent;
                    xhr.onreadystatechange = function(){
                        if(xhr.readyState === 4){
                            if(xhr.status === 200){
                                var res = xhr.response;
                                var rev = res.getElementsByClassName("a-text-right");
                                pushObj.niceReview30 = rev[4].textContent.replace(/\s/g,"");
                                pushObj.normalReview30 = rev[8].textContent.replace(/\s/g,"");
                                pushObj.badReview30 = rev[12].textContent.replace(/\s/g,"");
                                pushObj.reviewCount30 = rev[16].textContent; 
                            } else {
                                pushObj.niceReview30 = pushObj.normalReview30 = pushObj.badReview30 = pushObj.reviewCount30 = ""   
                            }
                        console.log(pushObj)
                        sellerInfos.push(JSON.stringify(pushObj));
                        checkSellerCount(); 
                        }
                    }
                    
                    xhr.open('GET',location.protocol + "//" + location.host + sL);
                    xhr.responseType = 'document';
                    xhr.send();
                    console.log("start" + sL)
                    },0,sellerLink,targetElement);
                } else {
                    --sellerCount;
                    checkSellerCount(); 
                }
            }
        }
    })
});
} catch(e) { send_default() }