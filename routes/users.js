const Razorpay= require('razorpay')
const adminHelpers = require("../helper/admin-helper")
var instance = new Razorpay({
  key_id: 'rzp_test_oqOom6V3IbHjCo',
  key_secret: 'sGonyu9F0Ss0YBoaj8yTGr2G',
});
const otp = require("../otp")
const client = require("twilio")(otp.accountSID,otp.authToken)
var alertcart = false
const checkBlock = (req,res,next)=>{
 
 let my=req.user
  console.log("********************8888");
  if(my){
    userHelpers.checkBlock(req.user._id).then((block)=>{
      if(block){
       
        res.redirect('/logout')
      }else{
        console.log("vannuuuu11111111111111");
        next()
      }
    })
  }else{
    next()
  }

}


var express = require('express');
var router = express.Router();
const userHelpers = require("../helper/user-helper")
/* GET users listing. */
const vendorHelpers = require("../helper/vendor-helper")
const passport = require('passport')


function checkAuthenticated(req, res, next) {
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    if (req.isAuthenticated()) {     
      return next() 
    }
  
    res.redirect('/login')
  }
  
  function checkNotAuthenticated(req, res, next) {
    console.log("ppppppppppppppppp");
    if (req.isAuthenticated()) {
      return res.redirect('/')
    }
    next()
  }





const initializePassport = require('../passport-config');

const { serializeUser } = require('passport');
const { Db } = require('mongodb');
const userHelper = require('../helper/user-helper');
initializePassport(passport)

//HOMEPAGE

router.get('/',checkBlock, async function(req, res, next) {
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
let products = await userHelpers.getProducts()
let category = await adminHelpers.getCategory()
console.log(products);
console.log(req.user);
if(req.user){
  console.log(req.user);
let total = await userHelpers.getTotalCount(req.user._id)
let count = total.length
console.log(count); 
  let user = req.user
console.log(alertcart)
console.log("iiiiiiiiiiiiiiii");
let catOn = true
  res.render('user/userHome',({userNav:true,products,user,count,alertcart,category,catOn}))
 alertcart = false
}else{
  let catOn = true
  res.render('user/userHome',({userNav:true,products,category,catOn}))
}

  

});

router.get('/signup',(req,res)=>{
  res.render('user/signup')
})

router.get('/signup/:id',(req,res)=>{
  let id = req.params.id

  res.render('user/referralSignup',({id}))
})



router.post('/signup',(req,res,next)=>{
 let password= req.body.password
  userHelpers.signUpUser(req.body).then((data)=>{
req.body.password=password
   console.log(req.body);
    console.log("3333333333333333");
    passport.authenticate('local',{
      
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: true
    })(req,res,next)
  })
})
//LOGIN
router.get('/login', function checkNotAuthenticated(req, res, next) {
  console.log("ppppppppppppppppp");
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
},(req,res)=>{
  res.render('user/userLogin')
  })

