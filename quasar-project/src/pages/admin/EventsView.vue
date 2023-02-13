<template lang="pug">
#admin-events
  h3 admin-events
  div(class="q-px-xl row")
    .col-12
      q-btn( @click="openDialog(-1)" color="primary" label="新增活動")
  div(class="q-px-xl q-mt-md")
    q-table(title="活動資訊" :columns="columns" :rows="events" row-key="_id" :filter="filter" :rows-per-page-options="[5]")
      //- 搜尋
      template( v-slot:top-right)
          q-input( borderless dense debounce="300" v-model="filter" placeholder="Search")
            template( v-slot:append)
              q-icon( name="search")

      //- 圖片顯示
      template( v-slot:body-cell-image="props")
          img(:src='props.row.image' style='height: 100px;')

      //- 日期顯示
      template( v-slot:body-cell-days="props")
        p

      //- 編輯按鈕
      template(#body-cell-edit="data")
        q-td(class="q-pa-md q-gutter-sm")
          q-btn( round color="primary" text-color="white" icon="edit" @click="openDialog(events.findIndex((event)=> event._id === data.row._id))")

    //- 新增、編輯活動
    q-dialog(align="center" v-model="form.dialog" persistent)
      q-card( class="column" style="width: 700px; max-width: 80vw;")
        q-form(@submit="onSubmit" @reset="onReset")
          q-card-actions.row.flex.justify-between
            .div(align="left" class="q-pa-md row" )
              .text-center {{ form._id.length > 0 ? '編輯活動' : '新增活動' }}
            q-btn(dense flat icon='close' v-close-popup)
              q-tooltip Close

          q-card-section.column.q-gutter-md
            .col-12
              q-input(square filled v-model="form.title" label="活動名稱" :rules="[rules.required]")
            .col-6
              q-input(square filled v-model="form.price" type="number" prefix="$" label="活動費用" :rules="[rules.required, rules.price]")
            .col-6
              q-checkbox(v-model="form.sell" label="上架")
            .col-12
              q-input(square filled v-model="form.daysfrom" type="date"  label="活動開始日期" :rules="[rules.required]")
              //-   p 活動開始日期： {{ days }}
              //- q-date(v-model='form.days' range multiple)
            .col-12
              q-input(square filled v-model="form.daysto" type="date"  label="活動結束日期" :rules="[rules.required]")
            .col-12
              q-input(square filled v-model="form.description" type="textarea" label="活動說明" :rules="[rules.required]")
            .col-12
              q-select(filled v-model="form.category" :options="categories" label="活動分類" :rules="[rules.required]")
            .col-2
              q-input(square filled v-model="form.pplNum" type="number" label="人數上限" :rules="[rules.required]" )
            .col-2
              q-input(square filled v-model="form.lecturer" label="講師姓名" )
            .col-2
              q-input(v-if='!haslecturer' square filled v-model="form.lecturerInfo" label="講師簡介" )

              .row
                  q-img(:src="events[form.idx]?.image" style="height:100px")
                  q-file(filled v-model="form.image" label="請上傳圖片" style="max-height: 50px")
                    template(v-slot:append)
                      q-icon(name="close" @click="clear")

          q-card-actions(align='right')
            q-btn(:disabled="form.loading" flat label='reset' type="reset" color='red')
            q-btn(:disabled="form.loading" flat label='submit' type="submit" color='green')

</template>

<script setup>
import { apiAuth } from '@/boot/axios'
import Swal from 'sweetalert2'
import { ref, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { useEventStore } from '@/stores/event'

const event = useEventStore()
const { haslecturer } = storeToRefs(event)

const categories = ['體驗', '線上課程', '實體課程', '其他']

const rules = {
  required (value) {
    return !!value || '欄位必填'
  },
  price (value) {
    return value >= 0 || '價格錯誤'
  }
}

const clear = () => {
  form.image = []
}

const events = reactive([])
const filter = ref('')
// const days = ref([])

const form = reactive({
  // 如果 id 有東西就是編輯，沒有是新增
  _id: '',
  title: '',
  price: 0,
  daysfrom: '',
  daysto: '',
  description: '',
  pplNum: '',
  lecturer: '',
  lecturerInfo: '',
  image: undefined,
  // 預設下架
  sell: false,
  category: '',
  valid: false,
  loading: false,
  dialog: false,
  idx: -1
})

const openDialog = (idx) => {
  // 陣列索引從 0 開始，設定 -1 代表不在陣列裡，為新增活動
  if (idx === -1) {
    form._id = ''
    form.title = ''
    form.price = 0
    form.daysfrom = ''
    form.daysto = ''
    form.description = ''
    form.pplNum = ''
    form.lecturer = ''
    form.lecturerInfo = ''
    form.image = undefined
    form.sell = false
    form.category = ''
    form.valid = false
    form.loading = false
    form.idx = -1
  } else {
    form._id = events[idx]._id
    form.title = events[idx].title
    form.price = events[idx].price
    form.daysfrom = events[idx].daysfrom
    form.daysto = events[idx].daysto
    form.description = events[idx].description
    form.pplNum = events[idx].pplNum
    form.lecturer = events[idx].lecturer
    form.lecturerInfo = events[idx].lecturerInfo
    form.image = events[idx].image
    form.sell = events[idx].sell
    form.category = events[idx].category
    form.valid = false
    form.loading = false
    form.idx = idx
  }
  form.dialog = true
}

const columns = [
  {
    name: 'title',
    required: true,
    label: '名稱',
    align: 'left',
    field: events => events.title
  },
  {
    name: 'price',
    required: true,
    label: '費用',
    align: 'left',
    field: events => events.price,
    format: val => `${val}`,
    sortable: true
  },
  {
    name: 'daysfrom',
    required: true,
    label: '開始日期',
    align: 'left',
    field: events => events.daysfrom
  },
  {
    name: 'daysto',
    required: true,
    label: '結束日期',
    align: 'left',
    field: events => events.daysto
  },
  {
    name: 'description',
    required: true,
    label: '簡介',
    align: 'left',
    field: events => events.description
  },
  {
    name: 'lecturer',
    required: true,
    label: '講者',
    align: 'left',
    field: events => events.lecturer
  },
  {
    name: 'lecturerInfo',
    required: true,
    label: '講者簡介',
    align: 'left',
    field: events => events.lecturerInfo
  },
  {
    name: 'pplNum',
    required: true,
    label: '人數上限',
    align: 'left',
    field: events => events.pplNum
  },
  {
    name: 'image',
    required: true,
    label: '圖片',
    align: 'left',
    field: events => events.image
  },
  {
    name: 'sell',
    required: true,
    label: '狀態',
    align: 'left',
    field: events => events.sell
  },
  {
    name: 'edit',
    label: '編輯',
    align: 'left'
  }]

const onReset = () => {
  form.title = null
  form.price = null
  form.daysfrom = null
  form.daysto = null
  form.description = null
  form.pplNum = null
  form.lecturer = null
  form.lecturerInfo = null
  form.image = undefined
  form.sell = false
  form.category = null
}

const onSubmit = async () => {
  // if (!form.valid) return
  form.loading = true
  // 建立一個新的 formdata 物件
  // fd.append(key, value)
  const fd = new FormData()
  fd.append('title', form.title)
  fd.append('price', form.price)
  fd.append('daysfrom', form.daysfrom)
  fd.append('daysto', form.daysto)
  fd.append('description', form.description)
  fd.append('pplNum', form.pplNum)
  fd.append('lecturer', form.lecturer)
  fd.append('lecturerInfo', form.lecturerInfo)
  fd.append('image', form.image)
  // fd.append('images', form.images)
  console.log(form.images)
  fd.append('sell', form.sell)
  fd.append('category', form.category)
  try {
    // 當id長度為 0，新增
    if (form._id.length === 0) {
      const { data } = await apiAuth.post('/events', fd)
      events.push(data.result)
      Swal.fire({
        icon: 'success',
        title: '成功',
        text: '新增活動成功'
      })
      console.log(events)
    } else {
      const { data } = await apiAuth.patch('/events/' + form._id, fd)
      events[form.idx] = data.result
      Swal.fire({
        icon: 'success',
        title: '成功',
        text: '編輯活動成功'
      })
    }
    form.dialog = false
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: '失敗',
      text: error?.response?.data?.message || '發生錯誤'
    })
  }
  form.loading = false
}
</script>
