import { ChatSDK, create } from '@src';
import inquirer from 'inquirer';
import config from "./config.json"

console.log(`[init] config=`, config)

// 创建实例
const instance: ChatSDK = create({ url: config.url });


// 定义不同命令对应的参数提示
const commandPrompts = {
    login: [
        { type: 'input', name: 'username', message: '输入用户名:' },
        { type: 'password', name: 'password', message: '输入密码:' },
    ],
    sendMsg: [
        { type: 'input', name: 'text', message: 'Enter the message text:' },
    ],
};


const commandHanldes: any = {
    login: async (args: any) => {
        try {
            await instance.login({ userId: args.username, token: args.password })
            console.log("[IM][dev] 登录成功")
        } catch (error) {
            console.error("[IM][dev] 登录失败", error)
        }
    },

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
