<template lang="pug">
#home
  div
    q-carousel(animated v-model='slide' navigation infinite :autoplay='autoplay' arrows transition-prev='slide-right' transition-next='slide-left' @mouseenter='autoplay = false' @mouseleave='autoplay = true')
      q-carousel-slide(:name='1' img-src='https://images.unsplash.com/photo-1533050487297-09b450131914?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80')
      q-carousel-slide(:name='2' img-src='https://images.unsplash.com/photo-1564284369929-026ba231f89b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80')
      q-carousel-slide(:name='3' img-src='https://plus.unsplash.com/premium_photo-1668989820310-8e2e3684bdb4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80')
      q-carousel-slide(:name='4' img-src='https://images.unsplash.com/photo-1557008525-73e7bf440f76?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80')

    div.product-area.flex.q-ma-lg.justify-center.row.col-5
      swiper(v-bind='swiperOptions' )
        swiper-slide(v-for="product in products" :key="product._id" :slidesPerView="3")
          q-card(style="width:250px").flex.justify-center.q-pa-lg.col-12.col-md-6.col-lg-3
            ProductCard(v-bind="product")

    .event-area.flex.q-ma-lg.justify-center.row.col-5
      div.flex.row.wrap(v-for="event in events" :key="event._id")
        q-card(style="width:250px").flex.justify-center.q-pa-lg.col-12.col-md-6.col-lg-3
          EventCard(v-bind="event")

</template>
<script setup>
import { reactive, ref, onMounted } from 'vue'
import { api } from '@/boot/axios'
import Swal from 'sweetalert2'
import ProductCard from '@/components/ProductCard.vue'
import EventCard from '@/components/EventCard.vue'

// swiper
import { SwiperSlide, Swiper } from 'swiper/vue'
import { Navigation, Autoplay } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
// swiper

const products = reactive([])
const events = reactive([])

const slide = ref(1)
const autoplay = ref(true)

const swiperOptions = {
  slidesPerView: 1,
  spaceBetween: 10,
  navigation: {
    prevEl: '#swiper-dj-prev',
    nextEl: '#swiper-dj-next'
  },
  modules: [Navigation, Autoplay],
  breakpoints: {
    768: {
      slidesPerView: 2,
      spaceBetween: 20
    },
    992: {
      slidesPerView: 3,
      spaceBetween: 20
    }
  },
  autoplay: {
    delay: 5000
  },
  loop: true
};

(async () => {
  try {
    const { data } = await api.get('/products')
    products.push(...data.result)
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: '失敗',
      text: error?.response?.data?.message || '發生錯誤'
    })
  }
})();

(async () => {
  try {
    const { data } = await api.get('/events')
    events.push(...data.result)
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: '失敗',
      text: error?.response?.data?.message || '發生錯誤'
    })
  }
})()
</script>
<style lang="sass">

</style>
