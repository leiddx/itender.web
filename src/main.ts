import * as Vue from 'vue'
import * as VueRouter from 'vue-router'

import 'moment/dist/locale/zh-cn'

import 'nprogress/nprogress.css'
import * as NProgress from 'nprogress'

import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'
import ElementPlusLocale from 'element-plus/es/locale/lang/zh-cn'

import App from './App.vue'
import Router from './router.js'
import * as Event from './event.js'


const router = VueRouter.createRouter(
	{
		routes: Router,
		history: VueRouter.createWebHashHistory(),
	},

)

router.beforeEach(
	to => {
		NProgress.start()

		Event.menu.emit('onSubMenuRefresh', to.path)


	},
)

router.afterEach(
	() => {
		NProgress.done()

	},

)

const app = Vue.createApp(App)

app.use(router)
app.use(
	ElementPlus, { locale: ElementPlusLocale },

)

app.mount('#app')