<script setup>


import { useSdStore } from '@/stores/sdStore'
import { useAuthStore } from '@/stores/authStore'
import { ref, reactive, onMounted } from 'vue';
import { txt2imgAPI } from '@/apis/txt2img';
import { getModels, getSamplers, getLoras, getfiles, getVaes, getScripts } from '@/apis/sdApi'
import { ElButton } from 'element-plus';
import { useWsStore } from '@/stores/wsStore';
import Tab from './components/tab.vue';

const sdStore = useSdStore();
const authStore = useAuthStore();

const params = reactive({
    id_task:"", //任务id
    sd_model_checkpoint: sdStore.selectionModel,
    restore_faces: false,//面部修复
    tiling: false,//平铺图
    denoising_strength: 0.7,
    enable_hr: false,//是否启用高分辨率模式 (High Resolution mode)。当设置为 `true` 时，将使用高分辨率的生成模型。默认值为 `false`。
    hr_scale: 2,//高分辨率模式下的放大倍数。当启用高分辨率模式时，生成的图像将以指定的倍数进行放大。默认值为 `2`。
    hr_upscaler: "None",//高分辨率模式下的上采样器。该参数指定用于图像上采样的算法或模型。它可以是一个字符串，表示特定的上采样器，或者是一个模型的标识符。默认值为 "string"。
    hr_second_pass_steps: 0,//高分辨率模式下的第二阶段生成步数。默认值为 `0`，表示只进行一次生成过程。
    hr_resize_x: 0,//高分辨率模式下的水平调整大小。该参数用于调整生成的图像的宽度。默认值为 `0`，表示不进行调整。
    hr_resize_y: 0,//高分辨率模式下的垂直调整大小。该参数用于调整生成的图像的高度。默认值为 `0`，表示不进行调整。

    cfg_scale: 7,
    batch_size: 1,
    seed: -1,
    height: 512,
    negative_prompt:"lowres,bad anatomy,bad hands,missing fingers,extra digit,cropped,worst quality,low quality,signature,watermark,username,blurry,missing arms,long neck",
    prompt: "best quality,highly detailed,masterpiece,",
    sampler_index:"Euler a", //采样器
    width: 512,
    steps: 10,
    init_images:[],
});

const showimg = ref()
const buttonDisabled = ref(false);
const getimglist =reactive([]);
const progress = reactive({
  id_task: "",
  id_live_preview: -1,
  live_preview: true
});

// const recoverdata = computed(() =>{
//    params.prompt =sdStore.responsedata.prompt
// })
const recoverdata = ()=>{
    console.log('recoverdata')
}

//开始任务
const start = async() => {
    if(authStore.isLoggedIn){
        generateRandomString();
        // showanimation.value = false
        buttonDisabled.value = true;

        const res = await txt2imgAPI(params, progress);
        // console.log('txt2imgAPI:'+JSON.stringify(res))
        // // predict.value = JSON.parse(res.data.predictinfo)
        sdStore.txt2imgresponsedata = JSON.parse(res.info)
        // console.log(res.images, res.parameters)
        getimglist.values= res.images
        sdStore.imgList = res.images        
        buttonDisabled.value = false;
        sdStore.userimgList.push(...(res.images.map((item,index)=>{
            return {
                id: index,
                img_url: 'data:image/png;base64,'+item
            }
        })))
    }
};
const generateRandomString = () => {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 13; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  params.id_task = result;
  progress.id_task = result;
};
const getScriptsList = async() => {
    const res = await getScripts();
    sdStore.scriptsList = res
}

const getModelsData = async() => {
    const res = await getModels();
    sdStore.modelsList = res.map((item) => {
    const lastDotIndex = item.filename.lastIndexOf(".");
    if (lastDotIndex !== -1) { 
        const img_url = item.filename.slice(0, lastDotIndex) + ".png";
        return {
            title: item.title,
            model_name: item.model_name,
            filename: item.filename,
            image_url: img_url 
        };
    } else {
        return {
            itle: item.title,
            model_name: item.model_name,
            filename: item.filename,
        };
    }
    })
};
const getSamplersData = async() => {
    const res = await getSamplers();
    sdStore.samplersList = res.map((item) =>{
        return   item.name
    });
};

