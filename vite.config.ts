import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig(({ mode, command }) => {
  return {
    plugins: [vue()],
    resolve: {
      //路径别名
      alias: {
        "@": resolve(__dirname, "./lib"),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 8008, //设置服务启动端口号
      open: true, //设置服务启动时是否自动打开浏览器
      proxy: {
        "/api": {
          // 匹配请求路径，localhost:3000/snow
          // target: 'http://10.1.104.137:8100', // 代理的目标地址
          target: "https://test1-imapi-gw.nn.com", // 代理的目标地址
          changeOrigin: true, // 开发模式，默认的origin是真实的 origin:localhost:3000 代理服务会把origin修改为目标地址
          // secure: true, // 是否https接口
          // ws: true, // 是否代理websockets
          // rewrite target目标地址 + '/abc'，如果接口是这样的，那么不用重写
          // rewrite: (path) => path.replace("/api/imapi/", "")//重写路径,替换/api
        },
        "/nim/app/v1": {
          target: "https://test1-opapi.nn.com", // 代理的目标地址
          changeOrigin: true, // 开发模式，默认的origin是真实的 origin:localhost:3000 代理服务会把origin修改为目标地址
          // secure: true, // 是否https接口
          // ws: true, // 是否代理websockets
          // rewrite target目标地址 + '/abc'，如果接口是这样的，那么不用重写
          // rewrite: (path) => path.replace("/api/imapi/", "")//重写路径,替换/api
        },
      },
    },
    build: {
      lib: {
        entry: "./lib/index.ts",
        name: "PeachyTalk-IM-SDK",
        fileName: "index",
      },
      rollupOptions: {
        external: ["axios"],
        output: {
          globals: {
            LeiGod: "PeachyTalk-IM-SDK",
          },
        },
      },
      sourcemap: true,
    },
  }
});
