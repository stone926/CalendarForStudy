<script setup>
import { h, computed, useTemplateRef, watch } from 'vue';
import { ElDivider } from 'element-plus';

const spacer = h(ElDivider, { direction: 'vertical' });
const cardRef = useTemplateRef("cardRef");
const { todo } = defineProps(["todo"]);
const labelClass = computed(() => {
  return finished.value ? "finished" : "";
})
const label = computed(() => {
  return finished.value ? "恭喜完成！" : "完成度";
})
const goalStudyHours = computed(() => {
  return parseInt(todo.goal.study.split(":")[0]);
})
const goalStudyMinutes = computed(() => {
  return parseInt(todo.goal.study.split(":")[1]);
})
const goalBreakHours = computed(() => {
  return parseInt(todo.goal.break.split(":")[0]);
})
const goalBreakMinutes = computed(() => {
  return parseInt(todo.goal.break.split(":")[1]);
})
const goalT = computed(() => {
  return todo.goal.T;
});
const currentStudyHours = computed(() => {
  return parseInt(todo.current.study.split(":")[0]);
})
const currentStudyMinutes = computed(() => {
  return parseInt(todo.current.study.split(":")[1]);
})
const currentBreakHours = computed(() => {
  return parseInt(todo.current.break.split(":")[0]);
})
const currentBreakMinutes = computed(() => {
  return parseInt(todo.current.break.split(":")[1]);
})
const currentT = computed(() => {
  return todo.current.T;
});
const finished = computed(() => {
  return currentT.value >= goalT.value;
})
</script>
<template>
  <el-card ref="cardRef">
    <template #header>
      {{ todo.todo }}
    </template>
    <template #default>
      <el-descriptions border>
        <el-descriptions-item width="25%" label="目标" align="center">
          <el-space direction="vertical" :size="3">
            <span>如此进行{{ goalT }}个循环</span>
            <span>每学习{{ goalStudyHours > 0 ? `${goalStudyHours}小时` : '' }}{{ goalStudyMinutes }}分钟</span>
            <span>休息{{ goalBreakHours > 0 ? `${goalBreakHours}小时` : '' }}{{ goalBreakMinutes }}分钟</span>
          </el-space>
        </el-descriptions-item>
        <el-descriptions-item width="25%" :label="label" :label-class-name="labelClass" align="center">
          <el-space :spacer="spacer">
            <el-space direction="vertical" :size="3">
              <span>已完成{{ currentT }}个循环</span>
              <span>余学习{{ currentStudyHours > 0 ? `${currentStudyHours}小时` : '' }}{{ currentStudyMinutes }}分钟</span>
              <span>余休息{{ currentBreakHours > 0 ? `${currentBreakHours}小时` : '' }}{{ currentBreakMinutes }}分钟</span>
            </el-space>
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