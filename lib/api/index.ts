/*
 * @Author: shenqi.lv 248120694@qq.com
 * @Date: 2024-04-28 19:07:29
 * @LastEditors: shenqi.lv 248120694@qq.com
 * @LastEditTime: 2024-04-29 09:58:07
 * @FilePath: \PeachyTalk-IM-SDK\lib\api\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/*
 * @Author: shenqi.lv 248120694@qq.com
 * @Date: 2024-04-28 19:07:29
 * @LastEditors: shenqi.lv 248120694@qq.com
 * @LastEditTime: 2024-04-29 09:26:59
 * @FilePath: \PeachyTalk-IM-SDK\lib\api\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import ChatProtocol from "../protocolLayer/mqtt";

export interface ILoginInfo {
    userId: string,
    token: string
}


export class ChatSDK {
    private chatProtocolInstance: ChatProtocol

    constructor() {
        this.chatProtocolInstance = new ChatProtocol()
    }

    /**
     * 登录
     * @param loginInfo 
     */
    async login(loginInfo: ILoginInfo) {
        console.log('[im][api][login] loginInfo', loginInfo);
        return await this.chatProtocolInstance.login({ username: loginInfo.userId, password: loginInfo.token })
    }

    /**
     * 退出登录
     * @returns 
     */
    logout() {
        console.log('[im][api][logout]');
        return this.chatProtocolInstance.logout()
    }

}

export default ChatSDK