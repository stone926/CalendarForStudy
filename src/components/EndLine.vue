<script setup></script>
<template>
	<hr class="end-line" />
</template>
<style scoped>
.end-line {
	width: 60%;
	border: none;
	border-top: 4px double black;
	color: black;
	overflow: visible;
	text-align: center;
	height: 5px;
  margin-top: 20px;
}
.end-line::after {
	background: #fff;
	content: "已经到底了";
	padding: 0 4px;
	position: relative;
	top: -13px;
}
</style>
