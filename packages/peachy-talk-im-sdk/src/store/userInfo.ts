/*
 * @Author: shenqi.lv 248120694@qq.com
 * @Date: 2024-05-08 20:27:34
 * @LastEditors: shenqi.lv 248120694@qq.com
 * @LastEditTime: 2024-05-08 20:35:24
 * @FilePath: \PeachyTalk-IM-SDK\lib\store\userInfo.ts
 * @Description: 保存用户信息
 */
interface IUserInfo {
    userId: string,
    token: string,
}

let userInfo: IUserInfo | undefined


export const setUserInfo = (info: IUserInfo | undefined) => {
    userInfo = Object.freeze(info)
}

export const getUserInfo = () => {
    return userInfo
}