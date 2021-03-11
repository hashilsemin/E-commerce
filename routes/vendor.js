var express = require('express');

var router = express.Router();
const maxAge = 3 *34 * 60 * 60
const vendorHelpers = require("../helper/vendor-helper")
const adminHelpers = require("../helper/admin-helper")
const passport = require('passport')
function checkAuthenticated(req, res, next) {
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.redirect('/vendor/login')
  }
  
  function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/vendor')
    }
    next()
  }
const initializePassport = require('../passport-config');
const { serializeUser } = require('passport');
const { Db } = require('mongodb');
initializePassport(passport)
router.get('/',checkAuthenticated, function(req, res, next) {
    res.render('vendor/vendHome', ({ vendorNav:true }));
  });

  router.get('/product',async function (req, res, next) {
    let vendorId = req.user
    console.log(vendorId);
  let product = await vendorHelpers.getProduct(vendorId)
  console.log(product);
    res.render('vendor/vendProduct', ({ vendorNav:true,product }));
  });

router.get('/login',checkNotAuthenticated,((req,res)=>{
    res.render('vendor/vendLogin')


}))
router.get('/signup',((req,res)=>{
  res.render('vendor/vendSignup')
}))

router.post('/signup',(req,res)=>{
  adminHelpers.addVendorPending(req.body).then(()=>{
    res.render('vendor/vendCall')
  })
})



router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/vendor',
    failureRedirect: '/vendor/login',
    failureFlash: true
  })) 

router.post('/login',((req,res)=>{
 console.log(req.body);
}))

router.get('/logout', (req, res) => {
  req.logOut()
  res.redirect('/vendor/login')
})
router.get('/addProduct',async(req,res)=>{
  let vendorId = req.user._id
  let category = await adminHelpers.getCategory()
  console.log(category);
  console.log(vendorId);
  res.render('vendor/vendAddProd',({vendorNav:true,vendorId,category}))
})

router.post('/addProduct',((req,res)=>{
  console.log("hi");
  console.log(req.files.Image);
  console.log(req.body);
  var product = req.body
    let vendorId = req.user._id
  
   console.log("--------------------------------");
    console.log(product);
    console.log(vendorId);
    vendorHelpers.addProduct(product,vendorId).then((id) => {
   console.log(id);
    let image=req.files.Image
      image.mv('public/product-images/'+id+'.jpg',(err,done)=>{
        if(!err){
          res.redirect('/vendor/product')
        }
        else{
          console.log(err); 
        }
     
     
    })
    })
}))
router.get('/deleteProduct/:id',((req,res)=>{
let id = req.params.id
console.log(id);
  vendorHelpers.deleteProduct(id).then(()=>{
    res.redirect('/vendor/product')
  })
}



))

router.get('/editProduct/:id',(async(req,res)=>{
  let id = req.params.id
  console.log(id);
  console.log("-------------------------------");
  let product = await vendorHelpers.getProductforEdit(id)
  console.log(product);
  let vendorId = req.user._id
  res.render('vendor/productEdit',({vendorNav:true,product,vendorId,id  }))
})
)
router.post('/edit-product',(async(req,res)=>{
console.log(req.body);
vendorHelpers.editProduct(req.body).then((id)=>{
  let image=req.files.Image
  image.mv('public/product-images/'+id+'.jpg',(err,done)=>{
    if(!err){
      res.redirect('/vendor/product')
    }
    else{
      console.log(err); 
    }
 
 
})
})
}))




  module.exports = router;