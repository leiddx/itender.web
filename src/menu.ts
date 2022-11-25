import * as Vue from 'vue'
import type { Ref } from 'vue'
import { CirclePlus } from '@element-plus/icons-vue'

import * as Event from './event.js'

export interface ToolbarItem {
	icon: Ref
	event: keyof Event.MenuEvent
}

export interface SubMenuItem {
	name: string
	href: string
	toolbar?: Array<ToolbarItem>
	search?: string | boolean
}

export interface MenuItem {
	name: string
	href?: string
	child?: Array<SubMenuItem>
	toolbar?: Array<ToolbarItem>
	search?: string | boolean
}

const Menu: Array<MenuItem> = [
	{
		name: 'P.公告管理',
		href: '/poster',
		search: '请输入关键字',
		toolbar: [
			{
				icon: Vue.shallowRef(CirclePlus), event: 'P.A.CirclePlus',
			},

		],

	},

]

export default Menu