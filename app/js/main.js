var IS_OFFLINE = true;

function getUrlParam(string) {
  var str = string.toString();

  if (str.match('&#038;')) { 
    str = str.replace("&#038;", "&");
  } else if (str.match('&#38;')) {
    str = str.replace("&#38;", "&");
  } else if (str.match('&amp;')) {
    str = str.replace("&amp;", "&");
  }

  var vars = [], hash;
  var hashes = str.slice(str.indexOf('?') + 1).split('&');
  for(var i = 0; i < hashes.length; i++) {
    hash = hashes[i].split('=');
    vars.push(hash[0]);
    vars[hash[0]] = hash[1];
  }
  return vars;
}
//Template helper
window.templates = [];
window.loadTemplate = function (name, callback) {
  if (window.templates[name]) {
    callback && callback(window.templates[name]);
    return;
  }
  $.get('views/' + name + '.html', function (data) {
    window.templates[name] = data;
    callback && callback(data);
  });
};

window.loadEjsTemplate  = function (name, injectdata, callback)
{
  window.loadTemplate( name, function(data){
    var newData = _.template(data, injectdata);
    callback && callback(newData);
  });   
};


/// PRODUCT LOADING
var allproducts = [];
function parseProductData(data)
{
  var entries = data && data.feed && data.feed.entry;
  if (!entries) return;
  for(var i = 0 ; i < entries.length; ++i)
  {
    var e = entries[i];
    if (!e) continue;
    if (e.gsx$id){
        var id = e.gsx$id.$t;
        if (id.length == 0) {
          allproducts.push({
            id: allproducts.length,
            category_name: e.gsx$productname.$t,
            image: e.gsx$image.$t,
            product_under_cat: []
          });
        } else {
          if (!allproducts.length) continue;
          var cur = allproducts[allproducts.length - 1];
          cur.product_under_cat.push({
            id: e.gsx$id,
            product_name: e.gsx$productname.$t,
            usage: e.gsx$usage.$t,
            size: e.gsx$size.$t,
            price: e.gsx$price.$t,
            image: e.gsx$image.$t,
            thumbnail: e.gsx$thumbnail.$t
          });
        }
    }
  }
}

function pleasingEffectForLinks()
{
    $('.list_1 > li > a').hover(function(){
      $(this).stop().animate({color:"#474747", marginLeft:5}, 300, "easeOutCubic")
    }, function(){;
      $(this).stop().animate({color:"#c8c8c8", marginLeft:0}, 300, "easeOutCubic");
    })   
}

function trackPageClick(name)
{
  if (typeof(_gaq) === 'undefined') return;
  _gaq.push(['_trackPageview',window.location.pathname + window.location.search  + window.location.hash + "/" + name]);
}

(function($){
	$.fn.listSubItems=function(templateProducts, templateSubProducts, allItems){
		this.each(function(){
        var th=$(this);
        init();
        function init()
        {
          th.curPid = 0;
          window.loadEjsTemplate( templateProducts, {allItems: allItems}, function(data){
            th.html(data)
            pleasingEffectForLinks();

            switchSubProduct(th.curPid);
            $('a[id*="catid"]', th).click(function(event){
              var pid = parseInt(event.currentTarget.id.slice(5));
              switchSubProduct( pid );
              trackPageClick(allItems[pid].category_name);
              return false;
            });
          });
        }
        function switchSubProduct( pid )
        {
          th.curPid = pid;
          window.loadEjsTemplate( templateSubProducts, {allSubItems:allItems[pid].product_under_cat, catName: allItems[pid].category_name}, function(data){
            $('#subproduct', th).hide().html( data ).fadeIn('slow');
            $('#subproduct').animate({scrollTop:0}, 'slow');

            $.each($('.product_big_image'), function(index, el){
              $(el).fancybox({
                'transitionIn': 'elastic',
                'transitionOut': 'elastic',
                'speedIn': 500,
                'speedOut': 300,
                'centerOnScroll': true,
                'overlayColor': '#000'
              });
            });
          });
        }
		})
	}
})(jQuery);


function populateProductData()
{
  $('#page_product').listSubItems("productListing", "subproductListing", allproducts);
}

function loadFromGoogleSpreadSheet(url, callbackComplete, callbackFailed)
{
  var params = getUrlParam(url);
  var key =  params["key"];
  var worksheet = params["worksheet"] || "od6";
  var urljson	= "https://spreadsheets.google.com/feeds/list/" + key + "/" + worksheet + "/public/values?alt=json";
  $.getJSON(urljson, function(data){
    callbackComplete && callbackComplete(data);
  }).error( function(jqxhr, textstatus, errorthrown){
    callbackFailed && callbackFailed();
  });
}

