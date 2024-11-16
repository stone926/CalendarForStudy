<script setup>
import { Notebook, Calendar } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router'

const router = useRouter();
</script>
<template>
  <el-menu default-active="calendar" router>
    <el-menu-item index="calendar" :route="{ path: '/calendar' }">
      <el-icon><Calendar /></el-icon>
      <span>月历 Calendar</span>
    </el-menu-item>
    <el-menu-item index="study" :route="{ path: '/study' }">
      <el-icon><Notebook /></el-icon>
      <span>专注模式 Concentration</span>
    </el-menu-item>
  </el-menu>
</template>
<style scoped>
</style>