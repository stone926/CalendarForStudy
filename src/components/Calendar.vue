<script setup>
import { computed, ref, watch } from "vue";
import { planStore } from "../data/store";
import TaskTag from "@/components/sub/TaskTag.vue";
import { Plus, Check, Edit, Delete, EditPen, Clock } from "@element-plus/icons-vue";
const showDrawer = ref(false);
const drawerData = ref({});
const taskInput = ref("");
const taskInputEdit = ref("");
const emergencySelected = ref(3);
const emergencySelectedEdit = ref(3);
const taskTime = ref([]);
const taskTimeEdit = ref([]);
const editPopVisible = ref(-1);

const emergencyOptions = [
  { value: 0, label: '完成', },
  { value: 1, label: '小事', },
  { value: 2, label: '重要', },
  { value: 3, label: '紧迫', },
];
function getTaskList(day) {
  const [y, m, d] = getYMD(day);
  return planStore.plan?.[y]?.[m]?.[d];
}
const taskList = computed(() => {
  const [y, m, d] = getYMD(drawerData.value.day);
  return planStore.plan?.[y]?.[m]?.[d];
});
function handleCellClick(day) {
  drawerData.value = { day };
  showDrawer.value = true;
}
function handleTaskAddition() {
  if (taskInput.value.trim() === "") return;
  const [y, m, d] = getYMD(drawerData.value.day);
  if (!planStore.plan[y]) {
    planStore.plan[y] = {};
  }
  if (!planStore.plan[y][m]) {
    planStore.plan[y][m] = {};
  }
  if (!planStore.plan[y][m][d]) {
    planStore.plan[y][m][d] = [];
  }
  const newTask = {
    task: taskInput.value,
    emergency: emergencySelected.value,
  };
  let additionMode = "push";
  if (taskTime.value.length != 0) {
    const begin = `${taskTime.value[0]}`;
    const end = `${taskTime.value[1]}`;
    newTask.taskTime = [begin, end];
    additionMode = "unshift";
  }
  planStore.plan[y][m][d][additionMode](newTask);
  emergencySelected.value = 3;
  taskInput.value = "";
  taskTime.value = [];
}
function getYMD(day) {
  const l = day.split("-");
  const y = l[0], m = l[1], d = l[2];
  return [y, m, d];
}
function editTask(index, day) {
  const [y, m, d] = getYMD(day);
  if (taskInputEdit.value.trim() !== "") {
    planStore.plan[y][m][d][index].task = taskInputEdit.value;
  }
  planStore.plan[y][m][d][index].emergency = emergencySelectedEdit.value;
  if (taskTimeEdit.value.length == 2) {
    planStore.plan[y][m][d][index].taskTime = taskTimeEdit.value;
  }
  editPopVisible.value = -1;
}
function finished(index, day) {
  const [y, m, d] = getYMD(day);
  return planStore.plan[y][m][d][index].emergency == 0
}
function finishTask(index, day) {
  const [y, m, d] = getYMD(day);
  planStore.plan[y][m][d][index].emergency = 0;
}
function deleteTask(index, day) {
  const [y, m, d] = getYMD(day);
  planStore.plan[y][m][d].splice(index, 1);
  if (planStore.plan[y][m][d].length == 0) {
    planStore.plan[y][m][d] = undefined;
  }
}
function toggleEditPop(index) {
  if (index == editPopVisible.value) {
    editPopVisible.value = -1;
  } else {
    editPopVisible.value = index;
  }
}
function handleDrawerClose() {
  editPopVisible.value = -1;
}
watch(showDrawer, (newValue, oldValue) => {
  if (oldValue) {
    taskInput.value = "";
    emergencySelected.value = 3;
    taskTime.value = [];
  }
});
watch(editPopVisible, (newValue, OldValue) => {
  taskInputEdit.value = "";
  emergencySelectedEdit.value = 3;
  taskTimeEdit.value = [];
});
</script>
<template>
  <div>
    <el-container>
      <el-header>
        <h2>每日计划</h2>
      </el-header>
      <el-main>
        <el-calendar>
          <template #date-cell="{ data }">
            <div @click="handleCellClick(data.day)">
              <div :class="data.isSelected ? 'is-selected' : ''">
                {{ data.day.split('-')[2] }}
                {{ getTaskList(data.day) ? '✔️' : '' }}
              </div>
              <div class="task-tag-list">
                <div v-for="item in getTaskList(data.day)" class="task-tag-list-item">
                  <TaskTag :emergency="item.emergency">
                    {{ item.task }}
                    <el-icon v-if="!!item.taskTime">
                      <Clock />
                    </el-icon>
                  </TaskTag>
                </div>
              </div>
            </div>
          </template>
        </el-calendar>
      </el-main>
    </el-container>
    <div class="calendar-drawer">
      <el-drawer v-model="showDrawer" :title="`${drawerData.day}的任务`" direction="rtl" size="35%"
        @close="handleDrawerClose">
        <div class="daily-task-list">
          <div v-if="taskList === undefined">
            <el-text class="mx-1">没有任务</el-text>
          </div>
          <div v-for="(item, index) in taskList" class="daily-task-list-item">
            <TaskTag :emergency="item.emergency" size="large">
              <template #default>
                {{ item.task }}
              </template>
              <template #time v-if="!!item.taskTime">
                {{ !!item.taskTime && `${item.taskTime[0]}~${item.taskTime[1]}` }}
              </template>
            </TaskTag>
            <el-button :disabled="finished(index, drawerData.day)" type="success" :icon="Check" circle
              @click="finishTask(index, drawerData.day)" />
            <el-popover title="修改任务" width="400px" :hide-after="50" :visible="editPopVisible == index">
              <template #reference>
                <el-button type="primary" :icon="Edit" circle @click="toggleEditPop(index)" />
              </template>
              <template #default>
                <div class="edit-task-pop">
                  <el-row justify="space-between" :gutter="10">
                    <el-col :span="14">
                      <el-input v-model="taskInputEdit" placeholder="想改成什么？"></el-input></el-col>
                    <el-col :span="8">
                      <el-select v-model="emergencySelectedEdit" clearable style="margin-right: 5px;">
                        <el-option v-for="item in emergencyOptions" :key="item.value" :label="item.label"
                          :value="item.value" />
                      </el-select>
                    </el-col>
                    <el-col :span="2">
                      <el-button type="primary" :icon="EditPen" circle @click="editTask(index, drawerData.day)" />
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-time-picker value-format="HH:mm" format="HH:mm" v-model="taskTimeEdit" is-range
                      range-separator="到" start-placeholder="开始" end-placeholder="结束" />
                  </el-row>
                </div>
              </template>
            </el-popover>
            <el-button type="danger" :icon="Delete" circle @click="deleteTask(index, drawerData.day)" />
          </div>
        </div>
        <template #footer>
          <div class="daily-task-drawer-footer">
            <el-row justify="space-between" :gutter="10">
              <el-col :span="14">
                <el-input v-model="taskInput" placeholder="计划干点什么？" clearable />
              </el-col>
              <el-col :span="6">
                <el-select v-model="emergencySelected" clearable>
                  <el-option v-for="item in emergencyOptions" :key="item.value" :label="item.label"
                    :value="item.value" />
                </el-select>
              </el-col>
              <el-col :span="4">
                <el-button type="primary" :icon="Plus" @click="handleTaskAddition"></el-button>
              </el-col>
            </el-row>
            <el-row>
              <el-time-picker value-format="HH:mm" format="HH:mm" v-model="taskTime" is-range range-separator="到"
                start-placeholder="开始" end-placeholder="结束" />
            </el-row>
          </div>
        </template>
      </el-drawer>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.daily-task-drawer-footer,
