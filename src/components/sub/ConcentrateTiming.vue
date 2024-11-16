<script setup>
import { computed, onBeforeMount, ref } from 'vue';
import { studyStore, concentrationStore } from "@/data/store";
import { ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router';

const { todo, time, index } = defineProps(["todo", "time", "index"]);
const router = useRouter();
const goalHours = computed(() => {
  return parseInt(todo.goal.time.split(":")[0]);
})
const goalMinutes = computed(() => {
  return parseInt(todo.goal.time.split(":")[1]);
})
const current = ref(0);

onBeforeMount(() => {
  if ((studyStore.study.state ?? "已结束") !== "计时中") {
    beginTiming();
  }
});

const percentage = computed(() => {
  if (studyStore.study.state === "计时中")
    return ((current.value - studyStore.study.now) / (1000 * 60 * 60 * goalHours.value + 1000 * 60 * goalMinutes.value) * 100).toFixed();
  else return 100;
})
function handleChange() {
  current.value = Date.now();
  let t = current.value - studyStore.study.now;
  concentrationStore.concentration[time.year][time.month][time.day][index].current.time = `${goalHours.value}:${goalMinutes.value}`;
}
function handleFinish() {
  ElMessageBox.alert("您已完成该学习任务！", "恭喜完成", {
    confirmButtonText: '确认',
    callback() {
      router.push("/study");
    }
  });
  end();
}
function beginTiming() {
  studyStore.study.now = Date.now();
  studyStore.study.countdown = studyStore.study.now + 1000 * 60 * 60 * goalHours.value + 1000 * 60 * goalMinutes.value;
  studyStore.study.state = "计时中";
}
function end() {
  studyStore.study.state = "已结束";
  studyStore.study.now = 0;
  studyStore.study.countdown = 0;
  concentrationStore.concentration[time.year][time.month][time.day][index].current.time = `${hours}:${minutes}`;
}
</script>
<template>
  <el-space :size="90" direction="vertical">
    <el-row>
      <el-space direction="vertical" :size="3">
        <span>学习{{ goalHours > 0 ? `${goalHours}小时` : '' }}{{ goalMinutes }}分钟</span>
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
      <el-button size="large" v-if="studyStore.study.state === '计时中'" @click="end">提前完成</el-button>
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