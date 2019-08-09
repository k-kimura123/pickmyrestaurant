$(document).ready(function(){
    // Activate Carousel
    $("#imageslide").carousel({
        pause:true,
        interval:false,
    });
      
      
    // Enable Carousel Controls
    $(".carousel-control-prev").click(function(){
      $("#myCarousel").carousel("prev");
    });
    $(".carousel-control-next").click(function(){
      $("#myCarousel").carousel("next");
    });
}); 