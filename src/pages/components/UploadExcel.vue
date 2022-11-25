<template>
	<el-upload
		drag
		class="upload"
		accept=".xlsx,.xls"
		:disabled="disabled"
		:before-upload="onParseExcel"
	>
		<el-icon class="el-icon--upload">
			<upload-filled />
		</el-icon>

		<div class="el-upload__text">
			<span>拖动文件至此处或</span><em>点击选择文件</em>
		</div>

	</el-upload>
</template>
  
<script setup lang="ts">
import Moment from 'moment'
import * as XLSX from 'xlsx'
import { UploadFilled } from '@element-plus/icons-vue'

import * as PosterAPI from '@/apis/poster.js'

type Item = {
	'分类': string
	'状态': string
	'项目名称': string
	'项目编号': string
	'发布单位': string
	'预算金额': number
	'最高限价': number
	'投标时间': Date
	'项目概括': string
	'内容': string
	'更新时间': string
}

type Props = {
	disabled?: boolean

}

const props = defineProps<Props>()


type Emits = {
	(event: 'upload', value: Array<PosterAPI.UpdateParams>): void

}

const emits = defineEmits<Emits>()

const ToString = (v: unknown) => `${v || ''}`.trim()
const ToNumber = (v: unknown) => Number(v) || 0
const ToDate = (v: Moment.MomentInput) => Moment(v).toDate()

const Map = (item: Item): PosterAPI.UpdateParams => {
	let category = ToString(item['分类'])
	let state = ToString(item['状态'])
	let name = ToString(item['项目名称'])
	let serial = ToString(item['项目编号'])
	let release = ToString(item['发布单位'])
	let estimate = ToNumber(item['预算金额'])
	let limit = ToNumber(item['最高限价'])
	let delivery = ToDate(item['投标时间'])
	let belike = ToString(item['项目概括'])
	let body = ToString(item['内容'])
	let updated = ToDate(item['更新时间'])

	return {
		category, state, name, serial, release,
		estimate, limit, delivery,
		belike, body, updated,

	}

}

const Filter = (v: PosterAPI.UpdateParams) => {
	return v.category && v.state && v.name && v.serial && v.release && v.belike && v.body && v.updated

}

const onParseExcel = async (file: File) => {
	let data = await file.arrayBuffer();

	let workbook = XLSX.read(data, { cellDates: true });

	let [a] = workbook.SheetNames;

	const worksheet = workbook.Sheets[a]
	const results = XLSX.utils.sheet_to_json<Item>(worksheet)

	emits(
		'upload',

		results.map(Map).filter(Filter)

	)

	return false

}

</script>