<template lang="pug">
#front-event
  .eventContent.flex.justify-center.row
    .col-12.q-pl-xl(align="left")
      .text-h3 {{ event.daysfrom }}
      .text-h3 {{ event.daysto }}
    div.row.justify-evenly
      .eventLeft.col-2.q-ma-md
        .text-h7 參加人數上限：{{event.pplNum}}
        .text-h6 費用： $ {{ event.price }}
        .text-h7.q-mt-lg 活動分類：{{ event.category }}
        div.q-mt-lg
          .text-h7 講師：{{ event. lecturer }}
          q-expansion-item(expand-separator label='講師介紹')
            q-card
              q-card-section.q-pl-none
                p {{ event. lecturerInfo }}

      .eventRight.col-8.q-ma-sm
        .text-h4  {{ event.title }}
        #event-img.q-pt-md(style="width:450px;height:300px;").col-12.col-lg-12.flex.justify-center
          q-img(:src="event.image" style="border-radius:20px" cover )
        p.pre.q-mt-lg 活動簡介：{{ event.description }} 講師簡介：
      //-v-model.number傳入數字，v-model 預設是文字
      //- q-input(filled v-model.number="quantity" type="number" label="數量" :rules="[rules.required, rules.number]" min="1")
      //- q-btn(type="submit" color="primary") 參加活動
      //- :disabled="quantity < 1"
    .col-3
      q-btn(@click="addCart=true" color="primary" ) 參加活動

  //-參加活動的彈跳視窗
  q-dialog(v-model="addCart" persistent )
    q-card(class="bg-accent text-white" style="width: 400px")
      q-form(@submit="onSubmit" @reset="onReset")
        q-card-section(align="right")
          //- h5.text-white.text-weight-bold
          q-btn( dense flat icon='close' v-close-popup)
              q-tooltip Close
        q-card-actions(align="center" class="bg-white text-accent")
          div.flex.column
            p 活動名稱：{{ event.title }}
            p 活動期間：{{ event.daysfrom }} ~ {{ event.daysto }}
            p 費用： $ {{ event.price }}
            p(align="center") ~會員資料~
            p(v-if="isLogin") 會員帳號： {{ user.account }}
            p(v-if="isLogin") 會員信箱： {{ user.email }}
            p 請輸入聯絡電話
            q-input.phoneNum(filled v-model="phone" label='請輸入手機號碼' :rules="[rules.required, rules.phoneNum]")
            q-checkbox.checkbox(v-model="checkbox" :rules="[rules.requiredCheckbox]") 請勾選同意參加活動
            div(align="center")
              q-btn(type="reset" color="red" flat label="reset")
              q-btn(flat type='submit' label="submit"  :disabled="!checkbox" )

  //-下架通知
  q-dialog(:v-model="!event.sell" persistent )
    q-card(class="bg-accent text-white" style="width: 300px")
      q-card-section
        h5.text-white.text-weight-bold 沒有ㄌ餒
      q-card-actions( align="right" class="bg-white text-accent")
        q-btn(@click="router.go(-1)" flat label="back" v-close-popup )

  </template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { api, apiAuth } from '@/boot/axios'
import Swal from 'sweetalert2'
import { storeToRefs, defineStore } from 'pinia'
import EventCard from '@/components/EventCard.vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import isMobilePhone from 'validator/es/lib/isMobilePhone'

// 取資訊
const route = useRoute()
// 換頁
const router = useRouter()

const user = useUserStore()
const { editCart, isLogin } = storeToRefs(user)
const { editEventParticipant, editUser } = user

// 打開輸入電話號碼dialog
const addCart = ref(false)

const text = ref('')
const phone = ref('')
const quantity = ref(0)
const checkbox = ref(false)

const onSubmit = async () => {
  // if (!valid.value) return
  await editEventParticipant(route.params.id, phone.value)
  try {
    const { data } = await apiAuth.get('/users/me')
    if (!data.result.phone) {
      await editUser({
        phone: phone.value
      })
    } else {
      if (phone.value !== data.result.phone) {
        Swal.fire({
          icon: 'error',
          title: '失敗',
          text: '資料錯誤'
        })
        return
      }
    }
    addCart.value = false
    router.push('/Mypage/MypageOrders')
  } catch (error) {
    console.log(error)
    Swal.fire({
      icon: 'error',
      title: '失敗',
      text: '參加活動失敗'
    })
  }
}

const onReset = () => {
  phone.value = ''
}

const rules = {
  required (value) {
    return !!value || '欄位必填'
  },
  number (value) {
    // 0 加購物車沒意義
    return value > 0 || '數量錯誤'
  },
  phoneNum (value) {
    return isMobilePhone(value, 'zh-TW') || '手機號碼格式錯誤'
  },
  requiredCheckbox (value) {
    return value === true || '請同意參加活動'
  }
}

const event = reactive({
  _id: '',
  title: '',
  price: 0,
  daysfrom: '',
  daysto: '',
  description: '',
  lecturer: '',
  lecturerInfo: '',
  pplNum: '',
  image: '',
  // 預設是 false 會看到已下架
  sell: true,
  category: ''
});

(async () => {
  try {
    const { data } = await api.get('/events/' + route.params.id)
    // 不能直接 event.result 因為 event 是 const
    event._id = data.result._id
    event.title = data.result.title
    event.price = data.result.price
    event.daysfrom = data.result.daysfrom
    event.daysto = data.result.daysto
    event.description = data.result.description
    event.image = data.result.image
    event.lecturer = data.result.lecturer
    event.lecturerInfo = data.result.lecturerInfo
    event.pplNum = data.result.pplNum
    event.sell = data.result.sell
    event.category = data.result.category
    // 對使用者來說，頁面標題有變化
    document.title = '購物網 | ' + event.title
    // 修改 og 的 title 無效，
    // document.querySelector('meta[property="og:title"]').setAttribute('content', event.name)
    console.log(data.result)
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: '失敗',
      text: '取得商品失敗'
    })
    // 取失敗就回上一頁
    router.go(-1)
  }
})()
</script>
<style lang="sass">

</style>
