<script setup>
import { computed, ref } from 'vue';
const props = defineProps(["emergency"]);
const type = computed(() => {
  switch (props.emergency) {
    case 0: return "success";
    case 1: return "primary";
    case 2: return "warning";
    case 3: return "danger";
    default: return "primary";
  }
});
</script>
<template>
  <el-tag :type="type">
    <div class="tag-content">
      <slot name="default"></slot>
    </div>
    <div class="tag-time">
      <slot name="time"></slot>
    </div>
  </el-tag>
</template>
<style lang="scss" scoped>
.tag-content,
.tag-time {
  display: flex;
  justify-content: center;
  align-items: center;
}

.tag-time {
  font-size: 15px;
  line-height: 20px;
}
</style>