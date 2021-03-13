const db = require('../config/connection')
const collection = require('../config/collection')
const objectID = require('mongodb').ObjectID
const bcrypt = require('bcrypt')

module.exports = {

    signUpUser: (user) => {
        return new Promise(async (resolve, reject) => {
            user.password = await bcrypt.hash(user.password, 10)
            db.get().collection(collection.USER).insertOne(user).then((data) => {
                resolve(data.ops[0])
            })
        })
    },

    getProducts:()=>{
        return new Promise(async(resolve,reject)=>{
            let products = await db.get().collection(collection.PRODUCT).find( { block: { $exists: false } } ).toArray()
            resolve(products)

        
        })
    }

}