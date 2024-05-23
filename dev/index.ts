import { ChatEventName, ChatSDK, ChatType, ISendMsg, Message, MessageType, create } from '@src';
import inquirer from 'inquirer';
import config from "./config.json"

console.log(`[init] config=`, config)

// 创建实例
const instance: ChatSDK = create({ url: config.url });

instance.on(ChatEventName.CONNECTING, () => {
    console.log("[IM][dev][event] 正在连接中")
})
instance.on(ChatEventName.CONNECTED, () => {
    console.log("[IM][dev][event] 连接成功")
})
instance.on(ChatEventName.DISCONNECTED, () => {
    console.log("[IM][dev][event] 连接断开")
})
instance.on(ChatEventName.MESSAGE_RECEIVED, (data: Message) => {
    console.log("[IM][dev][event] 接收到消息", data)
})
instance.on(ChatEventName.CONVERSATION_LIST_UPDATED, (list) => {
    console.log("[IM][dev][event] 会话列表更新", list)
})

// 定义不同命令对应的参数提示
const commandPrompts = {
    login: [
        { type: 'input', name: 'username', message: '输入用户名: ' },
        { type: 'password', name: 'password', message: '输入密码: ' },
    ],
    logout: [],
    sendTextMsg: [
        { type: 'input', name: 'toId', message: '接收者ID: ' },
        { type: 'input', name: 'text', message: '发送文本: ' },
    ],
};


const commandHanldes: any = {
    login: async (args: any) => {
        try {
            await instance.login({ userId: args.username, token: args.password })
            console.log("[IM][dev][login] 登录成功")
        } catch (error) {
            console.error("[IM][dev][login] 登录失败", error)
        }
    },
    logout: () => {
        instance.logout()
    },
    sendTextMsg: async (args: any) => {
        try {
            const msg: ISendMsg = {
                to: args.toId,
                chatType: ChatType.CHAT,
                type: MessageType.TEXT,
                payload: args.text
            }
            await instance.sendMsg(msg)
            console.log("[IM][dev][sendTextMsg] 发送成功")
        } catch (error) {
            console.error("[IM][dev][sendTextMsg] 发送失败", error)
        }
    }
}

// 提示用户输入命令，并根据命令选择相应的参数提示
function promptCommand() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'command',
                message: 'Enter a command:',
                choices: [...Object.keys(commandPrompts)],
            },
        ])
        .then((answers) => {
            const command: keyof typeof commandPrompts = answers.command;
            const prompts = commandPrompts[command];

            // 提示输入相应的参数
            inquirer.prompt(prompts)
                .then((commandAnswers) => {
                    console.log('Arguments:', commandAnswers);

                    return commandHanldes[command](commandAnswers)
                })
                .catch(err => {
                    console.error(err)
                })
                .finally(() => {
                    // 继续循环提示
                    promptCommand();
                })
        });
}

// 开始循环提示
promptCommand();
