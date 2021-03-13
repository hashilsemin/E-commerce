var express = require('express');
const { Db } = require('mongodb');
const { JsonWebTokenError } = require('jsonwebtoken');
var router = express.Router();
const maxAge = 3 *34 * 60 * 60
const vendorHelpers = require("../helper/vendor-helper")
const adminHelpers = require("../helper/admin-helper")
const maxAgev = 3 *34 * 60 * 60
var jwt = require('jsonwebtoken');
const userHelper = require('../helper/user-helper');
const createToken = (id) =>{
  return jwt.sign({id},'my secret',{
    expiresIn:maxAgev
  })
}

const requireAuth = (req,res,next)=>{
  console.log(req);
  console.log(req.cookie);
  //res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  const token = req.cookies.jwt1
  if(token){
    jwt.verify(token,'my secret', (err,decodedToken)=>{
      if(err){
        console.log(err.message);
        res.redirect('/vendor/login')
      }else{
         next()
      }
    })
  }else{
    res.redirect('/vendor/login')
  }
}



router.get('/', requireAuth, function(req, res, next) {
    res.render('vendor/vendHome', ({ vendorNav:true }));
  });

  router.get('/product',async function (req, res, next) {
    var decoded = jwt.decode(req.cookies.jwt1);
    console.log(decoded.id);
    var vendorId = decoded.id
    console.log(vendorId);
  let product = await vendorHelpers.getProduct(vendorId)
  console.log(product);
  console.log("--------------------");
    res.render('vendor/vendProduct', ({ vendorNav:true,product }));
  });

router.get('/login',((req,res)=>{




  
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




router.post('/login',async(req, res)=>{
  console.log(req.body);
  let response =await vendorHelpers.checkUser(req.body)
  
  console.log(response);
  let vendor=response.admindb
  if(response.Login){
    console.log("kitii");
     const token = createToken(vendor._id)
     console.log(token);
     res.cookie('jwt1',token,{httpOnly:true,maxAge:maxAge*1000})
     res.redirect('/vendor')
  }else if(response.passwordErr){
    console.log("password thett");
   errPass=true
    res.redirect('/vendor/login')
  }else{
    errEmail=true
    console.log("email not exist");
    res.redirect('/vendor/login')
  }
})



router.get('/logout', (req, res) => {
  res.cookie('jwt1','')
  res.redirect('/vendor/login')
})
router.get('/addProduct',async(req,res)=>{
  let decoded = jwt.decode(req.cookies.jwt1);
  var vendorId = decoded.id
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
  let decoded = jwt.decode(req.cookies.jwt1);
  var vendorId = decoded.id
  
   console.log("--------------------------------");
    console.log(product);
    console.log(vendorId);
    vendorHelpers.addProduct(product,vendorId).then((id) => {
   console.log(id);
 


  let image1=req.files.Image1
  image1.mv('public/product-images/'+id+'thumbnail.jpg',(err,done)=>{
  
})
let image2=req.files.Image2
image2.mv('public/product-images/'+id+'front.jpg',(err,done)=>{


})
let image3=req.files.Image3
image3.mv('public/product-images/'+id+'side.jpg',(err,done)=>{

})
let image4=req.files.Image4
image4.mv('public/product-images/'+id+'ad.jpg',(err,done)=>{
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
  let category = await adminHelpers.getCategory()
  console.log(product);
  let decoded = jwt.decode(req.cookies.jwt1);
  var vendorId = decoded.id
  res.render('vendor/productEdit',({vendorNav:true,product,vendorId,id,category }))
})
)
router.post('/edit-product',(async(req,res)=>{
console.log(req.body);
vendorHelpers.editProduct(req.body).then((id)=>{
  let image1=req.files.Image1
  image1.mv('public/product-images/'+id+'thumbnail.jpg',(err,done)=>{
   
 
 
})
let image2=req.files.Image2
image2.mv('public/product-images/'+id+'front.jpg',(err,done)=>{
 

})
let image3=req.files.Image3
image3.mv('public/product-images/'+id+'side.jpg',(err,done)=>{
 

})
let image4=req.files.Image4
image4.mv('public/product-images/'+id+'ad.jpg',(err,done)=>{
  if(!err){
    res.redirect('/vendor/product')
  }
  else{
    console.log(err); 
  }


})

})
}))

router.get('/blockVendor/:id',((req,res)=>{
  let id=req.params.id
  console.log(id);
  vendorHelpers.blockVendor(id).then(()=>{
    res.redirect('/vendor/product')
  })
}))
router.get('/unblock/:id',((req,res)=>{
  let id=req.params.id
  console.log(id);
  vendorHelpers.unBlockVendor(id).then(()=>{
    res.redirect('/vendor/product')
  })
}))


  module.exports = router;