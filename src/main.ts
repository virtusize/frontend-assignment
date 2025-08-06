import { createApp } from 'vue'
import App from '@/App.vue'
import '@/main.css'

import router from '@/router'
import VueAnnouncer from '@vue-a11y/announcer'
import '@vue-a11y/announcer/dist/style.css'

import ui from '@nuxt/ui/vue-plugin'

import { createAuth0 } from '@auth0/auth0-vue'

import { createPinia } from 'pinia'

const app = createApp(App)

app.use(VueAnnouncer)
app.use(router)

app.use(ui)

app.use(
  createAuth0({
    domain: import.meta.env.VITE_AUTH0_DOMAIN,
    clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
    authorizationParams: {
      redirect_uri: window.location.origin,
    },
  }),
)

app.use(createPinia())

app.mount('#app')
