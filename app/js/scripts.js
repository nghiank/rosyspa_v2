//--------global-------------
var isSplash = true;
var isFirst = true;

var spinner;
var mapSpinner;
var bgSpinner;

var MSIE = ($.browser.msie) && ($.browser.version <= 8)
//------DocReady-------------
$(document).ready(function(){ 
    if(location.hash.length == 0){
        location.hash="!/"+$('#content > ul > li:first-child').attr('id');
    }
    ///////////////////////////////////////////////////////////////////

    //$("body").css({'min-height':'568px'});
    $("body").css({'min-height':'950px'});


    ///////////////////////////////////////////////////////////////////



    $('ul#menu').superfish({
          delay:       800,
          animation:   {height:'show'},
          speed:       600,
          autoArrows:  false,
          dropShadows: false,
         	onInit: function(){
  				$("#menu > li > a").each(function(index){
  					var conText = $(this).find('.mText').text();
                       $(this).append("<div class='_area'></div><div class='_overPl'></div><div class='mTextOver'>"+conText+"</div>"); 
                       
  				})

  	 		}
    });
});

//------WinLoad-------------  
$(window).load(function(){  
  var win=$(window)
  //*************** SPLASH ******************//


  //*************** rollOver Splash items ******************//

  $('#splash_mov a').hover(function(){
    $(this).find('.pic_act').stop().animate({opacity:0}, 550, 'easeOutSine'); 
  }, function(){
    $(this).find('.pic_act').stop().animate({opacity:1}, 550, 'easeOutSine');
  })

  //*************** end rollOver Splash items ******************//
  function showSplash(){
    setTimeout(function(){
      animation = true;
      var cnt = 0;

      var mult = 1;
      var elems = $('#splash_ell>li');

      //console.log(elems);

      elems.each(function(index,el){
        if (parseInt((index+1)%2) == 0) {
          mult *= -1;
        }

        if (!MSIE){
          $(el).css({'left':windowW()*mult,'rotate':getRandomFromRangeInt(-720,720)}).stop(true,true)
          .delay(getRandomFromRangeInt(100,1000))
          .animate({'left': 0,'rotate':'0deg'},{duration:1200,easing:'easeOutQuad',complete:function(){
            cnt++; if (cnt==elems.length){animation = false;}
          }
          });
        } else {
          $(el).css({'left':windowW()*mult}).stop(true,true)
          .delay(getRandomFromRangeInt(100,1000))
          .animate({'left': 0},{duration:1200,easing:'easeOutQuad',complete:function(){
            cnt++; if (cnt==elems.length){animation = false;}
          }
          });
        }

      });
      $('.splash_mov').css({'display':'block'});        
    },0);
  }

  function hideSplash(){
    animation = true;
    var mult = 1;
    var cnt = 0;
    var elems =  $('#splash_ell>li');
    elems.each(function(index,el){
      if (parseInt((index+1)%2) == 0) {
        mult *= -1;
      }
      if (!MSIE){
        $(el).stop(true,true).delay(getRandomFromRangeInt(100,1000))
        .animate({'left':windowW()*mult,'rotate':getRandomFromRangeInt(-720,720)},
                 {duration:1200,easing:'easeOutQuad'
                   ,complete:function(){
                     cnt++;
                     if (cnt == elems.length){
                       animation = false;
                       $('.splash_mov').css({'display':'none'}); 
                     }
                   }});
      } else {
        $(el).stop(true,true).delay(getRandomFromRangeInt(100,1000))
        .animate({'left':windowW()*mult}
                 ,{duration:1200,easing:'easeOutQuad'
                   ,complete:function(){
                     cnt++;
                     if (cnt == elems.length){
                       animation = false;
                       $('.splash_mov').css({'display':'none'}); 
                     }
                   }});
      }
      $(el).find('.with_ul').hide(); 
    });
  }

  function hideSplashQ(){
    $('.splash_mov').css({'display':'none'});
    var mult = 1;
    $('#splash_ell>li').each(function(index,el){
      if (parseInt((index+1)%2) == 0){
        mult *= -1;
      }
      if (!MSIE){
        $(el).css({'left':windowW()*mult,'rotate':getRandomFromRangeInt(-720,720)});
      } else {
        $(el).css({'left':windowW()*mult});
      }
    });
  }

  //*************** END SPLASH ******************//
  //list_1-------------------------------------------------
  $('.list_1 > li > a').hover(function(){
    $(this).stop().animate({color:"#474747", marginLeft:5}, 300, "easeOutCubic")
  }, function(){;
  $(this).stop().animate({color:"#c8c8c8", marginLeft:0}, 300, "easeOutCubic");
  })   
  //end list-1-------------------------------------------------


  var menuItems = $('#menu >li'); 
  var currentIm = 0;
  var lastIm = 0;

  ///////////////////////////////////////////////
  var navItems = $('.menu > ul >li');

  //$('.menu > ul >li').eq(0).css({'display':'none'});
  var content=$('#content'),
  nav=$('.menu');

  $('#content').tabs_page({

    preFu:function(_){
      _.li.css({left:"-1700px",'visibility':'hidden'});
    }
    ,actFu:function(_){			
      if(_.curr){
        _.curr.css({'visibility':'visible', left:'1700px'}).stop(true).delay(400).animate({left:"-11px"},800,'easeOutCubic');
        if ((_.n == 0) && ((_.pren>0) || (_.pren==undefined))){splashMode();}

        if (((_.pren == 0) || (_.pren == undefined)) && (_.n>0) ){
          //console.log("pren " + _.pren);
          contentMode();
        }
        //console.log("_.n " + _.n);

        if (_.n == 0){
          showSplash();
        }
        if ((_.pren == 0) && (_.n>0)){
          hideSplash();  
        }
        if (_.pren == undefined){
          _.pren = -1;
          hideSplashQ();
        }
      }
      if(_.prev){
        _.prev.stop(true).animate({left:'-1700px'},600,'easeInOutCubic',function(){_.prev.css({'visibility':'hidden'});} );
      }
    }
  });


  function splashMode(){
    isSplash = true;
    setTimeout(function() {
      $("body").css({'min-height':'950px'});

    },0);
    setTimeout(
      function(){
        $(".main").css({"z-index":1});
        //$(".extraBg1").css({'border-top': 'none'});
      }, 800);
  }

  function contentMode(){  
    isSplash = false;
    setTimeout(function() {
      $("body").css({'min-height':'950px'});
    },0);

    $(".main").css({"z-index":2})
  }		
  nav.navs({
    useHash:true,
    defHash:'#!/page_home',
    hoverIn:function(li){
      $(".mText", li).stop(true).animate({top:"120px"}, 600, 'easeOutCubic');
      $(".mTextOver", li).stop(true).delay(50).animate({top:"20px"}, 500, 'easeOutCubic');
      $("._overPl", li).stop(true).animate({bottom:"0px"}, 500, 'easeOutCubic');
      // if(($.browser.msie) && ($.browser.version <= 8)){}else{}
    },
    hoverOut:function(li){
      if ((!li.hasClass('with_ul')) || (!li.hasClass('sfHover'))) {
        $(".mText", li).stop(true).animate({top:"0px"}, 600, 'easeOutCubic');
        $(".mTextOver", li).stop(true).delay(20).animate({top:"-120px"}, 400, 'easeOutCubic');
        $("._overPl", li).stop(true).animate({bottom:"121px"}, 400, 'easeOutCubic');
      }
    }
  })
  .navs(function(n){			
    $('#content').tabs_page(n);
  })


  //////////////////////////////////////////
  var h_cont=605;
  function centrRepos() {
    var h=$(window).height();
    if (h>(h_cont+385)) {
      m_top=~~(h-h_cont)/2;
      h_new=h;
    } else {
      m_top=115;
      h_new=h_cont+385;
    }

    if(m_top > 155){
      $('.center').stop().animate({paddingTop:m_top}, 800, 'easeOutExpo');
    }else{

      $('.center').stop().animate({paddingTop:"155px"}, 800, 'easeOutExpo');
    }
  }

  centrRepos();


  $(".downScroll_more").hoverSprite({onLoadWebSite: true});
  $(".upScroll_more").hoverSprite({onLoadWebSite: true});


  $('.scroll').uScroll({mousewheel:true,step: 100,lay:'outside'});


  //follow-icons-------------	 
  $('.follow-icon a').hover(function(){
    $(this).find('.img_icon').stop().animate({paddingTop:'7px'})					 
  }, function(){
    $(this).find('.img_icon').stop().animate({paddingTop:'0px'})						 
  })
  //end follow-icons-------------


  ///////////Window resize///////

  function windowW() {
    return (($(window).width()>=parseInt($('body').css('minWidth')))?$(window).width():parseInt($('body').css('minWidth')));
  }

  $(window).resize(function(){
    centrRepos();

  }
                  );

    } //window function
); //window load
