var $, chrome;
$(function() {
    var a = "";
    
    var endAction = function(){
        a = prompt("リサーチしたいASINを入力してください(デフォでこの出品者の商品一覧が入っています)",a) ? chrome.runtime.sendMessage({
            pageResponse: {
                Asins: a.split("\n"),
                nextActionName: "openPage",
                want_itemData: !1
            }
        }) : chrome.runtime.sendMessage({
            pageResponse: {
                want_itemData: !1,
                nextActionName: "stop"
            }
        })    
    };
    
    var sleep = function(){
        var d = $.Deferred();
        setTimeout(function(){
            d.resolve();    
        },5000 + Math.random() * 10000/2);
        return d.promise();
    }
    
    var checkElement = document.getElementById("products-heading");
    
    var def = (checkElement) 
    ? function(){
        for (var el = document.getElementById("products-list"),b = el.getElementsByClassName("product-details"), c = 0; c < b.length; c++) try {
            a += b[c].getElementsByTagName("a")[0].getAttribute("href").match(/\/dp\/B0[0-Z]{8}/)[0].match(/B0[0-Z]{8}/)[0] + "\n"
        } catch (d) {
            a += b[c].getElementsByTagName("a")[0].getAttribute("href").match(/B0[0-Z]{8}/)[0] + "\n"
        }
        var target = el.getElementsByClassName("products-pagination-button");
        if(target[target.length-1].getElementsByTagName("a")[0]){
            target[target.length-1].click();
            sleep().then(def);
        } else {
            console.log(a);
            endAction();
        }
    }
    : function(){
        for (var b = document.getElementsByClassName("s-access-detail-page"), c = 0; c < b.length; c++) try {
            a += b[c].getAttribute("href").match(/\/dp\/B0[0-Z]{8}/)[0].match(/B0[0-Z]{8}/)[0] + "\n"
        } catch (d) {
            a += b[c].getAttribute("href").match(/B0[0-Z]{8}/)[0] + "\n"
        }
        var target = document.getElementById("pagnNextLink");
        if(target){
            target.click();
            sleep().then(def);
        } else {
            endAction();
        }
    }
    
    if(checkElement){ 
        checkElement.click(); 
        sleep().then(def)
    } else {def();}
});