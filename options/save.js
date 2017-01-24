$("#close_btn").click(function(){
    var a = $(".setting");
    var idArray = [];
    for(var i = 0;i < a.length;i++){
        idArray.push(a[i].getAttribute("id"));
    }

    var data = {};
    for(i = 0;i < idArray.length;i++){
        data[idArray[i]] = document.getElementById(idArray[i]).value;
    }

    chrome.storage.sync.set(data,function(items){
    alert("保存しました");
    });
})


