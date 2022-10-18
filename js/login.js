const loginIdValidator = new FieldValidator('txtLoginId', async function (val) {
    if (!val) {
        return '请填写账号';
    }
})

const loginPwdValidator = new FieldValidator('txtLoginPwd', async function (val) {
    if (!val) {
        return '请填写密码';
    }
})
// 获取表单元素
const form = $('.user-form');

// 给表单元素注册事件
form.onsubmit = async function (e) {
    // 清除表单默认行为
    e.preventDefault();
    // 注册时进行验证
    const result = await FieldValidator.validator(loginIdValidator, loginPwdValidator)
    // 验证不通过则返回
    if (!result) {
        return;
    }
    // 验证通过
    // 使用FormData去进行表单的操作
    const formData = new FormData(form);
    // Object.formEntries将数组转化为对象，entries将自身属性的键值对返回
    const data = Object.fromEntries(formData.entries);
    // 判断注册是否成功
    const resp = await API.login(data)
    if (resp === 0) {
        alert('登录成功，点击确定，前往首页');
        location.href = '../index.html';
    } else {
        loginIdValidator.p.innerText = '账号或密码错误';
        loginPwdValidator.input.value = '';
    }
}