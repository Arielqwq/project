import { Schema, model } from 'mongoose'

const schema = new Schema(
  {
    title: {
      type: String,
      required: [true, '缺少活動名稱']
    },
    price: {
      type: Number,
      min: [0, '價格錯誤'],
      required: [true, '缺少活動價格']
    },
    date: {
      type: String,
      required: [true, '缺少活動日期']
    },
    description: {
      type: String,
      required: [true, '缺少活動說明']
    },
    image: {
      type: String,
      required: [true, '缺少活動圖片']
    },
    sell: {
      type: Boolean,
      required: [true, '缺少狀態']
    },
    participant: {
      type: Array,
      default: []
    }
  },
  { versionKey: false }
)

export default model('events', schema)
