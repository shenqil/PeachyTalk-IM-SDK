<!--
 * @Author: shenqi.lv 248120694@qq.com
 * @Date: 2024-04-25 20:42:47
 * @LastEditors: shenqi.lv 248120694@qq.com
 * @LastEditTime: 2024-05-08 21:15:33
 * @FilePath: \PeachyTalk-IM-SDK\src\App.vue
 * @Description: 功能测试
-->
<template>
  <div>
    <a-card :bordered="false">
      <div>
        <a-input
          v-model:value="userId"
          addon-before="userId"
          class="common"
          style="width: 200px"
        />
        <a-input
          v-model:value="password"
          addon-before="password"
          class="common"
          style="width: 200px"
        />

        <a-button type="primary" class="common" @click="login">登录</a-button>
        <a-button type="primary" class="common" @click="logout">退出</a-button>
      </div>
    </a-card>

    <a-card title="消息" :bordered="false">
      <div>
        <a-input
          v-model:value="chatToId"
          addon-before="单聊对方ID:"
          class="common"
          style="width: 200px"
        />
        <a-input
          v-model:value="msgContent"
          addon-before="消息内容:"
          class="common"
          style="width: 200px"
        />
      </div>

      <div>
        <a-button type="primary" style="margin-left: 10px" @click="sendChatMsg"
          >发送单聊消息</a-button
        >
        <a-button
          type="primary"
          style="margin-left: 10px"
          @click="sendChatImgMsg"
          >发送单聊图片消息</a-button
        >
        <a-button
          type="primary"
          style="margin-left: 10px"
          @click="sendGropChatMsg"
          >发送群聊消息</a-button
        >
        <a-button
          type="primary"
          style="margin-left: 10px"
          @click="sendGropChatImgMsg"
          >发送群聊图片消息</a-button
        >
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, watch } from "vue";
import lib, { IChatType, IMsgTypeEnum } from "../lib/index";
import type { ChatSDK } from "../lib/index";
let chatSDK: ChatSDK;
let curConfig = {};

const userId = ref(window.location.hash.replace("#", ""));

const { password, myStore, login, logout } = useUser();
const {
  msgContent,
  chatToId,
  sendChatMsg,
  sendChatImgMsg,
  sendGropChatMsg,
  sendGropChatImgMsg,
} = useMsg();

function useUser() {
  const password = ref("");

  const myStore = {
    setItem: (key: any, value: any) => {
      if (userId.value) {
        curConfig[key] = value;
        window.localStorage.setItem(userId.value, JSON.stringify(curConfig));
      }
    },
    getItem: (key: any) => {
      return curConfig[key] || "";
    },
  };

  watch(
    userId,
    () => {
      window.location.hash = userId.value.toString();
      document.title = userId.value.toString();
      resetCfg();
    },
    { immediate: true }
  );

  watch(password, () => {
    myStore.setItem("password", password.value);
  });

  onBeforeMount(() => {
    chatSDK = lib.create({ appId: "appId" });
  });

  const login = async () => {
    try {
      const res = await chatSDK.login({
        userId: userId.value,
        token: password.value,
      });

      console.log("[im][test][login] 登录成功", res);
    } catch (error) {
      console.log("[im][test][login] 登录失败", error);
    }
  };

  const logout = () => {
    chatSDK.logout();

    console.log("[im][test][login] 退出登录成功");
  };

  return {
    password,
    myStore,
    login,
    logout,
  };
}

function useMsg() {
  const msgContent = ref("消息内容");
  const chatToId = ref("");

  watch([msgContent, chatToId], () => {
    myStore.setItem("msgContent", msgContent.value);
    myStore.setItem("chatToId", chatToId.value);
  });

  const sendChatMsg = async () => {
    try {
      const res = await chatSDK.sendMsg({
        to: chatToId.value,
        chatType: IChatType.CHAT,
        msgType: IMsgTypeEnum.TEXT,
        payload: `${Date.now()}-${msgContent.value}`,
      });

      console.log("[im][test][login] 消息发送成功", res);
    } catch (error) {
      console.log("[im][test][login] 消息发送失败", error);
    }
  };

  const sendChatImgMsg = () => {};

  const sendGropChatMsg = () => {};

  const sendGropChatImgMsg = () => {};

  return {
    msgContent,
    chatToId,
    sendChatMsg,
    sendChatImgMsg,
    sendGropChatMsg,
    sendGropChatImgMsg,
  };
}

function resetCfg() {
  if (userId.value) {
    try {
      const cfgStr = window.localStorage.getItem(userId.value);
      if (cfgStr) {
        curConfig = {
          ...curConfig,
          ...JSON.parse(cfgStr),
        };

        setTimeout(() => {
          password.value = curConfig["password"] || password.value;
          msgContent.value = curConfig["msgContent"] || msgContent.value;
          chatToId.value = curConfig["chatToId"] || chatToId.value;
        });
      }
    } catch (error) {
      console.error(error);
    }
  }
}
</script>

<style>
.common {
  margin: 5px;
}
</style>
