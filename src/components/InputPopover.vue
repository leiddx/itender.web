<template>
	<slot name="reference" />

	<el-popover
		:width="width"
		:visible="visible"
		placement="bottom-end"
		v-if="$slots.default"
	>
		<template #reference>
			<label
				class="label"
				@click="oneEditMode"
			>
				<span
					class="value"
					v-if="!$slots.reference"
				>{{ input }}</span>

				<el-icon class="icon">
					<EditPen />
				</el-icon>
			</label>
		</template>

		<slot />

		<div style="text-align: right; margin-top: 12px">
			<el-button
				type="info"
				@click="onCancel"
			>取消</el-button>

			<el-button
				type="primary"
				@click="onConfirm"
			>确认</el-button>
		</div>
	</el-popover>

	<span
		class="value"
		v-else
	>{{ input }}</span>

</template>

<style scoped lang="less">
.value {
	font-size: 14px;
	line-height: 1.2;
}

.label {
	line-height: 1;

	.icon {
		color: #909399;
		font-size: 12px;
		cursor: pointer;
		vertical-align: middle;
		margin-left: 4px;
		line-height: 1;
	}

}
</style>

<script setup lang="ts">
import * as Vue from 'vue'

import { EditPen } from '@element-plus/icons-vue'


type Props = {
	value: any
	format?: (v: any) => string
	width?: number
}


const props = withDefaults(
	defineProps<Props>(),

	{
		value: '',
		format: (v: any) => v,
		width: 420
	}

)

type Emits = {
	(e: 'confirm'): void
}

const emits = defineEmits<Emits>()


const origin = Vue.ref('')
const visible = Vue.ref(false)

const input = Vue.computed(
	() => {
		let value = visible.value ? origin.value : props.value

		return props.format(value)

	}

)


const onConfirm = () => {
	emits('confirm')

	visible.value = false

}

const onCancel = () => {
	visible.value = false

}

const oneEditMode = () => {
	visible.value = true
	origin.value = props.value

}

</script>
