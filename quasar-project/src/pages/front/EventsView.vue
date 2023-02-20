<template lang="pug">
#front-events
  div.flex.q-ma-sm.justify-center.row.col-6
    .flex.justify-center.q-pa-lg.col-12.col-md-6(v-for="event in events" :key="event._id" )
      EventCard(v-bind="event")
  </template>

<script setup>
import { reactive } from 'vue'
import { api } from '@/boot/axios'
import Swal from 'sweetalert2'
import EventCard from '@/components/EventCard.vue'

const events = reactive([]);

(async () => {
  try {
    const { data } = await api.get('/events')
    events.push(...data.result)
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: '失敗',
      text: error?.response?.data?.message || '發生錯誤'
    })
  }
})()
</script>
