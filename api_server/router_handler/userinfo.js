//导入数据库操作模块
const db = require('../db/index')
//导入bcryptjs
const bcrypt = require('bcryptjs')

//获取用户基本信息的处理数据
exports.getUserInfo = (req, res) => {
    // res.send('ok')
    //根据用户的id，查询用户的基本信息
    //注意：为了防止用户的密码泄露，需要排除password字段
    const sql = 'select id, username, nickname, email, user_pic from ev_users where id=?'
    //注意：req对象上的user属性，是token解析成功，express-jwt中间件帮我们挂载上去的
    db.query(sql, req.user.id, (err, results) => {
        //1.执行sql语句失败
        if (err) return res.cc(err)

        //2.执行sql语句成功，但查询到的数据条数不止1条
        if (results.length !== 1) return res.cc('获取用户信息失败！')

        //3.将用户信息响应给客户端
        res.send({
            status: 0,
            message: '获取用户基本信息成功！',
            data: results[0]
        })
    })
}

//更新用户基本信息的处理函数
exports.updateUserInfo = (req, res) => {
    // res.send('ok')
    const userinfo = req.body
    const sql = 'update ev_users set ? where id=?'
    db.query(sql, [userinfo, userinfo.id], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('修改用户基本信息失败！')
        return res.cc('修改用户基本信息成功！', 0)
    })
}

//重置密码的处理函数
exports.updatePassword = (req, res) => {
    // res.send('ok')
    //根据id查询用户是否存在
    const sql = 'select * from ev_users where id=?'
    db.query(sql, req.user.id, (err, results) => {
        //执行sql语句失败
        if (err) return res.cc(err)
        //检查指定id的用户是否存在
        if (results.length !== 1) return res.cc('用户不存在！')

        //判断提交的旧密码是否正确
        const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password)
        if (!compareResult) return res.cc('原密码错误！')
        //对新密码进行加密后更新到数据库中
        //定义更新用户密码的sql语句
        const sql = 'update ev_users set password=? where id=?'
        //对新密码进行bcrypt加密处理
        const newPwd = bcrypt.hashSync(req.body.newPwd, 10)
        //执行sql语句，根据id更新用户的密码
        db.query(sql, [newPwd, req.user.id], (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc('更新密码失败！')
            return res.cc('更新密码成功！', 0)
        })
    })
}

//更新用户头像的处理函数
exports.updateAvatar = (req, res) => {
    // res.send('ok')
    const userinfo = req.body
    const sql = 'update ev_users set user_pic=? where id=?'
    db.query(sql, [userinfo.avatar, req.user.id], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('更新头像失败！')
        return res.cc('更新头像成功！', 0)
    })
}