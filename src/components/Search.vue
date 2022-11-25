<template>
	<el-form
		ref="form"
		class="form"
		:model="model"
		v-bind="attrs"
	>
		<el-input
			class="input"
			placeholder="请输入关键词"
			@keyup.enter="onSearch"
			v-model="keyword"
		>
			<template #suffix>
				<el-icon
					class="icon"
					@click="onOpen"
				>
					<Operation />
				</el-icon>
			</template>

			<template #append>
				<el-button
					class="search"
					@click="onSearch"
				>
					<el-icon>
						<Search />
					</el-icon>
				</el-button>
			</template>
		</el-input>


		<div
			class="advanced"
			v-if="isopen"
		>
			<slot />

			<div class="op">
				<el-button
					type="danger"
					@click="onClear"
				>
					<span>清空</span>
				</el-button>

				<el-button
					type="primary"
					@click="onSearch"
				>
					<span>查询</span>
				</el-button>


			</div>
		</div>

	</el-form>

</template>

<style scoped lang="less">
.form {
	position: relative;
	width: 500px;

	.input {
		height: 28px;
	}

	.icon {
		font-size: 18px;
		cursor: pointer;

		&:hover {
			color: #71BFFF;
		}
	}

	.search {
		display: flex;
		align-items: center;
		font-size: 18px;
	}

	.advanced {
		position: absolute;
		right: 0;
		min-width: 100%;
		box-sizing: border-box;
		z-index: 99;
		padding: 12px;
		background-color: #fff;
		box-shadow: 0 -1px 0 0 #dcdfe6 inset, 1px 0 0 0 #dcdfe6 inset, -1px 0 0 0 #dcdfe6 inset;

		.op {
			display: flex;
			justify-content: flex-end;
		}
	}

	:deep(.el-input__wrapper),
	:deep(.el-input-group__append) {
		border-radius: 0;
	}
}
</style>



<script setup lang="ts">
import * as Vue from 'vue'
import * as ElementPlus from 'element-plus'
import { Search, Operation } from '@element-plus/icons-vue'

type FormInstance = InstanceType<typeof ElementPlus.ElForm>

const form = Vue.ref<FormInstance>()

const keyword = Vue.ref('')
const isopen = Vue.ref(false)
const model = Vue.ref<ElementPlus.FormProps['model']>()

const attrs = Vue.useAttrs()

interface Emits {
	(event: 'search', value: Record<string, unknown>): void
	(event: 'clear'): void

}


const emits = defineEmits<Emits>()


const onSearch = async () => {
	if (form.value === undefined) {
		return

	}

	await form.value.validate()

	emits(
		'search', { keyword, ...model.value },

	)

}

const onClear = async () => {
	emits('clear')

}

const onOpen = () => {
	isopen.value = !isopen.value

}

</script>