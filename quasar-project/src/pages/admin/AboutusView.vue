<template lang="pug">
#admin-aboutUs
  h3.text-center 關於我們管理
  .div(class="q-px-xl row")
    .col-12
      q-btn(@click="openDialog(form._id.length > 0 ? 0 : -1)" color="primary" label="編輯")
  div(class="q-px-xl q-mt-md " )
    div( style="width:80% ;height:500px ;border-radius: 30px; background-color:rgb(255, 245, 238); padding:20px ")
      h5 標題： {{ aboutus[0]?.title}}
      h6 內容： {{ aboutus[0]?.description }}
      h6 圖片：
        img(:src='aboutus[0]?.image' style='height: 100px;')

    q-dialog(align="center" v-model="form.dialog" persistent)
      q-card( class="column" style="width: 700px; max-width: 80vw;")
        q-form(@submit="onSubmit" @reset="onReset")
          q-card-actions.row.flex.justify-between
            .div(align="left" class="q-pa-md row" )
              .text-center {{ form._id.length > 0 ? '編輯關於我們' : '新增關於我們' }}
            q-btn(dense flat icon='close' v-close-popup)
              q-tooltip Close
          q-card-section.column.q-gutter-md
            .col-12
              q-input(square filled v-model="form.title" label="關於我們標題" :rules="[rules.required]")
            .col-12
              q-input(square filled v-model="form.description" type="textarea" label="關於我們內容" :rules="[rules.required]")
            .col-5
              .row
                  //- .col-3( v-for="i in aboutus[form.idx]?.image" :key="i")
              q-img(:src="aboutus[form.idx]?.image" style="height:100px")
              q-file(filled v-model="form.image" label="請上傳圖片" style="max-height: 50px")
                  template(v-slot:append)
                    q-icon(name="close" @click="clear")

          q-card-actions(align='right')
            q-btn(:disabled="form.loading" flat label='reset' type="reset" color='red')
            q-btn(:disabled="form.loading" flat label='submit' type="submit" color='green')

</template>

<script setup>
import { apiAuth } from '@/boot/axios'
import { log } from 'console'
import Swal from 'sweetalert2'
import { ref, reactive } from 'vue'

const rules = {
  required (value) {
    return !!value || '欄位必填'
  }
}

const clear = () => {
  form.image = []
}

const aboutus = reactive([])

const form = reactive({
  _id: '',
  title: '',
  image: undefined,
  description: ''
})

const openDialog = (idx) => {
  // console.log(idx)
  if (idx === -1) {
    form.title = ''
    form.image = undefined
    form.description = ''
  }
  form.dialog = true
}

const onReset = () => {
  form.title = ''
  form.image = undefined
  form.description = ''
}

const onSubmit = async () => {
  // if (!form.valid) return
  form.loading = true
  // 建立一個新的 formdata 物件
  // fd.append(key, value)
  const fd = new FormData()
  fd.append('title', form.title)
  fd.append('description', form.description)
  fd.append('image', form.image)
  // fd.append('images', form.images)
  try {
    // 當id長度為 0，新增
    if (form._id.length === 0) {
      const { data } = await apiAuth.post('/aboutus', fd)
      aboutus.push(data.result)
      Swal.fire({
        icon: 'success',
        title: '成功',
        text: '新增成功'
      })
    } else {
      const { data } = await apiAuth.patch('/aboutus/' + form._id, fd)
      console.log(data.result)
      const index = aboutus.findIndex((item) => item._id === form._id)
      aboutus[index] = data.result
      Swal.fire({
        icon: 'success',
        title: '成功',
        text: '編輯成功'
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

(async () => {
  try {
    const { data } = await apiAuth.get('/aboutus')
    aboutus.push(...data.result)
    form._id = aboutus[0]._id
    form.title = aboutus[0].title
    form.image = aboutus[0].image
    form.description = aboutus[0].description
    console.log(form)
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: '失敗',
      text: error?.response?.data?.message || '發生錯誤'
    })
  }
})()
</script>
