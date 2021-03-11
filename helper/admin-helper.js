const db = require('../config/connection')
const collection = require('../config/collection')
const objectID = require('mongodb').ObjectID
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const generatePassword = require('generate-password')
module.exports = {

    Signupadmin: (admin) => {
        return new Promise(async (resolve, reject) => {
            admin.password = await bcrypt.hash(admin.password, 10)
            db.get().collection(collection.ADMIN).insertOne(admin).then((data) => {
                resolve(data.ops[0])
            })
        })
    },
    checkUser: (adminData) => {
        return new Promise(async (resolve, reject) => {
            var status = false
            var admindb = await db.get().collection(collection.ADMIN).findOne({ email: adminData.email })
            var response = {}
            if (admindb) {
                bcrypt.compare(adminData.password, admindb.password).then((status) => {
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

    addpendingVendor: (vendorData) => {
        return new Promise(async (resolve, reject) => {
            var password = generatePassword.generate({

                length: 10,
                number: true
            })
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'hashilsemin10@gmail.com',
                    pass: 'naseehaanwar'
                }
            })
            var mailOptions = {
                from: 'hashilsemin10@gmail.com',
                to: vendorData.email,
                subject: 'Use the given credential to sign in to your E-shop account and welcome to our family.',
                text: 'Your password is ' + password
            }
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("email sent " + infp.response);

                }
            })
            vendorData.password = await bcrypt.hash(password, 10)

            db.get().collection(collection.VENDOR).updateOne({_id:objectID(vendorData._id)},
            {
                $set:{
                    status:"true"
                }
            }).then(()=>{
                resolve()
            })

        })
    },


    addVendor: (vendorData) => {
        return new Promise(async (resolve, reject) => {
            var password = generatePassword.generate({

                length: 10,
                number: true
            })
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'hashilsemin10@gmail.com',
                    pass: 'naseehaanwar'
                }
            })
            var mailOptions = {
                from: 'hashilsemin10@gmail.com',
                to: vendorData.email,
                subject: 'Use the given credential to sign in to your E-shop account and welcome to our family.',
                text: 'Your password is ' + password
            }
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("email sent " + infp.response);

                }
            })
            vendorData.password = await bcrypt.hash(password, 10)

            db.get().collection(collection.VENDOR).insertOne(vendorData).then(() => [

                resolve()
            ])

        })
    },
    getVendor:()=>{
        return new Promise(async(resolve,reject)=>{
            let vendor = await db.get().collection(collection.VENDOR).find({status:"true"}).toArray()
            console.log(vendor);
            resolve(vendor)
        })
    },
    getpendingVendor:()=>{
        return new Promise(async(resolve,reject)=>{
            let vendor = await db.get().collection(collection.VENDOR).find({status:"false"}).toArray()
            console.log(vendor);
            resolve(vendor)
        })
    },
    checkAdmin: () => {
        return new Promise(async (resolve, reject) => {
            count = await db.get().collection(collection.ADMIN).count().then((count) => {
                if (count <= 0) {
                    status = true
                    resolve(status)
                } else {
                    status = false
                    resolve(status)
                }

            })

        })


    },

    deleteVendor:(vendorId)=>{
        return new Promise(async(resolve,reject)=>{
            db.get().collection(collection.VENDOR).deleteOne({_id:objectID(vendorId)})
            resolve()
        })
    },

    

    getCategory:()=>{
        return new Promise(async(resolve,reject)=>{
            let category = await db.get().collection(collection.CATEGORY).find().toArray()
            console.log(category);
            resolve(category)
        })
    },




    addCategory:(data)=>{
        return new Promise((resolve,reject)=>{
     
         db.get().collection(collection.CATEGORY).insertOne(data).then(()=>{
             resolve()
         })
       
        })
    },

    addVendorPending:(data)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.VENDOR).insertOne(data).then(() => {

                resolve()
            })
        })
    },
    getVendorById:(venid)=>{
        return new Promise(async(resolve,reject)=>{
            let vendor = await db.get().collection(collection.VENDOR).findOne({_id:objectID(venid)})
          
            resolve(vendor)
        })
    }
}





