<template lang="pug">
//- .q-pa-md.row.items-start.q-gutter-md
q-card.my-card(flat bordered)
  q-card-section(horizontal)
    q-card-section.q-pt-xs
      router-link.text-h5.q-mt-sm.q-mb-xs(:to="'/event/' + _id") {{title}}
      .text-caption.text-grey
        p {{ description }}
    q-card-section.col-5.flex.flex-center
      q-img.rounded-borders(:src='image')
  q-separator
  q-card-actions
    q-btn(flat round icon='event')
    q-btn(flat)
    q-btn(flat color='primary' label='Reserve')

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
  width: 30%
  max-width: 350px

</style>
