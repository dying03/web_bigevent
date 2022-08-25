// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候会先调用  这个函数
// 在这个函数中可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    // console.log(options.url)
    // 在发起真正Ajax请求前，统一拼装请求的根路径
    options.url = 'http://127.0.0.1:3007' + options.url

    // 统一为有权限的接口设置 headers 请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 全局统一挂载 complete 回调函数
    options.complete = function (res) {
        // 在 complete 回调函数中，可以使用 responseJSON 拿到服务器响应回来的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 1.强制清空 token
            localStorage.removeItem('token')
            // 2.强制跳转登录页
            layer.msg('未登录账号，2秒钟后自动跳转登录页面....', {
                time: 2000 //2秒关闭（如果不配置，默认是3秒）
            }, function () {
                //do something
                location.href = '/login.html'
            });
        }
    }
})