<script setup>
import NavBar from "@/components/NavBar.vue";
import { onMounted, watch, ref, computed } from "vue";
import { planStore, concentrationStore, studyStore } from "@/data/store";
import jsonDatabase from "../db/db.json" with { type: "json" };
import bg from "./assets/bg.webp"
import { useRouter, useRoute } from 'vue-router'

onMounted(() => {
  if (!localStorage.initialized) {
    // 将plan和concentration初始化为db.json中的默认数据，并标记初始化已完成
    planStore.plan = jsonDatabase.plan;
    concentrationStore.concentration = jsonDatabase.concentration;
    localStorage.initialized = true;
  } else {
    // 在已初始化的情况下，不应从db.json加载数据，而是从localStorage加载用户修改后的数据
    planStore.plan = JSON.parse(localStorage.plan);
    concentrationStore.concentration = JSON.parse(localStorage.concentration);
    studyStore.study = JSON.parse(localStorage.study ?? "{}");
  }
})
// 当store变更，保存用户修改后的数据
watch(planStore, (newValue, oldValue) => {
  localStorage.plan = JSON.stringify(newValue.plan);
})
watch(concentrationStore, (newValue, oldValue) => {
  localStorage.concentration = JSON.stringify(newValue.concentration);
})
watch(studyStore, (newValue, oldValue) => {
  localStorage.study = JSON.stringify(newValue.study);
})
const router = useRouter(), route = useRoute();
const showNavBar = computed(() => {
  return "/study/concentrate" !== route.path;
});
const background = computed(() => {
  return { img: !showNavBar.value ? `url(${bg})` : "none" };
});
function handleConcentrate() {

}
</script>
<template>
  <el-container>
    <el-aside v-if="showNavBar">
      <NavBar></NavBar>
    </el-aside>
    <el-main>
      <Transition name="el-fade-in-linear">
        <RouterView @concentrate="handleConcentrate"></RouterView>
      </Transition>
    </el-main>
  </el-container>
</template>
<style lang="scss" scoped>
.bg {
  z-index: -1;
  position: absolute;
  top: 0;
  left: 0;
}

.el-container {
  margin: 0;
  height: 100%;
  background-image: v-bind("background.img");
  background-attachment: fixed;
  width: 100%;
  height: 100vh;
}

:global(body) {
  margin: 0;
}

:global(*) {
  scrollbar-width: none;
}
</style>
