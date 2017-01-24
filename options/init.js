window.onload = function(){    
       var a = $(".setting");
        var idArray = [];
        for(var i = 0;i < a.length;i++){
            idArray.push(a[i].getAttribute("id"));
        }
        
    chrome.storage.sync.get(idArray,function(items){
        for(var i = 0;i < idArray.length;i++){
            var id = idArray[i];
            var key = items[id];
            if(key){
            document.getElementById(id).value = key;
        } else {
            document.getElementById(id).value = 0;
        }
        }
    });
}