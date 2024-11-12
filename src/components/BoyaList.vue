<script setup>
import { computed, onBeforeMount, ref } from "vue";
import { boyaListStore, chosenBoyaStore } from "../data/store";
import { getBoyaCategory } from "../util/courseUtil";
import { post, get } from "../util/axios";
import URL from "../data/api";
import Popup from "./Popup.vue";
import moment from "moment";
import EndLine from "./EndLine.vue";

const boyaList = ref([]);
const nameWanted = ref("");
const showPopup = ref(false);
const popupMsg = ref("");
const popupType = ref("");
const filterMode = ref("title");

const filterModeList = [
	["title", "按名查课"],
	["category", "按组别查课"],
];

onBeforeMount(() => {
	boyaList.value = boyaListStore.boyaList;
});
function boyaNameMatch(boya, nameWanted) {
	let pattern = new RegExp(`${nameWanted.value}`, "i");
	if (filterMode.value === "title") {
		return pattern.test(boya.title);
	} else if (filterMode.value === "category") {
		return pattern.test(getBoyaCategory(boya.category));
	} else if (filterMode.value === "time") {
		return true;
	}
}
function chooseBoya(boya) {
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
	let len = chosenBoyaStore.chosenBoya.filter((item) => item.id === boya.id).length;
	if (len !== 0) {
		warn();
	} else {
		post(URL.chosenBoya, { id: boya.id })
			.then((res) => {
				if (res.status === 201) success();
				else fail();
			})
			.then(() => {
				get(URL.chosenBoya).then((res) => {
					chosenBoyaStore.chosenBoya = res.data;
				});
			});
	}
}
function chosen(boya) {
	return chosenBoyaStore.chosenBoya.filter((item) => item.id === boya.id).length > 0;
}
function outdated(boya) {
  // return false;

	const boyaMomentStart = moment(`${boya.date}/${boya.time_start}`, "YYYY.M.D/H:mm");
	return boyaMomentStart.isBefore(moment());
}
function tooEarly(boya) {
  // return false;

	const boyaMomentStart = moment(`${boya.date}/${boya.time_start}`, "YYYY.M.D/H:mm");
	return moment().add(10, "d").isBefore(boyaMomentStart);
}
const computedBoyaList = computed(() => {
	return boyaListStore.boyaList.filter((boya) => boyaNameMatch(boya, nameWanted));
});
</script>
<template>
	<Popup :type="popupType" v-if="showPopup">{{ popupMsg }}</Popup>
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
	</div>
	<div class="boya-list">
		<div
			class="boya-list-item"
			:class="{
				chosen: chosen(boya),
				outdated: !chosen(boya) && outdated(boya),
				'too-early': !chosen(boya)&&tooEarly(boya),
			}"
			v-for="boya in computedBoyaList"
		>
			<h3 class="boya-title">{{ boya.title }}</h3>
			<div>组别：{{ getBoyaCategory(boya.category) }}</div>
			<div>时间：{{ boya.date }} {{ boya.time_start }}~{{ boya.time_end }}</div>
			<div>教室：{{ boya.classroom }}</div>
			<div
				@click="chooseBoya(boya)"
				class="choose-boya"
				v-if="!chosen(boya) && !outdated(boya) && !tooEarly(boya)"
			>
				选择此课
			</div>
		</div>
	</div>
</template>
<style scoped lang="less">
.chosen {
	background-color: var(--buaa-light-blue) !important;
	color: black !important;
}
.outdated {
	background-color: var(--dark-grey) !important;
}
.too-early {
	background-color: var(--greyish-blue) !important;
}
.filter {
	margin-top: 10px;
	display: flex;
	justify-content: space-evenly;
	width: 80%;
  margin-bottom: 10px;
}
.filter > label {
	display: flex;
}
.boya-title {
	margin: 0px;
	margin-bottom: 10px;
}
.boya-list {
  width: 80%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-between;
  gap: 20px 20px;
}
.boya-list-item {
	color: white;
	border-radius: 8px;
	background-color: var(--buaa-dark-blue);
	padding: 20px;
  flex:1 0 30%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .content-font-size();
}
.choose-boya {
	color: white;
	border-radius: 8px;
	background-color: var(--buaa-mild-blue);
	width: 100px;
	height: 40px;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 10px;
}
</style>