function loadProduct()
{
  var producturl = "https://docs.google.com/spreadsheet/pub?key=0Al1j6A-YSYd3dDJNazVMN1V3Z1MxeUM3Z3ZJRjlqaWc&output=html";
  loadFromGoogleSpreadSheet( producturl, 
                             function(data) {
                               parseProductData(data);
                               populateProductData();
                             },
                             IS_OFFLINE ? null: loadProduct);
}

var bigServiceItems = [];
//Service Data related
function parseServiceData(data)
{
  var entries = data && data.feed && data.feed.entry;
  if (!entries) return;
  for(var i = 0 ; i < entries.length; ++i)
  {
    var e = entries[i];
    bigServiceItems.push({
      id: i,
      name: e.gsx$name.$t,
      shortdesc: e.gsx$shortdesc.$t, 
      description: e.gsx$description.$t,
      image: e.gsx$image.$t
    });
  }
}

function updatePageServiceDetail(sid)
{
  var descDetail = bigServiceItems[sid].description;
  $('#page_service_detail_container').html( descDetail );
}

function populateServiceData()
{
  window.loadEjsTemplate( "serviceListing", {allItems: bigServiceItems}, function(data){
    var th = $('#page_services');
    th.html(data);

    updatePageServiceDetail(0);
    $('a[id*=service]').click(function(event){
      var sid = parseInt(event.currentTarget.id.slice(7));
      updatePageServiceDetail(sid);
      window.location.hash = "#!/page_service_detail";
      if (sid < 0 || sid > bigServiceItems.length - 1) return false;
      window.location.hash = "#!/page_service_detail";
      trackPageClick(sid);
      return false;
    });
  })
}
function loadServices()
{
  var serviceurl = "https://docs.google.com/spreadsheet/pub?key=0Al1j6A-YSYd3dFpocWM4Zm4ySkhQcnhQbUNGQk9sb3c&output=html";
  loadFromGoogleSpreadSheet(serviceurl, function(data){
                              parseServiceData(data);
                              populateServiceData();
                            },
                            IS_OFFLINE ? null : loadServices);
}

window.isTimelineLoaded = false;
function initTimeline()
{
  if (!window.isTimelineLoaded) {
    window.isTimelineLoaded = true;
    createStoryJS({
      type:       'timeline',
      width:      '100%',
      height:     '100%',
      source: 'https://docs.google.com/spreadsheet/pub?key=0Al1j6A-YSYd3dDQzUzloZTJaS0dtMEFNNnpoeTVoS3c&output=html',
      lang : 'vi',
      start_at_end:true,
      embed_id:   'timeline',
      css: 'js/TimelineJS/compiled/css/dark.css',
      js: 'js/TimelineJS/compiled/js/timeline-min.js'
    });
  }
}
$(window).bind('hashchange', function(){
  initTimeline();
});

//Lazy load images
function loadImageLazily()
{
  $.each( $('.lazy'), function(index, el){
    var img = new Image();
    var src = $(el).attr('data-original');
    img.src = src;
    img.onload = function(source){
      return function(){
        $(el).attr('src', source);
      }
    }(img.src);
  });

  $.each( $('.pic_act'), function(index, el){
    var img = new Image();
    var src = '../images/item0' + (index+1).toString() + ".png";
    img.src = src;
    img.onload = function(source){
      return function(){
        var newUrl ='url(' + source +')'; 
        $(el).css('background-image', newUrl);
        $(el).css('background-position-x', '0');
        $(el).css('background-position-y', '0');
      }
    }(src);
  });
}

