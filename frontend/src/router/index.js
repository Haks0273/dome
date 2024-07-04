import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/txt2img',
      name: 'Layout',
      component: () => import('../views/Layout/index.vue'),
      children:[
        {
          path:'/introduce',
          name:'introduce',
          component:() => import('../views/Introduce/index.vue')
        },
        {
          path:'/txt2img',
          name:'txt2img',
          component:() => import('../views/Image/txt2img.vue')
        },
        {
          path:'/img2img',
          name:'img2img',
          component:() => import('../views/Image/img2img.vue')
        },
      ]
    },
    // {
    //   path:'/txt2img',
    //   component:() => import('../views/Image/txt2img.vue')
    // }
  ]
})

export default router
