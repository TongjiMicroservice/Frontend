import { createRouter, createWebHistory } from 'vue-router'
import MainPage from '../pages/MainPage.vue'
import ChatView from '../views/ChatView.vue'
import DocumentsView from '../views/DocumentsView.vue'
import HomeView from '../views/HomeView.vue'
import PersonView from '../views/PersonView.vue'
import LoginPage from '@/pages/LoginPage.vue'
import TaskView from '../views/TaskView.vue'
import MeetingView from '../views/MeetingView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path:'/login',
      name:'login',
      component:LoginPage
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
          path: '/task',
          name: 'task',
          component: TaskView,
        },
        {
          path: '/meeting',
          name: 'meeting',
          component: MeetingView,
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
        }
      ]
    },
  ]
})

export default router
