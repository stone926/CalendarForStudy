<script setup>
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
function toBoyaList() {
	router.push("/boya");
}
function toProfile() {
	router.push("/profile");
}
function toCourseList() {
	router.push("/");
}
</script>

<template>
	<div class="top">
		<div class="top-item" @click="toProfile">个人空间</div>
		<div class="top-item" @click="toCourseList">课表选课</div>
		<div class="top-item" @click="toBoyaList">博雅选课</div>
	</div>
	<h1 class="head">AAUB选课系统</h1>
</template>

<style scoped lang="less">
.top {
	display: flex;
	justify-content: space-between;
	width: 80%;
}
.top-item {
	flex: 0.32;
	.flex-and-center();
	width: 10%;
	border-radius: 8px;
	background-color: var(--buaa-dark-blue);
	color: white;
	.content-font-size();
	height: @content-font-size+1.5rem;
}
.head {
	color: white;
	width: 80%;
	height: 70px;
	.flex-and-center();
	justify-content: center;
	border-radius: 8px;
	background-color: var(--buaa-dark-blue);
	margin: 0px;
	margin-top: 10px;
}
</style>
