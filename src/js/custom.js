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

  /*-- START: mobile nav --*/
  var MOBILE_NAV = (function(){
    var mobileNavClass = 'mobile-nav';
    var menus = [
      '.header-nav',
      '.main-nav'
    ];
    if(!menus.length) return false;
    var cnt = $('<div/>');
    
    for(var i = 0; i<menus.length; i++){
      var section = $('<div/>').addClass(mobileNavClass+'__section '+mobileNavClass+'__section_'+i);
      section.append(getItems(menus[i]));
      cnt.append(section);
    }
    cnt.addClass(mobileNavClass);

    $('body').append(cnt);

    $('.mobile-nav-btn').click(function(){
      $('.'+mobileNavClass).toggleClass('active');
      $(this).toggleClass('active');
    });
    

    function getItems(selector){
      var clone = $(selector).clone();
      return clearClasses(clone);
    }

    function clearClasses(element){
      var depth = 0;
      $(element).removeClass().addClass(mobileNavClass+'__list');
      clear($(element).children());

      function clear(childrens){
        depth++;
        $(childrens).removeClass();
        $(childrens).each(function(){
          var $this = $(this);
          if($this.is(':empty')) $(this).remove();
          if($this.is('li')) $(this).addClass(mobileNavClass+'__item');
          if($this.is('a')) $(this).addClass(mobileNavClass+'__link');
          if($this.is('ul') && depth>0) {
            var dropdownBtn = $('<button/>').addClass(mobileNavClass+'__dropdown-toggler');
            var parentLi = $(this).closest('li');
            dropdownBtn.click(function(){
              $this.toggleClass('active');
            });
            parentLi.append(dropdownBtn);

            $(this).addClass(mobileNavClass+'__dropdown');
            $(parentLi).addClass(mobileNavClass+'__parent');
          };
        });
        if($(childrens).children().length) clear($(childrens).children());
      }
      return element;
    }
  }());
  
  /*-- END: mobile nav --*/
  

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