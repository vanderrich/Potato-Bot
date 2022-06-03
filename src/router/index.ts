import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('../views/HomeView.vue')
        },
        {
            path: '/:pathMatch(.*)',
            component: () => import('../views/HomeView.vue')
        },
        {
            path: '/status',
            name: 'status',
            component: () => import('../views/Status.vue')
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            component: () => import('../views/Dashboard.vue')
        }
    ]
})

export default router
