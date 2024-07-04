import { useSdStore } from "@/stores/sdStore";
import httpInstance from "@/utils/http";

const getProgress = (progress) => {
  return httpInstance({
    method: "post",
    maxBodyLength: Infinity,
    url: "/api/internal/progress",
    data: progress,
  });
};
const txt2img = (params) => {
  return httpInstance({
    method: "post",
    maxBodyLength: Infinity,
    url: "/api/sdapi/v1/txt2img",
    headers: {
      "Content-Type": "application/json",
    },
    data: params,
  });
};
export const txt2imgAPI = async (params, progress) => {
  const req = txt2img(params);
  const sdStore = useSdStore();
  let count = 0
  while ( true ) {
    const res = await getProgress(progress);
    sdStore.progressInt = res.progress*100
    sdStore.progress = res;
    console.log(res?.completed);
    if (res.completed === true || count > 100) {
      break;
    }
    count++;
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    })
  } 
  return req;
};
