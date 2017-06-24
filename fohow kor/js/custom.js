$(document).ready(function(){
function Rotator(start_from){
    var phrases = ["Почему именно мы?","Потому что только у нас:"];
    var total = phrases.length;
    var interval = 1300;
    if(void 0 === start_from){
        start_from = 0;
    }
    $(".textrotator").text(phrases[start_from]).animate({"opacity":"1"}, 1000, function(){
                if(start_from >= (total-1)){
                    setTimeout(function(){
                        $(".textrotator").animate({"opacity":"0"}, 1000, function(){
                            Rotator();
                        });
                    }, interval);
                }else{
                    start_from++;
                    setTimeout(function(){
                        $(".textrotator").animate({"opacity":"0"}, 1000,function(){
                            Rotator(start_from);
                        });
                    }, interval);

                }
              })
}
Rotator();
})
$(document).on('ready', function() {
  $(".regular").slick({
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 3
  });
  $(".center").slick({
    dots: true,
    infinite: true,
    centerMode: true,
    slidesToShow: 3,
    slidesToScroll: 3
  });
  $(".variable").slick({
    dots: true,
    infinite: true,
    variableWidth: true
  });
  $(".lazy").slick({
    lazyLoad: 'ondemand', // ondemand progressive anticipated
    infinite: true
  });

  $('#myModal').modal({
  keyboard: true
})
});