var allGallery = [];
function parseGallery(data)
{
  var entries = data && data.feed && data.feed.entry;
  if (!entries) return;
  for(var i = 0 ; i < entries.length; ++i)
  {
    var e = entries[i];
    allGallery.push({
      id: i,
      thumbnail: e.gsx$thumbnail.$t,
      image: e.gsx$image.$t
    });
  }
}
function slideGallery()
{
  //slider gallery----------------------------------------------
  if ($(".slider1").length) {
    $('.slider1').cycle({
      fx: 'scrollHorz',
      speed: 600,
      timeout: 0,
      next: '.next1',
      prev: '.prev1',                
      easing: 'easeInOutExpo',
      cleartypeNoBg: true ,
      rev:0,
      startingSlide: 0,
      wrap: true
    })
  };
  var ind = 0;
  var len = $('.nav_item').length;
  $('.nav_item').bind('click',function(){
    ind = $(this).index()-0;
    $('.nav_item').each(function(index,elem){
        if (index!=(ind)){
          $(this).removeClass('active');
        }
    });
    $(this).addClass('active');
    $('.slider1').cycle(ind);
  });

  $('#arrows1 .img_act').css({opacity:0})
  $('.next1').hover(function(){
    $(this).find('.img_act').stop(true).animate({opacity:1}, 350, 'easeOutSine');				 
  }, function(){
    $(this).find('.img_act').stop(true).animate({opacity:0}, 350, 'easeOutSine')					 
  })

  $('.prev1').hover(function(){
    $(this).find('.img_act').stop(true).animate({opacity:1}, 350, 'easeOutSine');				 
  }, function(){
    $(this).find('.img_act').stop(true).animate({opacity:0}, 350, 'easeOutSine')					 
  })

  //********** list-1 ***********//
  $('.list-1>li>a').attr('rel','appendix')
  .prepend('<span class="sitem_over"><strong></strong></span>')
  $('.list-1>li>a').fancybox({
    'transitionIn': 'elastic',
    'transitionOut': 'elastic',
    'speedIn': 500,
    'speedOut': 300,
    'centerOnScroll': true,
    'overlayColor': '#000'
  });

  $('.list-1>li>a')
  .find('strong').css('top','200px').end()
  .hover(
    function(){
    if (!MSIE){
      $(this).children('.sitem_over').css({display:'block',opacity:'0'}).stop().animate({'opacity':1}).end() 
      .find('strong').css({'opacity':0}).stop().animate({'opacity':1,'top':'0'},350,'easeInOutExpo');
    } else { 
      $(this).children('.sitem_over').stop().show().end()
      .find('strong').stop().show().css({'top':'0'});
    }
  },
  function(){
    if (!MSIE){
      $(this).children('.sitem_over').stop().animate({'opacity':0},1000,'easeOutQuad',function(){$(this).children('.sitem_over').css({display:'none'})}).end()  
      .find('strong').stop().animate({'opacity':0,'top':'200px'},1000,'easeOutQuad');  
    } else {
      $(this).children('.sitem_over').stop().hide().end()
      .find('strong').stop().hide();
    }            
  }
  );
}

function populateGallery()
{
  var curSlide = "<ul class='list-1'>";
  var $page = $('.slider1');
  for(var i = 0 ; i < allGallery.length; ++i)
  {
    var anImg = "<li>";
    var imgLoading = '../images/main_spinner.gif';
    anImg += "<a href='" + allGallery[i].image + "'><img id='galleryImg" + i + "' style='width:197px; height: 189px;background:url(" + imgLoading + ") 85px 80px no-repeat;' /></a>"
    anImg += "</li>";
    if ((i % 8 == 0) && i)
    {
      curSlide += "</ul>";
      $page.append($(curSlide));
      curSlide = "<ul class='list-1'>";
    }
    curSlide += anImg;
  }
  if ( curSlide != "<ul class='list-1'>")
  {
    curSlide += "</ul>";
    $page.append($(curSlide));
  } 

  slideGallery();
  for(var i = 0; i < allGallery.length; ++i)
  {
    var img =new Image();
    img.src = allGallery[i].thumbnail;
    img.onload = function(index, source){
      return function(){
        $('#galleryImg' + index, $page).attr("src", source);
      };
    }(i, img.src);
  }
}

function loadImgGallery()
{
  var undone = allGallery.length;
  for(var i = 0; i < allGallery.length; ++i)
  {
    var img = new Image();
    img.src = allGallery[i].thumbnail; //we load only thumbnail in advance;
    img.onload = function(){

    };
  }
}

function loadGallery()
{
  var serviceurl = "https://docs.google.com/spreadsheet/pub?key=0Al1j6A-YSYd3dHpTbS1JdHdsTW1VRGJ3VzdqTWhHTHc&output=html";
  loadFromGoogleSpreadSheet(serviceurl, function(data){
                              parseGallery(data);
                              populateGallery();
                            },
                            IS_OFFLINE ? null : loadGallery);
}

function loadStartUpNotification()
{
  var startUpUrl = "https://docs.google.com/spreadsheet/pub?key=0Al1j6A-YSYd3dFRRdTgxdFhZMGFfZ2ZPQlhQdjBGTlE&output=html";
  ////if it fail, dont do anything
  loadFromGoogleSpreadSheet(startUpUrl, function(data){
    var entries = data && data.feed && data.feed.entry;
    if (!entries) return;
    var isOnStartUp = '0';
    var contentLoaded = "Welcome to beRosySpa";
    for(var i = 0 ; i < entries.length; ++i)
    {
      var e = entries[i];
      if (e.gsx$attr.$t && e.gsx$attr.$t === 'isOnStartUp') {
        isOnStartUp = e.gsx$value.$t;
      }
      if (e.gsx$attr.$t && e.gsx$attr.$t === 'notificationContent') {
        contentLoaded = e.gsx$value.$t;
      }
    }
    if (isOnStartUp === '1') {
      $('#popupContent').html(contentLoaded);
      $('#popup').bPopup({
        easing: 'easeOutBack', //uses jQuery easing plugin
        speed: 950,
        transition: 'slideDown'
      });
    }
  });
}

$(document).ready(function(){
  loadProduct();
  loadServices();
  initTimeline();
  loadImageLazily();
  loadGallery();
});

$(window).load(function(){
  loadStartUpNotification();
});


