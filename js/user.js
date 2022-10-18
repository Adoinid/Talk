// 通用代码
/**
 * 对某一个表单进行验证的构造函数
 */
class FieldValidator {
    /**
     * 构造器
     * @param {String} txtId 文本框的Id
     * @param {Function} validatorFunc 验证规则函数，当需要对该文本框进行验证时，会调用该函数，函数的参数为当前文本框的参数，函数的返回值为验证的错误消息，若没有返回值，则函数无错误
     */
    constructor(txtId, validatorFunc) {
        this.input = $('#' + txtId);
        this.p = this.input.nextElementSibling;
        this.validatorFunc = validatorFunc;
        this.input.onblur = () => {
            this.validate();
        };
    }
    /**
     * 验证，成功返回true，错误返回false
     */
    async validate() {
        const err = await this.validatorFunc(this.input.value);
        if (err) {
            this.p.innerText = err;
            return false;
        } else {
            this.p.innerText = '';
            return true;
        }
    }

    /**
     * 对传入的所有验证器进行统一的验证，如果所有的验证均通过，返回true，否则返回false
     * @param  {FieldValidator[]} validators 
     */
    static async validator(...validators) {
        const proms = validators.map((v) => v.validate());
        const results = await Promise.all(proms);
        return results.every((r) => r);
    }
}