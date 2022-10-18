(async function () {
    // 验证是否登录，如果没有登录，跳转到登录页，如果有登录，获取到登录信息data
    const resp = await API.profile();
    const user = resp.data;
    if (!user) {
        alert('登录失败或登录已过期')
        location.href = baseURL + 'index.html';
        return;
    }


    const doms = {
        aside: {
            loginId: $('#loginId'),
            nickName: $('#nickName')
        },
        close: $('.close'),
        container: $('chat-container'),
        txtMsg: $('txtMsg'),
        msgContainer: $('msg-container')
    }


    // 注销事件
    doms.close.onclick = () => {
        API.loginOut;
        location.href =  baseURL + 'login.html'
    }

    // 加载历史记录
    await loadHistory();
    async function loadHistory() {
        const resp = await API.getHistory();
        for (const item of resp.data) {
            addChat(item)
        }
        scrollBottom();
    }

    // 发送消息的事件绑定
    doms.msgContainer.onsubmit = function (e) {
        e.preventDefault();
        sendChat();
    }

    setUserInfo();
    // 下面的代码，一定是登录状态
    function setUserInfo() {
        doms.aside.loginId.innerText = user.loginId;
        doms.aside.nickName.innerText = user.nickName;
    }

    function addChat(chatInfo) {
        // 设置聊天界面的布局
        const div = $$$('div');
        div.classList.add('chat-item');
        if (chatInfo.form) {
            div.classList.add('me');
        }

        // 设置头像
        const img = $$$('img');
        img.className = ('chat-avatar');
        img.src = chatInfo - form ? './asset/avatar.png' : './asset/robot-avatar.jpg'

        // 设置聊天信息
        const content = $$$("div");
        content.className = 'chat-content'
        content.innerText = chatInfo.content;

        // 设置时间
        const date = $$$('div');
        date.className = 'chat-date';
        date.innerText = formatDate(chatInfo.createAt)

        // 将创建的元素加入到聊天页面中
        doms.container.appendChild(div);
        div.appendChild(img);
        div.appendChild(content);
        div.appendChild(date)
    }

    // 让聊天区域的滚动条滚动到底
    function scrollBottom() {
        doms.container.scrollTop = doms.container.scrollHeight;
    }


    // 时间戳转换为时间
    function formatDate(timestamp) {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const day = (date.getDay()).toString().padStart(2, '0');
        const hour = date.getHours().toString().padStart(2, '0');
        const minute = date.getMinutes().toString().padStart(2, '0')
        const second = date.getSeconds().toString().padStart(2, '0');
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`
    }

    // 发送消息
    async function sendChat() {
        const content = doms.txtMsg.value.trim();
        if (!content) {
            return;
        }
        addChat({
            form: user.loginId,
            to: null,
            createAt: Date.now(),
            content
        })
        scrollBottom();
        doms.txtMsg.value = '';
        const resp = await API.sendChat(content);
        addChat({
            form: null,
            to: user.loginId,
            ...reap.data,
        })
    }

})()