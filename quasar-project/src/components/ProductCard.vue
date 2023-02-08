<template lang="pug">
q-card.card-product.flex.wrap
.div
  img(:src="image" cover style="height:250px")
  q-card-section
    .text-h6.q-mb-xs(:to="'/products/' + _id") {{ name }}
  q-card-section.q-pt-none
  .text-subtitle1 ${{ price }}
  q-card-actions(align='right')
    q-btn(flat round color='red' icon='favorite')
      q-btn(flat round color='teal' icon='cart' @click="editCart({_id, quantity: 1, text:'加入成功'})")
        q-btn(flat round color='primary' icon='share').

  //-評論星星
    .row.no-wrap.items-center
      q-rating(size='18px' v-model='stars' :max='5' color='primary')
        span.text-caption.text-grey.q-ml-sm 4.2 (551)

  //-
    v-card.card-product
      v-img(:src="image" cover height="200px")
      v-card-title
        router-link.text-decoration-none.text-primary(:to="'/products/' + _id") {{ name }}
      v-card-subtitle ${{ price }}
      v-card-text
        p.pre {{ description }}
      v-card-actions
        v-btn(color="primary" prepend-icon="mdi-cart" @click="editCart({_id, quantity: 1, text:'加入成功'})") 加入購物車

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

const user = useUserStore()
const { editCart } = user
</script>
