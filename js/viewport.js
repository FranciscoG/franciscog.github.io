$(function() {

  var ua = navigator.userAgent;

  var isMobile = /Android|webOS|iPhone|iP[ao]d|Windows Phone/i.test(ua);
  var retina = window.devicePixelRatio >= 2;

  if (isMobile) {
    $("#mobile").text("this is a mobile device");
    $('.scrollbar').hide();
  }
  if (retina) {
    $('#retina').show();
  }


  var getScrollbarWidth = function() {
    var div = $('<div style="width:50px;height:50px;overflow:hidden;position:absolute;top:-200px;left:-200px;"><div style="height:100px;"></div></div>');
    $('body').append(div);
    var w1 = $('div', div).innerWidth();
    div.css('overflow-y', 'auto');
    var w2 = $('div', div).innerWidth();
    $(div).remove();
    return (w1 - w2);
  };

  $('.ua').text(ua);

  var checkSize = function() {
    var scrollbar = getScrollbarWidth();
    var winW = $(window).width();
    var winH = $(window).height();

    $('.showWidth').text(winW + "px");
    $('.showHeight').text(winH + "px");
    $('.showScrollWidth').text(scrollbar + "px");

  };

  checkSize();

  if (!isMobile) {
    $(window).on("resize", function() {
      checkSize();
    });
  }

});