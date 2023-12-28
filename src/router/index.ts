import { createRouter, createWebHistory } from 'vue-router'
import MainPage from '../pages/MainPage.vue'
import ChatView from '../views/ChatView.vue'
import DocumentsView from '../views/DocumentsView.vue'
import HomeView from '../views/HomeView.vue'
import PersonView from '../views/PersonView.vue'
import LoginPage from '@/pages/LoginPage.vue'
import SearchView from "@/views/SearchView.vue";
import RegisterPage from '@/pages/RegisterPage.vue'
import CreatePage from "@/pages/CreatePage.vue";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path:'/login',
      name:'login',
      component:LoginPage
    },
    {
      path:'/register',
      name:'register',
      component: RegisterPage
    },
    {
      path:'/create_project',
      name:'create_project',
      component: CreatePage
    },
    {
      path: '/',
      name: 'main',
      component: MainPage,
      children:[
        {
          path: '/chat',
          name: 'chat',
          component: ChatView,
        },
        {
          path: '/docs',
          name: 'docs',
          component: DocumentsView,
        },
        {
          path: '/home',
          name: 'home',
          component: HomeView,
        },
        {
          path: '/person',
          name: 'person',
          component: PersonView,
        },
        {
          path: '/search',
          name: 'search',
          component: SearchView,
        }
      ]
    },

  ]
})

export default router
