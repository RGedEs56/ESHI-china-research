var $;
var chrome;

$(function() {
    for (var text = "", pro = document.getElementsByClassName("s-access-detail-page"), i = 0; i < pro.length; i++) {
        try {
            text += (pro[i].getAttribute("href")).match(/\/dp\/B0[0-Z]{8}/)[0].match(/B0[0-Z]{8}/)[0] + "\n";
        } catch (err) {
            text += (pro[i].getAttribute("href")).match(/B0[0-Z]{8}/)[0] + "\n"; //スポンサープロダクトはリダイレクトなので/dp/が無い
        }
    }
    if (confirm('表示中のAmazonページのASIN一覧\n\n' + text + '\nこれらをシートに記入しますか？\n\n※全て記入完了までに' + Math.ceil(pro.length * 20 / 60) + '分程かかります。ご注意ください。')) {
        chrome.runtime.sendMessage({
            pageResponse: {
                Asins: text.split('\n'),
                nextActionName: 'openPage',
                want_itemData: false
            }
        });
    } else {
        chrome.runtime.sendMessage({
            pageResponse: {
                want_itemData: false,
                nextActionName: 'stop'
            }
        });
    }
})