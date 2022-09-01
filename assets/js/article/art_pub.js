$(function () {
    var layer = layui.layer
    var form = layui.form


    initCate()
    // 初始化富文本编辑器
    initEditor()


    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章类别失败！')
                }

                // 调用模板引擎，渲染分类的下拉菜单
                var htmlStr = template('tpl_cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 一定要记得调用 form.render() 方法
                form.render()
            }
        })
    }
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image');

    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 300 / 400,
        // 指定预览区域
        preview: '.img-preview'
    };

    // 1.3 创建裁剪区域
    $image.cropper(options);

    /* 绑定选择封面按钮 和 上传文件表单控件 */
    $('#btnChooseImage').on('click', function (e) {
        $('#coverFile').trigger('click')
    })

    /* 更换裁剪图片 */
    $('#coverFile').on('change', function (e) {
        var files = e.target.files

        if (files.length === 0) {
            return layui.layer.msg('请选择封面图片')
        }

        var newFileURL = URL.createObjectURL(files[0])

        $image.cropper('destroy').attr('src', newFileURL).cropper(options);
    })


    // 定义文章的发布状态
    var art_state = '已发布'

    // 为存为草稿按钮，绑定点击事件处理函数
    $('#btnSave').on('click', function (e) {
        art_state = '草稿'
    })
    


    // 为表单绑定 submit 提交事件
    $('#form-pub').on('submit', function (e) {
        e.preventDefault()
        // 基于 form 表单，快速创建 FormData 对象
        var fd = new FormData($(this)[0])
        // 将文章发布状态存到 fd 中
        fd.append('state', art_state)

        // 将裁剪图片输出为文件
        $image.cropper('getCroppedCanvas', {
            // 创建一个画布
            width: 300,
            height: 400
        }).toBlob(function (blob) {
            // 将裁剪图片变为文件blob后的回调函数
            fd.append('cover_img', blob)
            // 发起 ajax 请求
            publishArticle(fd)
        })
    })


    // 定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // FormData 配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if(res.status !== 0){
                    console.log(res)
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                location.href = '/article/art_list.html'
            }
        })
    }
})