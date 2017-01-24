var $;

$(function(){
var defAll = function() {

    var defAction = function(targetEl) {
        var def = $.Deferred();
        var win2 = window.open($(targetEl).find('a:first').attr('href'));
        var counter = 0;
        var timer = setInterval(function(subwindow, d) {
            try {
                console.log(counter);
                console.log(targetEl);
                if (subwindow.document.getElementById('role').value) {
                    console.log(subwindow.document.getElementById('role').value);
                    clearInterval(timer);
                    var depojit = 0;
                    switch (subwindow.document.getElementById('role').value) {
                        case 'platinummaster':
                            depojit = 100000000;
                            break;

                        case 'goldmaster':
                            depojit = 1000000;
                            break;

                        case 'automaster':
                            depojit = 500000;
                            break;

                        default:
                            depojit = 0;
                            break;

                    }
                } else {
                    depojit = 0;
                }

                win2.close();
                d.resolve(depojit);

                counter++;
                if (counter > 2) d.resolve('err');
            } catch (er) {
                clearInterval(timer);
                def.resolve('err');
            }
        }, 2000, win2, def);
        return def.promise();
    };


    defAction(cEl[i])
        .then(function(depojit) {
            if (depojit !== 'err') {
                $(cEl[i]).find('.points_balance:first').val(depojit);
            } else {
                try {
                    $(cEl[i]).find('.points_balance:first').css({
                        'background-color': 'red'
                    });
                } catch (err) {
                    console.log(err);
                }
            }
            i++;
            if (i < cEl.length - 1) defAll();
        })
        .fail(function(err) {
            alert(err);
        });
};

var cEl = $('tr');
var i = 1;
defAll();
});