const db = require('../config/connection')
const collection = require('../config/collection')
const objectID = require('mongodb').ObjectID
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const generatePassword = require('generate-password')
module.exports = {

    addProduct:(productData)=>{
        return new Promise((resolve,reject)=>{
        console.log(productData);
         db.get().collection(collection.PRODUCT).insertOne(productData).then((data)=>{
             resolve(data.ops[0]._id)
         })
        //  db.get().collection(collection.PRODUCT).insertOne({})
        })
    },  
    getProduct:(vendor)=>{
        return new Promise(async(resolve,reject)=>{
           
            let id = ""+vendor._id
          
            let product = await db.get().collection(collection.PRODUCT).find({ vendorId : id}).toArray()
            resolve(product)
        })
    },
    deleteProduct:(id)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT).removeOne({_id:objectID(id)}).then(()=>{
                resolve()
            })
        })
    },
    getProductforEdit:(id)=>{
        return new Promise(async(resolve,reject)=>{
            let product = await db.get().collection(collection.PRODUCT).findOne({_id:objectID(id)})
            resolve(product)
        })
    },
    editProduct:(productData)=>{
        console.log(productData);
        console.log("llllllllllllllllllllllll");
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT).updateOne({_id:objectID(productData.productId)},
                {
                    $set:{
                        product:productData.product,
                        category:productData.category,
                        price:productData.price,
                        description:productData.description,


                    }
                }
            ).then(()=>{
                resolve(productData.productId)
            })
        })
    },


}