(function(){
    for (var monorate_all_data = JSON.parse(window.server_data), product_data = monorate_all_data.data.amazon_price_b0s.points, first_data = monorate_all_data.data.amazon_price_nows.points[0], new_rank = first_data.sales_rank, firstDate = first_data.search_time_unix, i = 0, c30 = 0, c90 = 0, c180 = 0, c365 = 0; i < product_data.length; i++) {
    if (new_rank < product_data[i].sales_rank) {
        var targetDate = product_data[i].search_time_unix;
        firstDate < targetDate + 2592E3 && c30++;
        firstDate < targetDate + 7776E3 && c90++;
        firstDate < targetDate + 15552E3 && c180++;
        if (firstDate < targetDate + 31536E3) c365++;
        else break
    }
    new_rank = product_data[i].sales_rank
}
document.getElementById("_sheet_title").innerHTML = c30;
alert("\u76f4\u8fd130\u65e5\u9593\u306e\u8ca9\u58f2\u500b\u6570:" + c30 + "\n \u500b\n\u76f4\u8fd190\u65e5\u9593\u306e\u8ca9\u58f2\u500b\u6570:" + c90 + "\n\u500b\n\u76f4\u8fd1180\u65e5\u9593\u306e\u8ca9\u58f2\u500b\u6570:" + c180 + "\n\u500b\n\u76f4\u8fd1365\u65e5\u9593\u306e\u8ca9\u58f2\u500b\u6570:" + c365 + "\u500b");
})();