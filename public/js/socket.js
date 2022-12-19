const socket = io();
if (socket) {
    console.log('成功链接服务器')
}
let getValue = (id) => {
    return document.getElementById(id).value
}
let thisUser = {
    Uid: 0,
    Uname: '游客',
    UAvatar: '游客头像',
    Phone: '游客电话',
    Password: '123456'
}
let thisRoom = {
    Rid: 0,
    Rname: '广播',
    RAvatar: '../image/flower1.png'
}
let roomList = []
let messageList = []
let onlineList = []
let userList = []
// 监听登入按钮
document.getElementById('login').onclick = () => {
    console.log('客户端激活登入按钮')
    // 获取数据并校验
    thisUser.Uid = parseInt($('#Uid').val())
    if (thisUser.Uid == '') {
        alert('请输入账号')
        return
    }
    thisUser.Password = $('#password0').val()
    if (thisUser.Password == '') {
        alert('请输入密码')
        return
    }
    // 处理请求
    socket.emit('login', thisUser, (success, serverUser) => {
        console.log(`登入情况:${success}`)
        thisUser = serverUser
        if (success) {
            alert(`登入成功`)
            console.log(thisUser)
            tochatbox()
            loadrooms()
            loadUserInfo()
        }
        else {
            alert(`登入失败!\n请稍候再试.`)
        }
    })
}
// 监听注册按钮
document.getElementById('register').onclick = () => {
    console.log('客户端激活注册按钮')
    // 获取数据并校验
    thisUser.Uname = $('#Uname').val()
    if (thisUser.Uname == '') {
        alert('请输入名字')
        return
    }
    thisUser.Phone = $('#Phone').val()
    let p1 = $('#password1').val()
    let p2 = $('#password2').val()
    if (p1 == '') {
        alert('请输入密码')
        return
    }
    if (p1 != p2) {
        alert('密码不一致')
        return
    }
    thisUser.Password = p1
    // 处理请求
    socket.emit('register', thisUser, (success, serverUser) => {
        console.log(`注册情况:${success}`)
        thisUser = serverUser
        suc = success
        if (success) {
            console.log(thisUser)
            alert(`注册成功!\n请记住您的账号和密码!`)
            // alert(`账号:${thisUser.Uid}\n 密码:${thisUser.Password}`)
            // 自动登入
            document.getElementById('Uid').value = thisUser.Uid
            document.getElementById('password0').value = thisUser.Password
            document.getElementById('login').onclick()
        }
        else {
            alert(`注册失败!\n请稍候再试.`)
        }
    })
    // 页面处理


}
// 加载房间列表
function loadrooms() {
    socket.emit('getUtoRList', rooms => {
        // console.log('接受房间数据')
        roomList = rooms
        // console.log(rooms)
        $('.roomlist').html('')
        // 加载房间数据
        $.each(rooms, function (i, room) {
            // 数据上屏
            $('.roomlist').prepend(`
                <li>
                    <button id="room${room.Rid}">
                        <img src="${room.RAvatar}">
                        <span>${room.Rname}</span>
                    </button>
                </li>
            `)
            // 注册点击事件
            document.getElementById(`room${room.Rid}`).onclick = () => {
                // 切换房间
                thisRoom = room
                // console.log(thisRoom)
                loadRoomInfo()
                // 加载历史记录
                loadHis()
            }
        })
    })
}
// 加载历史记录
function loadHis() {
    // 请求历史记录
    socket.emit('getHistoryMessage', thisRoom, (success, newmsgs) => {
        console.log(`请求历史消息:${success}`)
        messageList = JSON.parse(JSON.stringify(newmsgs))
        // console.log(messageList)
        // 数据上屏
        $('.msglist').html('')
        $.each(messageList, function (i, msg) {
            // console.log(msg)
            if (msg.Uid == thisUser.Uid) {
                $('.msglist').append(`
                    <li class='r'>
                        <span>${msg.Uname}</span>
                        <span>${msg.Time}</span>
                        <br><span class='con'>${msg.Content}</span>
                    </li>
                `)
            }
            else {
                $('.msglist').append(`
                    <li class='l'>
                        <span>${msg.Uname}</span>
                        <span>${msg.Time}</span>
                        <br><span class='con'>${msg.Content}</span>
                    </li>
                `)
            }
        })
    })
}
// 加载个人信息
function loadUserInfo() {
    // console.log('加载个人信息')
    document.getElementById('myname').innerHTML = thisUser.Uname
    document.getElementById('myavatar').src = thisUser.UAvatar
}
// 加载房间信息
function loadRoomInfo() {
    // console.log('加载房间信息')
    document.getElementById('roomname').innerHTML = thisRoom.Rname
    document.getElementById('roomavatar').src = thisRoom.RAvatar
}
// 监听发送按钮
document.getElementById('send').onclick = () => {
    // 获取消息
    premsg = {
        Time: moment().format('YYYY-MM-DD HH:mm:ss'),
        Content: document.getElementById('presend').value,
        Uid: thisUser.Uid,
        Rid: thisRoom.Rid,
        Uname: thisUser.Uname
    }
    // console.log(premsg)
    if (premsg.Content != '') {
        // 发送消息
        socket.emit('sendMessage', premsg, success => {
            console.log(`消息发送:${success}`)
            // 刷新列表
            if (success) {
                loadHis()
            }
        })
    }
    document.getElementById('presend').value = ''
}
// 刷新消息
socket.on('pushMessage', () => {
    loadHis()
})
// 接受并更新在线列表
socket.on('pushOnlie', (newOnlineList) => {
    console.log(newOnlineList)
    onlineList = newOnlineList
    $('.memberlist').html('')
    $.each(onlineList, (i, user) => {
        $('.memberlist').append(`
        <li>
            <img class="smallavatar" src="${user.UAvatar}">
            <h1>${user.Uname}</h1>
        </li>
        `)
    })
})
// 新建聊天
document.getElementById('newroom').onclick = () => {
    let str = prompt('请输入成员')
    socket.emit('newroom', str, success => {
        if (success) {
            alert('建立成功')
        }
        else {
            alert('建立失败')
        }
    })
}
// 新建群聊后刷新列表
socket.on('rvnewroom', () => {
    loadrooms()
})