import Vue from 'vue';
import VueRouter from 'vue-router';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import VueResource from 'vue-resource';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import App from './App';
import clientsList from './components/ClientsList';
import notFound from './components/NotFound';
import Notifications from 'vue-notification';

// registering snackbars for notifications
Vue.use(Notifications);

// registering bootstrap and bootstrap icons
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

// setting up VueResource and setting the base url
Vue.use(VueResource);
Vue.http.options.root = process.env.VUE_APP_API_HOST;

// setting up router
Vue.use(VueRouter);
const routes = [
  { path: '/', component: clientsList },
  { path: '*', component: notFound }
];
const router = new VueRouter({
  mode: 'history',
  routes
});

Vue.config.productionTip = false;

new Vue({
  router,
  render: createElement => createElement(App)
}).$mount('#app');
