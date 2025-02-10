import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

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
        needsAuth: true,
      },
      component: () => import('../features/dashboard/DashboardPage.vue'),
    },
    { path: '/:notFound(.*)', redirect: '/' },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.name === 'auth' && authStore.user) return next('/')
  if (to.meta?.needsAuth && !authStore.user) return next('/auth')

  next()
})

export default router
