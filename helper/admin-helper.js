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
                    console.log("email sent " + info.response);

                }
            })
            vendorData.password = await bcrypt.hash(password, 10)
            console.log(vendorData);
            db.get().collection(collection.VENDOR).updateOne({_id:objectID(vendorData._id)},
            {
                $set:{
                    status:"true",
                    password:vendorData.password
                }
            }).then(()=>{
                resolve()
            })

        })
    },
    getVendReports:()=>{
        return new Promise(async(resolve,reject)=>{
            let report = await db.get().collection(collection.REPORT).find().toArray()
            console.log(report);
            resolve(report)
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
    getUser:()=>{
        return new Promise(async(resolve,reject)=>{
            let user = await db.get().collection(collection.USER).find().toArray()
            console.log(user);
            resolve(user)
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
    deleteUser:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            db.get().collection(collection.USER).deleteOne({_id:objectID(userId)})
            resolve()
        })
    },

    blockVendor:(id)=>{
return new Promise(async(resolve,reject)=>{
    db.get().collection(collection.VENDOR).updateOne({_id:objectID(id)},{
        $set:{
            block : "block"
        }
    }).then(()=>{
        db.get().collection(collection.PRODUCT).updateOne({vendorId:id},
            {
                $set:{
                    "block":"block"
                }
            }).then(()=>{
                resolve()
            })
    })
})
    },
    unBlockVendor:(id)=>{
        return new Promise(async(resolve,reject)=>{
            db.get().collection(collection.VENDOR).updateOne({_id:objectID(id)},{
                $unset:{
                    block : "block"
                }
            }).then(()=>{
                db.get().collection(collection.PRODUCT).updateOne({vendorID:id},{
                    $unset :{
                        block:""
                    }
                })
                .then(()=>{
                    resolve()
                })
            })
        })
            },



            blockUser:(id)=>{
                return new Promise(async(resolve,reject)=>{
                    db.get().collection(collection.USER).updateOne({_id:objectID(id)},{
                        $set:{
                            block : "block"
                        }
                    }).then(()=>{
                        resolve()
                    })
                })
                    },
                    unBlockUser:(id)=>{
                        return new Promise(async(resolve,reject)=>{
                            db.get().collection(collection.USER).updateOne({_id:objectID(id)},{
                                $unset:{
                                    block : "block"
                                }
                            }).then(()=>{
                                resolve()
                            })
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
    },
    getCategoryForEdit:(id)=>{
        return new Promise(async(resolve,reject)=>{
            let data = db.get().collection(collection.CATEGORY).findOne({_id:objectID(id)})
            resolve(data)
        })
    },
    editCategory:(data)=>{
        return new Promise(async(resolve,reject)=>{
            db.get().collection(collection.CATEGORY).updateOne({_id:objectID(data.id)},{
                $set:{
                    category:data.category,
                    description:data.description
                }
            }).then(()=>{
                resolve()
            })
        })
    },

    deleteCategory:(ID)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.CATEGORY).deleteOne({_id:objectID(ID)}).then(()=>{
                resolve()
            })
        })
    },
    getOrder:()=>{
        return new Promise (async(resolve,reject)=>{
            let order = await db.get().collection(collection.ORDER).aggregate([
                {
                    $unwind:'$product'
                }
            ]).toArray()
            resolve(order)
        })
    },
    deleteReport:(reportId)=>{
        return new Promise((resolve,reject)=>{
            console.log(reportId+"hdlf");
            db.get().collection(collection.REPORT).removeOne({_id:objectID(reportId)}).then((response)=>{
                console.log(response);
                resolve()
            })
           
        })
    }

}





