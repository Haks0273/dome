import { defineStore } from "pinia";
import { ref } from "vue";

export const useSdStore = defineStore("sdSd", () => {
  const modelsList = ref([{}]);
  const samplersList = ref([]);
  const lorasList = ref([{}]);
  const txt2imgresponsedata = ref([]);
  const vaesList = ref([]);
  const scriptsList = ref({});
  const selectionModel = ref(modelsList.value[0].title);
  const selectedVae = ref(vaesList[0]);
  const progressInt = ref(1)
  const userimgList = ref([]);
  const progress = {
    active : false,
    completed : false,
    eta : null,
    id_live_preview : -1,
    live_preview : null,
    progress : 0,
    queued : false,
    textinfo : null,
  };
  const imgList = ref([]);
  return {
    modelsList,
    selectionModel,
    progressInt,
    progress,
    userimgList,
    txt2imgresponsedata,
    samplersList,
    lorasList,
    vaesList,
    imgList,
    selectedVae,
    scriptsList,
    
  };
},{
    persist: {
        enabled: true,
        strategies: [{ storage: localStorage, paths: [""] }],
      },
}
);