const getLorasData = async() => {
    const res = await getLoras();
    sdStore.lorasList = res.map((item) =>{
        const lastDotIndex = item.path.lastIndexOf(".");
        if (lastDotIndex !== -1) { 
            const img_url = item.path.slice(0, lastDotIndex) + ".png";
            return {
            name : item.name,
            path : item.path,
            selected : false,
            img_url : img_url
            }
        }else{
            return{
                name : item.name,
                path : item.path,
            }
        }
    });
};

const Img = ref("")
const showImagePreview = (img) =>{
    showimg.value = !showimg.value
    Img.value = img
}

const selectmodel = (data) =>{
    sdStore.selectionModel = data
    params.sd_model_checkpoint = sdStore.selectionModel
};

const positive_Prompt = ref();

const selectedLora = (item) =>{
    item.selected = !item.selected
    if(item.selected == true){
        params.prompt = params.prompt + `<lora:${item.name}:1>, `
    }else{
        params.prompt = params.prompt.replace(`<lora:${item.name}:1>, `, "")
    }
}
const getVaesList = async () =>{
    const res = await getVaes();
    sdStore.vaesList = res.map((item) =>{
        return item.model_name;
            // filename : item.filename
        
    });
}

const handle = () =>{
    console.log(`
    width: ${params.width}px,
    height: ${params.height}px,
    steps: ${params.steps},
    batch_size: ${params.batch_size},
    seed: ${params.seed},
    sampler_index: ${params.sampler_index},
    sd_model_checkpoint: ${params.sd_model_checkpoint},
    enable_hr: ${params.enable_hr},
    hr_scale: ${params.hr_scale},
    hr_upscaler: ${params.hr_upscaler},
    `)
}
const handleButtonClick = () => {
    const ws = new WebSocket('ws://127.0.0.1:7860/queue/join');
    
    ws.onopen = function open() {
        console.log("WebSocket connection established.");
    };

    ws.onmessage = function incoming(event) {
        if (event.data === '{"msg": "send_hash"}') {
            const hash = JSON.stringify({"fn_index":1388,"session_hash":"8rxo1y538"})
            ws.send(hash)
        }else if(event.data === '{"msg": "send_data"}'){
            const data = JSON.stringify({
            data : ["CounterfeitV25_25.safetensors [a074b8864e]"],
            event_data : null,
            fn_index : 1388,
            session_hash : "8rxo1y538"
            })
            ws.send(data)
        }
        
    };

    ws.onclose = function close() {
        console.log("WebSocket connection closed.");
    };

    ws.send("1");
};

const handleVaeChange = (data, type) => {
    const wsStore = useWsStore();
    wsStore.hash = wsStore.generateHash()
    let hash =  JSON.stringify({"fn_index":1388,"session_hash": wsStore.hash})
    console.log(hash,wsStore.hash)
    const ws = wsStore.createWebSocketConnection()
    ws.onmessage = function incoming(event) {
        const sdStore = useSdStore();
        data = JSON.parse(event.data);
        switch (data.msg) {
            case "send_hash":{
                ws.send(hash);
                break;
            }
            case "estimation":
                // 处理 estimation 消息
                break;
            case "send_data":{
                let fn_index;
                switch (type){
                    case "Vae":
                        fn_index = 1390
                        break;
                    case "model":
                        fn_index = 1388
                        break;
                    default:
                        fn_index = 1393
                        break;
                }
                const dataToSend = JSON.stringify({
                    data: [data],
                    event_data: null,
                    fn_index: fn_index,
                    session_hash: hash
                });
                ws.send(dataToSend);
                break;
            }
            case "process_starts":
                // 处理 process_starts 消息
                break;
            case "process_completed":
                // 处理 process_completed 消息
                break;
            default:
                // 处理未知消息类型
                break;
        }
        ws.send("");
    };
}

