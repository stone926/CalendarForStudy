<script setup>
import { onBeforeMount } from "vue";
import Head from "./components/Head.vue";
import URL from "./data/api";
import { get } from "./util/axios";
import {
	courseListStore,
	coursePlanStore,
	chosenCourseStore,
	boyaPlanStore,
	boyaFinishedStore,
	boyaListStore,
	chosenBoyaStore,
} from "./data/store";
import EndLine from "./components/EndLine.vue";

onBeforeMount(() => {
  get(URL.courseList).then((res) => {
		courseListStore.courseList.push(...res.data);
	});
	get(URL.coursePlan).then((res) => {
		coursePlanStore.coursePlan.push(...res.data);
	});
	get(URL.chosenCourse).then((res) => {
		chosenCourseStore.chosenCourse.push(...res.data);
	});
	get(URL.boyaPlan).then((res) => {
		boyaPlanStore.boyaPlan.push(...res.data);
	});
	get(URL.boyaFinished).then((res) => {
		boyaFinishedStore.boyaFinished.push(...res.data);
	});
	get(URL.boyaList).then((res) => {
		boyaListStore.boyaList.push(...res.data);
	});
	get(URL.chosenBoya).then((res) => {
		chosenBoyaStore.chosenBoya.push(...res.data);
	});
});
</script>

<template>
	<Head></Head>
	<RouterView></RouterView>
  <EndLine></EndLine>
</template>

<style lang="less">
:root {
  --buaa-dark-blue: #092a5f;
  --buaa-mild-blue: #005bac;
  --buaa-light-blue: #5a93e9;
  --buaa-lighter-blue: #91beed;
  --dark-red: rgb(159, 5, 5);
  --darker-red: rgb(110, 1, 1);
  --grey:grey;
  --dark-grey: rgb(51, 51, 51);
  --greyish-blue: rgb(5, 70, 111);
}
#app {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}
html {
  font-size: 16px;
}
</style>
