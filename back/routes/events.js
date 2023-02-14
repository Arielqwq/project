import { Router } from 'express'
import content from '../middleware/content.js'
import admin from '../middleware/admin.js'
import upload from '../middleware/upload.js'
import { jwt } from '../middleware/auth.js'
import { createEvent, getAllEvents, getEvent, getSellEvents, editEvent, editEventParticipant } from '../controllers/events.js'

const router = Router()

// upload要放在  jwt, admin 之後 不然不用登入就可以用了
router.post('/', content('multipart/form-data'), jwt, admin, upload, createEvent)
// 不用登入也可以查所有架上活動
router.get('/', getSellEvents)
// .get('/all') 跟 .get('/:id') 順序有差，若 get all放後面，all會被認為是 id
// 取全部活動是管理員
router.get('/all', jwt, admin, getAllEvents)
// 取單個商品
router.get('/:id', getEvent)
// 更新，管理員權限
router.patch('/:id', content('multipart/form-data'), jwt, admin, upload, editEvent)

router.patch('/:id/participant', content('application/json'), jwt, editEventParticipant)

export default router