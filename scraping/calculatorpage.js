var $;
var chrome;

$(function() {
    chrome.runtime.sendMessage({
        pageResponse: {
            want_itemData: true
        }
    }, function(response) {
        var itemData = response.itemData;
        itemData.want_itemData = false;
        itemData.nextActionName = 'monorate',
            console.log(itemData);

        const clickWait = function(targetSelecter, time) {
            var d1 = $.Deferred();
            $(targetSelecter).trigger('click');
            setTimeout(function() {
                d1.resolve();
            }, time);
            return d1.promise();
        };

        try {
            document.getElementById('search-string').value = itemData.asin;
            clickWait('.a-button-input:first', 1000)
                .then(function() {
                    $('#afn-pricing').val(itemData.cartPrice);
                    return clickWait('#update-fees-link', 2000);
                })
                .then(function() {
                    document.getElementById('afn-amazon-fulfillment-fees').click();
                    var result = {
                        weight: $('#product-info-weight').text(),
                        length: $('#product-info-length').text(),
                        width: $('#product-info-width').text(),
                        height: $('#product-info-height').text(),
                        cost: $('#afn-selling-fees').text(),
                        packege: $('#afn-weight-handling-fee').val(),
                        totalcost: itemData.cartPrice - new Number(document.getElementById('afn-seller-proceeds').value)
                    };
                    result = Object.assign(itemData, result);
                    chrome.runtime.sendMessage({
                        pageResponse: result
                    });
                });
        } catch (err) {
            itemData.totalcost = "取得失敗";
            chrome.runtime.sendMessage({
                pageResponse: itemData
            });
        }
    });
})