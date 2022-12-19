$('#signup').click(function () {
    $('.pinkbox').css('transform', 'translateX(80%)');
    $('.signin').addClass('nodisplay');
    $('.signup').removeClass('nodisplay');
});

$('#signin').click(function () {
    $('.pinkbox').css('transform', 'translateX(0%)');
    $('.signup').addClass('nodisplay');
    $('.signin').removeClass('nodisplay');
});

$('#size1').click(()=>{
    $('.msglist').css('font-size','1em')
})
$('#size2').click(()=>{
    $('.msglist').css('font-size','2em')
})
$('#size3').click(()=>{
    $('.msglist').css('font-size','3em')
})
$('#fonti').click(()=>{
    $('.msglist').css('font-style','italic')
})
$('#fontn').click(()=>{
    $('.msglist').css('font-style','normal')
})
