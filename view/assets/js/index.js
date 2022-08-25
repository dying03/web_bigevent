$(function () {
    $('.text-avatar').hide()
    // 调用 getUserInfo 获取用户基本信息
    getUserInfo()

    var layer = layui.layer

    $('#btnLogout').on('click', function () {
        // 提示用户是否确认退出
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            //do something
            // 1.清空本地存储中的 token
            localStorage.removeItem('token')
            // 2.重新跳转登录页
            location.href = '/login.html'

            layer.close(index);
        });
    })
})


// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg('获取用户信息失败！')
            }

            // 调用 renderAvatar 渲染用户头像
            renderAvatar(res.data)
        },
    })
}

// 渲染用户头像
function renderAvatar(user) {
    // 1.获取用户名
    var name = user.nickname || user.username
    // 2.设置欢迎文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 3.按需渲染用户的头像
    if (user.user_pic !== null) {
        // 3.1 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        // 3.2 渲染文字头像
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}