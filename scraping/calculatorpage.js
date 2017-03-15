var $, chrome;
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
            var b = $.Deferred();
            $(a).trigger("click");
            setTimeout(function() {
                b.resolve()
            }, c);
            return b.promise()
        };
            document.getElementById("search-string").value = a.asin, c(".a-button-input:first", 1E3)
            .then(function(){
               var def = $.Deferred();
                if(document.getElementById("a-popover-header-2")){
                    for(var i = 0,pro = document.getElementsByClassName("product");i < pro.length;i++){
                        if(pro[i].getElementsByClassName("txtsmall")[0].textContent.replace(/^\s*|\s*$/g, "") === a.title){
                            pro[i].getElementsByTagName("button")[0].click();
                            def.resolve();
                            break;
                        }  
                    }       
                } else {
                    def.resolve();    
                }
                return def.promise();
            })
            .then(function() {
                $("#afn-pricing").val(a.cartPrice);
                return c("#update-fees-link", 2E3)
            }).then(function() {
                document.getElementById("afn-amazon-fulfillment-fees").click();
                var b = {
                        weight: $("#product-info-weight").text(),
                        length: $("#product-info-length").text(),
                        width: $("#product-info-width").text(),
                        height: $("#product-info-height").text(),
                        cost: $("#afn-selling-fees").text(),
                        packege: $("#afn-weight-handling-fee").val(),
                        totalcost: a.cartPrice - new Number(document.getElementById("afn-seller-proceeds").value)
                    },
                    b = Object.assign(a, b);
                chrome.runtime.sendMessage({
                    pageResponse: b
                })
            })
            } catch(err) {
                console.log(err);
                a.totalcost = "\u53d6\u5f97\u5931\u6557", chrome.runtime.sendMessage({
                    pageResponse: a
                })     
            }
        },1000);
    })
});