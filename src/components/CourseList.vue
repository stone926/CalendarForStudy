<script setup>
import { computed, onBeforeMount, ref, watch } from "vue";
import { getCourseCategory, getCourseType, getDay } from "../util/courseUtil";
import { get, post } from "../util/axios";
import URL from "../data/api";
import { chosenCourseStore, courseListStore } from "../data/store";
import Popup from "./Popup.vue";
import moment from "moment";
import EndLine from "./EndLine.vue";

const courseList = ref([]);
const nameWanted = ref("");
const hideConflict = ref(false);
const showPopup = ref(false);
const popupMsg = ref("");
const popupType = ref("");
const filterMode = ref("name");

const filterModeList = [
	["name", "按名查课"],
	["category", "按组别查课"],
	["type", "按类型查课"],
	["id", "按编号查课"],
];

onBeforeMount(() => {
	courseList.value = courseListStore.courseList;
});

function notConflict(any) {
	if (chosen(any)) return true;
	let timeOverlap = false;
	chosenCourseStore.chosenCourse.forEach((chosen) => {
		if (timeOverlap) return;
		let chosenMoments = chosen.info.map((info) => ({
			startWeek: moment(`${info.week_start}`, "w"),
			endWeek: moment(`${info.week_end}`, "w"),
			day: info.day,
			startTime: moment(`${info.time_start}`, "H:mm"),
			endTime: moment(`${info.time_end}`, "H:mm"),
		}));
		let anyMoments = any.info.map((info) => ({
			startWeek: moment(`${info.week_start}`, "w"),
			endWeek: moment(`${info.week_end}`, "w"),
			day: info.day,
			startTime: moment(`${info.time_start}`, "H:mm"),
			endTime: moment(`${info.time_end}`, "H:mm"),
		}));
		anyMoments.forEach((anyMomentObj) => {
			if (timeOverlap) return;
			chosenMoments.forEach((chosenMomentObj) => {
				if (timeOverlap) return;
				let sameDay = anyMomentObj.day == chosenMomentObj.day;
				let weekOverlap =
					anyMomentObj.startWeek.isBetween(
						chosenMomentObj.startWeek,
						chosenMomentObj.endWeek,
						undefined,
						"[]"
					) ||
					anyMomentObj.endWeek.isBetween(
						chosenMomentObj.startWeek,
						chosenMomentObj.endWeek,
						undefined,
						"[]"
					) ||
					chosenMomentObj.startWeek.isBetween(
						anyMomentObj.startWeek,
						anyMomentObj.endWeek,
						undefined,
						"[]"
					) ||
					chosenMomentObj.endWeek.isBetween(
						anyMomentObj.startWeek,
						anyMomentObj.endWeek,
						undefined,
						"[]"
					);
				let clockOverlap =
					anyMomentObj.startTime.isBetween(
						chosenMomentObj.startTime,
						chosenMomentObj.endTime,
						undefined,
						"[]"
					) ||
					anyMomentObj.endTime.isBetween(
						chosenMomentObj.startTime,
						chosenMomentObj.endTime,
						undefined,
						"[]"
					) ||
					chosenMomentObj.startTime.isBetween(
						anyMomentObj.startTime,
						anyMomentObj.endTime,
						undefined,
						"[]"
					) ||
					chosenMomentObj.endTime.isBetween(
						anyMomentObj.startTime,
						anyMomentObj.endTime,
						undefined,
						"[]"
					);
				timeOverlap = sameDay && weekOverlap && clockOverlap;
			});
		});
	});
	return !timeOverlap;
}

function chosen(course) {
	return (
		chosenCourseStore.chosenCourse.filter((item) => item.id === course.id).length > 0
	);
}

function chooseCourse(course) {
	const success = () => {
		showPopup.value = true;
		popupMsg.value = "选课成功";
		popupType.value = "success";
		setTimeout(clear, 2000);
	};
	const fail = () => {
		showPopup.value = true;
		popupMsg.value = "选课失败";
		popupType.value = "fail";
		setTimeout(clear, 2000);
	};
	const warn = () => {
		showPopup.value = true;
		popupMsg.value = "此课已选";
		popupType.value = "warn";
		setTimeout(clear, 2000);
	};
	const clear = () => {
		showPopup.value = false;
		popupMsg.value = "";
		popupType.value = "";
	};
	let len = chosenCourseStore.chosenCourse.filter(
		(item) => item.id.split("_")[0] === course.id.split("_")[0]
	).length;
	if (len !== 0) {
		warn();
	} else {
		post(URL.chosenCourse, course)
			.then(() => success())
			.then(() => {
				get(URL.chosenCourse).then((res) => {
					chosenCourseStore.chosenCourse = res.data;
					if (hideConflict.value) {
						courseList.value = courseList.value.filter((any) => notConflict(any));
					}
				});
			})
			.catch(() => fail());
	}
}

