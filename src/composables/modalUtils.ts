import { h, type Component } from 'vue'
import type { ComponentProps } from 'vue-component-type-helpers'

export function showModal<P extends Component>(component: P, props: ComponentProps<typeof component>) {
  const overlay = useOverlay()

  const modal = overlay.create(h(component, props))
  modal.open()

  return modal
}
