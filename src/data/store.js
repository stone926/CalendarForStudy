import { reactive } from "vue";

const planStore = reactive({
  plan: {}
});

const concentrationStore = reactive({
  concentration: {}
});

const studyStore = reactive({
  study: {}
});

export { planStore, concentrationStore, studyStore };
