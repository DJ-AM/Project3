console.log('we about this bitch');

//modified from http://jsfiddle.net/mdesdev/DLTEv/
$(function() {
  setInterval(function() {
    $('.car-right-image').animate({ left: $(window).width() + 'px' }, 9000, 'linear', function() {
      $(this).css({ left: - $(this).width() + 'px' });
    });
  }, 10);
});
