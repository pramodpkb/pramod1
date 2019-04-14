hostname = window.location.origin
function getQueryStrings() {
    var assoc = {};
    var decode = function (s) { return decodeURIComponent(s.replace(/\+/g, " ")); };
    var queryString = decodeURIComponent(location.search.substring(1));
    return queryString;
}

$('.CityOrHotel').on('keyup', function (e) {
    if (e.keyCode != "8" && e.keyCode != "13") {
        if (e.target.value.length > 0) {
            $(e.target).parent().closest('#DropSearchUl1').html('');
            $(e.target).parent().parent().find('#DropSearchUl1').append('<li style="border-bottom: 1px solid rgba(211, 211, 211, 0.31);" class="media selectcity"  > Loading....</li>');
            var da = jQuery.grep(AllCities, function (value) {
                return value.CityName.toUpperCase().indexOf(e.target.value.toUpperCase()) >= 0;
            });
            if (da.length == 0)
            { $(e.target).parent().parent().find('.search_txtsearch-dropdown1').hide(); }
            $(e.target).parent().parent().find('#DropSearchUl1').html('');
            var fo = 0;
            var seac = "";
            $(da).each(function (ined, u) {
                if (seac.toUpperCase() != da[ined].CityName.toUpperCase()) {
                    $(e.target).parent().parent().find('#DropSearchUl1').append('<li  style="border-bottom: 1px solid rgba(211, 211, 211, 0.31);"  > <a href="" class="selectcity" onclick="return selectcity(this,' + e.target.id + ')" data-type="' + da[ined].Typ + '" data-rval="' + da[ined].CityName + '" val=' + u.Id + '>' + da[ined].CityName.toUpperCase().replace(e.target.value.toUpperCase(), '<b>' + e.target.value.toUpperCase() + '</b>') + '</a></li>');
                    seac = da[ined].CityName;
                }
                fo = 1;
            });
            if ($(e.target).parent().parent().find('#DropSearchUl1').html() == '')
            {
                $(e.target).parent().parent().find('#DropSearchUl1').append('<li  style="border-bottom: 1px solid rgba(211, 211, 211, 0.31);"  > <a href="" class="selectcity" onclick="return false">No Data</a></li>');
            }
            if (e.keyCode == "40") {
                $(e.target).parent().parent().find('#DropSearchUl1 li:first').find('a').focus();
                $(e.target).parent().parent().find('.selectcity').on('keydown', function (e) {
                    if (e.keyCode == "40") {
                        $(e.target).parent().next().find('a').focus();
                        return false;
                    }
                    if (e.keyCode == "38") {
                        $(e.target).parent().prev().find('a').focus();
                        return false;
                    }
                    if (e.keyCode == "27") {
                        $('.search_txtsearch-dropdown1').hide();
                        return false;
                    }
                });
            }
            $(e.target).parent().parent().find('.search_txtsearch-dropdown1').show();
            return false;
        }
        else {
            $(e.target).parent().parent().find('.search_txtsearch-dropdown1').hide(); return false;
        }
    }
    else {
        $(e.target).parent().parent().find('.search_txtsearch-dropdown1').hide(); return false;
    }
});
function rtrim(str, length) {
    return str.substr(0, str.length - length);
}
function selectcity(obj, boxid) {
    $(obj).closest('.mainsearchwindow').find('#' + boxid.id).val($(obj).attr('data-rval').toUpperCase());
    $(obj).closest('.mainsearchwindow').find('#hdfselected').val($(obj).attr('val'));
    $(obj).closest('.mainsearchwindow').find('#hdfType').val($(obj).data('type'));
    $(obj).closest('.mainsearchwindow').find('#' + boxid.id).focus();
    $(obj).closest('.mainsearchwindow').find('.search_txtsearch-dropdown1').hide();
    $(obj).closest('.mainsearchwindow').find('#StartDate').focus();
    return false;
}
$('body').click(function () { $('.search_txtsearch-dropdown1').hide(); });
(function () {
    try {
        var container = document.getElementById('cbp-vm'),
            optionSwitch = Array.prototype.slice.call(container.querySelectorAll('div.cbp-vm-options > a'));
    } catch (e) {
    }
    function init() {
        try {
            optionSwitch.forEach(function (el, i) {
                el.addEventListener('click', function (ev) {
                    ev.preventDefault();
                    _switch(this);
                }, false);
            });
        } catch (e) {
        }
    }
    function _switch(opt) {
        // remove other view classes and any any selected option
        optionSwitch.forEach(function (el) {
            classie.remove(container, el.getAttribute('data-view'));
            classie.remove(el, 'cbp-vm-selected');
        });
        // add the view class for this option
        classie.add(container, opt.getAttribute('data-view'));
        // this option stays selected
        classie.add(opt, 'cbp-vm-selected');
    }
    init();
})();