<template lang="pug">
#home(style="height:100vh;" )
  div(style="padding:35px")
    q-carousel( style=" height:70vh" animated v-model='slide' navigation infinite :autoplay='autoplay' arrows transition-prev='slide-right' transition-next='slide-left' @mouseenter='autoplay = false' @mouseleave='autoplay = true')
      q-carousel-slide(:name='1' img-src='https://images.unsplash.com/photo-1533050487297-09b450131914?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80')
      q-carousel-slide(:name='2' img-src='https://images.unsplash.com/photo-1564284369929-026ba231f89b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80')
      q-carousel-slide(:name='3' img-src='https://plus.unsplash.com/premium_photo-1668989820310-8e2e3684bdb4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80')
      q-carousel-slide(:name='4' img-src='https://images.unsplash.com/photo-1557008525-73e7bf440f76?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80')

    .product-area
      .row.align-content-center.justify-content-center
        .col-1
          #swiper-dj-prev.swiper-button-prev
        .col-10
          swiper(v-bind='swiperOptions' @swiper='getSwiperRef')
            swiper-slide( v-for="product in products" :key="product._id" :slidesPerView="4")
              .productCard.flex.justify-center.q-pa-lg.col-12.col-md-6.col-lg-3
                ProductCard(v-bind="product")
        .col-1
          #swiper-dj-next.swiper-button-next

    .homeEvent-area1.flex.column.justify-around
      .firstEvent
        .row.flex.justify-center(style="height:100%")
          .homeEventLeft.col-12.col-md-4.ml-auto.flex.column.justify-around
            q-img(style="height:100%; mix-width:270px")
              img(:src="events[0]?.image")
          .homeEventRight.col-12.col-md-4.ml-auto.flex.column.justify-around
            .homeEventContent(style="height:75%").flex.column.no-wrap
              .contentTitle.q-mb-md
                .text-h3 {{ events[0]?.title }}
              .contentText.q-mb-md
                p.lessWord {{ events[0]?.description }}
              .contentBtn
                q-btn(style="width:250px; background: #182747 ; color: white" label="LEARN MORE")

    .homeEvent-area2.flex.column.justify-around
      .secondEvent
        .row.flex(style="height:100%")
          .homeEventLeft-2.col-12.col-md-7.ml-auto.flex.column

            q-img(style="height:100%; width:80%")
              img(:src="events[1]?.image")
          .homeEventRight-2.col-12.col-md-3.ml-auto
            .homeEventContent-2(style="height:75%").flex.column.no-wrap
              .contentTitle.q-mb-md
                .text-h3 {{ events[1]?.title }}
              .contentText.q-mb-md
                p.lessWord {{ events[1]?.description }}
              .contentBtn
                q-btn(style="width:250px; background: #182747 ; color: white" label="LEARN MORE")

        //- div.flex.row.wrap(v-for="event in events" :key="event._id")
        //-   q-card(style="width:250px").flex.justify-center.q-pa-lg.col-12.col-md-6.col-lg-3
            //- EventCard(v-bind="event")

            .firstEvent

    .homeFooter.flex.column.justify-around
      .row(style="height:100%").q-pa-md
        .col-3.q-pa-md
          q-list
            q-item(clickable v-ripple)
              q-item-section.text-h5 聯絡我們
            q-item(clickable v-ripple)
              q-item-section.text-h7 Main: 1-800-230-4321
            q-item
              q-btn(icon="fa-brands fa-square-facebook")
              q-btn(icon="fa-solid fa-envelope")
              q-btn(icon="fa-brands fa-square-twitter")
        .col-3.q-pa-md
          q-list
            q-item(clickable v-ripple)
              q-item-section.text-h5 客戶服務
            q-item(clickable v-ripple)
              q-item-section.text-h7 FAQ問與答
            q-item(clickable v-ripple)
              q-item-section.text-h7 詢問單說明
            q-item(clickable v-ripple)
              q-item-section.text-h7 配送資訊
            q-item(clickable v-ripple)
              q-item-section.text-h7 退換貨說明

        .col-3.q-pa-md
          q-list
            q-item(clickable v-ripple)
              q-item-section.text-h5 相關政策
            q-item(clickable v-ripple)
              q-item-section.text-h7 品質保證
            q-item(clickable v-ripple)
              q-item-section.text-h7 服務條款
            q-item(clickable v-ripple)
              q-item-section.text-h7 隱私權政策及法令宣告

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

const swiperRef = ref(null)
// Stop autoplay
const getSwiperRef = (swiperInstance) => {
  swiperRef.value = swiperInstance
  swiperRef.value.autoplay.stop()
}

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
      slidesPerView: 3,
      spaceBetween: 20
    },
    992: {
      slidesPerView: 4,
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
    const results = await Promise.all([api.get('/products'), api.get('/events/eventsforhome'), api.get('/news')])

    const productsdata = results[0].data
    products.push(...productsdata.result)
    console.log(products)

    const eventsforhomedata = results[1].data
    events.push(...eventsforhomedata.result)
    console.log(events)

    const newsfordata = results[2].data
    events.push(...eventsforhomedata.result)
    console.log(events)
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
