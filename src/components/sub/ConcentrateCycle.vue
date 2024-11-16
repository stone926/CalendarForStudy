<script setup>
import { computed, onBeforeMount, ref } from 'vue';
import { studyStore, concentrationStore } from "@/data/store";
import { ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router';

const router = useRouter();
const { todo, time, index } = defineProps(["todo", "time", "index"]);
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
const finishedT = computed(() => {
  return todo.current.T;
})

onBeforeMount(() => {
  const state = studyStore.study.state ?? "已结束";
  if (state !== "学习中" && state !== "休息中") {
    beginStudy();
  }
});
const percentage = computed(() => {
  if (studyStore.study.state === "学习中")
    return ((current.value - studyStore.study.now) / (1000 * 60 * 60 * goalStudyHours.value + 1000 * 60 * goalStudyMinutes.value) * 100).toFixed();
  else if (studyStore.study.state === "休息中")
    return ((current.value - studyStore.study.now) / (1000 * 60 * 60 * goalBreakHours.value + 1000 * 60 * goalBreakMinutes.value) * 100).toFixed();
  else return 100;
})
const current = ref(0);
function handleChange() {
  current.value = Date.now();
  let t = current.value - studyStore.study.now;
  let seconds = (t / 1000).toFixed(), hours = parseInt(seconds / 3600), minutes = (seconds / 60).toFixed() % 60;
  if (studyStore.study.state === "学习中") {
    concentrationStore.concentration[time.year][time.month][time.day][index].current.study = `${hours}:${minutes}`;
  } else if (studyStore.study.state === "休息中") {
    concentrationStore.concentration[time.year][time.month][time.day][index].current.break = `${hours}:${minutes}`;
  }
}
function handleFinish() {
  if (studyStore.study.state === "学习中") {
    if (concentrationStore.concentration[time.year][time.month][time.day][index].current.T >= goalT - 1) {
      jumpAll();
    } else beginBreak();
  } else if (studyStore.study.state === "休息中") {
    jumpBreak();
  }
}
function end() {
  studyStore.study.state = "已结束";
  studyStore.study.now = 0;
  studyStore.study.countdown = 0;
}
function saveCycle() {
  concentrationStore.concentration[time.year][time.month][time.day][index].current.T++;
  concentrationStore.concentration[time.year][time.month][time.day][index].current.study = `0:00`;
  concentrationStore.concentration[time.year][time.month][time.day][index].current.break = `0:00`;
}
function beginStudy() {
  studyStore.study.now = Date.now();
  studyStore.study.countdown = studyStore.study.now + 1000 * 60 * 60 * goalStudyHours.value + 1000 * 60 * goalStudyMinutes.value;
  studyStore.study.state = "学习中";
}
function beginBreak() {
  studyStore.study.now = Date.now();
  studyStore.study.countdown = studyStore.study.now + 1000 * 60 * 60 * goalBreakHours.value + 1000 * 60 * goalBreakMinutes.value;
  studyStore.study.state = "休息中";
}
function jumpBreak() {
  beginStudy();
  saveCycle();
}
function jumpStudy() {
  studyStore.study.countdown = Date.now()+1;
}
function jumpAll() {
  ElMessageBox.alert("您已完成该学习任务！", "恭喜完成", {
    confirmButtonText: '确认',
    callback() {
      router.push("/study");
    }
  });
  end();
  saveCycle();
}
</script>
<template>
  <el-space :size="90" direction="vertical">
    <el-row>
      <el-space direction="vertical" :size="3">
        <span>如此进行{{ goalT }}个循环</span>
        <span>每学习{{ goalStudyHours > 0 ? `${goalStudyHours}小时` : '' }}{{ goalStudyMinutes }}分钟</span>
        <span>休息{{ goalBreakHours > 0 ? `${goalBreakHours}小时` : '' }}{{ goalBreakMinutes }}分钟</span>
        <span>已完成{{ finishedT }}个循环</span>
      </el-space>
    </el-row>
    <el-row>
      <el-progress type="dashboard" :percentage="percentage" :stroke-width="15">
        <span class="percentage-value">{{ percentage }}%</span>
        <span class="percentage-label">{{ studyStore.study.state }}</span>
      </el-progress>
    </el-row>
    <el-row>
      <el-countdown :value="studyStore.study.countdown" :value-style="{ color: `white` }" @change="handleChange"
        @finish="handleFinish">
      </el-countdown>
    </el-row>
    <el-row>
      <el-button size="large" v-if="studyStore.study.state === '休息中'" @click="jumpBreak">跳过休息</el-button>
      <el-button size="large" v-if="studyStore.study.state === '学习中'" @click="jumpStudy">跳过学习</el-button>
      <el-button size="large" v-if="studyStore.study.state === '休息中' || studyStore.study.state === '学习中'"
        @click="jumpAll">提前完成</el-button>
    </el-row>
  </el-space>
</template>
<style lang="scss" scoped>
:deep(.el-progress__text) {
  color: white;
}

:deep(.el-progress) {
  transform: scale(1.8);
}

.percentage-value {
  display: block;
  margin-top: 10px;
  font-size: 28px;
}

.percentage-label {
  display: block;
  margin-top: 10px;
  font-size: 12px;
}
</style>