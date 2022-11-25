<template>
	<el-form
		ref="form"
		:model="modelValue"
		label-position="top"
	>
		<el-row :gutter="24">
			<el-col :span="8">
				<el-form-item
					label="项目名称"
					prop="name"
				>
					<InputPopover
						:value="modelValue.name"
						@confirm="onUpdatePoster"
					>
						<el-input v-model="modelValue.name" />
					</InputPopover>
				</el-form-item>

				<el-form-item
					label="项目编号"
					prop="serial"
				>
					<InputPopover
						:value="modelValue.serial"
						@confirm="onUpdatePoster"
					>
						<el-input v-model="modelValue.serial" />
					</InputPopover>
				</el-form-item>

				<el-form-item
					label="发布单位"
					prop="release"
				>
					<InputPopover
						:value="modelValue.release"
						@confirm="onUpdatePoster"
					>
						<el-input v-model="modelValue.release" />
					</InputPopover>
				</el-form-item>

				<el-form-item
					label="分类"
					prop="category"
				>
					<InputPopover
						:value="modelValue.category"
						@confirm="onUpdatePoster"
					>
						<el-input v-model="modelValue.category" />
					</InputPopover>
				</el-form-item>

				<el-form-item
					label="状态"
					prop="state"
				>
					<InputPopover
						:value="modelValue.state"
						@confirm="onUpdatePoster"
					>
						<el-input v-model="modelValue.state" />
					</InputPopover>
				</el-form-item>

				<el-form-item
					label="预算金额"
					prop="estimate"
				>
					<InputPopover
						:value="modelValue.estimate"
						@confirm="onUpdatePoster"
					>
						<el-input-number
							:min="0"
							size="small"
							controls-position="right"
							v-model="modelValue.estimate"
						/>
					</InputPopover>
				</el-form-item>

				<el-form-item
					label="最高限价"
					prop="limit"
				>
					<InputPopover
						:value="modelValue.limit"
						@confirm="onUpdatePoster"
					>
						<el-input-number
							:min="0"
							size="small"
							controls-position="right"
							v-model="modelValue.limit"
						/>
					</InputPopover>
				</el-form-item>

				<el-form-item
					label="投标时间"
					prop="delivery"
				>
					<InputPopover
						:format="DateFormat"
						:value="modelValue.delivery"
						@confirm="onUpdatePoster"
					>
						<el-date-picker
							type="datetime"
							:editable="false"
							:clearable="false"
							placeholder="请选择投标时间"
							format="YYYY-MM-DD HH:mm"
							v-model="modelValue.delivery"
						/>
					</InputPopover>
				</el-form-item>
			</el-col>

			<el-col :span="16">
				<el-form-item
					label="项目内容"
					prop="body"
				>
					<InputPopover
						:width="880"
						@confirm="onUpdatePoster"
					>
						<template #reference>
							<el-input
								readonly
								:rows="40"
								type="textarea"
								v-model="modelValue.body"
							/>
						</template>

						<el-input
							:rows="40"
							type="textarea"
							placeholder="请输入项目内容"
							v-model="modelValue.body"
						/>

					</InputPopover>
				</el-form-item>

			</el-col>
		</el-row>

	</el-form>

</template>

<style scoped lang="less">

</style>

<script setup lang="ts">
import Moment from 'moment'

import * as Model from '@/model.js'

import * as PosterAPI from '@/apis/poster.js'

import InputPopover from '@/components/InputPopover.vue'

type Props = {
	modelValue: Model.Poster

}

const props = defineProps<Props>()


type Emits = {
	(event: 'update:modelValue', value: Model.Poster): void

}

const emits = defineEmits<Emits>()

const DateFormat = (v: string) => Moment(v).format('YYYY-MM-DD HH:mm')


const onUpdatePoster = async () => {
	let { id } = props.modelValue

	let params = { ...props.modelValue, updated: new Date() }

	await PosterAPI.Update(id, params)

	emits('update:modelValue', props.modelValue)

}

</script>
