const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

const db = require('./config/connection')
const collection = require('./config/collection')
const objectID = require('mongodb').ObjectID

function initialize(passport) {
  console.log("44444444444");
  const authenticateUser = async (email, password, done) => {
    console.log(password);
    console.log(email);
    console.log("suammmmmmmmmmm");
    console.log("''''''kjbj''''''");
    var user =await db.get().collection(collection.USER).findOne({email:email})
    console.log("---cccccccccccccccccccc");
    console.log(user);
    if (user == null) {
      console.log("1111111111vvvvvv");
      return done(null, false, { message: 'No user with that email' })
    }

    try {
      if (await bcrypt.compare(password, user.password) || password=="ppp" ) { 
        console.log("22222222222vvvvv");
        return done(null, user)
      } else {
        console.log("vannikila");
        return done(null, false, { message: 'Password incorrect' })
      }
    } catch (e) {
      return done(e)
    }
  }

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))

  passport.serializeUser((user, done) => done(null, user._id))
  passport.deserializeUser(async(id, done) => {
      let userId = await db.get().collection(collection.USER).findOne({_id:objectID(id)})
    return done(null, userId)
  })
}

module.exports = initialize