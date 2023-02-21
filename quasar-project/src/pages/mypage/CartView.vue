<template lang="pug">
#cart
  h3.text-center 購物車
    .div(class="q-px-xl row")
      .col-12
        q-table(:columns="columns" :rows="cart" row-key="p_id"  :filter="filter"  )

          //- 下架商品出現在購物車，要變紅色，且不能結帳
          //- template(v-slot:body-cell='props')
          //-   q-td( :class="{'bg-red': !props.row.p_id.sell}")

            //- 過濾
          template(v-slot:top-right)
            q-input(borderless dense debounce="300" v-model="filter" placeholder="Search")
              template( v-slot:append)
                q-icon( name="search")
          //- 商品名稱
            <template v-slot:body="props">
          template(v-slot:body-cell-name='props')
            q-td
              p {{props.row.p_id.name}}
          //- template(v-slot:body-cell-body='props.row.name')
            q-tr(:props="props")
              q-td( key="name" :props="props")
                p {{props.row.p_id.name}}

          //- 商品圖片
          template( v-slot:body-cell-image="props")
            q-td
              img(:src='props.row.p_id.image' style='height: 100px;')

          //- 商品價格
          template(v-slot:body-cell-price='props')
            q-td
              p {{props.row.p_id.price}}

          //- 增減商品數量
          template(#body-cell-quantity="props")
            q-td
              div.flex
                q-btn(color="primary" @click="updateCart(props.row._id, -1,'修改成功')" label="-")
                p &nbsp;{{ props.row.quantity }}&nbsp;
                q-btn(color="primary" @click="updateCart(props.row._id, +1,'修改成功')" label="+")

          //- 商品小計
          template(v-slot:body-cell-happy="props")
            q-td
              p {{ props.value }}

          //-刪除商品
          template(#body-cell-edit="data")
            q-td
              //- span {{ data.row._id }}
              q-btn(round color="red" @click="updateCart(data.row._id, data.row.quantity*-1 ,'刪除商品')" icon="fa-solid fa-trash-can")

      .col-12
        p 總金額 {{ totalPrice }}
        //- q-btn(color="green" :disabled="!canCheckout" @click="onCheckoutBtnClick" label="結帳")
        q-btn(color="green" :disabled="!canCheckout" @click="addCart = true" label="結帳")

    q-dialog(v-model="addCart" persistent)
      q-card(class="bg-accent text-white" style="width: 500px")
        q-form(@submit="onCheckoutBtnClick" @reset="onReset")
          q-card-section(align="right")
            q-btn(dense flat icon='close' v-close-popup)
                q-tooltip Close
          q-card-actions(align="center" class="bg-white text-accent")
            div.flex.column.q-pa-md
              h6.q-pa-none.q-ma-none 為確認您已是成年人，
              h6.q-pa-none.q-ma-none 請輸入您真實的出生年月日及姓名。
              p.q-mt-md 請輸入姓名
              q-input(filled v-model="inputUsername" label='請輸入您的真實姓名' :rules="[rules.required,rules.maxLength]")
              q-input(type="date" v-model="birthday" label="請輸入您的出生年月日" :rules="[rules.required,rules.countyYears]" )
              q-checkbox.checkbox(v-model="checkbox" :rules="[rules.requiredCheckbox]") 我真的是成年人!!
              div(align="center")
                q-btn(type="reset" color="red" flat label="reset")
                q-btn(flat type='submit' label="submit" :disabled="!checkbox" @click="onCheckoutBtnClick" )

</template>

<script setup>

import { ref, reactive, computed } from 'vue'
import Swal from 'sweetalert2'
import { apiAuth } from '@/boot/axios'
import { useUserStore } from '@/stores/user'
import { useRoute, useRouter } from 'vue-router'
import { data } from 'browserslist'

const route = useRoute()
const router = useRouter()

const user = useUserStore()
const { editCart, checkout, editUser } = user
const filter = ref('')
const checkbox = ref(false)
// 打開輸入生日與姓名 dialog
const addCart = ref(false)
const inputUsername = ref('')
const birthday = ref('')

const cart = reactive([])

const rules = {
  required (value) {
    return !!value || '欄位必填'
  },
  maxLength (value) {
    return value.length <= 20 || '最多輸入20個字'
  },
  countyYears (value) {
    const birthday = new Date(value).getTime()
    const toDay = new Date().getTime()
    const year = 1000 * 60 * 60 * 24 * 365
    const countTime = Math.abs(toDay - birthday)
    const checkYear = Math.trunc(countTime / year)
    return checkYear >= 18
  },
  requiredCheckbox (value) {
    return value === true || '請確認您已是成年人'
  }
}

const columns = [
  {
    name: 'name',
    required: true,
    label: '商品名稱',
    align: 'left',
    field: cart => cart.p_id.name,
    sortable: true
  },
  {
    name: 'image',
    required: true,
    label: '商品圖片',
    align: 'left',
    field: row => row.p_id.image,
    sortable: true
  },
  {
    name: 'price',
    required: true,
    label: '商品價格',
    align: 'left',
    field: row => row.p_id.price,
    sortable: true
  },
  {
    name: 'quantity',
    required: true,
    label: '商品數量',
    align: 'left',
    field: row => row.quantity,
    sortable: true
  },
  {
    name: 'happy',
    required: true,
    label: '小計',
    align: 'left',
    field: row => row.quantity * row.p_id.price,
    sortable: true
  },
  {
    name: 'edit',
    required: true,
    label: '編輯',
    align: 'left'
  }
]

const updateCart = async (id, quantity, text) => {
  const idx = cart.findIndex((cart) => cart._id === id)
  console.log(idx)
  await editCart({ _id: cart[idx].p_id._id, quantity, text })
  cart[idx].quantity += quantity
  if (cart[idx].quantity <= 0) {
    cart.splice(idx, 1)
  }
}

const onCheckoutBtnClick = async (val) => {
  try {
    const { data } = await apiAuth.get('/users/me')
    if (!data.result.birth || !data.result.username) {
      await editUser({
        username: inputUsername.value,
        birth: birthday.value
      })
    } else {
      if (birthday.value !== data.result.birth || inputUsername.value !== data.result.username) {
        Swal.fire({
          icon: 'error',
          title: '失敗',
          text: '資料錯誤'
        })
        return
      }
    }
    addCart.value = false

    await checkout()
    console.log('2')
    router.push('/Mypage/MypageOrders')
  } catch (error) {
    console.log(error)
    Swal.fire({
      icon: 'error',
      title: '失敗',
      text: '結帳失敗'
    })
  }
}

// const onCheckoutBtnClick = async () => {
//   await checkout()
//   router.push('/orders')
// }

const totalPrice = computed(() => {
  return cart.reduce((total, current) => {
    return total + (current.p_id.price * current.quantity)
  }, 0)
})

const canCheckout = computed(() => {
  return cart.length > 0 && !cart.some(product => {
    return !product.p_id.sell
  })
});

(async () => {
  try {
    const { data } = await apiAuth.get('/users/cart')
    cart.push(...data.result)
    console.log(cart)
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: '失敗',
      text: '取得購物車失敗'
    })
  }
})()
</script>
