hostname = hostname = window.location.origin;
function getQueryStrings() {
    var assoc = {};
    var decode = function (s) { return decodeURIComponent(s.replace(/\+/g, " ")); };
    var queryString = decodeURIComponent(location.search.substring(1));
    return queryString;
}
$('.checkAvailability').click(function (e) {
    $(e.target).html('Checking..')
    var datastring = JSON.stringify({ parameters: e.target.dataset.href + '&SlotTime=' + document.getElementById('SlotTime_' + e.target.dataset.roomid).value});
    $.ajax({
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: 'text',
        url: hostname + "/Hotels/CheckAvailability",
        data: datastring,
        success: function (ret) {
            ret = JSON.parse(ret)
            if (ret.sts == 0) {
                document.getElementById('btnlogin').dataset.frm=e.target.dataset.frm;
                $('.modal-open').trigger('click')
                return false;
            }
            else {
                if (ret.AvCheck==1)
                {
                    $(e.target).html('Available')
                    $('#' + e.target.dataset.frm).submit();
                }
                else
                {
                    $(e.target).html("Room Not Available.")
                }
                
                //window.location = e.target.dataset.href + '&SlotTime=' + document.getElementById('SlotTime_' + e.target.dataset.roomid).value + '&' + getQueryStrings();
                
                return false;
            }
           
            return false;
        }
    });
    return false;
})
$('.Search-filter').click(function (e) {
    if ($('.load-more-button') != null)
        $('.load-more-button').show();
    $('#MainList').html('<div id="loader"><span>Loading....</span><div>');
    $(starti).val(1)
    $(endi).val(16)
    LoadHotels(null);
    $($('.custom-scroll-link')[0]).trigger('click')
});
$('.load-more-button').off('click');
$('.load-more-button').click(function (e) {
    if (e != null)
    $($(e.target).find('i')[0]).show();
    LoadHotels(e);
})
var requestCheck = null;
function LoadHotels(btn) {
    loadcheck = 1;
    rating = new Array();
    $('.StarRating').each(function (t, u) {
        if (u.checked)
            rating.push(u.value);
    });
    Areas = new Array();
    $('.AreaSelected').each(function (t, u) {
        if (u.checked)
            Areas.push(u.value);
    });
    var maxpriceAmt = $('.irs-to').html().replace('₹', '').replace(' ', '');
    if (maxpriceAmt == 0) {
        maxpriceAmt = $('.irs-max').html().replace('₹', '').replace(' ', '');
    }
    if (requestCheck != null && $(starti).val() == 1 && $(endi).val() == 16) {
        requestCheck.abort();
        requestCheck = null;
    }

    requestCheck = $.ajax({
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        url: hostname + '/Hotels/Get_Filtered_Hotels?' + getQueryStrings(),
        data: JSON.stringify({ searchparam: $('#searchparam').val(), start: $(starti).val(), end: $(endi).val(), minprice: $('.irs-from').html().replace('₹', '').replace(' ', ''), maxprice: maxpriceAmt, StarRating: rating.join(','), Area: Areas.join(',') }),
        success: function (ret) {
            if (btn != null)
                $($(btn.target).find('i')[0]).hide();
            if ($('#loader') != null)
            {
                $('#loader').remove();
            }
            var querystr = getQueryStrings();
            alldata = new Array();
            if (ret.length > 0) {
                if (btn != null)
                $(btn.target).show();
                $(ret).each(function (t, u) {


                    alldata.push("<div class='listing-item'>");
                    alldata.push("<article class='geodir-category-listing fl-wrap'>");
                    alldata.push("<div class='geodir-category-img'>");
                    alldata.push("<a href='" + hostname + "/hotels-in-" + u.City.split(' ').join('-').toLowerCase() + "/" + u.Hotel_name.split(' ').join('-').toLowerCase() + "/" + u.mainid + "?" + querystr+"' target='_blank'><img src='https://admin.bonitorooms.com/HotelImages/" + u.Primary_image + "' style='max-height:265px;min-height:265px;' alt=''></a>");

                    alldata.push("<div class='sale-window'>Sale 20%</div>");
                    alldata.push("<div class='geodir-category-opt'>");
                    alldata.push("<div class='listing-rating card-popup-rainingvis' data-starrating2='" + u.Star_Rating + "'>");
                    for (i = 1; i <= 5; i++) {
                        if (i <= parseInt(u.Star_Rating)) {
                            alldata.push('<i class="fa fa-star"></i>');
                        }
                    }
                    alldata.push("</div>");
                    alldata.push("<div class='rate-class-name'>");
                    alldata.push("<div class='score'><strong>Very Good</strong>27 Reviews </div>");
                    alldata.push("<span>5.0</span>");
                    alldata.push("</div>");
                    alldata.push("</div>");
                    alldata.push("</div>");
                    alldata.push("<div class='geodir-category-content fl-wrap title-sin_item'>");
                    alldata.push("<div class='geodir-category-content-title fl-wrap'>");
                    alldata.push("<div class='geodir-category-content-title-item'>");
                    alldata.push("<h3 class='title-sin_map'><a href='" + hostname + "/hotels-in-" + u.City.split(' ').join('-').toLowerCase() + "/" + u.Hotel_name.split(' ').join('-').toLowerCase() + "/" + u.mainid + "?" + querystr +"' target='_blank'>" + u.Hotel_name + "</a></h3>");
                    alldata.push("<div class='geodir-category-location fl-wrap'><a href='#' class='map-item'><i class='fas fa-map-marker-alt'></i>" + u.location_Details + "</a></div>");
                    alldata.push("</div>");
                    alldata.push("</div>");
                    alldata.push("<p>");
                    alldata.push("<button class='couple-button'>");
                    if (u.Allow_Local_Ids == 'True') {
                        alldata.push("<i class='fal fa-id-card'></i> <span>Local Id Allowed</span>&nbsp;");
                    }
                    else {
                        alldata.push("<i class='fal fa-id-badge'></i><span style='text-decoration:line-through'>Local Id Allowed</span>&nbsp;");
                    }
                    if (u.couple_freindly == 'True') {
                        alldata.push("<i class='fal fa-heart'></i><span>Couple Freindly</span>");
                    }
                    else {
                        alldata.push("<i class='fal fa-heart'></i><span style='text-decoration:line-through'>Couple Freindly</span>");
                    }
                    alldata.push("</button>");
                    alldata.push("</p>");
                    alldata.push("<ul class='facilities-list fl-wrap' style='text-transform:capitalize'>");
                    if (u.Hotel_Facilities != null && u.Hotel_Facilities.split(',').length > 0) 
                        {
                            $(u.Hotel_Facilities.split(',')).each(function (t, u) {

                                alldata.push("<li><i class='" + u.toString().split('#')[1] + "'></i><span>" + u.toString().split('#')[0] + "</span></li>");
                            });
                        }

                        alldata.push("</ul>");
                        alldata.push("<div class='geodir-category-footer fl-wrap'>");
                        alldata.push("<div class='geodir-category-price'>Avg/Night <span>₹ " + u.minrate + "</span></div>");
                        alldata.push("<div class='geodir-opt-list'>");
                        alldata.push("<a href='#' class='single-map-item' data-newlatitude='" + u.Lattitude + "' data-newlongitude='" + u.longitude + "'><i class='fal fa-map-marker-alt'></i><span class='geodir-opt-tooltip'>On the map</span></a>");
                        alldata.push("<a href='#' class='geodir-js-favorite'><i class='fal fa-heart'></i><span class='geodir-opt-tooltip'>Save</span></a>");
                        alldata.push("<a href='#' class='geodir-js-booking'><i class='fal fa-exchange'></i><span class='geodir-opt-tooltip'>Find Directions</span></a>");
                        alldata.push("</div>");
                        alldata.push("</div>");
                        alldata.push("</div>");
                        alldata.push("</article>");
                        alldata.push("</div>");


                //    alldata.push('<li><span class="launch-soon">');
                //    for (i = 1; i <= 5; i++) {
                //        if (i <= parseInt(u.Star_Rating)) {
                //            alldata.push('<i class="fa fa-star"></i>');
                //        }
                //    }
                //    alldata.push('</span>');
                //    alldata.push('<a class="cbp-vm-image" href="#"><img src="https://admin.bonitorooms.com/HotelImages/' + u.Primary_image + '"></a>');
                //    alldata.push('<div class="cbp-vm-details">');
                //    alldata.push('<h5 class="project-name text-uppercase"><a target="_blank" href="Hotel_Detail/' + u.Hotel_name.split(' ').join('-') + '?HID=' + u.mainid + '&' + getQueryStrings() + '"> ' + u.Hotel_name + ' </a>');
                //    if (u.over_all_rating != "0.0")
                //        alldata.push('<span class="pull-right Reviews"><a target="_blank" href="Hotel_Detail/' + u.Hotel_name.split(' ').join('-') + '?HID=' + u.mainid + '&' + getQueryStrings() + '#Reviews" >' + u.over_all_rating + '/5 <small>Reviews</small></a></span>');
                //    alldata.push('</h5>');
                //    alldata.push('<p class="location1"><i class="fa fa-map-marker"></i>' + u.location_Details + '</p>');
                //    if (u.Hotel_Facilities != null && u.Hotel_Facilities.split(',').length > 0) {
                //        alldata.push('<ul class="list-inline amneties">');
                //        $(u.Hotel_Facilities.split(',')).each(function (t, u) {

                //            {
                //                alldata.push('<li data-toggle="tooltip" data-placement="top" data-title="' + u.split('#')[0] + '" data-original-title="" title=""><i class="' + u.split('#')[1] + '"></i></li>');
                //            }
                //        })
                //        alldata.push('</ul>');
                //    }
                //    alldata.push('</div>');
                //    alldata.push('<div class="call-back">');
                //    alldata.push('<h3 class="price1">');
                //    alldata.push('<i class="fa fa-rupee"></i> ' + Number(u.minrate).toFixed(0) + '/- ');
                //    if (u.minrate != u.originalrate)
                //        alldata.push('<s class="text-muted small"><i class="fa fa-rupee"></i> ' + Number(u.originalrate).toFixed(0) + '</s>');
                //    alldata.push('</h3>');
                //    if (u.Allow_Local_Ids == "True" || u.couple_freindly == "True") {
                //        alldata.push('<p><button class="btn btn-warning btn-xs allow btn-sm">');
                //        if (u.Allow_Local_Ids == "True") {
                //            alldata.push('<i class="fa fa-id-card"></i> Allow Local ID');
                //        }
                //        else
                //            alldata.push('<i class="fa fa-id-card"></i><strike> Allow Local ID</strike>');

                //        if (u.couple_freindly == "True") {
                //            alldata.push('<br><i class="fa fa-heart"></i> Couple Friendly');
                //        }
                //        alldata.push('</button></p>');
                //    }
                //    alldata.push('<a class="cbp-vm-icon btn-sm cbp-vm-add btnhotel" target="_blank" href="Hotel_Detail/' + u.Hotel_name.split(' ').join('-') + '?HID=' + u.mainid +'&'+ getQueryStrings() + '"> Book Now <i class="fa fa-chevron-right"></i></a>');
                //    alldata.push('</div>');
                //    alldata.push('</li>');
                 });
                $('#MainList').append(alldata.join(''));
                $('[data-toggle="tooltip"]').tooltip();

                $(".listing-item-container  .listing-item").matchHeight({});
                
                fired = 0;
                $(starti).val(parseInt($(starti).val()) + 16)
                $(endi).val(parseInt($(endi).val()) + 16)
                $(".single-map-item").off('click');
                var markerIcon = {
                    url: '../Content/images/Icon.png',
                }
                var myLatLng = {
                    lng: $('#singleMap').data('longitude'),
                    lat: $('#singleMap').data('latitude'),
                };
                var single_map = new google.maps.Map(document.getElementById('singleMap'), {
                    zoom: 14,
                    center: myLatLng,
                    scrollwheel: false,
                    zoomControl: false,
                    fullscreenControl: true,
                    mapTypeControl: false,
                    scaleControl: false,
                    panControl: false,
                    navigationControl: false,
                    streetViewControl: true,
                    styles: [{
                        "featureType": "landscape",
                        "elementType": "all",
                        "stylers": [{
                            "color": "#f2f2f2"
                        }]
                    }]
                });
                var marker = new google.maps.Marker({
                    position: myLatLng,
                    map: single_map,
                    icon: markerIcon,
                    title: 'Location'
                });

                $(".single-map-item").on("click", function (e) {
                    e.preventDefault();
                    google.maps.event.trigger(single_map, 'resize');
                    $(".map-modal-wrap").fadeIn(400);
                    var $that = $(this),
                        newln = $that.data("newlatitude"),
                        newlg = $that.data("newlongitude"),
                        newtitle = $that.parents(".title-sin_item").find(".title-sin_map a").text(),
                        newurl = $that.parents(".title-sin_item").find(".title-sin_map a").attr('href');
                    var latlng = new google.maps.LatLng(newln, newlg);
                    marker.setPosition(latlng);
                    single_map.panTo(latlng);
                    $(".map-modal-container h3 a").text(newtitle).attr("href", newurl);
                });
            }
            else {
                if (btn != null)
                $(btn.target).hide();
                $('#nohotel').remove();
                // $(Grid).append('<li  class="mix category-3" id="nohotel" style="display:block;width:100%;color:grey;"><center><h1>No More Hotels</h1></center></li>');
                $('#loadergif').hide()
            }
            loadcheck = 0;
        }
    });
}
$('#SearchHeader').click(function () {
    
    if ($('#CityOrHotelHeader').val() == "")
    {
        $('#CityOrHotelHeader').focus();
        return false;
    }
    $('#SearchHeader').val('Please wait');
    $('#SearchHeader').attr('disabled', true);
    age = new Array();
    $('div[id*="SearchBox"]').each(function (t, u) {

       
         
            age1 = new Array();
            $(u).find('.childage').each(function (t, u) {
                age1.push(u.value);
            });
            
        
            age.push($(u).find('input[data-id="adults"]').val() + '-' + age1.join(','));
       

    });
    $('#StaySearch').val(age.join('$'));
    $('#SearchHeader').closest('form')[0].submit();
})