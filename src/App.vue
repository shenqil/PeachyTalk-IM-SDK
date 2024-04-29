<!--
 * @Author: shenqi.lv 248120694@qq.com
 * @Date: 2024-04-25 20:42:47
 * @LastEditors: shenqi.lv 248120694@qq.com
 * @LastEditTime: 2024-04-29 10:26:49
 * @FilePath: \PeachyTalk-IM-SDK\src\App.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
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
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, watch } from "vue";
import lib from "../lib/index";
import type { ChatSDK } from "../lib/index";
let chatSDK: ChatSDK;
let curConfig = {};

const userId = ref(window.location.hash.replace("#", ""));

const { password, myStore, login, logout } = useUser();

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
