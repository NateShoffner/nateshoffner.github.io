---

---

function init_fancybox() {
    $(".fancybox").fancybox({
        openEffect: "elastic",
        closeEffect: "elastic",
        padding: 0
    });
}

function jumpToAnchor(anchor) {
    var offset = anchor.offset();
    if (offset == null)
        return false;

    $("html, body").stop().animate({
        scrollTop: offset.top
    }, 850, "easeInOutExpo");

    return true;
}

function preventAnchorScroll() {
    var scrollToTop = function () {
        $(window).scrollTop(0);
    };
    if (window.location.hash) {
        // handler is executed at most once
        $(window).one('scroll', scrollToTop);

        var anchor = $(window.location.hash);
        jumpToAnchor(anchor);
    }

    // make sure to release scroll 1 second after document readiness
    // to avoid negative UX
    $(function () {
        setTimeout(
            function () {
                $(window).off('scroll', scrollToTop);
            },
            1000
        );
    });


}

// anchor link easing 
$(function() {
    $('a[href*="#"]:not([href="#"])').on("click", function(e) {

        var easingDisabled = $(this).attr("class") != null && $(this).attr("class").indexOf("no-easing") >= 0;

        if (!easingDisabled) {
            var anchor = $($(this).attr("href").replace("/", ""));

            if (anchor != null) {
                if (jumpToAnchor(anchor)) {
                    e.preventDefault();
                }
            }
        }
    });
});

$(".page-top").click(function(e) {
    if (!jumpToAnchor($("#page-top"))) {
        e.preventDefault();
    }
});

// navbar item activation via scrolling
$("body").scrollspy({
    target: "#navbar"
})

// close responsive navbar when item is clicked
$(".navbar-collapse ul li a").click(function() {
    $('.navbar-collapse').collapse('hide');
});

 $(document).ready(function () {
     $(document).click(function (event) {
         var clickover = $(event.target);
         var _opened = $(".navbar-collapse").hasClass("show");
         if (_opened === true && !clickover.hasClass("navbar-toggler")) {
             $(".navbar-toggler").click();
         }
     });
 });

// enable relative-agnostic navigation via navbar links
$("#navbar a").click(function(e) {
    var anchor = $(this).attr("href");
    var siteBase = window.location.protocol.concat("//", window.location.hostname, "/");
    var absolute = siteBase.concat(anchor);
    var currentBase = document.location.href.match(/(^[^#]*)/)[0];

    if (typeof siteBase != '' && siteBase != currentBase)
    {
        window.location = absolute;
    }
});


// contact form submission
$('#contact-form').submit(function(e) {
    e.preventDefault();
    $.ajax({
        url: 'https://contact.nateshoffner.com/send',
        data: $(this).serialize(),
        type: 'POST',
        error: function(xhr, ajaxOptions, thrownError) {
            $('#contact-form').hide();
            $('#contact-result-error').show();
        },
        success: function(data) {
            if (data.success) {
                $('#contact-form').hide();    
                $('#contact-result-success').show();
            } else {
                $('#contact-form').hide();
                $('#contact-result-error').show();
            }
        }
    });
});

$(document).ready(function() {
    init_fancybox();
});

preventAnchorScroll();

$(document).ready(function(){
    
    var offset = 350;
    var duration = 500;

    $(window).scroll(function() {
        if ($(this).scrollTop() > offset) {
             $("#top-btn").fadeIn(duration);
        } else {
            $("#top-btn").fadeOut(duration);
        }
    });
});

function typeName(selector, hideCursor, callback) {
    var options = {
        strings: [$(selector).attr('data-name')],
        typeSpeed: 100,
        showCursor: true,
        onComplete: function(self) {

            if (hideCursor) {
                var cursor = $('.typed-cursor');
                setTimeout(function() {
                    cursor.hide();
                }, 1); 
            }

            if (callback)
                callback();
        },
    }

    var typed = new Typed(selector, options);
}

$(document).ready(function() {
    typeName('#first-name', true, function() {
        typeName('#last-name', false, null);
    });
});