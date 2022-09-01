$(function () {
    var layer = layui.layer


    // 定义一个查询的参数对象
    // 将来请求数据的时候需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1,   // 页码值，默认请求第一页的数值
        pagesize: 2,  // 每页显示几条数据，默认值为2
        cate_id: '', // 文章分类的id
        status: '' // 文章的发布状态
    }

    initTable()

    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // 使用模板引擎渲染页面的数据
                var htmStr = template('tpl_table', res)
                $('tbody').html(htmStr)
            }
        })
    }

})