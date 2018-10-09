$(function(){
  var DOM = {
    videos: '.videos',
    categoryL: '.category-l',
    homeSlider: '.home-slider',
    partnersSlider: '.brands__list .swiper-container',
    reviewsSlider: '.reviews .swiper-container',
    scrollbar: '.js-scrollbar',
    tabs: '.tabs'
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
    },

    {
      selector: '.whywe-body',
      params: {
        spaceBetween: 40,
        slidesPerView: 1,
        effect: 'slide',
        loop: true,    
        autoplay: {
          delay: 4000
        }
      },
      functions: function(initSlider){
        whyWePagination(initSlider);
      }
    }
  ];

  function whyWePagination(initSlider){
    console.log(initSlider);
    var nav = $('.whywe').find('[role="navItem"]');
    nav.eq(0).addClass('active');

    nav.click(function(){
      nav.removeClass('active');
      initSlider.slideToLoop($(this).parent().index())
    });
    initSlider.on('slideChange', function(){
      nav.removeClass('active');
      nav.eq(initSlider.realIndex).addClass('active');
      console.log(initSlider.realIndex);
    });
  }

  /*-- START: tabs --*/
  var TABS = (function(){
    var cnt = DOM.tabs;
    
    function initTabs(tabs){
      var body = tabs.find('.tabs-body');
      var nav = tabs.find('.tabs-nav');
      nav.children().click(function(){
        nav.children().removeClass('active');
        $(this).addClass('active');
        body.children().removeClass('active');
        body.children().eq($(this).index()).addClass('active');
      });
    }
    
    return {
      init: function(){
        $(cnt).each(function(){
          if($(this).length) initTabs($(this));
        });
      }
    }
  }());

  TABS.init();
  /*-- END: tabs --*/
  

  /*-- START: calc --*/
  var CALC = (function(){
    return {
      init: function(){

      }
    }
  }());
  /*-- END: calc --*/
  

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
  
  /*-- START: spoiler --*/
  var SPOILER = (function(){
    var cnt = $('.spoiler');
    var active = false;

    function initSpoiler(spoiler){
      var body = spoiler.find('.spoiler-list');
      var dataItems = $(body).data('items');
      var btn = spoiler.find('.spoiler-btn');

      if(dataItems){
        hideItems(body, dataItems);
        btn.click(function(){
          if(active){
            hideItems(body, dataItems);
          }else{
            showItems(body);
          }
          return false;
        });
      }
    }

    function hideItems(body, dataItems){
      body.children().each(function(i,e){
        if(i>dataItems) $(this).hide();
      });
      active = false;
    }

    function showItems(body){
      body.children().slideDown();
      active=true;
    }

    return {
      init: function(){
        $(cnt).each(function(){
          if($(this).length) initSpoiler($(this));
        });
      }
    }
  }());

  
  /*-- END: spoiler --*/
  

  
  /*-- START: init --*/
  if($(DOM.videos).length) VIDEOS.init();
  if($(DOM.categoryL).length) CATEGORYL.init();
  if($(DOM.scrollbar).length) $('.js-scrollbar').perfectScrollbar();
  $('.fancybox').fancybox();
  SPOILER.init();

  for(var s = 0; s<sliders.length; s++){
    if($(sliders[s].selector).length){
      var initSlider = new Swiper(sliders[s].selector, sliders[s].params);
      if(sliders[s].functions) sliders[s].functions(initSlider);
    }
  }
  /*-- END: init --*/
  
});

ymaps.ready(init);

function init() {
    if(!$('#map').length) return false;
    var myMap = new ymaps.Map('map', {
        center: [53.20940057121059,34.458385999999976],
        zoom: 17,
        controls: []
    }),

    myPlacemark = new ymaps.Placemark([53.20940057121059,34.458085999999976], {
        iconCaption: 'Московский проспект, 99'
    }, {
        preset: 'islands#blueCircleDotIconWithCaption',
    });

    myMap.margin.addArea({
      left: 0,
      top: 0,
      width: $('.contacts-place').width(),
      height: '100%'
    });
    console.log(myMap.margin.getMargin()); 
    myMap.geoObjects.add(myPlacemark);
    
}