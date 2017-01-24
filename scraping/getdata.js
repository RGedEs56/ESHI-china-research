var $;
var chrome;

$(function(){

chrome.runtime.sendMessage({
    pageResponse: {
        want_itemData : true
    }
}, function(response) {
console.log(response);
    var itemData = response.itemData;
    
    try{var che = $("#SalesRank").text().replace(',','').match(/.*\d+位/)[0] } catch(e) { che = null }
    
    var result = {
        want_itemData : false,
        nextActionName : 'sellerCheck',
        asin : $('#ASIN').val(),
        category : (che && che.replace(/\d+位/,'').match(/[^\s\-]+/)) ? che.replace(/\d+位/,'').match(/[^\s\-]+/)[0] : "取得できませんでした",
        title : $('#productTitle').text().replace(/\s*/g,''),
        size_color : $('.disclaim:first').text() || '',
        ranking : (che && che.match(/\d+位/)) ? che.match(/\d+位/)[0].replace('位','') : "取得できませんでした"
        };
        
    try{ result.cartPrice = new Number($("#priceblock_ourprice").text().match(/\d+/)[0]); } catch(e) { result.cartPrice = 0; }
    
    result = Object.assign(itemData,result);
    chrome.runtime.sendMessage({
        pageResponse: result
    });
});
})