router.post('/login',passport.authenticate('local',{
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))



router.get('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})
//OTPPPPPPPPPPPPPPPPPPPPPPP
router.get('/signupOtp',(req,res)=>{
  res.render('user/otpSignupPage',)
})
router.get('/otpLoginPage',(req,res)=>{
  res.render('user/otpLoginPage',)
})
 
//otplogin
var mob="00808";
router.post('/otpLogin',(req,res)=>{
 console.log("kkkiiiiikkki");
  console.log(req.body.mobile);
  if (req.body.mobile) {
    console.log("koko");
    client
    .verify
    .services("VAb0b6eb48faa058b3f0c6e62bb5d3b858")
    .verifications
    .create({
        to:'+91'+req.body.mobile,
        channel:'sms'
    })
    .catch((err)=>{
      console.log(err);
    })
    .then(data => {
      console.log(data);
      let mobi = req.body.mobile
      res.render('user/typeCode',{mobi})
        // res.status(200).send({
        //     message: "Verification is sent!!",
        //     mobile: '+91'+req.body.mobile,
        //     data
        // })
    }) 
 } else {
    res.status(400).send({
        message: "Wrong phone number :(",
        mobile: req.body.mobile,
        data
    })
 }
})

router.post('/otpSignup',(req,res)=>{

  console.log(req.body.mobile);
  if (req.body.mobile) {
    client
    .verify
    .services("VAb0b6eb48faa058b3f0c6e62bb5d3b858")
    .verifications
    .create({
        to:'+91'+req.body.mobile,
        channel:'sms'
    })
    .then(data => {
      console.log(data);
      let mobi = req.body.mobile
      res.render('user/typeCodeSignup',{mobi})
        // res.status(200).send({
        //     message: "Verification is sent!!",
        //     mobile: '+91'+req.body.mobile,
        //     data
        // })
    }) 
 } else {
    res.status(400).send({
        message: "Wrong phone number :(",
        mobile: req.body.mobile,
        data
    })
 }
})






router.post('/verifyOtp', (req, res,next) => {
  console.log(req.body);
  if (req.body.mobile && (req.body.code).length === 6) {
      client
          .verify
          .services("VAb0b6eb48faa058b3f0c6e62bb5d3b858")
          .verificationChecks
          .create({
              to: '+91'+req.body.mobile,
              code: req.body.code
          })
          .then(data => {
            console.log(data);
              if (data.status === "approved") {
                userHelpers.getUserByNumber(req.body.mobile).then((response)=>{
                  if(!response){
                    res.redirect('/otpLoginPage')
                  }
                  req.body.email=response.email
                  req.body.password="ppp"
                    console.log(req.body);
console.log("opopopopopopopopopopopo");

                  passport.authenticate('local',{
                    
                    successRedirect: '/',
                    failureRedirect: '/login',
                    failureFlash: true
                  })(req,res,next)

                })
              }
          })
  } else {
      res.status(400).send({
          message: "Wrong phone number or code :(",
          phonenumber: req.query.phonenumber,
          data
      })
  }
})


router.post('/verifyOtpSignup', (req, res,next) => {
  console.log(req.body);
  if (req.body.email && (req.body.code).length === 6) {
      client
          .verify
          .services("VAb0b6eb48faa058b3f0c6e62bb5d3b858")
          .verificationChecks
          .create({
              to: '+91'+req.body.email,
              code: req.body.code
          })
          .then(data => {
            console.log(data);
              if (data.status === "approved") {
                
                userHelpers.signUpUser(req.body).then((response)=>{
                  req.body.email=response.email
                  req.body.password="ppp"
                    console.log(req.body);
console.log("opopopopopopopopopopopo");

                  passport.authenticate('local',{
                    
                    successRedirect: '/',
                    failureRedirect: '/login',
                    failureFlash: true
                  })(req,res,next)

                })
              }else {
                res.status(400).send({
                    message: "Wrong phone number or code :(",
                    phonenumber: req.query.phonenumber,
                    data
                })
            }
          })
  } else {
      res.status(400).send({
          message: "Wrong phone number or code :(",
          phonenumber: req.query.phonenumber,
          data
      })
  }
})


// router.get('/verify', (req, res) => {
//   if (req.body.mobile && (req.body.code).length === 4) {
//       client
//           .verify
//           .services(process.env.SERVICE_ID)
//           .verificationChecks
//           .create({
//               to: `+${req.body.mobile}`,
//               code: req.body.code
//           })
//           .then(data => {
//               if (data.status === "approved") {
//                   // res.status(200).send({
//                   //     message: "User is Verified!!",
//                   //     data
//                   // })
//               }
//           })
//   } else {
//       res.status(400).send({
//           message: "Wrong phone number or code :(",
//           mobile: req.body.mobile,
//           data
//       })
//   }
// })



router.get('/viewProduct/:id',(async(req,res)=>{

  let id = req.params.id
  console.log(id);
  console.log("----------------");
  if(req.user){
    let total = await userHelpers.getTotalCount(req.user._id)
    let count = total.length
      let product = await vendorHelpers.getProductforEdit(id)
      console.log(product);
      let user = req.user
      res.render('user/prodDetails',({userNav:true,product,count,user}))
  }else{
    let product = await vendorHelpers.getProductforEdit(id)
    console.log(product);
    res.render('user/prodDetails',({userNav:true,product}))
  }

 


}

))

router.get('/cart',checkAuthenticated,async(req,res)=>{
console.log(req.user._id);
let id = req.user._id

let products =  await userHelpers.getProductCart(id)
let totalValue=0
console.log("kikikikikik");
console.log(products.length);
if(products.length>0){
  totalValue=await userHelpers.getTotalAmount(id)
}
console.log(id);            
console.log("=============================");
console.log(products);
let total = await userHelpers.getTotalCount(req.user._id)
let count = total.length
let user = req.user
if(count){
  res.render('user/cart',({userNav:true,products,id,totalValue,count,user}))

}else{
alertcart = true
res.redirect('/')
}





}),





router.post('/changeQuantity',(req,res,next)=>{
  console.log(req.body)
  console.log("trettttttttttttttt");
  userHelpers.changeProductQuantity(req.body).then(async(response)=>{ 
    console.log(response);
    if(response.removeProduct){
      res.json(response)
    }else{
       userHelpers.getTotalAmount(req.body.user).then((response)=>{
        console.log("sksksksksk");
        console.log(response);
        res.json(response)
      })
    }
    
  
  })
}) 

router.get('/checkout',checkAuthenticated,async(req,res)=>{
  console.log(req.user);
  console.log("lllololololog");
  let user=req.user
  let id = req.user._id
  console.log(id);
  let address= await userHelpers.getAddress(id)
  let totalPrice=await userHelpers.getTotalAmount(req.user._id) 
  console.log(address);
  let firstOrderOffer=await userHelpers.getFirstOrderOffer(req.user._id)
  console.log(firstOrderOffer);
  console.log("toptippppppppppppp");
  let referralOffer = await userHelpers.getReferralOffer(req.user._id)

  res.render('user/checkout',({userNav:true,address,user,totalPrice,firstOrderOffer,referralOffer,id}))
})
 

router.post('/placeOrder',checkAuthenticated,async(req,res)=>{
console.log("makale");
console.log(req.body);
if(req.body.referral){
  let referral = await userHelpers.deleteRefer(req.user._id)
}
if(req.body.WhichCoupon){
  let WhichCoupon = req.body.WhichCoupon
  let changeCoupon = await userHelpers.changeCoupon(WhichCoupon,req.user._id)
}
payment= req.body.payment
console.log(payment);

let products=await userHelpers.getProductCart(req.user._id)
let totalPrice= Number(req.body.realTotal)
console.log(totalPrice);
userHelpers.placeOrder(req.body,products,totalPrice,req.user._id).then((data)=>{
  console.log(data);

  if(data.payment=="cash"){
   res.json(data)
  
   
  }else if(data.payment=="razorpay"){
    console.log("vannu");
  userHelpers.generateRazorpay(data).then((response)=>{
    console.log(response);
    console.log("mekele");
    res.json(response)
  })
  }else if(data.payment=="paypal"){
    console.log(data);
    res.json(data)
  }
})

})



router.get('/profile',checkAuthenticated,async(req,res)=>{
  let id = req.user._id
  console.log(id);
  let user = await userHelpers.getUserInfo(id)
  let address= await userHelpers.getAddress(id)
  console.log(address);
  console.log("newwwwwwwwwwwwwww");
  let total = await userHelpers.getTotalCount(req.user._id)
let count = total.length
  res.render('user/profile',({userNav:true,address,user,count}))
})




router.post('/verify-payment', (req, res) => {
  console.log(req.body);
  userHelpers.verifyPayment(req.body).then(() => {
console.log("mandaaa");
    userHelpers.changePaymentStatus(req.body['order[receipt]']).then(() => {
      console.log('sucesssssssssss');
      res.json({ status: true })

    })

  }).catch((err) => {
    console.log('faileddddddddd');
    res.json({ status: false, errMsg: '' })
  })

})
router.get('/orderPlaced/:id',(req,res)=>{
let id = req.params.id


  console.log("id und");
  userHelpers.changePaymentStatus(id).then(()=>{
    let id = req.user._id
    userHelpers.deleteCart(id).then(()=>{
      res.render('user/successPage',({userNav:true}))
    })
    
  })

})

router.get('/orderPlaced/',(req,res)=>{
 
  let id = req.user._id
    userHelpers.deleteCart(id).then(()=>{
      res.render('user/successPage',({userNav:true}))
    })

  })


router.post('/addToCart',(req,res)=>{
console.log(req.body);

let body = req.body
console.log("dikrrrrrrrrrrrrrrrr");

console.log("jhihihihih");

if(req.user){
  userHelpers.addCart(body.proId,req.user._id).then(async(response)=>{
    let total = await userHelpers.getTotalCount(req.user._id)
let count = total.length
 response.count=count
 console.log(response);
 console.log("apppppppppppppppppppppppppp");
    res.json(response)
    })
}else{
  console.log('kiliiiiiiiiiiiiii');
  response=false
res.json(response)
}

})


router.get('/addAddress',checkAuthenticated,async(req,res)=>{
  let id = req.user._id

  res.render('user/addAddress',({userNav:true,id}))
})


router.get('/addAddressOrder',checkAuthenticated,async(req,res)=>{
  let id = req.user._id

  res.render('user/addAddressOrder',({userNav:true,id}))
})

router.post('/addNewAddress',(req,res)=>{
console.log("ravile");
 console.log(req.body);
 userHelpers.addAddress(req.body).then(()=>{
   res.redirect('/profile')
 })
})

router.post('/addAddressOrder',(req,res)=>{
  console.log("ravile");
   console.log(req.body);
   userHelpers.addAddress(req.body).then(()=>{
     res.redirect('/checkout')
   })
  })




router.get('/order',checkAuthenticated,(async(req,res)=>{
  let id = req.user._id
  let user = req.user
  console.log(id);
  console.log("evfrrrrrrrrrrrrrrrrr");
let order= await userHelpers.getMyOrder(id)
console.log(order);
console.log("hoooowwwwwwwwwwwwwwww");
let total = await userHelpers.getTotalCount(req.user._id)
let count = total.length

res.render('user/userOrder',({userNav:true,order,user,count}))

}))

router.get('/changePassword',((req,res)=>{
  let id=req.user
  console.log(id);
  res.render('user/changePassword',({id,userNav:true}))
}))
router.post('/changePassword',((req,res)=>{
  userHelpers.changePassword(req.body,req.user._id).then(()=>{
    console.log("makale");
    res.redirect('/profile')
  })
}))
router.get('/editProfile',(async(req,res)=>{
  var id=req.user._id
  console.log(id);
  let user = await userHelpers.getUserInfo(id)
  res.render('user/editProfile',({id,userNav:true,user}))
}))
router.post('/editProfile',((req,res)=>{
  
  userHelpers.editProfile(req.body,req.user._id).then(()=>{
    console.log(req.body);
    console.log("lolololololol");
    var id=req.user._id
    let image4=req.files.Image3
image4.mv('public/user-image/'+id+'.jpg',(err,done)=>{
  if(!err){
    res.redirect('/profile')
  }
  else{
    console.log(err); 
  }


})
    
  })
}))

router.get('/editAddress/:id',async(req,res)=>{
  let id = req.params.id
  
  
    console.log("id und");
  let address = await  userHelpers.getAddressForEdit(id)
res.render('user/editAddress',({address,userNav:true}))
     
      

  
  })

  router.post('/editAddress',((req,res)=>{
    userHelpers.editAddress(req.body).then(()=>{
      console.log("makale");
      res.redirect('/profile')
    })
  }))

router.get('/deleteAddress/:id',(req,res)=>{
let id = req.params.id
  userHelpers.deleteAddress(id).then(()=>{
    res.redirect('/profile')
  })
})

router.get('/coupon',async(req,res)=>{
  let coupon = await userHelpers.getCoupon()
  res.render('user/coupon',({coupon,userNav:true}))
})

router.post('/checkCode',(req,res)=>{
  console.log(req.body);
  let userId=req.user._id
  let code = req.body.code
  userHelpers.findCode(code,userId).then((response)=>{
    console.log(response);
    res.json(response)
  })
})







router.get('/x',((req,res)=>{
 
  res.render('user/x',{vendorNav:true})
}))
// router.get('/addCart:/id',(req,res)=>{
// let productId = req.params.id
// let userId=req.user._id
// console.log(productId);
// userHelpers.addCart(productId,userId).then(()=>{
  
// })


// })



module.exports = router;  
