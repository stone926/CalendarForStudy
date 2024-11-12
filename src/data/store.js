import { reactive } from "vue";

const courseListStore = reactive({
	courseList: [],
});

const coursePlanStore = reactive({
	coursePlan: [],
});

const boyaPlanStore = reactive({
	boyaPlan: [],
});

const boyaFinishedStore = reactive({
	boyaFinished: [],
});

const boyaListStore = reactive({
	boyaList: [],
});

const chosenCourseStore = reactive({
	chosenCourse: [],
});

const chosenBoyaStore = reactive({
  chosenBoya: []
});

export { chosenBoyaStore, courseListStore, coursePlanStore, chosenCourseStore, boyaPlanStore, boyaFinishedStore, boyaListStore };
