<template lang="pug">
.flex.wrap
  .div(align="center")
    img(:src="image" cover style="height:150px")
    q-card-section.q-pa-none
      router-link.text-center.text-weight-bold.textUnderline-none(:to="'/product/' + _id") {{ name }}
    q-card-section.q-pt-none
      .text-center.text-subtitle  ${{ price }}
    q-card-actions(align='right')
      //- q-btn(flat round color='red' icon='favorite')
      q-btn( icon="fa-solid fa-cart-plus" style="background: #182747 ; color: white" label="加入購物車" @click="editCart({_id, quantity: 1, text:'加入成功'})")
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
