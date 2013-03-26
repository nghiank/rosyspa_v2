$(document).ready(function(){
	$.fn.gallerySplash = function(){
		var imageHolder = $(".imageHolder",this),
	 		image = $(".imageHolder > img",this),
	 		imageSRCLink = $("ul>li>a",this),
			imageDeltaX,
			imageDeltaY,
			imageK =image.height()/image.width(),
			holderK =imageHolder.height()/imageHolder.width(),
			imagePercent = (image.height()/image.width())*100,
			imgSRC,
			currImg = 0,
			prevImg = 0,
			allImg = imageSRCLink.length,
			MSIE = ($.browser.msie) && ($.browser.version <= 8),
			autoPlayState = true,
			loadComplete = true;
			
		init()
		
		function init(){
            imageSRCLink.click(function (){
                    if(loadComplete){
                	    var newInd = $(this).parent().index();
    				    if (newInd != currImg) {
                        	autoPlayState = false;
        					prevImg = currImg;
        					currImg = newInd;
        					changeImageHandler();
    				    }
                    }
            });
			$("#next").click(function(){
					if(loadComplete){
						autoPlayState = false;
						prevImg = currImg;
						currImg++;
						if(currImg>allImg-1){
							currImg = 0;
						}
						changeImageHandler();
					}
			});
			$("#prev").click(function(){
				if(loadComplete){
					autoPlayState = false;
					prevImg = currImg;
					currImg--;
					if(currImg<0){
						currImg = allImg-1;
					}
					changeImageHandler();
				}			
			});
			$("#next").mouseenter(
				function(){
					if(!MSIE){
						$(this).stop(true).animate({"backgroundPosition":"left center"}, 400, "easeInOutCubic");	
					}else{
						$(this).css({"backgroundPosition":"left center"});
					}
				})
			$("#next").mouseleave(
			 	function(){
					if(!MSIE){
						$(this).stop(true).animate({"backgroundPosition":"right center"}, 400, "easeInOutCubic");	
					}else{
						$(this).css({"backgroundPosition":"right center"});
					}
				}
			)
			
			$("#prev").mouseenter(
				function(){
					if(!MSIE){
						$(this).stop(true).animate({"backgroundPosition":"right center"}, 400, "easeInOutCubic");	
					}else{
						$(this).css({"backgroundPosition":"right center"});
					}
				})
			$("#prev").mouseleave(		
			 	function(){
					if(!MSIE){
						$(this).stop(true).animate({"backgroundPosition":"left center"}, 400, "easeInOutCubic");	
					}else{
						$(this).css({"backgroundPosition":"left center"});
					}
				}
			)
			
			$(window).resize(resizeImageHandler).trigger('resize');
			image.load(resizeImageHandler);
		}		
		function resizeImageHandler(){
			image = imageHolder.children("img");
			imageK =image.height()/image.width()
			holderK =imageHolder.height()/imageHolder.width()
			if(holderK>imageK){
				imagePercent = (image.width()/image.height())*100;
				image.css({height:imageHolder.height(), width:(imageHolder.height()*imagePercent)/100});
			}else{
				imagePercent = (image.height()/image.width())*100;
				image.css({width:imageHolder.width(), height:(imageHolder.width()*imagePercent)/100});
			}
			imageDeltaX=-(image.width()-imageHolder.width())/2;
			imageDeltaY=-(image.height()-imageHolder.height())/2;
			image.css({left:imageDeltaX, top:imageDeltaY, position:"absolute"});
		}
		function changeImageHandler(){
			loadComplete = false;
			image.addClass("topImg");
			imgSRC = imageSRCLink.eq(currImg).attr("href");
			imageHolder.append("<div id='imgSpinner'></div><img class='bottomImg' src="+imgSRC+" alt=''>");
			$("#imgSpinner").css({opacity:.5});
			$(".bottomImg").bind("load", loadImageHandler);
		}
		function loadImageHandler(){
			resizeImageHandler();
			$(".bottomImg").unbind("load", loadImageHandler);
			$("#imgSpinner").stop(true).animate({opacity:0}, 600, "easeInOutCubic")
			$(".topImg").stop(true).animate({opacity:0}, 600, "easeInOutCubic",  function(){
				$("#imgSpinner").remove();
				$(".topImg").remove();
				image.removeClass("bottomImg");
				loadComplete = true;
			})
		}
	}
});
