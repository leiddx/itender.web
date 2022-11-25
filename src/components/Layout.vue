<template>
	<Header></Header>

	<main>
		<router-view></router-view>
	</main>
</template>

<style lang="less">
body {
	background: #dbecff;
}

main {
	background: white;
	box-sizing: border-box;
	// margin-top: 8px;
}
</style>


<script setup lang="ts">
import Header from './Header.vue'


</script>
