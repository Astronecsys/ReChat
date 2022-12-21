const db = require('./db')

// 查询返回的数据均为数组格式

// 获取整个表格
module.exports.getAllList = (tablename, callback) => {
    db.query(`select * from ${tablename}`, (err, results) => {
        if (err) {
            console.log(err.message)
            callback([])
            return
        }
        callback(results)
    })
}
{
    // this.getAllList('User', results => {
    //     console.log('测试查询用户表')
    //     console.log(results)
    // })
    // this.getAllList('Room', results => {
    //     console.log('测试查询房间表')
    //     console.log(results)
    // })
    // this.getAllList('Message', results => {
    //     console.log('测试查询消息表')
    //     console.log(results)
    // })
    // this.getAllList('Belong', results => {
    //     console.log('测试查询所属表')
    //     console.log(results)
    // })
}
// 获取指定用户数据包
module.exports.getUserInfo = (Uid, callback) => {
    db.query(`select * from User where Uid = ${Uid}`, (err, results) => {
        if (err) {
            console.log(err.message)
            callback([])
            return
        }
        callback(results)
    })
}
{
    // this.getUserInfo(1,results=>{
    //     console.log('测试查询指定用户数据包')
    //     console.log(results)
    // })
}
// 获取指定房间数据包
module.exports.getRoomInfo = (Rid, callback) => {
    db.query(`select * from Room where Rid = ${Rid}`, (err, results) => {
        if (err) {
            console.log(err.message)
            callback([])
            return
        }
        callback(results)
    })
}
{
    // this.getRoomInfo(1,results=>{
    //     console.log('测试查询指定房间数据包')
    //     console.log(results)
    // })
}

// 获取指定房间的消息列表
module.exports.getMinRList = (Rid, callback) => {
    db.query(`select * from Message where Rid = ${Rid}`, (err, results) => {
        if (err) {
            console.log(err.message)
            callback(false, [])
            return
        }
        callback(true, results)
    })
}
{
    // this.getMinRList(1,results=>{
    //     console.log('测试指定房间的消息列表')
    //     console.log(results)
    // })
}

// 获取指定用户所属房间列表
module.exports.getUtoRList = (Uid, callback) => {
    db.query(`select distinct * from Belong where Uid = ${Uid}`, (err, results) => {
        if (err) {
            console.log(err.message)
            callback([])
            return
        }
        callback(results)
    })
}
{
    // this.getUtoRList(1,results=>{
    //     console.log('测试查询指定用户所属房间列表')
    //     console.log(results)
    // })
}

// 获取指定房间所拥用户列表
module.exports.getRtoUList = (Rid, callback) => {
    db.query(`select distinct * from Belong where Rid = ${Rid}`, (err, results) => {
        if (err) {
            console.log(err.message)
            callback([])
            return
        }
        callback(results)
    })
}
{
    // this.getRtoUList(1,results=>{
    //     console.log('测试查询指定房间所拥用户列表')
    //     console.log(results)
    // })
}

// 注册新用户
module.exports.register = (newUser, callback) => {
    db.query('insert into user set ?', newUser, (err, results) => {
        if (err) {
            console.log(err.message)
            callback(false)
        }
        callback(true)
    })
}

// 注册新房间
module.exports.newroom = (str, Rid, callback) => {
    // 分析成员
    if(!str.length){
        callback(false)
    }
    let arr = str.split(',')
    Rname = arr[0]
    arr = arr.filter((e, i) => i != 0)
    db.query(`INSERT INTO rechat.room (Rid, Rname, RAvatar) VALUES (${Rid}, '${Rname}', '../image/jiwang.png')`, (err, results) => {
        if (err) {
            console.log(err.message)
            callback(false)
        }
        else {
            arr.forEach(Uid => {
                db.query(`INSERT INTO rechat.belong (Uid, Rid) VALUES (${Uid}, ${Rid})`, (err, results) => {
                    if (err) {
                        console.log(err.message)
                        callback(false)
                    }
                    else {
                        callback(true)
                    }
                })
            })
        }
    })
}

// 发送消息
module.exports.sendMessage = (premsg, callback) => {
    db.query('insert into message set ?', premsg, (err, results) => {
        if (err) {
            console.log(err.message)
            callback(false)
        }
        callback(true)
    })
}
// 找回密码
module.exports.getPassword = (Phone, callback) => {
    db.query(`select * from User where Phone  = ${Phone}`, (err, results) => {
        if (err) {
            console.log(err.message)
            callback(false,[])
            return
        }
        callback(true,results)
    })
}
// 加入房间
module.exports.addRoom = (premsg, callback) => {
    db.query('insert into belong set ?', premsg, (err, results) => {
        if (err) {
            console.log(err.message)
            callback(false)
        }
        callback(true)
    })
}