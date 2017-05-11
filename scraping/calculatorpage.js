var $, chrome;
var send_default = function(){
    chrome.runtime.sendMessage({
            pageResponse: {
                fba_totalcost : "timeout",
                want_itemData: !1,
                nextActionName: "monorate",
                }    
    })
}

try{
var timeoutId = setTimeout(function(){
        send_default();
    },7000);

$(function() {
    chrome.runtime.sendMessage({
        pageResponse: {
            want_itemData: !0
        }
    }, function(d) {
        var a = d.itemData;
        a.want_itemData = !1;
        a.nextActionName = "monorate";
        
        setTimeout(function(){
        try{
        console.log(a);
        var c = function(a, c) {
            console.log("click start time=" + c);
            var b = $.Deferred();
            $(a).trigger("click");
            setTimeout(function() {
                b.resolve()
            }, c);
            return b.promise()
        };  
            console.log("set ASIN");
            document.getElementById("search-string").value = a.asin;
            console.log("click1")
            c(".a-button-input:first", 1500)
            .then(function() {
                if(document.getElementById("a-popover-header-2")){
                    for(var i = 0,pro = document.getElementsByClassName("product");i < pro.length;i++){
                        if(pro[i].getElementsByClassName("txtsmall")[0].textContent.replace(/^\s*|\s*$/g, "") === a.title){
                            pro[i].getElementsByTagName("button")[0].click();
                            break;
                        }
                        if(i === pro.length-1){ pro[0].getElementsByTagName("button")[0].click();}
                    }
                }
                $("#afn-pricing").val(a.cartPrice);
                console.log("click2");
                return c("#update-fees-link", 2E3)
            }).then(function() {
                console.log("click3");
                document.getElementById("afn-amazon-fulfillment-fees").click();
                var b = {
                        weight: $("#product-info-weight").text(),
                        leng: $("#product-info-length").text(),
                        width: $("#product-info-width").text(),
                        height: $("#product-info-height").text(),
                        cost: $("#afn-selling-fees").text(),
                        packege: $("#afn-weight-handling-fee").val(),
                        fba_totalcost: a.cartPrice - new Number(document.getElementById("afn-seller-proceeds").value)
                    };
                    b.volume_weight = b.leng * b.width * b.height / 5000;
                    b.true_weight = Math.ceil(Math.max(b.weight,b.volume_weight)*10)/10;
                    b = Object.assign(a,b);//must
                chrome.runtime.sendMessage({
                    pageResponse: b
                })
                clearTimeout(timeoutId);
            })
            } catch(err) {
                console.log(err);
                a.fba_totalcost = "error", chrome.runtime.sendMessage({
                    pageResponse: a
                })     
            }
        },1000);
    })
});
} catch(e) { send_default()}