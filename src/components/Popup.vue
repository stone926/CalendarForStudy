<script setup>
const props = defineProps(["type"]);
</script>
<template>
	<div :class="props.type">
    <slot />
  </div>
</template>
<style scoped>
div {
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  height:50px;
  width: 20%;
  position: fixed;
  top: 30px;
}
.success {
	background-color: rgb(14, 172, 14);
	color: white;
}
.fail {
	background-color: red;
	color: white;
}
.warn {
	background-color: yellow;
	color: black;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
