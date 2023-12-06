import { createRouter, createWebHistory } from 'vue-router'
import HomePage from "../pages/HomePage.vue";

import RegisterPage from "../pages/RegisterPage.vue";
import LoginPage from "../pages/LoginPage.vue"

import HelpView from '../views/HelpView.vue'
import InitialView from '../views/InitialView.vue'
import CalendarView from '../views/CalendarView.vue'
import MeetingView from '../views/MeetingView.vue'
import PositionView from '../views/PositionView.vue'
import MemberView from '../views/MemberView.vue'
import ChatView from '../views/ChatView.vue'
import WorkView from '../views/WorkView.vue'
import TaskView from '../views/TaskView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginPage
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterPage
    },
    {
      path: '/member',
      name: 'member',
      component: MemberView
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // component: () => import('../views/MemberView.vue')
    },
    {
      path: '/home',
      component: HomePage,
      children: [
        {
          path: 'calendar',
          name: 'calendar',
          component: CalendarView
        },
        {
          path: 'help',
          name: 'help',
          component: HelpView
        },
        {
          path: 'position',
          name: 'position',
          component: PositionView
        },
        {
          path: 'meeting',
          name: 'meeting',
          component:MeetingView
        },
        {
          path: 'member',
          name: 'member',
          component:MemberView
        },
        {
          path: 'chat',
          name: 'chat',
          component:ChatView
        },
        {
          path: 'work',
          name: 'work',
          component:WorkView
        },
        {
          path: 'task',
          name: 'task',
          component:TaskView
        },
        {
          path: '',
          name: 'initial',
          component:InitialView
        },
      ]
    }

  ]
})

export default router
