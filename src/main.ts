import { createApp } from 'vue'
import App from './App.vue'
import router from './router.ts'
import './styles/main.scss'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCog, faPlus, faChevronDown, faAnglesLeft, faAngleLeft, faAngleRight, faAnglesRight, faTimes, faSignOutAlt, faSave } from '@fortawesome/free-solid-svg-icons'

library.add(faCog, faPlus, faChevronDown, faAnglesLeft, faAngleLeft, faAngleRight, faAnglesRight, faTimes, faSignOutAlt, faSave)

const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(router).mount('#app')
