$(document).ready(function () {
  var $menuBtn = $('.header-nav-menubtn');
  var $menu = $('.header-nav-menu');
  var $menuItem = $('.header-nav-menu-item');
  var $submenu = $('.header-nav-submenu');
  var isMobile = $menuBtn.is(':visible');
  
(function cust_valine(){
	  var $valinecontainer = $('#valine-container');
		var $vheader = $valinecontainer.find('.vheader');
		var $vinput = $valinecontainer.find('.vinput');
	  var $vlink = $valinecontainer.find('.vlink');
	  $vlink.remove();
		var $vnick = $valinecontainer.find('.vnick');
		var $vmail = $valinecontainer.find('.vmail');
		var $vsubmit = $valinecontainer.find('.vsubmit');
		var verif_nick = true;
		var verif_mail = true;	
		
		$vheader.css('position','relative');
		
		var $vcue = $('<label class="vcue" style="position: absolute;color: #FF0000;font-size: 10px;padding: 0 5px"></label>');
		$vcue.css({'top': '-10px','left': '0px'});
				
		$vheader.append($vcue);
		
		$vnick.bind('focus keyup',function(){
			var $vnick_val = $.trim(this.value);
			if(!$vnick_val){
				verif_nick = true;
				$vcue.text('提示：请输入昵称！（非必须）');
			}else{
				verif_nick = false;
				$vcue.text('');				
			};
		});
		$vnick.bind('blur',function(){
			$vcue.text('');
		});
		
		$vmail.bind('focus keyup',function(){
			var $vmail_val = $.trim(this.value);
			var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
			if(!$vmail_val){
				verif_mail = true;
				$vcue.text('提示：请输入邮箱！（非必须）');
			}else if(!reg.test($vmail_val)){
				verif_mail = true;
				$vcue.text('提示：邮箱不完整或格式不正确！');
			}else{
				verif_mail = false;
				$vcue.text('');				
			}
		});
		$vmail.bind('blur',function(){
			$vcue.text('');
		});
		
		/*$vsubmit.bind('click',function(){
			if(verif_nick || verif_mail){
				$(this).attr('disabled','disabled');
				$vcue.text('请检查邮箱和用户名！');
			};
		});*/
		/* $vsubmit.bind('mouseover',function(){
			if(verif_nick === false && verif_mail === false){
				$(this).removeAttr('disabled');
			}else{
				$vcue.text('请检查邮箱和用户名！');
				$(this).attr('disabled','disabled');
			};
		});
		
		$vsubmit.bind('touchstart',function(){
			if(!(verif_nick || verif_mail)){
				$(this).removeAttr('disabled');
			}else{
				$vcue.text('请检查邮箱和用户名！');
				$(this).attr('disabled','disabled');
			};
		}); */
		
})();

  var isMenuShow = false;
  var isSubmenuShow = false;

  function resetMenuHeight () {
    $menuItem.velocity(
      {
        height: $menuItem.outerHeight()
      },
      {
        complete: function () {
          $submenu.css({ display: 'none', opacity: 0 });
        }
      }
    );
  }

  $(window).on(
    'resize',
    Stun.utils.throttle(function () {
      isMobile = $menuBtn.is(':visible');
      if (isMobile) {
        $submenu.removeClass('hide--force');

        if (isSubmenuShow) {
          resetMenuHeight();
          isSubmenuShow = false;
        }
      } else {
        $submenu.css({ display: 'none', opacity: 0 });
      }
    }, 200)
  );

  var isNightModeFocus = true;
  var $nightMode = $('.mode');

  $(document).on('click', function () {
    if ($menu.is(':visible')) {
      if (isMobile && isSubmenuShow) {
        resetMenuHeight();
        isSubmenuShow = false;
      }
      $menu.css({ display: 'none' });
      isMenuShow = false;
    }
    if (isNightModeFocus) {
      $nightMode.removeClass('mode--focus');
      isNightModeFocus = false;
    }
  });

  Stun.utils.pjaxReloadHeader = function () {
    $menuBtn = $('.header-nav-menubtn');
    $menu = $('.header-nav-menu');
    $menuItem = $('.header-nav-menu-item');
    $submenu = $('.header-nav-submenu');
    isMobile = $menuBtn.is(':visible');

    isMenuShow = false;
    isSubmenuShow = false;

    function getNightMode () {
      var nightMode = false;
      try {
        if (parseInt(Stun.utils.Cookies().get(NIGHT_MODE_COOKIES_KEY))) {
          nightMode = true;
        }
      } catch (err) {}
      return nightMode;
    }

    if (CONFIG.night_mode && CONFIG.night_mode.enable) {
      var isNightMode = false;
      var NIGHT_MODE_COOKIES_KEY = 'night_mode';
      $nightMode = $('.mode');
      isNightModeFocus = true;

      if (getNightMode()) {
        $nightMode.addClass('mode--checked');
        $nightMode.addClass('mode--focus');
        $('html').addClass('nightmode');
        isNightMode = true;
      } else {
        isNightMode = false;
      }
      $('.mode').on('click', function (e) {
        e.stopPropagation();
        isNightMode = !isNightMode;
        isNightModeFocus = true;
        Stun.utils.Cookies().set(NIGHT_MODE_COOKIES_KEY, isNightMode ? 1 : 0);
        $nightMode.toggleClass('mode--checked');
        $nightMode.addClass('mode--focus');
        $('html').toggleClass('nightmode');
      });
    }

    $menuBtn.on('click', function (e) {
      e.stopPropagation();
      if (isMobile && isMenuShow && isSubmenuShow) {
        resetMenuHeight();
        isSubmenuShow = false;
      }
      if (!isMenuShow) {
        isMenuShow = true;
      } else {
        isMenuShow = false;
      }
      $menu.velocity('stop').velocity(
        {
          opacity: isMenuShow ? 1 : 0
        },
        {
          duration: isMenuShow ? 200 : 0,
          display: isMenuShow ? 'block' : 'none'
        }
      );
    });

    // Whether to allow events to bubble in the menu.
    var isBubbleInMenu = false;
    $('.header-nav-submenu-item').on('click', function () {
      isBubbleInMenu = true;
    });

    $menuItem.on('click', function (e) {
      if (!isMobile) {
        return;
      }
      var $submenu = $(this).find('.header-nav-submenu');
      if (!$submenu.length) {
        return;
      }
      if (!isBubbleInMenu) {
        e.stopPropagation();
      } else {
        isBubbleInMenu = false;
      }

      var menuItemHeight = $menuItem.outerHeight();
      var submenuHeight =
        menuItemHeight + Math.floor($submenu.outerHeight()) * $submenu.length;
      var menuShowHeight = 0;

      if ($(this).outerHeight() > menuItemHeight) {
        isSubmenuShow = false;
        menuShowHeight = menuItemHeight;
      } else {
        isSubmenuShow = true;
        menuShowHeight = submenuHeight;
      }
      $submenu.css({ display: 'block', opacity: 1 });
      // Accordion effect.
      $(this)
        .velocity('stop')
        .velocity({ height: menuShowHeight }, { duration: 300 })
        .siblings()
        .velocity({ height: menuItemHeight }, { duration: 300 });
    });

    $menuItem.on('mouseenter', function () {
      var $submenu = $(this).find('.header-nav-submenu');
      if (!$submenu.length) {
        return;
      }
      if (!$submenu.is(':visible')) {
        if (isMobile) {
          $submenu.css({ display: 'block', opacity: 1 });
        } else {
          $submenu.removeClass('hide--force');
          $submenu
            .velocity('stop')
            .velocity('transition.slideUpIn', { duration: 200 });
        }
      }
    });

    $menuItem.on('mouseleave', function () {
      var $submenu = $(this).find('.header-nav-submenu');
      if (!$submenu.length) {
        return;
      }
      if (!isMobile) {
        $submenu.addClass('hide--force');
        isSubmenuShow = false;
      }
    });
  };

  Stun.utils.pjaxReloadScrollIcon = function () {
    if (CONFIG.header && CONFIG.header.scrollDownIcon) {
      $('.header-banner-arrow').on('click', function (e) {
        e.stopPropagation();
        $('#container').velocity('scroll', {
          offset: $('#header').outerHeight()
        });
      });
    }
  };

  // Initializaiton
  Stun.utils.pjaxReloadHeader();
  Stun.utils.pjaxReloadScrollIcon();
});
