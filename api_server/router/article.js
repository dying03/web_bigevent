const express = require('express')
const router = express.Router()

//导入文章的路由处理函数模块
const article_handler = require('../router_handler/article')

// 导入 multer 和 path
const multer = require('multer')
const path = require('path')

// 创建 multer 的实例
const upload = multer({ dest: path.join(__dirname, '../uploads') })

//导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
//导入文章的验证模块
const { add_article_schema, delete_schema, get_articleById_schema, update_article_schema } = require('../schema/article')

//发布新文章
//upload.single()是一个局部生效的中间件，用来解析FormData 格式的表单数据
//将文件类型的数据，解析并挂载到req.file属性中
//将文本类型的数据，解析并挂载到req.body属性中
//先使用multer解析表单数据
//再使用expressJoi对解析的表单数据进行验证
router.post('/add', upload.single('cover_img'), expressJoi(add_article_schema), article_handler.addArticle)
// 获取文章的列表数据
router.get('/list', article_handler.getArticle)
//根据ID删除文章的路由
router.get('/delete/:Id', expressJoi(delete_schema), article_handler.deleteById)
//根据Id查询文章
router.get('/:Id', expressJoi(get_articleById_schema), article_handler.getArticleById)
//更新文章的路由
router.post('/edit', upload.single('cover_img'), expressJoi(update_article_schema), article_handler.editArticle)

module.exports = router