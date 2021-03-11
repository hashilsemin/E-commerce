const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

const db = require('./config/connection')
const collection = require('./config/collection')
const objectID = require('mongodb').ObjectID

function initialize(passport) {
  const authenticateUser = async (email, password, done) => {
    const user =await db.get().collection(collection.VENDOR).findOne({email:email})
    if (user == null) {
      return done(null, false, { message: 'No user with that email' })
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'Password incorrect' })
      }
    } catch (e) {
      return done(e)
    }
  }

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
  passport.serializeUser((user, done) => done(null, user._id))
  passport.deserializeUser(async(id, done) => {
      let userId = await db.get().collection(collection.VENDOR).findOne({_id:objectID(id)})
    return done(null, userId)
  })
}

module.exports = initialize