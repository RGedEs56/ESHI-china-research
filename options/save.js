var chrome, $;
$("#close_btn").click(function() {
    for (var b = $(".setting"), c = [], a = 0; a < b.length; a++) c.push(b[a].getAttribute("id"));
    b = {};
    for (a = 0; a < c.length; a++) b[c[a]] = document.getElementById(c[a]).value;
    chrome.storage.sync.set(b, function(a) {
        alert("\u4fdd\u5b58\u3057\u307e\u3057\u305f")
    })
});