import { createRouter, createWebHistory } from 'vue-router';
//
// import Router from 'vue-router'
// import home from '@/components/home'
// import blog from '@/components/blog'
// import services from '@/components/services'
// import contact from '@/components/contact'
// import details from '@/components/details'
//
// Vue.use(Router)


import NewBooks from '../templates/NewBooks.vue'
import Books from '../templates/BookStore.vue'
import Categories from '../templates/CategoryList.vue'
import SuperContainer from "../containers/SuperContainer.vue"
const routes = [
  {
    path: '/',
    name: 'SuperContainer',
    component: SuperContainer
  },
  {
    path: '/newbooks',
    name: 'NewBooks',
    component: NewBooks
  },
  {
    path: '/books',
    name: 'Books',
    component: Books
  },
  {
    path: '/categories',
    name: 'Categories',
    component: Categories
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;