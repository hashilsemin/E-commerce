const db = require('../config/connection')
const collection = require('../config/collection')
const objectID = require('mongodb').ObjectID
const bcrypt = require('bcrypt')
const Razorpay= require('razorpay')
const { resolve } = require('path')
const { response } = require('express')
var instance = new Razorpay({
    key_id: 'rzp_test_oqOom6V3IbHjCo',
    key_secret: 'sGonyu9F0Ss0YBoaj8yTGr2G',
  });
module.exports = {

    signUpUser: (user) => {
        return new Promise(async (resolve, reject) => {
            user.password = await bcrypt.hash(user.password, 10)
            db.get().collection(collection.USER).insertOne(user).then((data) => {
                resolve(data.ops[0])
            })
        })
    },
    getTotalCount:(userId)=>{
return new Promise(async(resolve,reject)=>{
    let count = await db.get().collection(collection.CART).aggregate(
        [   
            {
                $match : {user:objectID(userId)}
                },

           {
              $unwind:"$products"
           }
        ]
     ).toArray()
console.log("makale");
    console.log(count.length);
    resolve(count)
})
    },

    getProducts:()=>{
        return new Promise(async(resolve,reject)=>{
            let products = await db.get().collection(collection.PRODUCT).find( { block: { $exists: false } } ).toArray()
            resolve(products)

        
        })
    },
    changeProductQuantity: (details) => {
        details.quantity = parseInt(details.quantity)
        details.count = parseInt(details.count)
console.log(details);
console.log("blevrrrrrrrrrrr");
        return new Promise((resolve,reject) => {
            if ((details.count == -1 && details.quantity == 1)||(details.count == 0)) {
                console.log("onnaneeeeeeeee");
                db.get().collection(collection.CART)
                    .updateOne({_id:objectID(details.cart)},
                        {
                            $pull: { products: { item: objectID(details.product) } }
                        }   
                    ).then((response) => {
                        resolve({ removeProduct: true })
                    })
                 } else {


                  db.get().collection(collection.CART)
                    .updateOne({ _id: objectID(details.cart), 'products.item': objectID(details.product) },
                        {
                            $inc: { 'products.$.quantity': details.count }

                        }
                    ).then((response) => {

                        resolve({status:true })
                    })
                }
            })
    },
    addCart:(productId,userId)=>{
        return new Promise(async(resolve,reject)=>{ 
            let prod = {
                item: objectID(productId),
                quantity: 1
            }
            console.log(prod);
            let user = await db.get().collection(collection.CART).findOne({user:objectID(userId)})
            console.log(user);
            if(user){

                let prodExist = user.products.findIndex(products => products.item == productId)
             
                console.log("11111111111111111111");
                if (prodExist != -1) {
                    //if product is there
                    console.log("222222222222222222");
                    db.get().collection(collection.CART)
                        .updateOne({ user: objectID(userId), 'products.item': objectID(productId) },
                            {
                                $inc: { 'products.$.quantity': 1 }
                            }
                        ).then((response) => {
                            resolve(response)
                        })
                } else {
                    //if there is no product
                    console.log("3333333333333333");
                    db.get().collection(collection.CART)
                        .updateOne({ user: objectID(userId) },
                            {
                                $push: { products: prod }
                            }
                        ).then((response) => {
                            resolve(response)
                        })
                }
            } else {
                //if there is no cart for user
                console.log("44444444444444444");
                let cartObj = {
                    user: objectID(userId),
                    products: [prod]
                }
                console.log(cartObj);
                console.log("jijijijij");
                db.get().collection(collection.CART).insertOne(cartObj).then(() => {
                    resolve()
                })
            }
            

        })
    },
    checkBlock: (id) => {
        console.log(id);
        return new Promise(async (resolve, reject) => {
            var blocked = false
            let vendor1 = await db.get().collection(collection.USER).findOne({ _id: objectID(id), block: { $exists: true } })
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
    getProductCart :(userId)=>{
        console.log(userId);
        
        return new Promise(async(resolve,reject)=>{
           let cartProduct = await db.get().collection(collection.CART).aggregate([
                {
                $match : {user:objectID(userId)}
                },
                {
                $unwind:'$products'

                },
                
                // {
                //     $project:{
                //         item:'$products.item',
                //         quantity:'$products.quantity',
                       
                //         totalPrice: { $multiply: [ "$products.product.price", "$products.quantity" ] } 
                //             }
                // }, 
                {
                    $lookup:{
                        from:collection.PRODUCT,
                        localField:'products.item',
                        foreignField:'_id',
                        as:'product'
                    }
                },
                {
                    $unwind:'$product'
                },
                {
                    $project:{
                        _id:1,user:1,products:1,product:1,totalPrice:{$multiply:['$products.quantity',{ $toInt: '$product.price' }]}
                    }
                }
            //    {
            //        $unwind:{

            //        }
            //    }
                // {
                //     $project:{
                //         item:1,quantity:1,totalPrice:1,product:{$arrayElemAt:['$product',0]}
                //     }
                // }
            ]).toArray()
            console.log(cartProduct);
              
              console.log("addddddddddddddddddddd");
        resolve(cartProduct)
        })
    },
    getTotalAmount:(userId)=>{
        console.log(userId);
        console.log("shwrmmmmmmmmmmmmm");
        return new Promise(async(resolve,reject) => {
            let total = await db.get().collection(collection.CART).aggregate([
                {
                    $match: { user:objectID(userId) }
                },
                {
                    $unwind: '$products'
                },
                {
                    $project: {
                        item: '$products.item',
                        quantity: '$products.quantity'
                    }
                },
                {
                    $lookup: {
                        from: collection.PRODUCT,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'
                    }
                },
              
                {
                    $project: {
                        item: 1, quantity: 1, product: { $arrayElemAt: ['$product', 0] }
                    }
                },
                {
                    
                        $group:{
                            _id:null,
                          
                            total:{$sum:{ $multiply:['$quantity',{$toInt:'$product.price'}]}}
                        } 
                     } 
                 
                
            ]).toArray()
            console.log("sssshihs");
            console.log(total);
                console.log(total[0]);
            resolve(total[0].total)
        })
    } ,
    addAddress:(address)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.ADDRESS).insertOne(address).then(()=>{
                resolve()
            })
        })
    },

    changePaymentStatus:(orderId)=>{
        console.log(orderId);
        return new Promise((resolve,reject)=>{
            console.log(orderId);
            db.get().collection(collection.ORDER).updateOne({_id:objectID(orderId)},
            {
                $set:{
                   status:'placed'
                }
            }).then(()=>{
                resolve()
            })
        })
    },



    getAddress:(id)=>{
        return new Promise(async(resolve,reject)=>{
            
            let idnum = ""+id
            let address= await db.get().collection(collection.ADDRESS).find({user:idnum}).toArray()
            console.log(address);
            resolve(address)
        })
    },
    placeOrder:(order,products,total,idOfUser)=>{
        return new Promise(async(resolve,reject)=>{
        console.log(order)
        console.log("nghmmmmmmmmmmmm");
        
        let status=order['payment']==='cash'?'placed':'pending'
        console.log(status);
        console.log("makale");
        let orderObj={
            deliveryDetails:{
                mobile:order.mobile,
                address:order.address,
               city:order.city,
                zip:order.zip,
                province:order.province,
                email:order.email,
                fname:order.fname,
                payment:order.payment
                
        
            },
            userId:idOfUser,
            payment:order['payment'],
            product:products,
            totalAmount:total*100,
            date:new Date(),
            status:status,
           
        }
        console.log("klrrr");
        db.get().collection(collection.ORDER).insertOne(orderObj).then((response)=>{
            console.log(response);
            console.log("tickkkkkkkkkkk");
            console.log(order);
           
                resolve(response.ops[0])
          
            
        })
        })
        },
    generateRazorpay:   (data)=>{
        return new Promise((resolve,reject)=>{

     
        console.log(data);
        var options = {
            amount: data.totalAmount,  // amount in the smallest currency unit
            currency: "INR",
            receipt: ""+data._id
          };
          instance.orders.create(options, function(err, order) {
               order.payment="razorPay"
            console.log(order);
            resolve(order)
          });
        })
    },
    verifyPayment:(details)=>{
        return new Promise((resolve,reject)=>{
            console.log(details);
            console.log("opopopopopopopopopopo");
            const crypto= require('crypto')
            let hmac=crypto.createHmac('sha256','sGonyu9F0Ss0YBoaj8yTGr2G')
            hmac.update(details['payment[razorpay_order_id]']+'|'+details['payment[razorpay_payment_id]'])
           console.log(hmac);
            hmac=hmac.digest('hex')
            console.log(hmac);
            console.log(details['payment[razorpay_signature]']);
            if(hmac===details['payment[razorpay_signature]']){
                console.log("ya mownaaaaaaa");
                resolve()
            }else{
                console.log("anaswwwwwwww");
                reject()
            
            }
        })
    },

    deleteCart:(id)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.CART).removeOne({user:objectID(id)}).then(()=>{
                resolve()
            })
        })
    },
    shipOrder:(orderId,id)=>{
        console.log("qqqqqqqqqqqqqqqqq");
        console.log(orderId,id);
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.ORDER).updateOne({_id:objectID(orderId), product: { $elemMatch: { 'product._id': objectID(id) } } },{
                $set:{
                   'product.$.product.ship':"shipped"
                }
            }).then(()=>{
                resolve()
            })
        })
    },

    getMyOrder:(userId)=>{
        return new Promise(async(resolve,reject)=>{
           let order = await db.get().collection(collection.ORDER).aggregate([
               {
                   $match:{userId:userId,status:{$ne:"pending"}}
               },
         
               {
                $unwind:"$product"
            },
            
            
           ]).toArray()
           console.log(order);
        resolve(order)
        })
    },
    getUserInfo:(userId)=>{
        return new Promise (async(resolve,reject)=>{
            let user = await db.get().collection(collection.USER).findOne({_id:objectID(userId)})
            console.log(user);
            resolve(user)
        })
    },
    changePassword:(body,userId)=>{
        console.log(body);
        return new Promise(async(resolve,reject)=>{
            body.new = await bcrypt.hash(body.new, 10)
            db.get().collection(collection.USER).updateOne({_id:objectID(userId)},{
                $set:{
                    password:body.new
                }
            }).then(()=>{
resolve()
            })
        })
    },
    editProfile:(body,userId)=>{
        console.log(body);
        return new Promise(async(resolve,reject)=>{
            db.get().collection(collection.USER).updateOne({_id:objectID(userId)},{
                $set:{
                    fname:body.fname,
                    lname:body.lname
                
                }
            }).then((data)=>{
                console.log(data);
                resolve()
            })
        })
    },
    
    editAddress:(address)=>{
console.log(address);
console.log("josssssssssssss");
        return new Promise(async(resolve,reject)=>{
            db.get().collection(collection.ADDRESS).updateOne({_id:objectID(address.addressId)},{
                $set:{
                    address:address.address,
                    city:address.city,
                    province:address.province,
                
                    zip : address.zip,
                    mobile : address.mobile
                
                }
            }).then(()=>{
                resolve()
            })
        })
    },
 
    getAddressForEdit  :(Id)=>{
        return new Promise (async(resolve,reject)=>{
            let address = await db.get().collection(collection.ADDRESS).findOne({_id:objectID(Id)})
            console.log(address);
            resolve(address)
        })
    },
    deleteAddress:(id)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.ADDRESS).removeOne({_id:objectID(id)}).then(()=>{
                resolve()
            })
        })
    },
    getUserByNumber:(mobile)=>{
        return new Promise(async(resolve,reject)=>{
            console.log(mobile);
            db.get().collection(collection.USER).findOne({mobile:mobile},{email:mobile}).then((data)=>{
                console.log(data);
                resolve(data)
            })
        })
    },
    getFirstOrderOffer:(id)=>{
        return new Promise(async(resolve,reject)=>{
           let order = await db.get().collection(collection.ORDER).findOne({userId:id})
           console.log(order);
           if(order){
            resolve()
           }else{
               order = true
               resolve(order)
           }
        })
    },

    getReferralOffer:(id)=>{
        return new Promise(async(resolve,reject)=>{
            let order = await db.get().collection(collection.USER).find({_id:objectID(id)}).toArray()
            console.log(order);
        if(order[0].referral){
            resolve(order)
        }else{
            resolve()
        }
        })
    },
    deleteRefer:(id)=>{
        return new Promise(async(resolve,reject)=>{
            let referer = await db.get().collection(collection.USER).findOne({_id:objectID(id)})
            let addReferrer = await db.get().collection(collection.USER).updateOne({_id:objectID(referer.referral)},{
                $set:{
                    referral:"true"
                }
            })
            db.get().collection(collection.USER).updateOne({_id:objectID(id)},{
                $unset:{
                    referral:""
                }
            }).then(()=>{
                resolve()
            })
        })
    },
    getCoupon:()=>{
        return new Promise(async(resolve,reject)=>{
            let coupon = await db.get().collection(collection.COUPON).find().toArray()
            resolve(coupon)
        })
    },
    findCode:(Ecode,EuserId)=>{
        return new Promise(async(resolve,reject)=>{
           var response={}
            let code = await db.get().collection(collection.COUPON).findOne({code:Ecode})
            //{$elemMatch:{userId:EuserId}}
            if(code){
                let user =  await db.get().collection(collection.COUPON).findOne({$and:[{code:Ecode},{user:{$in:[EuserId]}}]})
                console.log(user);
                if(user){
                    response.message="You have already used this Coupon"
                    resolve(response)
                }else{
                    // db.get().collection(collection.COUPON).updateOne({code:Ecode},{
                    //     $push:{
                    //         user:EuserId
                    //     }
                    // }).then(()=>{
                        response.percent=code.discount
                        response.code=code.code
                    resolve(response)
                  
                    
                }
                
            }else{
                response.message="No coupon found"
                resolve(response)
            }
        })
    },
    changeCoupon:(code,id)=>{
        return new Promise((resolve,reject)=>{
             db.get().collection(collection.COUPON).updateOne({code:code},{
                        $push:{
                            user:id
                        }
                    }).then(()=>{
                        resolve()
                    })
       
    })
   
    },
    
    shipCancelOrder:(orderId,id)=>{
        console.log("qqqqqqqqqqqqqqqqq");
        console.log(orderId,id);
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.ORDER).updateOne({_id:objectID(orderId), product: { $elemMatch: { 'product._id': objectID(id) } } },{
                $set:{
                   'product.$.product.ship':"pending"
                }
            }).then(()=>{
                resolve()
            })
        })
    },

    

}