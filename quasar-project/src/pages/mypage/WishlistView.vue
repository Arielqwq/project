<template lang="pug">
#wishlist
  h3.text-center 我的願望清單
    .div(class="q-px-xl row")
      .col-12
        q-table(:columns="columns" :rows="loves" row-key="p_id" :filter="filter" )

          //- 商品圖片
          template( v-slot:body-cell-image="props")
            q-td
              img(:src='props.row.image' style='height: 100px;')

          //- 刪除商品
          template(#body-cell-edit="data")
            q-td
              //- span {{ data.row._id }}
              q-btn(round color="red"  @click="removeFromWishlist(data.row._id)" icon="fa-solid fa-trash-can")
</template>
<script setup>
import { ref, reactive, computed } from 'vue'
import Swal from 'sweetalert2'
import { apiAuth } from '@/boot/axios'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { data } from 'browserslist'

const router = useRouter()

const user = useUserStore()
const { removeLove } = user
const filter = ref('')
const loves = reactive([])

const removeFromWishlist = async (_id) => {
  try {
    console.log(_id)
    console.log(loves)
    // await apiAuth.get('/users/love', { _id, love: false })
    const idx = loves.findIndex((loves) => loves._id === _id)
    loves.splice(idx, 1)
    await removeLove({ _id: loves[idx]._id })

    Swal.fire({
      icon: 'success',
      title: '成功',
      text: '已從收藏刪除商品'
    })
  } catch (error) {
    console.log(error)
    Swal.fire({
      icon: 'error',
      title: '失敗',
      text: '刪除商品失敗'
    })
  }
}

const columns = [
  {
    name: 'name',
    required: true,
    label: '商品名稱',
    align: 'left',
    field: row => row.name,
    sortable: true
  },
  {
    name: 'image',
    required: true,
    label: '商品圖片',
    align: 'left',
    field: row => row.image,
    sortable: true
  },
  {
    name: 'price',
    required: true,
    label: '商品價格',
    align: 'left',
    field: row => row.price,
    sortable: true
  },

  {
    name: 'edit',
    required: true,
    label: '編輯',
    align: 'left'
  }
];

(async () => {
  try {
    const { data } = await apiAuth.get('/users/love')
    loves.push(...data.result)
    console.log(loves)
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: '失敗',
      text: '取得我的收藏失敗'
    })
  }
})()

</script>
