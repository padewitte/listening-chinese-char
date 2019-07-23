import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import './registerServiceWorker'
import './plugins/element.js'
import VueConfetti from 'vue-confetti'
 
Vue.use(VueConfetti)

Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
