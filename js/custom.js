$(function(){
  var DOM = {
    videos: '.videos',
    categoryL: '.category-l',
    homeSlider: '.home-slider',
    partnersSlider: '.brands__list .swiper-container',
    reviewsSlider: '.reviews .swiper-container',
    scrollbar: '.js-scrollbar',
  };

  var sliders = [
    {
      selector: DOM.homeSlider,
      params: {
        spaceBetween: 30,
        effect: 'fade',
        loop: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        autoplay: {
          delay: 4000
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      }
    },

    {
      selector: DOM.partnersSlider,
      params: {
        spaceBetween: 50,
        slidesPerView: 6,
        effect: 'slide',
        loop: true,    
        autoplay: {
          delay: 4000
        },
        navigation: {
          nextEl: '#brandsNext',
          prevEl: '#brandsPrev',
        },
        breakpoints: {
          991:{
            slidesPerView: 4,

          },
          767: {
            slidesPerView: 4,
            spaceBetween: 10
          },
          575: {
            slidesPerView: 2,
            spaceBetween: 10
          }
        }
      }
    },

    {
      selector: DOM.reviewsSlider,
      params: {
        spaceBetween: 40,
        slidesPerView: 5,
        effect: 'slide',
        loop: true,    
        autoplay: {
          delay: 4000
        },
        navigation: {
          nextEl: '#brandsNext',
          prevEl: '#brandsPrev',
        },
        breakpoints: {
          991:{
            slidesPerView: 4,

          },
          767: {
            slidesPerView: 4,
            spaceBetween: 10
          },
          575: {
            slidesPerView: 3,
            spaceBetween: 10
          },
          480: {
            slidesPerView: 2,
            spaceBetween: 10
          }
        }
      }
    }
  ];

  /*-- START: videos --*/
  var VIDEOS = (function(){
    var cnt = DOM.videos;
    var main = $(cnt).find();
    function checkActive(){
      $(cnt).find('[role="thumbnails"]').each(function(){
        if($(this).is('[aria-active="true"]')) {
          setMain($(this).data('video'));
          return false;
        }
      });
    }

    function setMain(link){
      $(cnt).find('[role="main"] iframe').attr('src', link);
    }
  
    return {
      init: function(){
        $(cnt).find('[role="thumbnails"]').click(function(){
          setMain($(this).data('video'));
          $(cnt).find('[role="thumbnails"]').attr('aria-active',false);
          $(this).attr('aria-active',true);
        });
    
        checkActive();
      }
    }
  }());
  /*-- END: videos --*/

  /*-- START: category l --*/
  var CATEGORYL = (function(){
    var cnt = DOM.categoryL;
    var currentImage = '';
    var backgroundEl = $(cnt).find('[role="background"]');

    function setImage(src){
      backgroundEl.css('background-image', 'url('+src+')');
    }

    return {
      init: function(){
        $(cnt).find('[role="section"]').each(function(){
          if($(this).is('.active')) setImage($(this).data('image'));
          $(this).mouseenter(function(){
            setImage($(this).data('image'));
            $(cnt).find('[role="section"]').removeClass('active');
            $(this).addClass('active');
          });
        });
      }
    }
  }());
  /*-- END: category l --*/
  
  
  /*-- START: init --*/
  if($(DOM.videos).length) VIDEOS.init();
  if($(DOM.categoryL).length) CATEGORYL.init();
  if($(DOM.scrollbar).length) $('.js-scrollbar').perfectScrollbar();

  for(var s = 0; s<sliders.length; s++){
    if($(sliders[s].selector).length){
      var initSlider = new Swiper(sliders[s].selector, sliders[s].params);
    }
  }
  /*-- END: init --*/
  
});