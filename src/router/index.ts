import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/auth',
      name: 'auth',
      component: () => import('../features/auth/AuthPage.vue'),
    },
    {
      path: '/',
      name: 'dashboard',
      meta: { 
        needsAuth: true 
      },
      component: () => import('../features/dashboard/Dashboard.vue'),
    },
  ],
})

router.beforeEach( (to, from, next) => {  
  const authStore = useAuthStore()

  if (to.name === 'auth' && authStore.user) return next('/')
  if (to.meta?.needsAuth && !authStore.user) return next('/auth');

  console.log( to.meta , 'meta data from router.beforeEach' )
  next()
})

export default router
