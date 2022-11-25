<template>
	<el-config-provider size="small">
		<Layout />
	</el-config-provider>
</template>


<style lang="less">
html,
body {
	margin: 0;
	padding: 0;
	height: 100%;
	box-sizing: border-box;
	color: #353030;
	font-family: Arial, sans-serif, microsoft yahei, Microsoft YaHei,
		"\5FAE\8F6F\96C5\9ED1", Helvetica Neue, Helvetica,
		PingFang SC, Hiragino Sans GB;
}

#app {
	min-height: 100vh;
}
</style>


<script setup lang="ts">
import Axios from 'axios'

import * as Event from './Event.js'

import Layout from './components/Layout.vue'


interface AxiosInterceptorsRejectResponse {
	name: string
	message: string
	stack: Array<string>

}

Axios.interceptors.response.use(
	function (res) {
		return res

	},

	function (error) {
		if (error?.response?.data) {
			let { name, message } = error.response.data as AxiosInterceptorsRejectResponse

			let e = new Error(message)

			e.name = name

			return Promise.reject(e)
		}


		return Promise.reject(error)

	}



)


if (import.meta.env.VITE_API_BASE_URL) {
	Axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL

}


const onEmitEscape = function (e: KeyboardEvent) {
	if (e.key === 'Escape') {
		Event.keyup.emit('esc')

	}

}


document.addEventListener('keyup', onEmitEscape)

</script>
