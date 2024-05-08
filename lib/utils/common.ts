/*
 * @Author: shenqi.lv 248120694@qq.com
 * @Date: 2024-05-01 18:32:57
 * @LastEditors: shenqi.lv 248120694@qq.com
 * @LastEditTime: 2024-05-01 18:33:35
 * @FilePath: \PeachyTalk-IM-SDK\lib\utils\common.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

/**
 * 生成唯一ID
 */
let sequence = 0
let preTime = 0
function generateRandomNumber() {
    return Math.floor(Math.random() * 900) + 100;
}
export function getCMsgId(): string {
    const curTime = Date.now()
    sequence++;
    if (curTime != preTime) {
        sequence = 0
    }
    preTime = curTime
    return `${generateRandomNumber()}${curTime}${sequence}`
}
