var chrome,$;window.onload=function(){for(var a=$(".setting"),c=[],b=0;b<a.length;b++)c.push(a[b].getAttribute("id"));chrome.storage.sync.get(c,function(b){for(var d=0;d<c.length;d++){var e=c[d],a=b[e];a?document.getElementById(e).value=a:document.getElementById(e).value=0}})};