.edit-task-pop {
  :deep(.el-row) {
    margin-bottom: 10px;
  }

  :deep(.el-row):last-child {
    margin-bottom: 0;
  }

  :deep(.el-col) {
    display: flex;
    justify-content: center;

    * {
      flex: 1;
    }
  }
}

// .edit-task-pop {
//   width: 100%;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   gap: 5px;

//   :deep(.el-select) {
//     flex: 0.29;
//   }

//   :deep(.el-input) {
//     flex: 0.7;
//   }

//   :deep(.el-button) {
//     flex: 0.01;
//   }

// }

.calendar-drawer {
  :deep(.el-drawer__body) {
    overflow: scroll;
    scrollbar-width: none;
  }
}

:deep(.el-calendar-table .el-calendar-day) {
  height: 100px !important;
}

:deep(.el-calendar-day) {
  overflow-x: scroll;
  overflow-y: scroll;
  scrollbar-width: none;
}

.is-selected {
  color: #1989fa;
}

.task-tag-list {
  margin: 0;

  .task-tag-list-item {
    margin-top: 2px;
    margin-bottom: 2px;
  }
}

.daily-task-list {
  margin: 0;

  .daily-task-list-item {
    margin-top: 5px;
    margin-bottom: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;

    :deep(.el-tag) {
      font-size: 20px;
      height: 55px;
      flex: 0.7;
      flex-shrink: 0;
      flex-grow: 1;
    }

    :deep(.el-button) {
      margin: 0;
      flex: 0 0 0.1;
    }
  }
}
</style>