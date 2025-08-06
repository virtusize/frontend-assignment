// @vitest-environment happy-dom

import ClientModal from '@/components/ClientModal.vue'
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { toLocaleFormattedString } from '@/composables/timeUtils'
import { createMemoryHistory, createRouter } from 'vue-router'
import Home from '@/views/HomeView.vue'

const props = {
  title: 'Test modal',
  description: 'test modal description',
  client: {
    id: '0',
    gender: 'female',
    name: 'Steele Burch',
    company: 'TELEPARK',
    age: 21,
    picture: 'http://placehold.it/32x32',
    registered: '2021-05-31T02:20:58 -09:00',
    currency: 'USD',
    subscriptionCost: '1000.00',
  },
  open: true,
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes: routes,
})

const pinia = createTestingPinia({
  stubActions: true,
})

describe('ClientModal', () => {
  mount(ClientModal, {
    props,
    global: {
      plugins: [
        router,
        pinia,
      ],
    },
  })

  // ClientModal is teleported to the body
  it('should render', () => {
    expect(document.body.querySelector(`h2`)?.textContent).toBe(props.title)
    expect(document.body.querySelector(`p`)?.textContent).toBe(props.description)
    expect(document.body.querySelector(`input[value=${props.client.id}]`)).toBeTruthy()
    expect(document.body.querySelector(`input[value=${toLocaleFormattedString(props.client.registered)}]`)).toBeTruthy()
    expect(document.body.querySelector(`input[value=${props.client.gender}]`)).toBeTruthy()
    expect(document.body.querySelector(`input[value=${props.client.name}]`)).toBeTruthy()
    expect(document.body.querySelector(`input[value=${props.client.company}]`)).toBeTruthy()
    expect(document.body.querySelector(`input[value=${props.client.age}]`)).toBeTruthy()
    expect(document.body.querySelector(`input[value=${props.client.currency}]`)).toBeTruthy()
    expect(document.body.querySelector(`input[value=${
      Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: props.client.currency,
        currencyDisplay: 'narrowSymbol',
        currencySign: 'accounting',
      }).format(Number(props.client.subscriptionCost))
    }]`)).toBeTruthy()
  })
})

describe('ClientModal edit mode', () => {
  mount(ClientModal, {
    props: {
      ...props,
      edit: true,
    },
    global: {
      plugins: [
        router,
        pinia,
      ],
    },
  })

  it('should show a submit button', () => {
    expect(document.body.querySelector(`button[type=submit]`)).toBeTruthy()
  })
})
