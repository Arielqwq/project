import { boot } from 'quasar/wrappers'
import VImageInput from 'vue3-img-input'

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
// 從這裡解構出 app
export default boot(({ app }) => {
  // something to do
  app.component('VImageInput', VImageInput)
})
