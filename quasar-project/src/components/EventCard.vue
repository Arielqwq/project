<template lang="pug">

q-card.my-card
  q-img.rounded-borders(:src='image' cover)
    .absolute-bottom.text-subtitle2.text-center
      router-link.text-h6.q-mt-sm.q-mb-xs(:to="'/event/' + _id" style="color:white;") {{title}}

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
  description: {
    type: String,
    default: ''
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

// const user = useUserStore()
// const { editCart } = user
</script>

<style lang="sass">
.my-card
  width: 100%
  max-width: 500px

</style>
