   //Función detectar el tamaño del dispostivo en que se abra la revista
   function checkMobile() { return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent); }

   function addPage(page, book, lang) {

       var pages = book.turn('pages')
           // Create a new element for this page
       if (checkMobile()) {
           var element = $('<div />', { class: 'hard' });
       } else {
           var element = $('<div />', {});

       }

       if (page % 2 == 0) {
           element.addClass('even')
       } else {
           element.addClass('odd')
       }

       // Add the page to the flipbook
       if (book.turn('addPage', element, page)) {
           // Add the initial HTML
           // It will contain a loader indicator and a gradient

           if (page !== 1 && page !== pages) {
               if (lang == 'es') {
                   element.html('<div class="gradient"></div><div class="number-page" onclick=goPage(2)>' + page + ' | Edición 16 - 2022</div>');
               } else {
                   element.html('<div class="gradient"></div><div class="number-page" onclick=goPage(2)>' + page + ' | Edition 16 - 2022</div>');
               }
           } else {
               element.html('<div class="gradient"></div>');
           }

           // Load the page
           loadPage(page, element, lang);
       }

   }

   function loadPage(page, pageElement, lang) {

       // Create an image element

       var img = $('<img />', { class: 'backPage' + page });

       img.mousedown(function(e) {
           e.preventDefault();
       });

       img.load(function() {

           // Set the size
           $(this).css({ width: '100%', height: '100%' });

           // Add the image to the page after loaded

           $(this).appendTo(pageElement);

           // Remove the loader indicator

           pageElement.find('.loader').remove();
       });


       // Load the page
       checkImage('../assets/pics/backgrounds/' + page + '.jpg', img, pageElement, page)

       loadRegions(page, pageElement, lang);

   }

   function checkImage(url, img, element, page) {
       var request = new XMLHttpRequest();
       request.open("GET", url, true);
       request.send();
       request.onload = function() {
           status = request.status;
           if (request.status == 200) //if(statusText == OK)
           {
               img.attr('src', url);
           } else {
               var video = $('<div/>', { 'class': 'videoPages' }).append($('<video/>', { playsinline: true, autoplay: true, src: '../assets/pics/videos/' + page + '.mp4', loop: true, 'class': 'backVideo' + page }));
               video.appendTo(element)
           }
       }
   }



   // Load regions

   function loadRegions(page, element, lang) {
       $.getJSON('./assets/pages-' + lang + '/' + page + '-page.json').
       done(function(data) {
           $.each(data, function(key, region) {
               addRegion(region, element, lang, page);
           });
       });
   }

   // Add region

   function addRegion(region, pageElement, lang, page) {

       var reg = $('<div />', { 'class': 'region ' + region['class'] }).append(addComponents(region, lang))

       reg.css({
           top: region.y,
           left: region.x,
           width: region.width
       }).attr('region-data', $.param(region.data || ''));

       reg.appendTo(pageElement);
   }

   // Process click on a region

   function regionClick(event) {

       var region = $(event.target).closest('div');

       if (region.hasClass('region')) {

           $('.magazine-viewport').data().regionClicked = true;

           setTimeout(function() {
               $('.magazine-viewport').data().regionClicked = false;
           }, 100);

           var regionType = $.trim(region.attr('class').replace('region', ''));

           return processRegion(region, regionType);

       }

   }

   // Process the data of every region

   function processRegion(region, regionType) {

       data = decodeParams(region.attr('region-data'));

       switch (regionType) {
           case 'link':
               window.open(data.url);
               break;

           case 'to-page':
               $('.magazine').turn('page', data.page);
               break;
       }

   }


   // http://code.google.com/p/chromium/issues/detail?id=128488

   function isChrome() {

       return navigator.userAgent.indexOf('Chrome') != -1;

   }

   function disableControls(page) {
       if (page == 1)
           $('.previous-button').hide();
       else
           $('.previous-button').show();

       if (page == $('.magazine').turn('pages'))
           $('.next-button').hide();
       else
           $('.next-button').show();
   }

   // Set the width and height for the viewport


   function resizeViewport() {

       var width = $(window).width(),
           height = $(window).height(),
           options = $('.magazine').turn('options');

       $('.magazine').removeClass('animated');

       $('.magazine-viewport').css({
           width: width,
           height: height
       })

       if ($('.magazine').turn('zoom') == 1) {
           var bound = calculateBound({
               width: options.width,
               height: options.height,
               boundWidth: Math.min(options.width, width),
               boundHeight: Math.min(options.height, height)
           });

           if (bound.width % 2 !== 0)
               bound.width -= 1;

           $('.magazine').css({ left: -bound.width / 2 });

           if (bound.width != $('.magazine').width() || bound.height != $('.magazine').height()) {

               if ($('.magazine').turn('page') == 1)
                   $('.magazine').turn('peel', 'br');
           }

           if (window.matchMedia("(max-width: 468px)").matches) {
               $('.magazine').turn('display', 'single');
               $('.magazine').turn('size', bound.width, height * 0.6);
               $('.magazine').css({ left: -bound.width / 2 });

           } else if (window.matchMedia("(max-width: 720px)").matches) {
               $('.magazine').turn('display', 'single');
               $('.magazine').turn('size', bound.width * 0.8, height);
               $('.magazine').css({ left: -bound.width / 2.5 });
           } else {
               $('.magazine').turn('display', 'double');
               $('.magazine').turn('size', width * 0.72, height);
               $('.magazine').css({ left: -width / 2.77 });
           }

       }

       $('.magazine').turn('peel', false);



   }

   //Go to the page
   function goPage(page) {
       $('.magazine').turn('page', page);
       $('.container-thumbs').remove()
   }


   // Number of views in a flipbook

   function numberOfViews(book) {
       return book.turn('pages') / 2 + 1;
   }

   // Current view in a flipbook

   function getViewNumber(book, page) {
       return parseInt((page || book.turn('page')) / 2 + 1, 10);
   }

   function moveBar(yes) {
       if (Modernizr && Modernizr.csstransforms) {
           $('#slider .ui-slider-handle').css({ zIndex: yes ? -1 : 10000 });
       }
   }

   // decode URL Parameters

   function decodeParams(data) {

       var parts = data.split('&'),
           d, obj = {};

       for (var i = 0; i < parts.length; i++) {
           d = parts[i].split('=');
           obj[decodeURIComponent(d[0])] = decodeURIComponent(d[1]);
       }

       return obj;
   }

   // Calculate the width and height of a square within another square

   function calculateBound(d) {

       var bound = { width: d.width, height: d.height };

       if (bound.width > d.boundWidth || bound.height > d.boundHeight) {

           var rel = bound.width / bound.height;

           if (d.boundWidth / rel > d.boundHeight && d.boundHeight * rel <= d.boundWidth) {

               bound.width = Math.round(d.boundHeight * rel);
               bound.height = d.boundHeight;

           } else {

               bound.width = d.boundWidth;
               bound.height = Math.round(d.boundWidth / rel);

           }
       }

       return bound;
   }