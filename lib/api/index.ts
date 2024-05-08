/*
 * @Author: shenqi.lv 248120694@qq.com
 * @Date: 2024-04-28 19:07:29
 * @LastEditors: shenqi.lv 248120694@qq.com
 * @LastEditTime: 2024-05-08 20:39:37
 * @FilePath: \PeachyTalk-IM-SDK\lib\api\index.ts
 * @Description: 对外暴露的所有API
 */
import { getCMsgId } from "../utils/common";
import ChatProtocol, { IChatType, IMQTTMsg, IMsgTypeEnum } from "../protocolLayer/mqtt";
import httpApi from "../protocolLayer/http"
import { getUserInfo, setUserInfo } from "@/store/userInfo";

export * from "../protocolLayer/mqtt"
export * from "../protocolLayer/http"

export interface ILoginInfo {
    userId: string,
    token: string
}


interface IMsgBase {
    to: string; // 接收者
    chatType: IChatType; // 聊天类型 单聊、群聊
    cMsgId?: string; // 客户端唯一消息id
    extends?: { [key: string]: string }; // 扩展字段
}


interface IMsgText extends IMsgBase {
    msgType: IMsgTypeEnum.TEXT | IMsgTypeEnum.CUSTOM,
    payload: string
}


interface IMsgImg extends IMsgBase {
    msgType: IMsgTypeEnum.IMAGE,
    file: File;
    width: number;
    height: number;
}

interface IMsgFile extends IMsgBase {
    msgType: IMsgTypeEnum.AUDIO | IMsgTypeEnum.VEDIO,
    file: File;
}

/**
 * @desc 发送的消息结构
 * */
export type ISendMsg = IMsgText | IMsgImg | IMsgFile

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
        const res = await this.chatProtocolInstance.login({ username: loginInfo.userId, password: loginInfo.token })
        setUserInfo({ ...loginInfo })
        return res
    }

    /**
     * 退出登录
     * @returns 
     */
    logout() {
        console.log('[im][api][logout]');
        setUserInfo(undefined)
        return this.chatProtocolInstance.logout()
    }


    /**
     * 发送消息
     * @param msg 
     * @returns 
     */
    async sendMsg(msg: ISendMsg) {

        const userId = getUserInfo()?.userId

        if (!userId) {
            throw new Error("用户未登陆")
        }

        console.log('[im][api][sendMsg] msg=', msg);

        let payload = ""
        switch (msg.msgType) {
            case IMsgTypeEnum.TEXT:
            case IMsgTypeEnum.CUSTOM:
                payload = msg.payload
                break;

            case IMsgTypeEnum.IMAGE:
            case IMsgTypeEnum.VEDIO:
            case IMsgTypeEnum.IMAGE:
                await httpApi.uploadFile({ file: msg.file })
                break

            default:
                break;
        }

        const cMsgId = msg.cMsgId || getCMsgId()

        const data: IMQTTMsg = {
            from: userId,
            to: msg.to,
            chatType: msg.chatType,
            msgType: msg.msgType, // 消息类型
            id: "", // 消息id
            payload, // 消息内容
            clientTime: Date.now(), // 客户端时间
            serverTime: 0, // 服务端时间
            cMsgId, // 客户端唯一消息id
            msgStatus: 0, // 消息状态
            extends: msg.extends, // 扩展字段
        }

        return await this.chatProtocolInstance.sendMsg(data)
    }

}

export default ChatSDK