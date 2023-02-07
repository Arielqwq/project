import products from '../models/products.js'

export const createProduct = async (req, res) => {
  try {
    console.log(req.files)
    const result = await products.create({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      image: req.files?.image?.[0]?.path || '',
      images: req.files?.images?.map(file => file.path) || [],
      sell: req.body.sell,
      category: req.body.category
    })
    // .send() 或 .json() 都可，統一.json()。
    // .send() 會根據資料型態去改變回傳內容， .send('asdasd') 就預設回傳文字
    // res.status(200).send({ success: true, message: '', result })
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}

// 上架，查詢方法是 sell: true
export const getSellProducts = async (req, res) => {
  try {
    const result = await products.find({ sell: true })
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

// 只有管理員看得到
export const getAllProducts = async (req, res) => {
  try {
    // 沒有任何查詢條件
    const result = await products.find()
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

// 查單一個商品
export const getProduct = async (req, res) => {
  try {
    const result = await products.findById(req.params.id)
    if (!result) {
      res.status(404).json({ success: false, message: '找不到此商品' })
    } else {
      res.status(200).json({ success: true, message: '', result })
    }
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(404).json({ success: false, message: 'ID 格式錯誤，找不到此商品' })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}

export const editProduct = async (req, res) => {
  try {
    const productNew = await products.findByIdAndUpdate(req.params.id)
    const images = products.images.fillter(image => !req.body.delImges.includes(image)).concat(req.files?.images?.map(file => file.path))
    productNew.name = req.body.name
    productNew.price = req.body.price
    productNew.description = req.body.description
    // 記得把 ||'' 拿掉，如果留著，在沒有上傳更新的時，圖片也會不見
    productNew.image = req.file?.path
    productNew.images = images
    productNew.sell = req.body.sell
    productNew.category = req.body.category
    // Mongoose 有 upsert:true ，當找不到東西時，可自動新增一筆 => ,{ new: true, upsert:true})
    await productNew.save()
    if (!productNew) {
      // 找不到這個東西，無法更新
      res.status(404).json({ success: false, message: '找不到' })
    } else {
      res.status(200).json({ success: true, message: '', productNew })
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
    } else if (error.name === 'CastError') {
      res.status(404).json({ success: false, message: '找不到' })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}
