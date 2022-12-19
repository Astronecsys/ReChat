// 切换到聊天界面
function tochatbox(){
    $('#container').css('display','none')
    $('#chatbox').css('display','block')
}
// 切换到欢迎界面
function toWelcome(){
    $('#chatbox').css('display','none')
    $('#container').css('display','block')
}
// 调试按钮
document.getElementById('t1').onclick=tochatbox
document.getElementById('t0').onclick=toWelcome