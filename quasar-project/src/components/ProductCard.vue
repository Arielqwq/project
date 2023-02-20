<template lang="pug">
//- .flex.wrap
div(align="center" style="height:500px")

  q-img(:src="image" cover style="height: 300px; max-width: 150px")
  q-card-section.q-pa-none.q-mt-lg(style="height:40px")
    router-link.text-center.text-weight-bold.textUnderline-none(:to="'/product/' + _id") {{ name }}
  q-card-section.flex.justify-center.column.items-center.q-pa-sm(style="height:50px;")
    .text-h5.text-center.text-subtitle.items-center ${{ price }}
  q-card-actions(align="center")
    //- q-btn(flat round color='red' icon='favorite')
    q-btn(icon="fa-solid fa-cart-plus" style="background: #182747 ; color: white" label="加入購物車" @click="editCart({_id, quantity: 1, text:'加入成功'})")
    //- q-btn(flat round color='primary' icon='share').

</template>

<script setup>
import { useUserStore } from '@/stores/user'

defineProps({
  /* eslint-disable */
  _id: {
      type: String,
      default: ''
  },
  /* eslint-enable */
  name: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    default: 0
  },
  image: {
    type: String,
    default: ''
  },
  sell: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    default: ''
  }
})

const user = useUserStore()
const { editCart } = user
</script>

<style lang="sass">

</style>
