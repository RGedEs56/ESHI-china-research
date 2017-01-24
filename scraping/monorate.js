var chrome;
var $;
$(function() {
    chrome.runtime.sendMessage({
        pageResponse: {
            want_itemData: true
        }
    }, function(response) {
        var itemData = response.itemData;
        location.href = 'javascript:for(var monorate_all_data=JSON.parse(window.server_data),product_data=monorate_all_data.data.amazon_price_b0s.points,first_data=monorate_all_data.data.amazon_price_nows.points[0],new_rank=first_data.sales_rank,firstDate=first_data.search_time_unix,i=0,c30=0,c90=0,c180=0,c365=0;i<product_data.length;i++){if(new_rank<product_data[i].sales_rank){var targetDate=product_data[i].search_time_unix;firstDate<targetDate+2592E3&&c30++;firstDate<targetDate+7776E3&&c90++;firstDate<targetDate+15552E3&&c180++;if(firstDate<targetDate+31536E3)c365++;else break}new_rank=product_data[i].sales_rank}document.getElementById("_sheet_title").innerHTML=c30;';
        // var monorate_all_data = JSON.parse(window.server_data);
        // var product_data = monorate_all_data.data.amazon_price_b0s.points;

        // var first_data = monorate_all_data.data.amazon_price_nows.points[0];
        // var new_rank = first_data.sales_rank;
        // var firstDate = first_data.search_time_unix;

        // for (var i = 0, c30 = 0, c90 = 0, c180 = 0, c365 = 0; i < product_data.length; i++) {
        //     if (new_rank < product_data[i].sales_rank) {
        //         var targetDate = product_data[i].search_time_unix;
        //         if (firstDate < targetDate + 60 * 60 * 24 * 30) c30++;
        //         if (firstDate < targetDate + 60 * 60 * 24 * 90) c90++;
        //         if (firstDate < targetDate + 60 * 60 * 24 * 180) c180++;
        //         if (firstDate < targetDate + 60 * 60 * 24 * 365){ c365++ } else {break;}
        //     }
        //     new_rank = product_data[i].sales_rank;
        // }
        // document.getElementById("_sheet_title").innerHTML = c30;
        
        setTimeout(function() {
            var result = {
                want_itemData: false,
                nextActionName: 'writeSheet',
                img : document.getElementById("_item_detail_photo").getAttribute("src")
            };
            try {
                result.rank = document.getElementById("_sheet_title").innerHTML;
            } catch (err) {
                result.rank = '取得失敗';
            }
            
            result = Object.assign(itemData, result);
            console.log(result);
            chrome.runtime.sendMessage({
                pageResponse: result
            });
        }, 0);
    });
});