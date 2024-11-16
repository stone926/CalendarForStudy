<script setup>
import { h, computed, onMounted, useTemplateRef, watch, ref } from 'vue';
import { ArrowUpBold, ArrowDownBold } from "@element-plus/icons-vue";
import { ElDivider } from 'element-plus';

const spacer = h(ElDivider, { direction: 'vertical' });
const { todo } = defineProps(["todo"]);
const cardRef = useTemplateRef("cardRef");
const finished = computed(() => {
  return todo.current.count >= todo.goal.count;
});
const labelClass = computed(() => {
  return finished.value ? "finished" : "";
})
const label = computed(() => {
  return finished.value ? "恭喜完成！" : "完成度";
})
</script>
<template>
  <el-card ref="cardRef">
    <template #header>{{ todo.todo }}</template>
    <template #default>
      <el-descriptions border>
        <el-descriptions-item width="25%" label="目标" align="center">{{ todo.goal.count }}</el-descriptions-item>
        <el-descriptions-item width="25%" :label="label" align="center" :label-class-name="labelClass">
          <el-space :spacer="spacer">
          <span>{{ todo.current.count }}</span>
          <el-tooltip placement="top" content="点击以+1">
            <el-button :icon="ArrowUpBold" type="default" @click="$emit('plus')" text bg></el-button>
          </el-tooltip>
          <el-tooltip placement="top" content="点击以-1">
            <el-button :icon="ArrowDownBold" type="default" @click="$emit('minus')" text bg></el-button>
          </el-tooltip>
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