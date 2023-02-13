<template lang="pug">
.flex.wrap
  .div
    img(:src="image" cover style="height:150px")
    q-card-section.q-pa-none
      router-link.text-weight-bold.text.Underline-none(:to="'/events/' + _id") {{ title }}
    q-card-section.q-pt-none
      .text-subtitle 日期： {{ daysfrom }} ~ {{ daysto }}
    q-card-section.q-pt-none
      .text-subtitle 費用： ${{ price }}
    q-card-actions(align='right')
      q-btn(flat round color='red' icon='favorite')
      q-btn(flat round color='teal' icon='fa-solid fa-cart-plus' @click="editCart({_id, quantity: 1, text:'加入成功'})")
      q-btn(flat round color='primary' icon='share').

</template>

<script setup>
// import { useUserStore } from '@/stores/'

defineProps({
  /* eslint-disable */
  _id: {
      type: String,
      default: ''
  },
  /* eslint-enable */
  title: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    default: 0
  },
  daysfrom: {
    type: String,
    default: ''
  },
  daysto: {
    type: String,
    default: ''
  },
  // description: {
  //   type: String,
  //   default: ''
  // },
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

// const user = useUserStore()
// const { editCart } = user
</script>

<style lang="sass">

</style>
