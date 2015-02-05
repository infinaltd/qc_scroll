//--- global vars ---------- //
$scrollOffsets = {};
$slideOrders = [];
$scrollOrders = [];
$animationListener = false;
$activeAnim = false;
$nextSection = '';
$currentSection = '';
$animCounter = 0;
$results = [];

//---- end of global vars -----------//


//------- page events ---------------//
$(window).resize(function(){
    repositionSlides();
    getScrollPositions();
    $.waypoints('refresh');
}); 



$(document).keydown(function (evt) {
    var $scrollTo = 0;
    var $scrollTop = $(document).scrollTop();
    
    if(evt.keyCode == 65)  //A key for triggering animation within a slide
    {
        if($animationListener == true) 
        {
            if($animCounter < $activeAnim.length)
            {
                var $animElement = $activeAnim[$animCounter];
                var $animEffect = 'slide';
                var $animDuration = 400;

                //hide other elements if attribute toggle set to true
                for(var $i = 0; $i < $activeAnim.length; $i++)
                {
                    if($i != $animCounter)
                    {
                    	if($($activeAnim[$i]).attr('toggle') == '1')
                        {
                            var $transitionOut = '';
                                
                            if($($activeAnim[$i]).attr('transition_out') != undefined)
                            	$transitionOut = $($activeAnim[$i]).attr('transition_out');
                                
                            $($activeAnim[$i]).hide($transitionOut);
                        }
                     }
                }

                if($($animElement).attr('anim_effect') != undefined)
                {
                        $animEffect = $($animElement).attr('anim_effect');
                }

                if($($animElement).attr('anim_duration') != undefined)
                {
                        $animDuration = $($animElement).attr('anim_duration');
                }

                $($animElement).show($animEffect, $animDuration);

                if($($animElement).attr('hide_related') != undefined)
                {
                    var $transOut = '';
                    var $related = $("#" + $($animElement).attr('hide_related'));
                    
                    if($related.attr('transition_out') != undefined)
                    	$transOut = $related.attr('transition_out');
                        
                    $related.hide($transOut);
                }
				
                $animCounter ++;
            }
            else
            {
                    //reset anim global vars
                    $animationListener = false;
                    $activeAnim = false;
                    $animCounter = 0;
            }
        }
    }
    else if (evt.keyCode == 78) // N key for moving to the "next" slide
    { 
        $scrollTo = $scrollOffsets[$nextSection];
        
        //reset anim global vars
        $animationListener = false;
        $activeAnim = false;
        $animCounter = 0;
        $currentSection = $nextSection;
        
        var $currIdx = jQuery.inArray($currentSection, $slideOrders); 
        
        if($currIdx >= $slideOrders.length - 1)
            $nextSection =  $slideOrders[0];
        else
            $nextSection =  $slideOrders[$currIdx + 1];
        
        $.smoothScroll({ speed: 1000, easing: 'easeInOutExpo' }, $scrollTo);
    }
    else if(evt.keyCode == 66) //B key for moving to the "previous" slide
    {
        var $currIdx = jQuery.inArray($currentSection, $slideOrders); 
        
        if($currIdx <= 0)
            $prevSection = $slideOrders[$slideOrders.length - 1];
        else
            $prevSection = $slideOrders[$currIdx - 1];
        
        $scrollTo = $scrollOffsets[$prevSection];
        
        //reset anim global vars
        $animationListener = false;
        $activeAnim = false;
        $animCounter = 0;
        $nextSection = $currentSection;
        $currentSection = $prevSection;
        
        $.smoothScroll({ speed: 1000, easing: 'easeInOutExpo' }, $scrollTo);
    }
    
});
//------- end of page events ----//

$(window).load(function() {
    
    $results = getXMLContent("content/content.xml");
    $("#deck").html(makeThumbList($results.data));
    $("#main_content").html(makeSlides($results));
    
    repositionSlides();
    getScrollPositions();
    $("html").niceScroll();
    $("#deck").niceScroll();
    $('#ascrail2001').css({'display':'none'});
    
    //renderPages();
    
    //animate and center next slide with smooth-scroll.js
    $('a.scroll, a.scrolldeck').on('click', function(e) {
        var $href = $(this).attr('href');
        var $offset = $scrollOffsets[$href];
    
        $.smoothScroll({ speed: 750, easing: 'easeInOutQuart' }, $offset);

        //reset global anim vars
        $animationListener = false;
        $activeAnim = false;
        $animCounter = 0;
        $currentSection = $(this).attr('href');
        $nextSection = $($currentSection).find(".scroll").first().attr('href');
        
        return false;
    });
    
    $waypointOptions = {
        offset: 'bottom-in-view',
	triggerOnce: true
    };
    
    $("section.slide").waypoint(function(direction){
        $nextSection = $(this).find(".scroll").first().attr('href');

        var $curID = "#" + $(this).attr('id');
        
        if(jQuery.inArray($currentSection, $scrollOrders) == -1 )
            $scrollOrders.push($curID);
        
    }, $waypointOptions);
    
    $(".animate-slide").waypoint(function(direction){
        
        if(direction == 'down')
        {
            $animationListener = true;
            $activeAnim = $(this).find(".anim_element");
        }
        
    }, {offset: 'bottom-in-view', triggerOnce: false});
    
    $(".animate-slide").waypoint(function(direction){
        
        if(direction == 'up')
        {
            $animationListener = true;
            $activeAnim = $(this).find(".anim_element");
        }
        
    }, {offset: '5%', triggerOnce: false});
});

function getScrollPositions()
{
    $('a.scroll').each(function(){
        var $href = $(this).attr('href');
        var $section = $($href + '_bottom');
        
        
        if($(window).height() <= $(".slide").height())
        {
            var $slide = $("#s" + $href.replace("#p", ""));
            $slideTop = $slide.offset().top;
        }
        else
        {
            $slideTop = $section.offset().top;
        }
        
        $scrollOffsets[$href] = $slideTop;
        $slideOrders.push($href);
    });
}

function repositionSlides()
{
    $('#scrollable').css({'height':$(window).height() + 'px' });
    $(".photo_bottom").css({'height': ($(window).height() - $(".slide").height())/2 + 'px'});
    $(window).scrollTop($(".photo_bottom").first().offset().top);
}