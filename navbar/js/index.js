$(document).ready(function(){
	$(".scroll").click(function(event){
		event.preventDefault();
		$("html,body").animate({scrollTop:$(this.hash).offset().top}, 500);
		$('.navbar-default a').removeClass('selected');
		$(this).addClass('selected');
    	});
});
$('.carousel').slick({
  dots: true,
  infinite: true,
  speed: 300,
  slidesToShow: 1,
  centerMode: false,
  variableWidth: false,
  autoplay: true,
  arrows: false
});
