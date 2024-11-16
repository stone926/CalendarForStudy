<script setup>
import { h, computed, watch, useTemplateRef } from 'vue';
import { ElDivider } from 'element-plus';

const spacer = h(ElDivider, { direction: 'vertical' });
const cardRef = useTemplateRef("cardRef");
const { todo } = defineProps(["todo"]);
const labelClass = computed(() => {
  return finished.value ? "finished" : "";
});
const label = computed(() => {
  return finished.value ? "恭喜完成！" : "完成度";
});
const goalHours = computed(() => {
  return parseInt(todo.goal.time.split(":")[0])
});
const goalMinutes = computed(() => {
  return parseInt(todo.goal.time.split(":")[1])
});
const currentHours = computed(() => {
  return parseInt(todo.current.time.split(":")[0])
});
const currentMinutes = computed(() => {
  return parseInt(todo.current.time.split(":")[1])
});
const finished = computed(() => {
  if (currentHours.value > goalHours.value) {
    return true;
  } else if (currentHours.value == goalHours.value) {
    return currentMinutes.value >= goalMinutes.value;
  } else {
    return false;
  }
});
</script>
<template>
  <el-card ref="cardRef">
    <template #header>
      {{ todo.todo }}
    </template>
    <template #default>
      <el-descriptions border>
        <el-descriptions-item width="20%" label="目标" align="center">
          {{ goalHours }} 小时
          {{ goalMinutes }} 分钟
        </el-descriptions-item>
        <el-descriptions-item width="20%" :label="label" align="center" :label-class-name="labelClass">
          <el-space :spacer="spacer">
            <span>
              {{ currentHours }} 小时
              {{ currentMinutes }} 分钟
            </span>
            <el-button type="default" @click="$emit('concentrate')" v-if="!finished">开始专注</el-button>
          </el-space>
        </el-descriptions-item>
      </el-descriptions>
    </template>
  </el-card>
</template>
<style lang="scss" scoped>
:deep(.finished) {
  background: var(--el-color-success-light-9) !important;
  color: var(--el-color-success) !important;
}

:deep(.header-finished) {
  background: var(--el-color-success-light-9) !important;
  color: var(--el-color-success) !important;
}
</style>