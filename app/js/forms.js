//forms
;(function($){
  $.fn.forms=function(o){
    return this.each(function(){
      var th=$(this)
        ,_=th.data('forms')||{
          errorCl:'error',
          emptyCl:'empty',
          invalidCl:'invalid',
          notRequiredCl:'notRequired',
          successCl:'success',
          successShow:'4000',
          mailHandlerURL:'bat/MailHandler.php',
          ownerEmail:'spa@berosy.vn',
          stripHTML:true,
          smtpMailServer:'localhost',
          targets:'input,textarea',
          controls:'a[data-type=reset],a[data-type=submit]',
          validate:true,
          rx:{
            ".name":{rx:/^[a-zA-Z'][a-zA-Z-' ]+[a-zA-Z']?$/,target:'input'},
            ".state":{rx:/^[a-zA-Z'][a-zA-Z-' ]+[a-zA-Z']?$/,target:'input'},
            ".email":{rx:/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i,target:'input'},
            ".phone":{rx:/^\+?(\d[\d\-\+\(\) ]{5,}\d$)/,target:'input'},
            ".phonespam":{rx:/^\+?(\d[\d\-\+\(\) ]{5,}\d$)/,target:'input'},
            ".fax":{rx:/^\+?(\d[\d\-\+\(\) ]{5,}\d$)/,target:'input'},
            ".date": {rx:/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/, target:'input'},
            ".time": {rx: /^(0?9|1[0-9])[\.\:]?(00|30)$/, target:'input'}
          },
          preFu:function(){
            _.labels.each(function(){
              var label=$(this),
                inp=$(_.targets,this),
                defVal=inp.val(),
                trueVal=(function(){
                      var tmp=inp.is('input')?(tmp=label.html().match(/value=['"](.+?)['"].+/),!!tmp&&!!tmp[1]&&tmp[1]):inp.html()
                      return defVal==''?defVal:tmp
                    })();
              trueVal!=defVal && inp.val(defVal=trueVal||defVal);
              label.data({defVal:defVal});
              inp.bind('focus',function(){
                    inp.val()==defVal &&(inp.val(''),_.hideEmptyFu(label),label.removeClass(_.invalidCl));
              }).bind('blur',function(){
                  _.validateFu(label);
                  if(_.isEmpty(label))
                    inp.val(defVal)
                    ,_.hideErrorFu(label.removeClass(_.invalidCl))
              }).bind('keyup',function(){
                  label.hasClass(_.invalidCl)
                    &&_.validateFu(label)
              }).bind('change', function(){
                  _.validateFu(label);
                  if(_.isEmpty(label))
                    inp.val(defVal)
                    ,_.hideErrorFu(label.removeClass(_.invalidCl))
              });
              label.find('.'+_.errorCl+',.'+_.emptyCl).css({display:'block'}).hide()
            })
            _.success=$('.'+_.successCl,_.form).hide()
          },
          isRequired:function(el){
            return !el.hasClass(_.notRequiredCl)
          },
          isValid:function(el){
            var ret=true
            $.each(_.rx,function(k,d){
              if(el.is(k))
                ret=d.rx.test(el.find(d.target).val())
            })
            return ret
          },
          isEmpty:function(el){
            var tmp
            return (tmp=el.find(_.targets).val())==''||tmp==el.data('defVal')
          },
          validateFu:function(el){
            el.each(function(){
              var th=$(this)
                ,req=_.isRequired(th)
                ,empty=_.isEmpty(th)
                ,valid=_.isValid(th)								
              
              if(empty&&req)
                _.showEmptyFu(th.addClass(_.invalidCl))
              else
                _.hideEmptyFu(th.removeClass(_.invalidCl))
              
              if(!empty)
                if(valid)
                  _.hideErrorFu(th.removeClass(_.invalidCl))
                else
                  _.showErrorFu(th.addClass(_.invalidCl))								
            })
          },
          getValFromLabel:function(label){
            var val=$('input,textarea',label).val()
              ,defVal=label.data('defVal')								
            return label.length?val==defVal?'nope':val:'nope'
          },
          getValFromList: function(selectList){
            return selectList.val();
          },
          submitFu:function(){
            _.validateFu(_.labels);
            if (_.getValFromLabel($('.phone',_.form)) !==
                _.getValFromLabel($('.phonespam',_.form)))
            {
                $phonespam =$('.phonespam',_.form); 
                $('input',$phonespam).val($phonespam.data('defVal'));
                _.validateFu(_.labels);
            }
            $('.message',_.form).removeClass(_.invalidCl);
            if(!$('.'+_.invalidCl, _.form).length)
              $.ajax({
                type: "POST",
                url:_.mailHandlerURL,
                data:{
                  name:_.getValFromLabel($('.name',_.form)),
                  email:_.getValFromLabel($('.email',_.form)),
                  phone:_.getValFromLabel($('.phone',_.form)),
                  phonespam:_.getValFromLabel($('.phonespam',_.form)),
                  service:_.getValFromList($('#serviceList', _.form)),
                  fax:_.getValFromLabel($('.fax',_.form)),
                  state:_.getValFromLabel($('.state',_.form)),
                  date: _.getValFromLabel($('.date', _.form)),
                  time: _.getValFromLabel($('.time', _.form)),
                  message:_.getValFromLabel($('.message',_.form)),
                  owner_email:_.ownerEmail,
                  stripHTML:_.stripHTML
                },
                success: function(){
                  _.showFu(true);
                },
                error: function()
                {
                  _.showFu(false);
                }
              })			
          },
          showFu:function(isSuccess){
            if (isSuccess)
              {
                $('#alrBookingDate').html(_.getValFromLabel($('.date', _.form)))
                $('#alrBookingTime').html(_.getValFromLabel($('.time', _.form)))
                $('#alrBookingService').html( _.getValFromList($('#serviceList')));
                $('#contactName').html( _.getValFromLabel($('.name')));
                $("#successDlg" ).dialog("open") 
                _.form.trigger('reset')
              } else {
                $('#failedDlg').dialog("open");
              }
          },
          controlsFu:function(){
            $(_.controls,_.form).each(function(){
              var th=$(this)
              th
                .bind('click',function(){
                  _.form.trigger(th.data('type'))
                  return false
                })
            })
          },
          showErrorFu:function(label){
            label.find('.'+_.errorCl).slideDown()
          },
          hideErrorFu:function(label){
            label.find('.'+_.errorCl).slideUp()
          },
          showEmptyFu:function(label){
            label.find('.'+_.emptyCl).slideDown()
            _.hideErrorFu(label)
          },
          hideEmptyFu:function(label){
            label.find('.'+_.emptyCl).slideUp()
          },
          init:function(){
            LazyLoad.js(["js/lib/jquery-ui.js","js/lib/jquery.timePicker.js"], function(){

              jQuery(function($){
                $.datepicker.regional['vi'] = {
                  closeText: 'Đóng',
                  prevText: '&#x3c;Trước',
                  nextText: 'Tiếp&#x3e;',
                  currentText: 'Hôm nay',
                  monthNames: ['Tháng Một', 'Tháng Hai', 'Tháng Ba', 'Tháng Tư', 'Tháng Năm', 'Tháng Sáu',
                  'Tháng Bảy', 'Tháng Tám', 'Tháng Chín', 'Tháng Mười', 'Tháng Mười Một', 'Tháng Mười Hai'],
                  monthNamesShort: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
                  'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
                  dayNames: ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'],
                  dayNamesShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
                  dayNamesMin: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
                  weekHeader: 'Tu',
                  dateFormat: 'dd/mm/yy',
                  firstDay: 0,
                  isRTL: false,
                  showMonthAfterYear: false,
                  yearSuffix: ''};
                $.datepicker.setDefaults($.datepicker.regional['vi']);
              });
              var curDate = new Date(Date.now())
              $('#bookingdate').datepicker({minDate: curDate, dateFormat: "dd-mm-yy"});
              $('#bookingtime').timePicker({
                startTime: new Date(0, 0, 0, 09, 00, 00),
                endTime: new Date(0, 0, 0, 19, 00, 00)
              });
              $("#successDlg" ).dialog({
                  autoOpen:false,
                  modal: true,
                  width:310,
                  height: 250,
                  draggable: false,
                  stack:true,
                  buttons: {
                    Ok:function(){
                      $( this ).dialog( "close" );
                    }
                  }
              });
              $("#failedDlg" ).dialog({
                  autoOpen:false,
                  modal: true,
                  width:310,
                  height: 270,
                  draggable: false,
                  stack:true,
                  buttons: {
                    Ok:function(){
                      $( this ).dialog( "close" );
                    }
                  }
              });
            });
            _.form=_.me
            _.labels=$('label',_.form)

            _.preFu();
            _.controlsFu();
            _.form
              .bind('submit',function(){
                if(_.validate)
                  _.submitFu()
                else
                  _.form[0].submit()
                return false
              })
              .bind('reset',function(){
                _.labels.removeClass(_.invalidCl)									
                _.labels.each(function(){
                  var th=$(this)
                  _.hideErrorFu(th)
                  _.hideEmptyFu(th)
                })
              })
            _.form.trigger('reset')
          }
        }
      _.me||_.init(_.me=th.data({forms:_}))
      typeof o=='object'
        &&$.extend(_,o)
    })
  }
})(jQuery)

function plotPoint(map, myLatlng,title,popUpContent,markerIcon)
{
  var marker = new google.maps.Marker({
      position: myLatlng,
      map: map,
      title:title
  });
  var infowindow = new google.maps.InfoWindow({
    content: popUpContent
  });
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.open(map,marker);
  });
}
window.isFormLoaded = false;
function initForm() {
    if (!window.isFormLoaded && location.hash === '#!/page_contact'){
        window.isFormLoaded = true;
        $('#form1').forms({
          ownerEmail:'spa@berosy.vn'
        });

        if (typeof(google) !== 'undefined')
        {
          var latlng = new google.maps.LatLng(10.770371, 106.67049);
          var myOptions = {
            zoom: 16,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          };

          this.map = new google.maps.Map(document.getElementById("map_canvas"),  myOptions); 
          plotPoint(this.map, latlng,'BeRosySpa','<span class="gBubble"><b>BeRosySpa</b><br>381 Sư Vạn Hạnh (nối dài), P.12, Q.10, Hồ Chí Minh</span>');
        }
    }
}
$(window).bind('hashchange', function() {
  initForm();
});
$(document).ready(function(){
  initForm();
});

