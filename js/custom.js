$(function(){
  var DOM = {
    videos: '.videos',
    categoryL: '.category-l, .services',
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
    var cnt = '.home-products';
    var amountSelector = $(cnt).find('[role="amount"]');
    var amount = 0;
    var orderBtn = $(cnt).find('[rule="order"]');
    //1: Одностворчатое
    //2: Двухстворчатое
    //3: Трехстворчатое
    //4: Балконный выход
    //5: Лоджии
    //6: Дополнительно
    var priceScheme = {
      1:{
        0:2100,
        1:4700
      },
      2:{
        0:4000,
        1:6700,
        2:8800
      },
      3:{
        1:8700,
        2:10900
      },
      4:{
        1:8400,
        2:11000
      },
      5:{
        1:15000,
        2:15000
      },
      6:{
        0:0,
        1:2000,
        2:4200
      },
    };
    
    orderBtn.hover(function(){
      $(cnt).find('.home-products-total__tip').fadeIn();
    },function(){
      $(cnt).find('.home-products-total__tip').fadeOut();
    });

    orderBtn.click(function(){
      $.fancybox.open('<b>'+amount+'</b>');
      return false;
    });
 
    function initWindow(window){
      
      if(window.find('[role="addService"]').length){
        initAddService(window);
        return false;
      }
      
      var id = window.data('id');
      var controlsElement = window.find('[role="controls"]');
      var price = window.find('[role="price"]');
      var folds = window.find('[role="folds"]');
      var minFolds = Object.keys(priceScheme[id])[0];
      var maxFolds = Object.keys(priceScheme[id])[Object.keys(priceScheme[id]).length-1];
      


      var addPrice = window.find('[role="addPrice"]');
      var removePrice = window.find('[role="removePrice"]');
      
      if(!id) {
        console.warn('Не указан ID окна', window[0]);
        return false;
      }
      
      
      var controls = new Controls(controlsElement, minFolds, maxFolds);
     

      folds.text(controls.val);
      price.text(priceScheme[id][controls.val]);
      disableBtns(controls.val, minFolds, maxFolds, controlsElement.find('button'));

      controlsElement.find('button').click(function(){
        if($(this).is('[role="minus"]')) controls.minus();
        if($(this).is('[role="plus"]')) controls.plus();
        folds.text(controls.val);
        price.text(priceScheme[id][controls.val]);
        disableBtns(controls.val, minFolds, maxFolds, controlsElement.find('button'));
        if(controls.val && window.find('[role="tip"]').is(':visible')) window.find('[role="tip"]').fadeOut();
      });

      addPrice.click(function(){
        window.addClass('added')
        setAmount(priceScheme[id][controls.val]);
        controlsElement.find('button').attr('disabled','disabled')
        return false;
      });

      addPrice.mouseenter(function(){
        if(controls.val === 0) window.find('[role="tip"]').fadeIn();
      });

      removePrice.click(function(){
        if(!window.is('.added')) return false;
        window.removeClass('added')
        setAmount(priceScheme[id][controls.val], '-');
        controlsElement.find('button').removeAttr('disabled')
        return false;
      });
    }

    function initAddService(window){
      var id = window.data('id');
      var mainPriceVal = 0;
      var mainPrice = window.find('[role="price"]');
      var addPrice = window.find('[role="addPrice"]');
      var removePrice = window.find('[role="removePrice"]');
      mainPrice.text(mainPriceVal);
      window.find('[role="addService"]').each(function(){
        var input = $(this).find('[role="addServiceInput"]');
        var price = $(this).find('[role="addServicePrice"]');
        var serviceId = $(this).data('service');
        price.text(priceScheme[id][serviceId]);
        
        input.change(function(){
          if($(this).is(':checked')) mainPriceVal+=priceScheme[id][serviceId];
          if(!$(this).is(':checked')) mainPriceVal-=priceScheme[id][serviceId];
          
          mainPrice.text(mainPriceVal);
        });
      });

      addPrice.click(function(){
        window.addClass('added')
        setAmount(mainPriceVal);
        return false;
      });

      removePrice.click(function(){
        if(!window.is('.added')) return false;
        window.removeClass('added')
        setAmount(mainPriceVal, '-');
        return false;
      });
    }

    function setAmount(val=0, operation="+"){
      (operation == '-')?amount-=val:amount+=val;
      amountSelector.text(amount);
    }

    function Controls(controls, min,max){
      this.element = controls;
      this.val = +min;
      this.min = +min;
      this.max = +max;
      this.plus = function(){
        if(this.val>=this.max) return false;
        this.val++;
      }
      this.minus = function(){
        if(this.val<=this.min) return false;
        this.val--;
      }
    }

    function disableBtns(val, min, max, btns){
      btns.each(function(){
        switch($(this).attr('role')){
          case 'minus': {
            if(val<=min) $(this).attr('disabled','disabled');
            else $(this).removeAttr('disabled');
          };break;
          case 'plus': {
            if(val>=max) $(this).attr('disabled','disabled');
            else $(this).removeAttr('disabled');
          };break;
        }
      });
    }

    return {
      init: function(){
        $(cnt).find('.home-product').each(function(){
          if($(this).length) initWindow($(this));
        });
        setAmount();
      }
    }
  }());

  CALC.init();
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
      backgroundEl.addClass('hovered');
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

          $(this).mouseleave(function(){
            backgroundEl.removeClass('hovered');
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
  AOS.init({
    duration: 500,
    once: true
  });
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
    myMap.geoObjects.add(myPlacemark);
    
}
