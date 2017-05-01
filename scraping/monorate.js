var chrome, $;
var timeoutId = setTimeout(function(){
    chrome.runtime.sendMessage({
            pageResponse: {
                monthly_sales : "timeout",
                want_itemData: !1,
                nextActionName: "writeSheet",
                }
        });
    },15000);
    
$(function() {
    chrome.runtime.sendMessage({
        pageResponse: {
            want_itemData: !0
        }
    }, function(b) {
        var c = b.itemData;
        location.href = 'javascript:for(var monorate_all_data=JSON.parse(window.server_data),product_data=monorate_all_data.data.amazon_price_b0s.points,first_data=monorate_all_data.data.amazon_price_nows.points[0],new_rank=first_data.sales_rank,firstDate=first_data.search_time_unix,i=0,c30=0,c90=0,c180=0,c365=0;i<product_data.length;i++){if(new_rank<product_data[i].sales_rank){var targetDate=product_data[i].search_time_unix;firstDate<targetDate+2592E3&&c30++;firstDate<targetDate+7776E3&&c90++;firstDate<targetDate+15552E3&&c180++;if(firstDate<targetDate+31536E3)c365++;else break}new_rank=product_data[i].sales_rank}document.getElementById("_sheet_title").innerHTML=c30;';
        setTimeout(function() {
            var a = {
                want_itemData: !1,
                nextActionName: "writeSheet",
                img: document.getElementById("_item_detail_photo").getAttribute("src")
            };
            try {
                a.monthly_sales = document.getElementById("_sheet_title").innerHTML
                a.ranking = document.getElementById("graph_03").getElementsByClassName("highcharts-subtitle")[0].textContent.match(/\d+/)[0];
            } catch (d) {
                a.monthly_sales = "faild"
            }
            
            chrome.runtime.sendMessage({
                pageResponse: a
            })
            clearTimeout(timeoutId);
        }, 0)
    })
});