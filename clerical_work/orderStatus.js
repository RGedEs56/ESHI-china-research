var $;
$(function(){
var imput = window.prompt("変更したいオーダー番号をカンマで区切って入力");
var orderNumberArray = imput.split(",");
var changeNumber = "";
var errorNumber = "";
for (var i = orderNumberArray.length - 1; i >= 0; i--) {
    var orderNumber = orderNumberArray[i];
    var id = "cb-select-" + orderNumber;
    try {
        document.getElementById(id).checked = true;
        changeNumber += orderNumber + ",";
    } catch (e) {
        errorNumber += orderNumber + ",";
    }
}
alert('チェックを入れたオーダー番号\n' + changeNumber + '\n\n見つからなかったオーダー番号\n' + errorNumber);
    })