import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'

import LogoHolder from '@/views/LogoHolder.vue'
import CreateAcc from '@/views/CreateAcc.vue'
import SignIn from '@/views/SignIn.vue'
import HomeView from '@/views/HomeView.vue'
import ProfileCard from '@/components/ProfileCard.vue'
import ChatCard from '@/components/ChatCard.vue'

import MessengerTab from '@/components/MessengerTab.vue'
import { useMessengerStore } from '@/stores/messengerStore'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: LogoHolder },
    { path: '/create', component: CreateAcc },
    { path: '/sign-in', component: SignIn },
    {
      path: '/home',
      component: HomeView,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          component: MessengerTab
        },
        {
          path: 'profile',
          component: ProfileCard
        },
        {
          path: 'chat-info',
          component: ChatCard
        }
      ]
    }
  ],
})

router.beforeEach((to, from) => {
  if (to.path === '/' && from.path === '/home') {
    const confirmed = window.confirm('Are you sure you want to sign out?')

    if (!confirmed) {
      return false
    }

    const messengerStore = useMessengerStore()
    messengerStore.logout()

    return true
  }
})

router.beforeEach((to, from) => {
  if (to.matched.length === 0)
    return from.fullPath
})

router.beforeEach((to, from, next) => {
  const messengerStore = useMessengerStore()
  const token = localStorage.getItem('authToken')

  if (to.meta.requiresAuth && !messengerStore.isLoggedIn && !token) {
    next('/sign-in')
  } else {
    next()
  }
})

export default router
