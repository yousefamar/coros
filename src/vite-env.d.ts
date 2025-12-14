/// <reference types="vite/client" />

import { Buffer } from 'buffer'

declare global {
  interface Window {
    Buffer: typeof Buffer
  }
}

declare module '*.glsl' {
  const content: string
  export default content
}

declare module '*.vert' {
  const content: string
  export default content
}

declare module '*.frag' {
  const content: string
  export default content
}
