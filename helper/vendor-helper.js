const db = require('../config/connection')
const collection = require('../config/collection')
const objectID = require('mongodb').ObjectID
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const generatePassword = require('generate-password')
module.exports = {

    addProduct: (productData) => {
        return new Promise((resolve, reject) => {

            db.get().collection(collection.PRODUCT).insertOne(productData).then((data) => {
                resolve(data.ops[0]._id)
            })
            //  db.get().collection(collection.PRODUCT).insertOne({})
        })
    },
    getProduct: (vendor) => {
        return new Promise(async (resolve, reject) => {

            let id = "" + vendor

            let product = await db.get().collection(collection.PRODUCT).find({ vendorId: id }).toArray()
            resolve(product)
        })
    },
    deleteProduct: (id) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT).removeOne({ _id: objectID(id) }).then(() => {
                resolve()
            })
        })
    },
    getProductforEdit: (id) => {
        return new Promise(async (resolve, reject) => {
            let product = await db.get().collection(collection.PRODUCT).findOne({ _id: objectID(id) })
            resolve(product)
        })
    },
    editProduct: (productData) => {
        console.log(productData);
        console.log("llllllllllllllllllllllll");
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT).updateOne({ _id: objectID(productData.productId) },
                {
                    $set: {
                        product: productData.product,
                        category: productData.category,
                        price: productData.price,
                        description: productData.description,


                    }
                }
            ).then(() => {
                resolve(productData.productId)
            })
        })
    },

    checkUser: (vendorData) => {
        return new Promise(async (resolve, reject) => {
            var status = false
            var admindb = await db.get().collection(collection.VENDOR).findOne({ email: vendorData.email, block: { $exists: false } })
            console.log(admindb);
            var response = {}
            if (admindb) {
                bcrypt.compare(vendorData.password, admindb.password).then((status) => {
                    if (status) {
                        console.log("1");
                        resolve({ Login: true, admindb })
                    } else {
                        console.log("2");
                        resolve({ passwordErr: true })
                    }
                })

            } else {
                resolve({ Login: false })
                console.log("3");
            }
        })
    },

    blockVendor: (id) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.PRODUCT).updateOne({ _id: objectID(id) }, {
                $set: {
                    block: "block"
                }
            }).then(() => {
                resolve()
            })
        })
    },
    unBlockVendor: (id) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.PRODUCT).updateOne({ _id: objectID(id) }, {
                $unset: {
                    block: "block"
                }
            }).then(() => {
                resolve()
            })
        })
    },
    checkBlock: (id) => {
        console.log(id);
        return new Promise(async (resolve, reject) => {
            var blocked = false
            let vendor1 = await db.get().collection(collection.VENDOR).findOne({ _id: objectID(id), block: { $exists: true } })
            console.log("000000000000000000000000");
            console.log(vendor1);
            if (vendor1) {
                console.log("rrrrrrrrrrrrrrrr");
                var blocked = true
                resolve(blocked)
            } else {
                console.log("llllllllllllllllllll");
                resolve(blocked)
            }

        })



    },
    getOrder: (vendorId) => {
        return new Promise(async(resolve,reject)=>{
            console.log(vendorId);
            let orders = await db.get().collection(collection.ORDER).aggregate([

            
                {
                    $unwind:'$product'
                },
                {
                    $match:{'product.product.vendorId':vendorId,status:'placed'}
                }


            ]).toArray()

            console.log(orders);
            console.log("perccccccccccc");
resolve(orders)
        })
    },
    getPendingOrder:(vendorId)=>{
        return new Promise(async(resolve,reject)=>{
            let orders = await db.get().collection(collection.ORDER).find({product:{$elemMatch:{'product.vendorId':vendorId}}},{status:"placed"}).toArray()
            resolve(orders)
                    })
     
    },
    getViewOrder:(orderId)=>{
        return new Promise(async(resolve,reject)=>{
            let order = await db.get().collection(collection.ORDER).find({_id:objectID(orderId)}).toArray()
            resolve(order)
        })
    },
    getName:(vendorId)=>{
        return new Promise(async(resolve,reject)=>{
            let vendor = await db.get().collection(collection.VENDOR).findOne({_id:objectID(vendorId)})
            console.log(vendor);
            resolve(vendor)
        })
    },
    getCustomer:(vendorId)=>{
        return new Promise(async(resolve,reject)=>{
            let customer = await db.get().collection(collection.ORDER).aggregate([
                {
                    $unwind: '$product'
                },
                {
                    $match:{
                       'product.product.vendorId':vendorId
                    }
                },
                {
                    $group:{
                        _id:{userId:'$userId',fname:"$deliveryDetails.fname",email:"$deliveryDetails.email"}
                    }
                },
            ]).toArray()
            console.log(customer);
            console.log("noddddddddddddddddd");
            resolve(customer)
        })
    },
    reportUser:(body)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.REPORT).insertOne(body).then(()=>{
                resolve()
            })
        })
    },
    getVendorName:(id)=>{
        return new Promise(async(resolve,reject)=>{
            let vendor = await db.get().collection(collection.VENDOR).findOne({_id:objectID(id)})
            resolve(vendor)
        })
    }


}