const handleVae = (vae,type) =>{
    console.log(vae,type)
}

onMounted(()=>{
    getModelsData()
    getSamplersData()
    getLorasData()
    getVaesList()
    getScriptsList()
})
</script>




<template>
    <v-container class="transparent "  fluid >
        <!-- {{ params }} -->
        <el-button @click="handleVaeChange(sdStore.vaesList[0],'Vae')">Click me</el-button>
        <!-- <v-row>
            <v-col>
                <v-select
                :style="{ width: '400px' }"
                v-model="sdStore.selectedVae"
                label="Vae"
                :items="sdStore.vaesList"
                variant="solo-filled"
                ></v-select>
            </v-col>
        </v-row> -->
       <v-row>
             <v-col cols="9" class="pb-0">
                
             <v-textarea  
             :ref="positive_Prompt"
             active  
             class="text-caption "
             clearable 
             auto-grow 
             counter
             rows="3"
             density="compact"
             color="purple-accent-3" 
             label="正向提示词" 
             v-model="params.prompt"
             variant="solo-filled" >
              <template v-slot:append>
                <div class="tab">
                  <Tab />
                </div>
              </template>
             </v-textarea>
             
             <v-textarea 
             class="text-caption "
             density="compact"
             clearable 
             auto-grow 
             counter
             rows="3"
             color="purple-accent-3" 
             label="反向提示词" 
             v-model="params.negative_prompt"
             variant="solo-filled" >
                <template v-slot:append>
                    <div class="tab">
                    <Tab />
                    </div>
                </template>
             </v-textarea>
             </v-col>
             <v-col cols="3">
                 <v-btn class="selected my-1"  variant="text" size="x-large" height="70" elevation="2" block color="#ff2d51" @click="start" :disabled="buttonDisabled" >
                     开始
                 </v-btn>
                 <v-sheet class="rounded-lg mt-2 " elevation="0" min-height="40" >
                     <v-btn size="40" class="rim" elevation="0" @click="recoverdata">
                         <v-icon icon="mdi-arrow-bottom-left" color="#DDB84E" size="27"></v-icon>
                         <v-tooltip text="恢复到上一次的参数" activator="parent" location="top">
                         </v-tooltip>
                     </v-btn>
                 </v-sheet>
             </v-col>
           </v-row>
       <v-row>
           <v-col lg="6">
               <v-row class="my-0 py-0">
                   <v-col>
                       <h4 class=""> 模型：{{ params.sd_model_checkpoint }}</h4> 
                       <v-sheet class="mx-auto mb-3 rounded-lg "  border >
                           <v-slide-group v-model=sdStore.selectionModel  class="pa-3"  >
                               <v-slide-group-item v-for="(item,index) in sdStore?.modelsList" :key="index"  >
                                   <v-card class="mx-2 "  height="150" width="120" v-if="item.model_name"  :class="{'selected': item.title === sdStore.selectionModel}" @click= selectmodel(item.title) >
                                       <v-img 
                                           :src="`/api/sd_extra_networks/thumb?filename=${item.image_url}`"
                                           height="150"
                                           width="120"
                                           cover
                                           gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                                           class="d-flex align-end  text-white  "
                                           >
                                           <template v-slot:placeholder>
                                           <div class="d-flex align-center justify-center fill-height">
                                           <v-progress-circular
                                               color="grey-lighten-4"
                                               indeterminate
                                           ></v-progress-circular>
                                           </div>
                                           </template>
                                           <v-card-title class="py-0 justify-center text-caption">{{ item.model_name }}</v-card-title>
                                       </v-img>
                                   </v-card>
                               </v-slide-group-item>
                           </v-slide-group>
                       </v-sheet> 
                   </v-col>
                   <v-col>
                       <h4 class=""> LoRa：</h4> 
                       <v-sheet class="mx-auto mb-3 rounded-lg "  border >
                           <v-slide-group  class="pa-3"  >
                               <v-slide-group-item v-for="(item,index) in sdStore?.lorasList" :key="index"  >
                                   <v-card class="mx-2 "  height="150" width="120" v-if="item.name"  @click= selectedLora(item) >
                                       <v-img 
                                           :src="`/api/sd_extra_networks/thumb?filename=${item.img_url}`"
                                           height="150"
                                           width="120"
                                           cover
                                           gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                                           class="d-flex align-end  text-white  "
                                           >
                                           <template v-slot:placeholder>
                                           <div class="d-flex align-center justify-center fill-height">
                                           <v-progress-circular
                                               color="grey-lighten-4"
                                               indeterminate
                                           ></v-progress-circular>
                                           </div>
                                           </template>
                                           <v-card-title class="py-0 justify-center text-caption">{{ item.name }}</v-card-title>
                                       </v-img>
                                   </v-card>
                               </v-slide-group-item>
                           </v-slide-group>
                       </v-sheet> 
                   </v-col>
           </v-row>  
               <v-row class="my-0 py-0" >
                   <v-col class="my-0 py-0" >
                       <div class="text-caption ">采样器 ( Sampling method )</div>
                       <v-select
                       center-affix
                       v-model="params.sampler_index"
                       :items="sdStore.samplersList"
                       item-text="name" 
                       item-value="name"
                       variant="solo"
                       density="compact"
                       ></v-select>
                   </v-col>
                   <v-col class="my-0 py-0">
                       <div class="text-caption ">采样步数 ( steps )</div>  
                       <v-slider
                           v-model="params.steps"
                           color="#1FA2FF"
                           track-fill-color="#aa00ff"
                           class="align-center"
                           :max="150"
                           :min="1"
                           :step="1"
                           hide-details
                       >
                           <template v-slot:append>
                           <v-text-field
                               v-model="params.steps"
                               hide-details
                               single-line
                               density="compact"
                               type="number"
                               style="width: 70px"
                           ></v-text-field>
                           </template>
                       </v-slider>
                   </v-col>
               </v-row>
               <v-row class="my-0 py-0 d-flex align-center ">
                   <v-col class="my-0 py-0 ">
                       <v-sheet  width="500" height="55" elevation="0" >
                           <v-row  >
                           <v-col class="ma-0 pa-0" >
                           <v-checkbox label="面部修复"   hide-details="auto" v-model=params.restore_faces ></v-checkbox>
                           </v-col>
                           <v-col  class="ma-0 pa-0">
                           <v-checkbox label="平铺图"    hide-details="auto" class="ma-0 pa-0" v-model=params.tiling ></v-checkbox>
                           </v-col>
                           <v-col  class="ma-0 pa-0">
                           <v-checkbox  label="高清修复"  hide-details="auto" class="ma-0 pa-0" v-model=params.enable_hr ></v-checkbox>
                           </v-col >
                           </v-row>
                       </v-sheet>
                   </v-col>
               
                   <v-col v-show="params.enable_hr" class="my-0 py-0 ">
                       <v-sheet width="300" height="30" elevation="0" >
                       <div class="ma-0 pa-0" > 输出图像从{{params.width}}X{{params.height }}调整到{{ params.width*params.hr_scale}}X{{ params.height*params.hr_scale}}</div>
                       </v-sheet>
                   </v-col>
   
               </v-row>
           
               <v-row v-show="params.enable_hr" class="my-0 py-0" >
                   <v-col>
                   <div class="text-caption ">放大算法</div>
                   <v-select
                   center-affix
                   v-model="params.hr_upscaler"
                   :items= "sdStore.scalersList"
                   item-text="model_name" 
                   item-value="name"
                   variant="solo"
                   density="compact"
                   ></v-select>
               
                   <div class="text-caption "> 放大倍数</div>
                   <v-slider
                       v-model="params.hr_scale"
                       color="#1FA2FF"                    
                       track-fill-color="#aa00ff"
                       class="align-center"
                       :max="4"
                       :min="1"
                       :step="1"
                       hide-details
                   >
                       <template v-slot:append>
                       <v-text-field
                           v-model="params.hr_scale"
                           hide-details
                           single-line
                           density="compact"
                           type="number"
                           style="width: 70px"
                       ></v-text-field>
                       </template>
                   </v-slider>
                   </v-col>
                   <v-col>
                       <div class="text-caption ">高分迭代步数</div>
                       <v-slider
                           v-model="params.hr_second_pass_steps"
                           color="#1FA2FF"
                           
                           track-fill-color="#aa00ff"
                           class="align-center"
                           :max="150"
                           :min="1"
                           :step="1"
                           hide-details
                       >
                           <template v-slot:append>
                           <v-text-field
                               v-model="params.hr_second_pass_steps"
                               hide-details
                               single-line
                               density="compact"
                               type="number"
                               style="width: 70px"
                           ></v-text-field>
                           </template>
                       </v-slider>
   
                       <div class="text-caption ">将宽度调整为</div>
                       <v-slider
                           v-model="params.hr_resize_x"
                           color="#1FA2FF"
                           track-fill-color="#aa00ff"
                           class="align-center"
                           :max="2048"
                           :min="0"
                           :step="64"
                           hide-details
                       >
                           <template v-slot:append>
                           <v-text-field
                               v-model="params.hr_resize_x"
                               hide-details
                               single-line
                               density="compact"
                               type="number"
                               style="width: 70px"
                           ></v-text-field>
                           </template>
                       </v-slider>
   
                   </v-col>
                   <v-col>
                       <div class="text-caption ">重绘幅度</div>
                       <v-slider
                           v-model="params.denoising_strength"
                           color="#1FA2FF"
                           track-fill-color="#aa00ff"
                           class="align-center"
                           :max="1"
                           :min="0"
                           :step="0.1"
                           hide-details
                       >
                           <template v-slot:append>
                           <v-text-field
                               v-model="params.denoising_strength"
                               hide-details
                               single-line
                               density="compact"
                               type="number"
                               style="width: 70px"
                           ></v-text-field>
                           </template>
                       </v-slider>
                       
                       <div class="text-caption ">将高度调整为</div>
                       <v-slider
                           v-model="params.hr_resize_y"
                           color="#1FA2FF"
                           
                           track-fill-color="#aa00ff"
                           class="align-center"
                           :max="2048"
                           :min="0"
                           :step="1"
                           hide-details
                       >
                           <template v-slot:append>
                           <v-text-field
                               v-model="params.hr_resize_y"
                               hide-details
                               single-line
                               density="compact"
                               type="number"
                               style="width: 70px"
                           ></v-text-field>
                           </template>
                       </v-slider>
                   </v-col>
               </v-row>
   
               <v-row class="my-0 py-0">
                   <v-col lg="8" class="">
                       <div class="text-caption ">图片宽度 ( width )</div>
                       <v-slider 
                       v-model="params.width"
                       color="#1FA2FF"
                       track-fill-color="#aa00ff"
                       class="align-center "
                       :max="1024"
                       :min="512"
                       :step="64"
                       hide-details>
                       <template v-slot:append>
                       <v-text-field
                           class="text-caption "
                           v-model="params.width"
                           hide-details
                           single-line
                           density="compact"
                           type="number"
                           style="width: 80px"
                       ></v-text-field>
                       </template>
                       </v-slider>
                       <div class="text-caption ">图片高度 ( height )</div>
                       <v-slider
                       v-model="params.height"
                       color="#1FA2FF"                    
                       track-fill-color="#aa00ff"
                       class="align-center"
                       :max="1024"
                       :min="512"
                       :step="64"
                       hide-details
                   >
                       <template v-slot:append>
                       <v-text-field
                           class="text-caption "
                           v-model="params.height"                       
                           hide-details
                           single-line
                           density="compact"
                           type="number"
                           style="width: 80px"
                       ></v-text-field>
                       </template>
                       </v-slider>
                   </v-col>
                   <v-col  class="">
                   <div class="text-caption ">批量大小 ( batch-size )</div>
                   <v-slider
                       v-model="params.batch_size"
                       color="#1FA2FF"
                       track-fill-color="#aa00ff"
                       class="align-center "
                       :max="4"
                       :min="1"
                       :step="1"
                       hide-details>
                       <template v-slot:append>
                       <v-text-field
                           v-model="params.batch_size"
                           hide-details
                           single-line
                           density="compact"
                           type="number"
                           style="width: 70px"
                       ></v-text-field>
                       </template>
                       </v-slider>
                   </v-col>
               </v-row>
               <v-row>
                   <v-col>
                       <div class="text-caption ">提示词引导强度</div>
                       <v-slider 
                           v-model="params.cfg_scale"
                           color="#1FA2FF"
                           track-fill-color="#aa00ff"
                           class="align-center "
                           :max="30"
                           :min="1"
                           :step="1"
                           hide-details>
                           <template v-slot:append>
                               <v-text-field
                                   class="text-caption "
                                   v-model="params.cfg_scale"
                                   hide-details
                                   single-line
                                   density="compact"
                                   type="number"
                                   style="width: 80px"
                               ></v-text-field>
                           </template>
                       </v-slider>
                   </v-col>
               </v-row>
               <v-row class=" d-flex align-center " >
                       <v-col  class="" cols="9">
                           <v-sheet elevation="0" height="50" >
                           <v-text-field  density="compact" label="seed" v-model="params.seed"></v-text-field>
                           </v-sheet>
                       </v-col>
                       <v-col  class="" cols="1">
                           <v-sheet elevation="0" height="50" >
                               <v-btn size="45" @click="params.seed = -1 ">
                                   <v-icon icon="mdi-dice-3-outline"  size="large" class="my-0 py-0"></v-icon>
                                   <v-tooltip text="设置种子为-1" activator="parent" location="top">
                                   </v-tooltip>
                               </v-btn>
                           </v-sheet>
                       </v-col>
                       <v-col   class="" cols="1">
                           <v-sheet elevation="0" height="50">
                               <v-btn size="45" @click="params.seed = sdStore.txt2imgresponsedata.seed">
                                   <v-icon icon="mdi-recycle" color="green-darken-2" size="large"></v-icon>
                                   <v-tooltip text="使用上一步种子" activator="parent" location="top">
                                   </v-tooltip>
                               </v-btn>
                           </v-sheet>
                       </v-col>                
               </v-row>
               <v-row class="my-0 py-0">
                   <v-col>
                       <v-select
                       density="compact"
                       label="Script"
                       :items="sdStore.scriptsList.txt2img"
                       ></v-select>
                   </v-col>
               </v-row>      
           </v-col >
           <v-col lg="6">  
               <v-row>
                   <v-col>
                       <!-- {{ sdStore.txt2imgresponsedata.prompt }} -->
                       <!-- {{ predict["0"]}} -->
                       <v-sheet max-height="465" elevation="1" min-height="350" class="align-center rounded-lg justify-center mb-2 ">
                           <v-sheet class=" rounded-lg" v-show="sdStore?.progress.active">
                           <v-progress-linear
                               class="align-end rounded-lg"
                               v-model="sdStore.progressInt"
                               color="light-green"
                               height="15"
                               
                               >
                               <template v-slot:default="">
                                   <strong v-if="sdStore.progress.active">{{(sdStore.progressInt)+"%"}}</strong>
                                   <strong v-else-if="sdStore.progress.queued">任务下达中....</strong>
                                   <strong v-else-if="sdStore.progress.completed">绘图完成！</strong>                        
                               </template>
                           </v-progress-linear>
                           </v-sheet> 
                           <!-- <AnimationSD v-show="showanimation " :size="350"/> -->
                           <v-card height="450" v-show="sdStore.progress.live_preview ===null" class="rounded-lg">
                               <v-row class="ma-0">
                                   <v-col v-for="(img, index) in getimglist.values" :key="index"
                                       class=" ma-0 pa-2"
                                       cols="3" >                                    
                                       <v-hover v-slot="{ isHovering, props }">
                                           <v-card :class="{ 'selected': isHovering }" v-bind="props" class="ma-0"    @click="showImagePreview(img)">
                                               <v-img :src="'data:image/png;base64,'+img" height=100%  cover></v-img> 
                                           </v-card>
                                           <v-overlay
                                                   v-model="showimg"
                                                   contained
                                                   class="align-center justify-center "
                                                   @click="showimg = !showimg "
                                                   >
                                                   <v-img :src="'data:image/png;base64,'+Img" width="600" height="400"></v-img> 
                                           </v-overlay>
                                       </v-hover>
                                   </v-col>
                               </v-row>
                           </v-card>  
                           <v-card v-show="sdStore.progress.live_preview !=null" max-height="450" class="align-center justify-center rounded-lg">
                               <v-img :src="sdStore.progress.live_preview" height="450" ></v-img>
                           </v-card>
                       </v-sheet>
   
                       <v-row>
                           <v-col cols="auto">
                           <v-btn prepend-icon="mdi-content-save" height="50" elevation="2" >
                               
                               <template v-slot:prepend>
                               <v-icon color="success"></v-icon>
                               </template>
                               保存到SD项目
                           </v-btn>
                           </v-col>
                           <v-col cols="auto">
                           <v-btn prepend-icon="mdi-content-save" height="50" elevation="2" @click="updataimginfo()">
                               <template v-slot:prepend>
                               <v-icon color="success"></v-icon>
                               </template>
                               保存到相册
                           </v-btn>
                           </v-col>
                           <v-col cols="auto">
                           <v-btn prepend-icon="mdi-content-save" height="50" elevation="2">
                               发送到图生图
                           </v-btn>
                           </v-col>
                           
                       </v-row>
                   </v-col>
               </v-row>
               <v-row class="my-0">
                   <V-col>
                   <v-sheet max-height="800" class="overflow-y-auto " rounded ="lg">
                       <v-row class="ma-0">
                           <v-col
                           v-for="(img) in sdStore.userimgList.slice().reverse()" :key="img.id"
                           class="d-flex child-flex ma-0 pa-2"
                           cols="4" >
                               <v-hover v-slot="{ isHovering, props }">
                                   <v-card :elevation="isHovering ? 12 : 2" width="300" class="ma-0 " :class="{ 'selected': isHovering }" v-bind="props" @click="ispreview = !ispreview" >
                                       <v-img :src="img.img_url" aspect-ratio="1"   cover >
                                       </v-img>                  
                                   </v-card>
                               </v-hover>  
                               <v-overlay
                               class="align-center justify-center "
                               :v-model="ispreview"
                               activator="parent"
                               scroll-strategy="close"
                               @click="ispreview = !ispreview "
                               >
                                   <v-img :src="img.img_url"  width="1000"  height="800">  </v-img>  
                               </v-overlay> 
                           </v-col>
                       </v-row>
                   </v-sheet>
                   </V-col>
               </v-row>
           </v-col> 
       </v-row>
    </v-container>
   </template>
   
   <style lang="scss" scoped>
   .selected {
       // border-radius: 15%;
       padding: 2px;
       background-image: -webkit-linear-gradient(0deg, rgb(255, 215, 254), rgb(136, 136, 136));
   
   }
   .rim {
       border-style:solid; 
       border-width: 1px ;
       border-color: #9E9E9E;
   }
   .text-caption {
        display: block;
   }
   .tab {
    padding: 0;
    margin: 0;
    transform: translateX(-16px) translateY(-10px);
   }
   </style>