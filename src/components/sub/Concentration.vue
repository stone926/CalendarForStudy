<script setup>
import { onBeforeMount, computed, ref } from 'vue';
import { concentrationStore } from "@/data/store.js";
import Cycle from './ConcentrateCycle.vue';
import Timing from "./ConcentrateTiming.vue";
import moment from 'moment';

const { index } = defineProps(["index"]);
const current = { moment: null, year: -1, month: -1, day: -1 };
onBeforeMount(() => {
  current.moment = moment();
  const year = current.moment.year().toString();
  const month = (parseInt(current.moment.month()) + 1).toString();
  const day = current.moment.date().toString();
  current.year = year;
  current.month = month;
  current.day = day;
});
const todo = computed(() => {
  return concentrationStore.concentration?.[current.year]?.[current.month]?.[current.day]?.[index];
});
</script> 
<template>
<el-container>
  <el-header>
    <h1>{{ todo.todo }}</h1>
  </el-header>
  <el-main>
    <Cycle :todo="todo" :time="current" :index="index" v-if="todo.mode==='cycle'"></Cycle>
    <Timing :todo="todo" :time="current" :index="index" v-else-if="todo.mode==='timing'"></Timing>
  </el-main>
</el-container>
</template>
<style lang="scss" scoped>
* {
  color: white;
}
.el-header {
  display: flex;
  justify-content: center;
  height: fit-content;
  h1 {
    font-size: 45px !important;
  }
}
.el-main {
  display: flex;
  align-items: center;
  flex-direction: column;
}
.el-container {
  height: auto !important;
}
</style>