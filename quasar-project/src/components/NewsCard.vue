<template lang="pug">
div.q-ma-md(style="width:85%")
  .my-card
    q-img(:src="image" cover style="height:300px")
    q-card-section.q-pa-none.q-mt-lg(style="height:40px" align="right" )
      .q-ma-lg.text-h5.text-star.text-weight-bold.textUnderline-none {{ title }}
    //- q-card-section.flex.justify-center.column.items-center.q-pa-none.q-ma-sm(style="height:50px;")
    //-   .text-h7.text-center.text-subtitle.items-center.lessWord {{ description }}
    q-card-section.q-pa-none.q-mt-lg(style="height:50px magin-top:10px;" align="right" )
      router-link.text-h8.q-pa-md(:to="'/newsPage/' + _id") (...繼續閱讀)

</template>

<script setup>

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
  image: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  }
})

</script>

<style lang="sass">
.my-card
  // width:100%

</style>
