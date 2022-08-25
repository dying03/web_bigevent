const express = require('express')
const router = express.Router()

//导入文章分类的路由处理函数模块
const artCate_handler = require('../router_handler/artcate')

//导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
//导入文章分类的校验模块
const { add_cate_schema, detele_cate_schema, get_cate_schema, update_cate_schema } = require('../schema/artcate')

//获取文章分类的列表数据
router.get('/cates', artCate_handler.getArticleCates)
//新增文章分类的路由
router.post('/addcates', expressJoi(add_cate_schema), artCate_handler.addArticleCates)
//删除文章分类的路由
router.get('/deletecate/:id', expressJoi(detele_cate_schema), artCate_handler.deleteCateById)
//根据id获取文章分类的路由
router.get('/cates/:id', expressJoi(get_cate_schema), artCate_handler.getArticleById)
//根据id更新文章分类的路由
router.post('/updatecate', expressJoi(update_cate_schema), artCate_handler.updataCateById)

//向外共享路由对象
module.exports = router