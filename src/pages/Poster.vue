<template>
	<el-table :data="items">
		<el-table-column
			label="项目名称"
			prop="name"
		/>

		<el-table-column
			label="项目编号"
			prop="serial"
			width="214"
		/>

		<el-table-column
			label="发布单位"
			prop="release"
			width="244"
		/>

		<el-table-column
			label="分类"
			prop="category"
			width="112"
		/>

		<el-table-column
			align="center"
			label="状态"
			prop="state"
			width="88"
		/>

		<el-table-column
			label="预算金额"
			prop="estimate"
			width="108"
		/>

		<el-table-column
			label="最高限价"
			prop="limit"
			width="108"
		/>

		<el-table-column
			align="center"
			label="投标时间"
			width="148"
		>
			<template #default="scope">
				<span>{{ DateFormat(scope.row.delivery) }}</span>
			</template>
		</el-table-column>

		<el-table-column
			align="center"
			label="更新时间"
			width="148"
		>
			<template #default="scope">
				<span>{{ DateFormat(scope.row.updated) }}</span>
			</template>
		</el-table-column>

		<el-table-column
			fixed="right"
			width="60"
		>
			<template #default="scope">
				<el-button
					size="small"
					type="primary"
					@click="onUpdatePoster(scope.row)"
				>查看</el-button>
			</template>
		</el-table-column>
	</el-table>

	<el-pagination
		class="pagination"
		layout="prev, pager, next"
		:total="pagin.total"
		v-model:page-size="pagin.size"
		v-model:current-page="pagin.current"
		@current-change="onPaginCurrentChange"
	/>

	<el-drawer
		append-to-body
		direction="ltr"
		:size="view.size"
		:title="view.title"
		v-model="view.visible"
		@close="onPaginCurrentChange(1)"
	>
		<CreateTable
			v-model:loading="loading"
			@wait="onCreatePosterWait"
			@error="onCreatePosterError"
			@success="onCreatePosterSuccess"
			v-if="view.title === '导入表格'"
		/>

		<UpdatePoster
			v-model="view.value"
			v-if="view.value && view.title === '查看公告'"
		/>

		<template #footer>
			<el-button
				type="primary"
				:loading="loading"
				@click="onCreatePoster"
				v-if="view.title === '导入表格' && view.message === 'wait'"
			>开始导入</el-button>

			<el-button
				type="primary"
				:loading="loading"
				@click="onCreatePoster"
				v-if="view.title === '导入表格' && view.message === 'error'"
			>继续导入</el-button>

			<el-button
				type="danger"
				:loading="loading"
				@click="onDeletePoster"
				v-if="view.title === '查看公告'"
			>删除公告</el-button>
		</template>

	</el-drawer>


</template>

<style scoped lang="less">
.pagination {
	justify-content: flex-end;
}
</style>

<script lang="tsx" setup>
import * as Vue from 'vue'
import Moment from 'moment'
import * as Axios from 'axios'
import { ElMessage } from 'element-plus'

import * as Event from '@/event.js'
import * as Model from '@/model.js'

import * as PosterAPI from '@/apis/poster.js'

import CreateTable from './components/CreateTable.vue'
import UpdatePoster from './components/UpdatePoster.vue'


type Drawer = {
	size: string
	title: string
	message: '' | 'wait' | 'success' | 'error'
	visible: boolean
	value: null | Model.Poster
}

const loading = Vue.ref(false)

const search = Vue.reactive(
	{
		keyword: '',
	},

)

const pagin = Vue.reactive(
	{
		current: 1,
		size: 10,
		total: 0,
	},

)

const view = Vue.reactive<Drawer>(
	{
		size: '',
		title: '',
		message: '',
		visible: false,
		value: null,
	},

)


const items = Vue.ref<Model.Poster[]>([])

const onCloseDrawer = () => {
	view.size = ''
	view.title = ''
	view.message = ''
	view.visible = false
	view.value = null

	onPaginCurrentChange(1)
}

const onUpdatePoster = (v: Model.Poster) => {
	view.size = '74vw'
	view.title = '查看公告'
	view.message = ''
	view.visible = true
	view.value = v

}

const onUploadExcel = () => {
	view.size = '100vw'
	view.title = '导入表格'
	view.message = 'wait'
	view.visible = true
	view.value = null

}

const onCreatePoster = () => {
	loading.value = true

}

const onCreatePosterWait = () => {
	view.message = 'wait'

}

const onCreatePosterSuccess = () => {
	view.message = 'success'

}

const onCreatePosterError = () => {
	view.message = 'error'

}

const onDeletePoster = async () => {
	loading.value = true

	try {
		await PosterAPI.Delete(view.value!.id)

		onCloseDrawer()
	}

	catch (e) {
		if (e instanceof Error) {
			ElMessage.error(e.message)

		}

		if (e instanceof Axios.AxiosError) {
			ElMessage.error(e.response?.data.message || '未知错误')

		}

	}

	loading.value = false

}

const onSearch = async (keyword: string) => {
	search.keyword = keyword

	onPaginCurrentChange(1)

}

const onPaginCurrentChange = async (page: number) => {
	pagin.current = page

	await PagingReadPoster()

}

const PagingReadPoster = async () => {
	let limit = pagin.size
	let skip = (pagin.current - 1) * pagin.size

	let params = { limit, skip, ...search }

	let res = await PosterAPI.PagingRead(params)

	items.value = res.data
	pagin.total = Number(res.headers['x-total-count'] || 0)
}

const DateFormat = (v: string) => {
	if (!v.includes('T')) {
		v = v.replace('+', 'T00:00:00+')

	}

	return Moment(v).format('YYYY-MM-DD HH:mm')

}

Vue.onMounted(PagingReadPoster)

Event.menu.on('P.A.CirclePlus', onUploadExcel)
Event.menu.on('onSubMenuSearch', onSearch)

</script>
