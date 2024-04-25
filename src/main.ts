import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
// 新增代码：引入全部组件及样式
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css';

import * as Sentry from "@sentry/browser";

Sentry.init({
    dsn: "https://a098c609bb26708e3b069fcc3e0dfa8d@o4507144803713024.ingest.de.sentry.io/4507144808890448",

    // Alternatively, use `process.env.npm_package_version` for a dynamic release version
    // if your build tool supports it.
    release: "my-project-name@2.3.12",
    integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration(),
    ],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,

    // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],

    // Capture Replay for 10% of all sessions,
    // plus for 100% of sessions with an error
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
});

// Set user information, as well as tags and further extras
Sentry.setExtra('battery', 0.7);
Sentry.setTag('user_mode', 'admin');
Sentry.setUser({ id: '4711' });

// Add a breadcrumb for future events
Sentry.addBreadcrumb({
    message: 'My Breadcrumb',
    // ...
});

// Capture exceptions, messages or manual events
Sentry.captureMessage('Hello, world!');
Sentry.captureException(new Error('Good bye'));
Sentry.captureEvent({
    message: 'Manual',
});


const app = createApp(App);
app.use(Antd).mount("#app");