<template>
	<header>
		<el-menu
			router
			unique-opened
			class="menu"
			mode="horizontal"
			text-color="#fff"
			active-text-color="#fff"
			background-color="#409EFF"
			:default-active="active"
		>
			<template v-for="(v, i) in menu">
				<el-sub-menu
					:index="`${i}`"
					v-if="Array.isArray(v.child) && v.child.length > 0"
				>
					<template #title>{{ v.name }}</template>
					<el-menu-item
						:index="vv.href"
						v-for="vv in v.child"
					>{{ vv.name }}</el-menu-item>
				</el-sub-menu>
				<el-menu-item
					:index="v.href"
					v-else
				>{{ v.name }}</el-menu-item>
			</template>
		</el-menu>

		<div
			class="submenu"
			v-if="toolbar.length > 0 || search.use"
		>
			<nav>
				<el-icon
					class="icon"
					:size="24"
					@click="onSubMenuOperate(v.event)"
					v-for="v in toolbar"
				>
					<component :is="v.icon"></component>
				</el-icon>
			</nav>

			<el-input
				clearable
				class="search"
				v-model="search.keyword"
				:placeholder="search.placeholder"
				@clear="onSubMenuSearch"
				@keyup.enter.native="onSubMenuSearch"
				v-if="search.use"
			>
				<template #append>
					<el-button
						:icon="Search"
						@click="onSubMenuSearch"
					/>
				</template>
			</el-input>
		</div>
	</header>
</template>

<style scoped lang="less">
.menu {
	height: 26px;
	border-bottom: solid 1px #79bbff;
	margin-bottom: 4px;
}

.submenu {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 4px 12px 12px 12px;
	background: white;

	nav {
		font-size: 0;
		box-sizing: border-box;

		.icon {
			cursor: pointer;
			border-radius: 50%;
			padding: 2px;

			&:hover {
				color: #79bbff;
			}
		}
	}

	.search {
		width: 246px;
	}

}
</style>


<script setup lang="ts">
import * as Vue from 'vue'
import * as VueRouter from 'vue-router'
import { Search } from '@element-plus/icons-vue'

import * as Menu from '../menu'

import * as Event from '@/event.js'

interface SearchItem {
	use: boolean
	keyword: string
	placeholder: string
}

const route = VueRouter.useRoute()

const active = Vue.ref('')
const menu = Vue.ref(Menu.default)
const toolbar = Vue.ref<Array<Menu.ToolbarItem>>([])
const search = Vue.reactive<SearchItem>({ use: false, keyword: '', placeholder: '' })


const onSubMenuOperate = (event: keyof Event.MenuEvent) => {
	Event.menu.emit(event, '')
	Event.menu.emit('onSubMenuOperate', event)

}

const onSubMenuSearch = () => {
	Event.menu.emit('onSubMenuSearch', search.keyword)

}


const onMenuRefresh = (path: string) => {
	active.value = path
	toolbar.value = []

	search.use = false
	search.keyword = ''
	search.placeholder = ''

	for (let v of Menu.default) {
		if (
			v.href === path
			&& Array.isArray(v.toolbar)
		) {
			toolbar.value = v.toolbar

			if (v.search === true) {
				search.use = true

			}

			if (typeof v.search === 'string') {
				search.use = true
				search.placeholder = v.search

			}

			break

		}

		if (
			Array.isArray(v.child)
		) {
			let item = v.child.find(vv => vv.href === path)

			if (
				item
				&& Array.isArray(item.toolbar)
			) {
				toolbar.value = item.toolbar

				if (item.search === true) {
					search.use = true

				}

				if (typeof item.search === 'string') {
					search.use = true
					search.placeholder = item.search

				}

				break

			}

		}


	}

}

Event.menu.on('onSubMenuRefresh', onMenuRefresh)

onMenuRefresh(route.path)

</script>
