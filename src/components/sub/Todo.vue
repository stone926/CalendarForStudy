<script setup>
import moment from 'moment';
import { computed, onBeforeMount, reactive, watch, h } from 'vue';
import { concentrationStore } from "@/data/store.js"
import Count from "./TodoCardCount.vue";
import Cycle from "./TodoCardCycle.vue";
import Timing from './TodoCardTiming.vue';
import { useRouter } from 'vue-router';
import { ElDivider } from 'element-plus';

const router = useRouter();
const emit = defineEmits(["concentrate"]);
const current = { moment: null, year: -1, month: -1, day: -1 };
onBeforeMount(() => {
  current.moment = moment();
  const year = current.moment.year().toString();
  const month = (parseInt(current.moment.month()) + 1).toString();
  const day = current.moment.date().toString();
  current.year = year;
  current.month = month;
  current.day = day;
})
const todayTodoList = computed(() => {
  return concentrationStore.concentration?.[current.year]?.[current.month]?.[current.day] ?? [];
});
function handlePlus(index) {
  concentrationStore.concentration[current.year][current.month][current.day][index].current.count++;
}
function handleMinus(index) {
  if (concentrationStore.concentration[current.year][current.month][current.day][index].current.count > 0) {
    concentrationStore.concentration[current.year][current.month][current.day][index].current.count--;
  }
}
function handleConcentrate(index) {
  router.push({ path: "/study/concentrate", query: { index } });
  emit("concentrate");
}
const form = reactive({
  mode: "timing",
  todo: "",
  goal: {},
  current: {}
});
function addTodo() {
  switch (form.mode) {
    case "cycle":
      form.current.study = "0:00";
      form.current.break = "0:00";
      form.current.T = 0;
      break;
    case "count":
      form.current.count = 0;
      break;
    case "timing":
      form.current.time = "0:00";
      break;
    default:
  };
  concentrationStore.concentration?.[current.year]?.[current.month]?.[current.day]
  if (!concentrationStore.concentration[current.year]) {
    concentrationStore.concentration[current.year] = {};
  }
  if (!concentrationStore.concentration[current.year][current.month]) {
    concentrationStore.concentration[current.year][current.month] = {};
  }
  if (!concentrationStore.concentration[current.year][current.month][current.day]) {
    concentrationStore.concentration[current.year][current.month][current.day] = [];
  }
  concentrationStore.concentration[current.year][current.month][current.day].push({
    mode: form.mode,
    todo: form.todo,
    goal: form.goal,
    current: form.current
  });
  form.mode = "timing";
  form.todo = "";
  form.goal = {};
  form.current = {};
}
</script>
<template>
  <div class="todo-list">
    <el-container>
      <el-header>
        <h2>专注计划</h2>
      </el-header>
      <el-main>
        <el-text v-if="todayTodoList.length == 0">今日无专注计划</el-text>
        <div v-for="(item, index) in todayTodoList" class="todo-list-item">
          <Count v-if="item.mode === 'count'" :todo="item" @plus="handlePlus(index)" @minus="handleMinus(index)">
          </Count>
          <Cycle v-else-if="item.mode === 'cycle'" :todo="item" @concentrate="handleConcentrate(index)"></Cycle>
          <Timing v-else-if="item.mode === 'timing'" :todo="item" @concentrate="handleConcentrate(index)"></Timing>
        </div>
      </el-main>
      <el-footer>
        <el-form :model="form" label-width="auto">
          <el-form-item label="事项名称">
            <el-input v-model="form.todo" placeholder="想干点什么？" />
          </el-form-item>
          <el-form-item label="模式">
            <el-select v-model="form.mode">
              <el-option label="循环" value="cycle" />
              <el-option label="计数" value="count" />
              <el-option label="计时" value="timing" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="form.mode === 'count'" label="目标次数">
            <el-input-number v-model="form.goal.count" />
          </el-form-item>
          <el-space v-else-if="form.mode === 'cycle'" size="large" wrap>
            <el-form-item label="学习时长">
              <el-time-picker value-format="HH:mm" format="HH:mm" v-model="form.goal.study" />
            </el-form-item>
            <el-form-item label="休息时长">
              <el-time-picker value-format="HH:mm" format="HH:mm" v-model="form.goal.break" />
            </el-form-item>
            <el-form-item label="循环次数">
              <el-input-number v-model="form.goal.T" :min="1" />
            </el-form-item>
          </el-space>
          <el-form-item label="学习时长" v-else>
            <el-time-picker value-format="HH:mm" format="HH:mm" v-model="form.goal.time" />
          </el-form-item>
          <el-form-item>
            <el-button @click="addTodo">添加任务</el-button>
          </el-form-item>
        </el-form>
      </el-footer>
    </el-container>
  </div>
</template>
<style lang="scss" scoped>
.todo-list {
  .todo-list-item {
    :deep(.el-card) {
      margin-bottom: 10px;
    }

    :deep(.el-card__header) {
      display: flex;
      justify-content: center;
    }
  }

  .todo-list-item:last-child {
    :deep(.el-card) {
      margin-bottom: 0;
    }
  }
}

.el-footer {
  height: fit-content;
}
</style>