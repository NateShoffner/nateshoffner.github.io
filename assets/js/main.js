function responsify_twitter_widgets() {

}

function responsify_blog_images() {
    $(".post-content  img").each(function( index ) {
        $(this).addClass("img-responsive");
    });
}

function fancybox_blog_images() {
    $(".post-content img").each(function( index ) {
        $(this).wrap( "<a href='" + $(this).attr("src") + "' class='fancybox'></a>");
    });

    $(document).ready(function(){
        $(".fancybox").fancybox({
            openEffect  : "elastic",
            closeEffect : "elastic",
            padding : 0
        });
    });
}