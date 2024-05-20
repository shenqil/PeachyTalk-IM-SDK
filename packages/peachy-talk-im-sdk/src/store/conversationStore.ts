import { ChatType, Message } from "@/protocolLayer/protobuf/proto/messages"
import log from "../utils/log"
import { throttle } from "@/utils/common"


export interface IConversationInfo {
    id: string, // 会话ID
    name: string, // 会话名称
    pinToTop: boolean,   // 消息置顶
    doNotDisturb: boolean, // 消息免打扰
    lastMessage: Message | undefined, // 最后一条消息
    type: ChatType, // 会话类型
    unReadNums: number, // 消息未读数量
    utime: number // 会话最后更新时间
}



class ConversationStore {
    private conversationMap = new Map<string, IConversationInfo>()
    private mUpdateFn: Function
    private userId: string | undefined

    constructor(updateFn: Function) {
        this.mUpdateFn = throttle(() => {
            const mList = Array.from(this.conversationMap.values())
            log.info("[conversationStore][conversationListChange]", "list=", mList)
            updateFn(mList)
        }, 1000)
    }

    /**
     * 通过消息创建会话
     * @param msg 
     */
    private createConversationByMsg(id: string, msg: Message) {
        const defaultConversation: IConversationInfo = {
            id,
            name: "",
            pinToTop: false,
            doNotDisturb: false,
            lastMessage: msg,
            type: msg.chatType,
            unReadNums: msg.from === this.userId ? 0 : 1,
            utime: Number(msg.timestamp),
        }

        return defaultConversation
    }

    /**
     *  初始化会话列表
     * @param list 
     * @param userId 
     */
    init(list: IConversationInfo[], userId: string) {
        this.userId = userId

        list.forEach(item => {
            this.conversationMap.set(item.id, item)
        })
    }

    /**
     * 销毁会话列表
     */
    destroy() {
        this.conversationMap.clear()
    }


    /**
     * 通过消息收发更新会话
     * @param id 
     * @param msg 
     */
    updateConversationByMsg(id: string, msg: Message) {
        log.debug("[conversationStore][updateConversationByMsg]", "msg=", msg)
        const conversationItem = this.conversationMap.get(id)

        if (!conversationItem) {
            const newItem = this.createConversationByMsg(id, msg)
            this.conversationMap.set(id, newItem)
            log.info('[conversationStore][updateConversationByMsg] createConversation', newItem)
        } else {
            conversationItem.lastMessage = msg
            conversationItem.utime = Number(msg.timestamp)
            if (this.userId !== msg.from) {
                conversationItem.unReadNums++
            }
        }

        this.mUpdateFn()
    }

    /**
     * 获取某个会话
     * @param id 
     * @returns 
     */
    get(id: string): IConversationInfo | undefined {
        return this.conversationMap.get(id)
    }


    /**
     * 用户对该会话已读
     */
    updateConversationByMsgRead(id: string) {
        const conversationItem = this.conversationMap.get(id)

        log.debug("[conversationStore][updateConversationByMsgRead]", "id=" + id)
        if (conversationItem) {
            conversationItem.unReadNums = 0
            this.mUpdateFn()
        }
    }


    /**
     * 删除会话时更新会话
     * @param id 
     */
    updateConversationBydeleteCoversation(id: string) {
        if (this.conversationMap.has(id)) {
            log.debug("[conversationStore][updateConversationBydeleteCoversation]", "id=" + id)
            this.conversationMap.delete(id)
            this.mUpdateFn()
        }
    }
}

export default ConversationStore