import axios from "axios";
import { ElMessage } from "element-plus";
import "element-plus/theme-chalk/el-message.css";



// 创建一个axios实例
const httpInstance = axios.create({
  timeout: 200000,
});

// 配置请求拦截器
httpInstance.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 配置响应拦截器
httpInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {

    ElMessage({
      type: "warning",
      message: error.response.statusText,
    });
    return Promise.reject(error);
  }
);
export default httpInstance;
