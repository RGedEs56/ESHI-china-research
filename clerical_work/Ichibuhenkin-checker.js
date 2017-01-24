var $;

$(function() {
    var ASIN = prompt("計算したい商品のASINを入力してください");
    var now_price = prompt("現在のAmazonの販売価格を入力してください");
    var old_sell_price = prompt("オートマスターショップで販売したときの1個あたりの販売価格を入力してください(Paypal手数料込で入力してください)");

    var clickWait = function(targetSelecter, time) {
        var d1 = $.Deferred();
        $(targetSelecter).trigger('click');
        setTimeout(function() {
            d1.resolve();
        }, time);
        return d1.promise();
    };

    $('#search-string').val(ASIN);
    clickWait('.a-button-input:first', 1000)
        .then(function() {
            $('#afn-pricing').val(now_price);
            return clickWait('#update-fees-link', 2000);
        })
        .then(function() {
            var profit = $('#afn-seller-proceeds').val();
            console.log(profit);
            var r_price = old_sell_price - (profit - Math.ceil(now_price * 0.2));
            console.log(r_price);
            alert('差額は ' + r_price + '円です');
        });
}());