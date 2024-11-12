<script setup>
import { onBeforeMount, ref } from "vue";
import { getCourseType, getCourseCategory, getBoyaCategory } from "../util/courseUtil";
import {
	coursePlanStore,
	boyaPlanStore,
	chosenCourseStore,
	boyaListStore,
	chosenBoyaStore,
} from "../data/store";

const coursePlan = ref([]);
const chosenCourse = ref([]);
const boyaPlan = ref([]);

onBeforeMount(() => {
	coursePlan.value = coursePlanStore.coursePlan;
	chosenCourse.value = chosenCourseStore.chosenCourse;
	boyaPlan.value = boyaPlanStore.boyaPlan;
});

function getScoreRequirement(mode, value) {
	if (mode === "e") {
		return `${value}`;
	} else if (mode === "ge") {
		return `>=${value}`;
	} else if (mode === "le") {
		return `<=${value}`;
	} else {
		return "未知";
	}
}
function isScoreSatisfied(mode, value, score) {
	if (mode === "e" || mode === "ge") {
		return score >= value;
	} else if (mode === "le") {
		return score <= value;
	} else {
		return true;
	}
}
function getChosenScore(mode, id, category) {
	if (mode === "course") {
		return chosenCourse.value
			.filter((item) => item.id.split("_")[0] === id)
			.reduce((prev, cur) => prev + cur.score, 0);
	} else if (mode === "category") {
		return chosenCourse.value
			.filter((item) => item.category === category)
			.reduce((prev, cur) => prev + cur.score, 0);
	}
}
function getBoyaFinishedCount(category) {
	const boyaIds = boyaListStore.boyaList
		.filter((item) => item.category === category)
		.map((item) => item.id);
	return chosenBoyaStore.chosenBoya.reduce(
		(prev, cur) => prev + boyaIds.includes(cur.id),
		0
	);
}
</script>
<template>
	<div class="profile-container">
		<h1 class="plan-title">培养方案</h1>
		<div class="plan-list">
			<div class="plan-list-item" v-for="plan in coursePlan">
				<div v-if="plan.mode === `course`">
					<div>课程通用编号：{{ plan.id }}</div>
					<div>课程名：{{ plan.name }}</div>
					<div>类型：{{ getCourseType(plan.type) }}</div>
				</div>
				<div v-if="plan.mode === `category`">
					<div>课程组别：{{ getCourseCategory(plan.category) }}</div>
				</div>
				<div>学分要求：{{ getScoreRequirement(plan.score.mode, plan.score.value) }}</div>
				<div>已选学分：{{ getChosenScore(plan.mode, plan.id, plan.category) }}</div>
				<div>
					学分达标：{{
						isScoreSatisfied(
							plan.score.mode,
							plan.score.value,
							getChosenScore(plan.mode, plan.id, plan.category)
						)
							? "是"
							: "否"
					}}
				</div>
			</div>
		</div>
		<h1 class="plan-title">已选课程</h1>
		<div v-if="chosenCourse.length > 0" class="chosen-course-list">
			<div class="chosen-course-list-item" v-for="course in chosenCourse">
				<div class="chosen-course-list-item-text">
					<div>课程编号：{{ course.id }}</div>
					<div>课程名：{{ course.name }}</div>
					<div>类型：{{ getCourseType(course.type) }}</div>
					<div v-if="course.category !== `misc`">
						组别：{{ getCourseCategory(course.category) }}
					</div>
					<div>学分：{{ course.score }}</div>
				</div>
				<div class="info-list">
					<div v-for="info in course.info" class="info-list-item">
						<div>教师：{{ info.teacher }}</div>
						<div>周：{{ info.week_start }}~{{ info.week_end }}周</div>
						<div>教室：{{ info.classroom }}</div>
						<div>时间：{{ info.time_start }}~{{ info.time_end }}</div>
					</div>
				</div>
			</div>
		</div>
		<template v-else>
			<h1 class="no-course">无</h1>
		</template>
		<h1 class="plan-title">博雅方案</h1>
		<div class="boya-plan">
			<table class="boya-table">
				<thead>
					<tr class="head-row">
						<th class="table-item">组别</th>
						<th class="table-item">所需课次</th>
						<th class="table-item">已上课次</th>
					</tr>
				</thead>
				<tbody>
					<tr class="body-row" v-for="(category, index) in boyaPlan">
						<td class="table-item" :class="{ odd: index % 2 == 1 }">
							{{ getBoyaCategory(category.category) }}
						</td>
						<td class="table-item" :class="{ odd: index % 2 == 1 }">
							{{ category.count }}
						</td>
						<td class="table-item" :class="{ odd: index % 2 == 1 }">
							{{ getBoyaFinishedCount(category.category) }}
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>
<style scoped lang="less">
.profile-container {
	display: flex;
	flex-direction: column;
	width: 80%;
}
.no-course {
	display: flex;
	justify-content: center;
	align-items: center;
}
.boya-table {
	border-collapse: collapse;
	border: 3px solid black;
	width: 50%;
}
.table-item {
	border: 1px solid black;
	height: 50px;
}
.head-row > .table-item {
	background-color: var(--buaa-dark-blue);
	color: white;
	border: 1px solid white !important;
}
.boya-plan {
	display: flex;
	justify-content: center;
	text-align: center;
	vertical-align: middle;
}
.plan-list {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: space-between;
	gap: 20px 20px;
}
.plan-list-item {
	color: white;
	border-radius: 8px;
	background-color: var(--buaa-dark-blue);
	padding: 7px;
	flex: 1 0 10%;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	.content-font-size();
}
.plan-title {
	color: var(--buaa-dark-blue);
	height: 70px;
	text-align: center;
	align-items: center;
	display: flex;
	justify-content: center;
	border-radius: 8px;
	background-color: var(--buaa-light-blue);
	margin: 0px;
  margin-top: 20px;
  margin-bottom: 20px;
	padding: 7px;
}
.chosen-course-list {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	gap: 20px 20px;
}
.chosen-course-list-item {
	color: white;
	border-radius: 8px;
	background-color: var(--buaa-dark-blue);
	padding: 20px;
	line-height: @content-font-size + 0.5rem;
	.content-font-size();
	flex: 1 0 25%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}
.info-list {
  display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	gap: 10px 10px;
	margin-top: 10px;
}
.info-list-item {
	color: white;
	border-radius: 8px;
	background-color: var(--buaa-mild-blue);
	padding: 7px;
	flex: 1 0 30%;
}
</style>
