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
  if (!window.isTimelineLoaded && location.hash === "#!/page_promotion") {
    window.isTimelineLoaded = true;
    createStoryJS({
      type:       'timeline',
      width:      '100%',
      height:     '100%',
      source: 'https://docs.google.com/spreadsheet/pub?key=0ApI-2uhbGvbbdFNCUnpWd2hnRlpWY3NoOTlMMUJDdGc&output=html',
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
  var el = $('.lazy');
  for(var i = 0; i < el.length; ++i)
  {
    var img = new Image();
    var src = $(el).attr('data-original');
    img.onload = function(){
      $(el).attr('src', img.src);
      $("#galleryHolder").gallerySplash();
    };
    img.src = src;
  }
}

$(document).ready(function(){
  loadProduct();
  loadServices();
  initTimeline();
  loadImageLazily();
});


