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
    daysfrom: {
      type: String,
      required: [true, '缺少活動開始日期']
    },
    daysto: {
      type: String,
      required: [true, '缺少活動結束日期']
    },
    description: {
      type: String,
      required: [true, '缺少活動說明']
    },
    lecturer: {
      type: String,
      default: ''
    },
    lecturerInfo: {
      type: String,
      default: ''
    },
    pplNum: {
      type: Number,
      required: [true, '缺少活動人數']
    },
    image: {
      type: String,
      required: [true, '缺少活動圖片']
    },
    sell: {
      type: Boolean,
      required: [true, '缺少狀態']
    },
    category: {
      type: String,
      required: [true, '缺少分類'],
      // enum 限制欄位的值只能是裡面的其中一個
      enum: {
        values: ['體驗', '線上課程', '實體課程', '其他'],
        message: '分類錯誤'
      }
    },
    participant: {
      type: Array,
      default: []
    }
  },
  { versionKey: false }
)

export default model('events', schema)
