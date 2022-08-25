/**
 * 该文件定义和用户相关的路由处理函数，供 /router/user.js 模块进行调用
 */

//导入数据库操作模块
const db = require('../db/index')
//导入 bcryptjs包
const bcrypt = require('bcryptjs')
//用这个包来生成Token字符串
const jwt = require('jsonwebtoken')
//导入配置文件
const config = require('../config')

//注册用户的处理函数
exports.regUser = (req, res) =>{
    // res.send('reguser OK')
    //接收表单数据
    const userinfo = req.body
    //判断数据是否合法（为空）
    if(!userinfo.username || !userinfo.password){
        return req.send({status: 1, message: '用户名或密码不能为空！'})
    }

    //检测用户名是否被占用
    const sqlStr = 'select * from ev_users where username=?'
    //执行sql语句并根据结果判断用户名是都被占用
    db.query(sqlStr, [userinfo.username], function(err, results){
        //执行sql语句失败
        if(err){
            // return res.send({status: 1, message: err.message})
            return res.cc(err)
        }
        //用户名被占用
        if(results.length > 0){
            // return res.send({status: 1, message: '用户名被占用，请更换其他用户名'})
            return res.cc('用户名被占用，请更换其他用户名！')
        }
        //对用户的密码进行 bcrype加密，返回值是加密之后的密码字符串
        userinfo.password = bcrypt.hashSync(userinfo.password, 10)
        //插入新用户
        const sql = 'insert into ev_users set ?'
        db.query(sql, { username: userinfo.username, password: userinfo.password },function(err, results){
            //执行sql语句失败
            // if(err) return res.send({status: 1, message: err.message})
            if(err) return res.cc(err)
            //sql语句执行成功，但影响行数不为1
            if(results.affectedRows !== 1){
                // return res.send({status: 1, message: '注册用户失败，请稍后重试！'})
                return res.cc('注册用户失败，请稍后重试！')
            }
            //注册成功
            // res.send({status: 0, message: '注册成功！'})
            res.cc('注册成功！', 0)
        })
    })
}

//登录的处理函数
exports.login = (req, res) =>{
    // res.send('reguser OK')
    const userinfo = req.body

    const sql = 'select * from ev_users where username=?'
    db.query(sql, userinfo.username, function(err, results){
        if(err) return res.cc(err)
        //执行sql语句成功，但查询到数据条数不等于1
        if(results.length !== 1) return res.cc('登录失败！')

        //判断用户输入的登录密码是否和数据库中密码一致
        //将用户输入密码与数据库汇总储存的密码进行对比
        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
        //如果对比结果等于FALSE，则证明用户输入的密码错误
        if(!compareResult){
            return res.cc('登录失败！')
        }
        //提出密码和头像的值，user只保留id，username，nickname，email
        const user = { ...results[0], password: '', user_pic: '' }
        //生成Token字符串
        const tokenStr = jwt.sign(user, config.jwtSecretKey, {
            expiresIn: '10h',  //token有效期为10个小时
        })
        //将生成的token字符串响应给客户端
        res.send({
            status: 0,
            message: '登录成功！',
            //为了方便客户端使用token，在服务器端直接拼接上bearer的前缀
            token: 'Bearer ' + tokenStr
        })
    })
}