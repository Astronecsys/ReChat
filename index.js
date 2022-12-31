const path = require('path')

const express = require('express')
const { createServer } = require("http");
const { Server } = require("socket.io");
// 建立服务器
const app = express();
const server = createServer(app);
const io = new Server(server, { /* options */ });

// 导入数据库操作模块
const db = require('./db/db')
const def = require('./db/def')

// 端口号
const port = 80

app.use(express.static('./public'))
// 响应访问
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/html/index.html'))
})

// 获取房间总表
let Rooms = []
let loadRooms = () => def.getAllList('Room', results => {
    console.log(`成功读取房间表, 有${results.length}间`)
    Rooms = results
})
loadRooms()

// 监听房间事件
// io.of("/").adapter.on("create-room", (room) => {
//     console.log(`room ${room} was created`);
// });
// io.of("/").adapter.on("join-room", (room, id) => {
//     console.log(`socket ${id} has joined room ${room}`);
// });

// 用户列表
let Users = []
let loadUsers = () => def.getAllList('User', results => {
    console.log(`成功读取用户表, 有${results.length}人`)
    Users = results
})
loadUsers()
// 在线用户列表
let onlineUsers = []


// socket被连接后的动作
io.on("connection", socket => {
    console.log("有新客户端访问")
    // 当前链接对应用户数据包
    let thisUser = {
        Uid: 0,
        Uname: '游客',
        UAvatar: '',
        Phone: '',
        Password: ''
    }
    // 当前用户对应房间数组
    let rooms = []
    // 监听注册事件
    socket.on('register', (newUser, callback) => {
        thisUser = newUser
        // 获取并分配最新未注册账号
        Users.forEach(user => {
            thisUser.Uid = Math.max(thisUser.Uid, user.Uid)
        });
        thisUser.Uid += 1
        console.log(`${thisUser.Uid}:${thisUser.Uname}请求注册`)
        // 向数据库写入新注册的账号
        def.register(thisUser, success => {
            // 刷新用户表
            if (success) {
                loadUsers()
            }
            callback(success, thisUser)
        })
    })
    // 监听登入事件
    socket.on('login', (newUser, callback) => {
        // 查询密码密码
        thisUser = Users.find(user => user.Uid == newUser.Uid)
        console.log(`${thisUser.Uid}:${thisUser.Uname}请求登入`)
        // 校验密码
        if (thisUser.Password == newUser.Password) {
            // 分配房间
            // 检索所属房间
            def.getUtoRList(thisUser.Uid, results => {
                results.forEach(room => {
                    // 检索对应房间信息
                    def.getRoomInfo(room.Rid, results => {
                        // 房间信息绑定到socket
                        rooms.push(results[0])
                    })
                })
            })
            // // socket加入服务器房间
            // rooms.forEach(room => {
            //     socket.join(room.Rid)
            // })
            onlineUsers.push(thisUser)
            console.log(`${thisUser.Uid}:${thisUser.Uname}登入成功`)
            // 推送在线列表
            pushOnlie()
            callback(true, thisUser)
        }
        else {
            console.log(`${thisUser.Uid}:${thisUser.Uname}登入失败`)
            callback(false, thisUser)
        }
        console.log(`当前在线用户${onlineUsers.length}人`)
    })
    // 响应找回密码
    socket.on('findPassword', (phone, callback) => {
        // console.log(phone)
        def.getPassword(phone, (success, results) => {
            console.log(results)
            callback(success, results[0].Password)
        })
    })
    // 监听请求房间列表
    socket.on('getUtoRList', callback => {
        // 更新房间数据
        def.getUtoRList(thisUser.Uid, results => {
            rooms = []
            // console.log(results)
            results.forEach((room, i) => {
                // 检索对应房间信息
                def.getRoomInfo(room.Rid, result => {
                    // 房间信息绑定到socket
                    rooms.push(result[0])
                    // console.log(i)
                    // console.log(results.length-1)
                    // 更新所有房间数据后返回数据
                    if (i == results.length-1) {
                        // console.log('发送房间数据')
                        // console.log(rooms)
                        callback(rooms)
                    }
                })
            })
        })
    })
    // 监听请求历史记录
    socket.on('getHistoryMessage', (room, callback) => {
        def.getMinRList(room.Rid, (success, msgs) => {
            // console.log(msgs)
            callback(success, msgs)
        })
    })
    // 监听发送消息
    socket.on('sendMessage', (premsg, callback) => {
        // 写入数据库
        // console.log(premsg)
        def.sendMessage(premsg, success => {
            if (success) {
                // 转发
                io.emit('pushMessage')
                callback(true)
            }
            else {
                callback(false)
            }
        })

    })
    // 推送在线列表
    function pushOnlie() {
        console.log('推送在线列表')
        io.emit('pushOnlie', onlineUsers)
    }
    // 新建群聊
    socket.on('newroom', (str, callback) => {
        // 分配房间号
        let Rid = 0
        Rooms.forEach(room => {
            Rid = Math.max(room.Rid, Rid)
        });
        Rid += 1
        // 新建房间
        if (str != '' || str != null) {
            def.newroom(str, Rid, success => {
                // 广播刷新列表
                rvnewroom()
                io.emit('rvnewroom')
                callback(success)
            })
        }
        else {
            callback(false)
        }
    })
    // 加入群聊
    socket.on('addroom', (rid, callback) => {
        def.addRoom({ Rid: rid, Uid: thisUser.Uid }, success => {
            // 广播刷新列表
            rvnewroom()
            callback(success)
        })
    })
    // 广播刷新列表
    function rvnewroom() {
        io.emit('rvnewroom')
    }
    // 监听断开连接
    socket.on("disconnect", () => {
        console.log(`${thisUser.Uname}断开了链接`)
        // 下线此socekt用户
        onlineUsers = onlineUsers.filter(user => {
            return user != thisUser
        })
        pushOnlie()
        console.log(`当前在线用户${onlineUsers.length}人`)
        // 自动完成退出房间
    })
});

// 启动服务器监听
server.listen(port, () => {
    console.log(`服务器启动,访问地址为: http://localhost:${port}/`)
})