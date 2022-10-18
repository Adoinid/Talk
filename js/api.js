var API = (function () {
    const BASE_URL = 'https://study.duyiedu.com'
    const TOKEN_KEY = 'token'
    // 封装get函数
    function get(path) {
        const headers = {}
        const token = localStorage.getItem(TOKEN_KEY)
        if (token) {
            headers.authorization = `Bearer ${token}`
        }
        return fetch(BASE_URL + path, headers)
    }
    // 封装post函数
    function post(path, bodyObj) {
        const headers = {
            'Content-Type': 'application/json'
        }
        const token = localStorage.getItem(TOKEN_KEY)
        if (token) {
            headers.authorization = `Bearer ${token}`
        }
        return fetch(BASE_URL + path, {
            headers,
            method: 'POST',
            body: JSON.stringify(bodyObj)
        })
    }
    // 用户注册
    async function reg(userInfo) {
        return await post('/api/user/reg', userInfo).then((resp) => resp.json())
    }
    // 用户登录
    async function login(loginInfo) {
        const resp = await post('/api/user/login', loginInfo)
        const result = await resp.json();
        // 判断函数是否登录成功
        if (result.code === 0) {
            // 登录成功
            // 将响应头中的tokne保存起来(localStrorage)
            const token = resp.headers.get('authorization');
            localStorage.setItem(TOKEN_KEY, token);
        }
    }
    // 验证登录
    async function exists(loginId) {
        return await get('/api/user/exists?loginId=' + loginId).then((resp) => resp.json())
    }
    // 验证当前登录的用户信息
    async function profile() {
        const resp = await get('/api/user/profile');
        return await resp.json();
    }
    // 发送聊天消息
    async function sendChat(content) {
        const resp = await post('/api/chat', {
            content
        });
        return await resp.json();
    }
    // 获取聊天记录
    async function getHistory() {
        const resp = await get('/api/chat/history')
        return await resp.json();
    }
    // 注销登录
    function loginOut() {
        localStorage.removeItem(TOKEN_KEY);
    }
    return {
        reg,
        login,
        exists,
        profile,
        sendChat,
        getHistory,
        loginOut
    }
})()