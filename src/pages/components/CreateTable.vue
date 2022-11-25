<template>
	<el-auto-resizer style="height: 500px;">
		<template #default="{ height, width }">
			<el-table-v2
				ref="itable"
				:width="width"
				:height="height"
				:data="items"
				:columns="columns"
			/>

		</template>
	</el-auto-resizer>

	<UploadExcel
		:disabled="loading"
		@upload="onCheckExcel"
	/>

	<span class="tip">共{{ items.length }}条，已导入{{ upload }}条，当前第{{ index }}条</span>

	<el-alert
		type="error"
		:title="error.message"
		v-if="error.message && error.message !== 'success'"
	/>

	<el-alert
		type="success"
		title="导入完成"
		v-if="error.message && error.message === 'success'"
	/>

</template>

<style scoped lang="less">
.tip {
	display: flex;
	line-height: 1;
	margin: 8px 0 24px 4px;
	font-size: 12px;
}
</style>

<script lang="tsx" setup>
import * as Vue from 'vue'
import Moment from 'moment'
import * as ElementPlus from 'element-plus'
import { CircleCheck, CircleClose } from '@element-plus/icons-vue'


import * as PosterAPI from '@/apis/poster.js'

import UploadExcel from './UploadExcel.vue'

type CreateParams = { index: number, process: 'wait' | 'done' | 'error' } & PosterAPI.CreateParams

type Props = {
	loading: boolean
}

const props = withDefaults(
	defineProps<Props>(),

	{ loading: false }

)

type Emits = {
	(event: 'update:loading', value: boolean): void

	(event: 'wait'): void
	(event: 'error'): void
	(event: 'success'): void
}

const emits = defineEmits<Emits>()

const loading = Vue.ref(false)

const upload = Vue.ref(0)
const error = Vue.reactive(
	{ index: 0, message: '' }
)

const items = Vue.ref<CreateParams[]>([])
const itable = Vue.ref<ElementPlus.TableV2Instance>()

const index = Vue.computed(
	() => Math.min(items.value.length > 0 ? error.index + 1 : 0, items.value.length)

)


const columns: ElementPlus.Columns<CreateParams> = [
	{
		key: 'index',
		dataKey: 'index',
		title: '序号',
		width: 55,
	},
	{
		key: 'name',
		dataKey: 'name',
		title: '项目名称',
		width: 778,
	},

	{
		key: 'serial',
		dataKey: 'serial',
		title: '项目编号',
		width: 244,
	},

	{
		key: 'release',
		dataKey: 'release',
		title: '发布单位',
		width: 244,
	},

	{
		key: 'category',
		dataKey: 'category',
		title: '分类',
		width: 112,
	},

	{
		key: 'state',
		dataKey: 'state',
		title: '状态',
		width: 88,
	},

	{
		key: 'estimate',
		dataKey: 'estimate',
		title: '预算金额',
		width: 108,
	},

	{
		key: 'limit',
		dataKey: 'limit',
		title: '最高限价',
		width: 108,
	},


	{
		key: 'delivery',
		dataKey: 'delivery',
		title: '投标时间',
		width: 148,
		cellRenderer: (params) => {
			let value = ''

			if (params.cellData instanceof Date) {
				value = Moment(params.cellData).format('YYYY-MM-DD HH:mm')

			}

			return <span>{ value }</span>

		},
	},

	{
		key: 'updated',
		dataKey: 'updated',
		title: '更新时间',
		width: 148,
		cellRenderer: (params) => {
			let value = ''

			if (params.cellData instanceof Date) {
				value = Moment(params.cellData).format('YYYY-MM-DD HH:mm')

			}

			return <span>{ value }</span>

		},
	},

	{
		key: 'process',
		dataKey: 'process',
		title: '',
		width: 60,
		cellRenderer: (params) => {
			if (typeof params.cellData === 'string' && params.cellData === 'done') {
				return <el-icon style="color:#67C23A"><CircleCheck /></el-icon>
			}

			if (typeof params.cellData === 'string' && params.cellData === 'error') {
				return <el-icon style="color:#F56C6C"><CircleClose /></el-icon>

			}

			return <el-icon style="color:#b1b3b8"><CircleCheck /></el-icon>

		},
	},


]


const onCheckExcel = (value: Array<PosterAPI.CreateParams>) => {
	error.index = 0
	error.message = ''

	upload.value = 0

	items.value = value.map(
		(v, i) => ({ ...v, index: i + 1, process: 'wait' })

	)

	emits('wait')

}

const CreatePoster = async () => {
	for (
		let d of items.value.slice(error.index)

	) {
		if (d.process === 'wait') {
			await PosterAPI.Create(d)

			d.process = 'done'

		}

		error.index = error.index + 1

		itable.value?.scrollTo(
			{ scrollTop: Number(error.index) * 50 }

		)

		upload.value = upload.value + 1


	}

	error.message = 'success'

	emits('success')


}

const SafeCreatePoster = async () => {
	if (error.message) {
		error.message = ''
		error.index = error.index + 1

	}

	loading.value = true

	try {
		await CreatePoster()

	}

	catch (e) {
		items.value[error.index].process = 'error'

		if (e instanceof Error) {
			error.message = e.message

		}

		emits('error')

	}

	loading.value = false

	emits('update:loading', false)
}

Vue.watch(
	() => props.loading,

	async value => {
		if (value) {
			await SafeCreatePoster()

		}


	}

)

</script>
