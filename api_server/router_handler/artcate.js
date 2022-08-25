//导入数据库操作模块
const db = require('../db/index')

//获取文章分类列表数据的处理函数
exports.getArticleCates = (req, res) =>{
    // res.send('ok')
    //根据分类的状态，获取所有违背删除的分类列表数据
    //is_delete为0表示没有被标记为删除的数据
    const sql = 'select * from ev_article_cate where is_delete=0 order by id asc'
    db.query(sql, (err, results) =>{
        if(err) return res.cc(err)
        res.send({
            status: 0,
            message: '获取文章分类列表成功！',
            data: results
        })
    })
}

//新增文章分类的处理函数
exports.addArticleCates = (req, res) =>{
    //查询分类名称与别名是否被占用
    const sql = 'select * from ev_article_cate where name=? or alias=?'
    db.query(sql, [req.body.name, req.body.alias], (err, results) =>{
        if(err) return res.cc(err)

        //判断分类名称和分类别名是否被占用
        if(results.length === 2) return res.cc('分类名称与别名被占用，请更换后重试！')
        //分别判断分类名称和分类别名是否被占用
        if(results.length === 1 && results[0].name === req.body.name) return res.cc('分类名称被占用，请更换后重试！')
        if(results.length === 1 && results[0].name === req.body.alias) return res.cc('分类别名被占用，请更换后重试！')
        
        //新增文章分类
        const sql = 'insert into ev_article_cate set ?'
        db.query(sql, req.body, (err, results) =>{
            if(err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc('新增文章分类失败！')
            res.cc('新增文章分类成功！', 0)
        })
    })
}

//删除文章分类的处理函数
exports.deleteCateById = (req, res) =>{
    const sql = 'update ev_article_cate set is_delete=1 where id=?'
    db.query(sql, req.params.id, (err, results) =>{
        if(err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('删除文章分类失败！')
        res.cc('删除文章分类成功！', 0)
    })
}

//根据id获取文章分类的处理函数
exports.getArticleById = (req, res) =>{
    const sql = 'select * from ev_article_cate where id=?'
    db.query(sql, req.params.id, (err, results) =>{
        if(err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('获取文章分类数据失败！')
        res.send({
            status: 0,
            message: '获取文章分类数据成功！',
            data: results[0]
        })
    })
}

//根据id更新文章的分类数据
exports.updataCateById = (req, res) =>{
    const sql = 'select * from ev_article_cate where Id<>? and (name=? or alias=?)'
    db.query(sql, [req.body.id, req.body.name, req.body.alias], (err, results) =>{
        if(err) return res.cc(err)

        //判断分类名称和分类别名是否被占用
        if(results.length === 2) return res.cc('分类名称与别名被占用，请更换后重试！')
        //分别判断分类名称和分类别名是否被占用
        if(results.length === 1 && results[0].name === req.body.name) return res.cc('分类名称被占用，请更换后重试！')
        if(results.length === 1 && results[0].name === req.body.alias) return res.cc('分类别名被占用，请更换后重试！')
        
        //更新文章分类
        const sql = 'updata ev_article_cate set ? where id=?'
        db.query(sql, [req.body, req.body.id], (err, results) =>{
            if(err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc('更新文章分类失败！')
            res.cc('更新文章分类成功！', 0)
        })
    })
}
