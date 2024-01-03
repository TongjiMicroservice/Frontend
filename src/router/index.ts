import { createRouter, createWebHistory } from 'vue-router'
import MainPage from '../pages/MainPage.vue'
import ChatView from '@/views/ChatView.vue'
import DocumentsView from '../views/DocumentsView.vue'
import HomeView from '../views/HomeView.vue'
import PersonView from '../views/PersonView.vue'
import LoginPage from '@/pages/LoginPage.vue'
import RegisterPage from '@/pages/RegisterPage.vue'
import CreatePage from "@/pages/CreatePage.vue";
import SearchProjectPage from '@/pages/SearchProjectPage.vue'
import ContactView from '@/views/ContactView.vue'
import TaskView from '@/views/TaskView.vue'
import MeetingView from '@/views/MeetingView.vue'
import ScheduleView from '@/views/ScheduleView.vue'
import ManageView from '@/views/ManageView.vue'
import ProjectProgressView from '@/views/manage/ProjectProgressView.vue'
import TaskManageView from '@/views/manage/TaskManageView.vue'
import MemberManageView from '@/views/manage/memberManage/MemberManageView.vue'
import ApplicationManageView from '@/views/manage/memberManage/ApplicationManageView.vue'
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
      path:'/search_project',
      name:'search_project',
      component: SearchProjectPage
    },

    {
      path: '/',
      name: 'main',
      component: MainPage,
      children:[
        {
          path: '/chat/:userId?',
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
        },
        {
          path: '/contact',
          name: 'contact',
          component: ContactView,
        },
        {
          path:'/task_view',
          name:'task_view',
          component: TaskView
        },
        {
          path:'/meeting',
          name:'meeting',
          component:MeetingView
        },
        {
          path:'/schedule',
          name:'schedule',
          component:ScheduleView
        },
        {
          path:'/manage',
          name:'manage',
          component:ManageView,
          children:[
            {
              path:'/manage/project',
              name:'project',
              component:ProjectProgressView,
            },
            {
              path:'/manage/member',
              name:'member',
              component:MemberManageView,
            },
            {
              path:'/manage/application',
              name:'application',
              component:ApplicationManageView,
            },
            {
              path:'/manage/task',
              name:'task',
              component:TaskManageView,
            }
          ]
        }
      ]
    },
  ]
})

export default router
