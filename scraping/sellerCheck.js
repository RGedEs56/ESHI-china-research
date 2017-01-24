var $;
var chrome;

$(function() {
    chrome.runtime.sendMessage({
        pageResponse: {
            want_itemData: true
        }
    }, function(response) {
        var itemData = response.itemData;

        for (var i = 0, targetArr = document.getElementsByClassName("olpOfferPrice"); i < targetArr.length; i++) { //for(var i = 0,targetArr = $(".olpOfferPrice");i < targetArr.length;i++){
            if (i === 0) {
                var cartPrice = targetArr[i].textContent.replace(',', '').match(/\d+/)[0]; //var cartPrice = $(targetArr[i]).text().replace(',','').match(/\d+/)[0];

            } else if (new Number(targetArr[i].textContent.replace(',', '').match(/\d+/)[0]) > cartPrice * 1.3) { //} else if(new Number($(targetArr[i]).text().replace(',','').match(/\d+/)[0]) > cartPrice * 1.1 ){
                break;
            }
        }


        var result = {
            want_itemData: false,
            nextActionName: 'calc',
            cartPrice: cartPrice,
            rival: i
        };

        result = Object.assign(itemData, result);
        console.log(result);

        chrome.runtime.sendMessage({
            pageResponse: result
        });
    });
})