// 导入 mysql 模块
const mysql = require('mysql')
// 建立与 MySQL 数据库的连接关系
const db = mysql.createPool({
    host: 'localhost', // 数据库地址
    user: 'root', // 登录数据库的账号
    password: 'root', // 登录数据库的密码
    database: 'rechat', // 指定要操作哪个数据库
    timezone:'UTC+0'//时区
})
// 暴露数据库操作模块
module.exports = db