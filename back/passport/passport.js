import passport from 'passport'
import bcrypt from 'bcrypt'
import passportLocal from 'passport-local'
import passportJWT from 'passport-jwt'
import users from '../models/users.js'

// 用登入策略寫登入方法
const LocalStrategy = passportLocal.Strategy
const JWTStrategy = passportJWT.Strategy

// 使用 Local 策略寫 login 方式
passport.use('login', new LocalStrategy({
  // 預設帳密欄位是 username 和 password
  // 修改成 account 和 password
  usernameField: 'account',
  passwordField: 'password'
}, async (account, password, done) => {
  // done(錯誤, 傳到下一步的資料, 傳到下一步 info 的內容)
  try {
    // 去找使用者帳號
    const user = await users.findOne({ account })
    if (!user) {
      return done(null, false, { message: '帳號不存在' })
    }
    // 比較輸入的密碼是否與資料庫密碼一致
    if (!bcrypt.compareSync(password, user.password)) {
      return done(null, false, { message: '密碼錯誤' })
    }
    return done(null, user)
  } catch (error) {
    return done(error, false)
  }
}))

// 使用 JWT 策略寫 jwt 方式
passport.use('jwt', new passportJWT.Strategy({
  jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  passReqToCallback: true,
  // 忽略過期檢查
  ignoreExpiration: true
}, async (req, payload, done) => {
  // 檢查有沒有過期
  // payload 解譯出來的過期時間單位是秒，JS 的 Date.now() 單位是毫秒，所以要 *1000
  const expired = payload.exp * 1000 < Date.now()
  // 要'/users/extend' '/users/logout' 允許過期的 jwt
  if (expired && req.originalUrl !== '/users/extend' && req.originalUrl !== '/users/logout') {
    return done(null, false, { message: '登入逾時' })
  }

  const token = req.headers.authorization.split(' ')[1]
  try {
    // 還是要取得使用者資料
    const user = await users.findOne({ _id: payload._id, tokens: token })
    if (user) {
      return done(null, { user, token })
    }
    return done(null, false, { message: '使用者不存在或 JWT 無效' })
  } catch (error) {
    return done(error, false)
  }
}))
