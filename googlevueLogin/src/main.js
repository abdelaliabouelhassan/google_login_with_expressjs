import { createApp } from 'vue'
import './style.css'
import { createRouter, createWebHistory } from "vue-router";

import App from './App.vue'
import Login from './components/Login.vue'
import Profile from './components/Profile.vue'
import CallBack from './components/CallBack.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: Login },
        { path: '/profile', component: Profile },
        { path:'/callback', component: CallBack}
    ],
})



createApp(App).use(router).mount('#app')