function courseNameMatch(course, nameWanted) {
	let pattern = new RegExp(`${nameWanted.value}`, "i");
	if (filterMode.value === "category") {
		return pattern.test(getCourseCategory(course.category));
	} else if (filterMode.value === "type") {
		return pattern.test(getCourseType(course.type));
	} else {
		return pattern.test(course[filterMode.value]);
	}
}

const computedCourseList = computed(() => {
	let l = courseListStore.courseList.filter((item) => courseNameMatch(item, nameWanted));
	if (hideConflict.value) {
		l = l.filter((any) => notConflict(any));
	}
	return l;
});
</script>
<template>
	<Transition>
		<Popup v-if="showPopup" :type="popupType">{{ popupMsg }}</Popup>
	</Transition>
	<div class="filter">
		<label for="filter-mode">
			<select name="filter-mode" id="filter-mode" v-model="filterMode">
				<option v-for="item in filterModeList" :value="item[0]">{{ item[1] }}</option>
			</select>
		</label>
		<label for="filter-input">
			<input
				type="text"
				id="filter-input"
				v-model.trim="nameWanted"
				placeholder="支持正则表达式"
			/>
		</label>
		<label for="hide-conflict" class="hide-conflict-label">
			隐藏冲突课程
			<input type="checkbox" id="hide-conflict" v-model="hideConflict" />
		</label>
	</div>

	<div v-if="computedCourseList.length > 0" class="course-list">
		<div
			class="course-list-item"
			:class="{ chosen: chosen(course), conflict: !notConflict(course) }"
			v-for="course in computedCourseList"
		>
    <div class="course-list-item-text">
			<div>课程编号：{{ course.id }}</div>
			<div>课程名：{{ course.name }}</div>
			<div>类型：{{ getCourseType(course.type) }}</div>
			<div v-if="course.category !== `misc`">
				组别：{{ getCourseCategory(course.category) }}
			</div>
			<div>学分：{{ course.score }}</div>
    </div>
			<div class="info-list">
				<div
					v-for="info in course.info"
					class="info-list-item"
					:class="{
						'chosen-info': chosen(course),
						'conflict-info': !notConflict(course),
					}"
				>
					<div>教师：{{ info.teacher }}</div>
					<div>周：{{ info.week_start }}~{{ info.week_end }}周</div>
					<div>星期：{{ getDay(info.day) }}</div>
					<div>教室：{{ info.classroom }}</div>
					<div>时间：{{ info.time_start }}~{{ info.time_end }}</div>
				</div>
			</div>
			<div
				@click="chooseCourse(course)"
				class="choose-course"
				v-if="!chosen(course) && notConflict(course)"
			>
				选择此课
			</div>
		</div>
	</div>
	<template v-else>
		<h2 class="no-course">无课</h2>
	</template>
</template>
<style scoped lang="less">
#filter-mode {
  .content-font-size();
}
#filter-input {
  .content-font-size();
}
#hide-conflict {
  margin-left:3px;
  width: 20px;
  height: 20px;
}
.hide-conflict-label {
  .content-font-size();
}
.no-course {
	width: 80%;
	.flex-and-center();
}
.filter {
	margin-top: 10px;
	display: flex;
	justify-content: space-evenly;
  align-items: center;
	width: 80%;
	margin-bottom: 10px;
}
.filter > label {
	display: flex;
}
.course-list-item {
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
.course-list {
	display: flex;
	width: 80%;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: space-between;
	gap: 20px 20px;
}
.chosen {
	background-color: var(--buaa-light-blue) !important;
	color: black !important;
}
.chosen-info {
	background-color: var(--buaa-lighter-blue) !important;
	color: black !important;
}
.conflict {
	background-color: var(--dark-grey) !important;
}
.conflict-info {
	background-color: var(--grey) !important;
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
.choose-course {
	color: white;
	border-radius: 8px;
	background-color: var(--buaa-mild-blue);
	width: 100px;
	height: 40px;
  margin-top: 10px;
	display: flex;
	justify-content: center;
	align-items: center;
  align-self:flex-end;
}
</style>
