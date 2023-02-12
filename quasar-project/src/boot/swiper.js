import { boot } from 'quasar/wrappers'
import { Swiper, SwiperSlide } from 'swiper/vue'

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(({ app }) => {
  app.use(Swiper)
  app.use(SwiperSlide)
})
