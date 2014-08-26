$(function() {

  var isMobile = (function() {
    if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iP[ao]d/i) || navigator.userAgent.match(/Windows Phone/i)) {
      return true;
    } else {
      return false;
    }
  })();

  if (isMobile) {
    $("#mobile").text("this is a mobile device");
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

  var ua = navigator.userAgent;
  $('.ua').text(ua);

  var checkSize = function() {
    var scrollbar = getScrollbarWidth();
    var winW = $(window).width();
    var winH = $(window).height();
    winW = winW - scrollbar;

    $('#width').text(winW + "px");
    $('#height').text(winH + "px");

    $('.container').css('height', winH + "px");
  };

  checkSize();


  $(window).on("resize", function() {
    checkSize();
  });

  // $(window).on("scroll", function() {
  //   $(window).resize(function(e) {
  //     e.stopPropagation();
  //   });
  // });


});