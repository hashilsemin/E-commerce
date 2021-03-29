var express = require('express');
const { Db } = require('mongodb');
const { JsonWebTokenError } = require('jsonwebtoken');
var router = express.Router();
var base64ToImage = require('base64-to-image');
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

const checkBlock = (req,res,next)=>{
  console.log("kikikikikik");

  let decoded = jwt.decode(req.cookies.jwt1);
  console.log(decoded);
  console.log("++++++++========+++++++");
 
  console.log("********************8888");
  vendorHelpers.checkBlock(decoded.id).then((block)=>{
    if(block){
     
      res.redirect('/vendor/logout')
    }else{
      console.log("vannuuuu11111111111111");
      next()
    }
  })
}


const requireAuth = (req,res,next)=>{

  //res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  const token = req.cookies.jwt1
  if(token){
    console.log("compaaaaaaaaa");
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



router.get('/',requireAuth,checkBlock, async function(req, res, next) {
  console.log("kikikiki");
  var decoded = jwt.decode(req.cookies.jwt1);
  console.log(decoded.id);
  var vendorId = decoded.id
  let vendorDetails = await vendorHelpers.getName(vendorId)
 
  let totalCustomer1 = await vendorHelpers.getTotalUser(vendorId)
let totalCustomer = totalCustomer1[0]
console.log(totalCustomer);
console.log("liiiiiiiiiiiiii");
  let totalProduct = await vendorHelpers.getTotalProduct(vendorId)
  console.log(totalProduct+"hifiiiiiiii");
  let totalOrder = await vendorHelpers.getTotalOrder(vendorId)
  let totalOrder1 = totalOrder[0]
  console.log(totalOrder1);
  console.log("i gottaaaaa");
  let totalBusiness = await vendorHelpers.getTotalBusiness(vendorId)
  let totalBusiness1 = totalBusiness[0]
  // let totalCOD = await vendorHelpers.getTotalCOD()
  // let totalRazorpay = await vendorHelpers.getTotalRazorPay()
  
  // let totalPaypal = await vendorHelpers.getTotalPaypal()
  // console.log(totalCOD,totalRazorpay,totalPaypal);
  
  // totalB = totalBusiness[0].totalAmount




    res.render('vendor/vendHome', ({ vendorNav:true,vendorDetails,totalCustomer,totalProduct,totalOrder1,totalBusiness1 }));
  });

  router.get('/product',checkBlock,async function (req, res, next) {
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
router.get('/addProduct',checkBlock,async(req,res)=>{
  let decoded = jwt.decode(req.cookies.jwt1);
  var vendorId = decoded.id
  let category = await adminHelpers.getCategory()
  console.log(category);
  console.log(vendorId);
  res.render('vendor/vendAddProd',({vendorNav:true,vendorId,category}))
})

router.post('/addProduct',((req,res)=>{
 
  let addBody = req.body

  var product = req.body
  let decoded = jwt.decode(req.cookies.jwt1);
  var vendorId = decoded.id

 
  
    var base64Str = addBody.base64Code;
    var base64Str1 = addBody.base64Code1;
    var base64Str2 = addBody.base64Code2;
    var base64Str3 = addBody.base64Code3;
    delete product.base64Code
delete product.base64Code1
delete product.base64Code2
delete product.base64Code3

    var path ='public/product-images/';
    var path2 ='public/product-images/';
    var path3 ='public/product-images/';
    var path4 ='public/product-images/';
   

    
    vendorHelpers.addProduct(product,vendorId).then((id) => {
   console.log(id);
   var optionalObj1 = {'fileName': id+"first", 'type':'jpg'};
   var optionalObj2 = {'fileName': id+"second", 'type':'jpg'};
   var optionalObj3 = {'fileName': id+"third", 'type':'jpg'};
   var optionalObj4 = {'fileName': id+"ad", 'type':'jpg'};
   console.log("--------------------------------");
   console.log("ivide rthenne");
   var imageInfo = base64ToImage(base64Str,path,optionalObj1); 
   var imageInfo2 = base64ToImage(base64Str1,path2,optionalObj2); 
   var imageInfo3 = base64ToImage(base64Str2,path3,optionalObj3); 
   var imageInfo4 = base64ToImage(base64Str3,path4,optionalObj4); 


res.redirect('/vendor/product')
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

router.get('/editProduct/:id',checkBlock,(async(req,res)=>{
  let id = req.params.id
  console.log(id);
  console.log("-------------------------------");
  let product = await vendorHelpers.getProductforEdit(id)
  let category = await adminHelpers.getCategory()
  console.log(product);
  let decoded = jwt.decode(req.cookies.jwt1);
  console.log(decoded);
  console.log("----------------------------------------------");
  var vendorId = decoded.id
  res.render('vendor/productEdit',({vendorNav:true,product,vendorId,id,category }))
})
)
router.post('/edit-product',(async(req,res)=>{
console.log(req.body);
vendorHelpers.editProduct(req.body).then((id)=>{
  let image1=req.files.Image1
  image1.mv('public/product-images/'+id+'first.jpg',(err,done)=>{
   
 
 
})
let image2=req.files.Image2
image2.mv('public/product-images/'+id+'second.jpg',(err,done)=>{
 

})
let image3=req.files.Image3
image3.mv('public/product-images/'+id+'third.jpg',(err,done)=>{
 

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
router.get('/order',(async(req,res)=>{
  let decoded = jwt.decode(req.cookies.jwt1);
  var vendorId = decoded.id
let order= await vendorHelpers.getOrder(vendorId)
console.log(order);
res.render('vendor/vendorders',({vendorNav:true,order}))
}))

router.get('/Pendingorder',(async(req,res)=>{
  let decoded = jwt.decode(req.cookies.jwt1);
  var vendorId = decoded.id
let order= await vendorHelpers.getPendingOrder(vendorId)
console.log(order);
res.render('/order')
}))

router.get('/viewOrder/:id/:proId',(async(req,res)=>{
  let orderId = req.params.id
  let proId = req.params.proId
  let order = await vendorHelpers.getViewOrder(orderId)
let ordernew=order[0]
  console.log("aychaaaaaaaaa");
 var name=ordernew.product[0].product.product
 console.log(name);   
  // let products = await vendorHelpers.getProductOrder(id)
  res.render('vendor/orderPage',({vendorNav:true,ordernew,name})) 
}))
router.get('/ship/:id/:name',(req,res)=>{
  console.log("okokokokokokoko");
  let name=req.params.name
let id= req.params.id
console.log(name);
console.log("paisssssssssssssssssss");
userHelper.shipOrder(id,name).then(()=>{  
console.log("makaleeeeeeeeee");
res.redirect('/vendor/order')
})
})
router.get('/customers',async(req,res)=>{
  let decoded = jwt.decode(req.cookies.jwt1);
  var vendorId = decoded.id
  let name = await vendorHelpers.getVendorName(vendorId)
let customer = await vendorHelpers.getCustomer(vendorId)
console.log(name);
console.log("bbyyyyyyyyyy");
  res.render('vendor/vendCustomer',({customer,vendorNav:true,vendorId,name}))
})
router.post('/reportUser',(req,res)=>{
 
  vendorHelpers.reportUser(req.body).then(()=>{
    res.redirect('/vendor/customers')
  })
})




router.get('/orderReport',async(req,res)=>{

  res.render('vendor/orderReport',({vendorNav:true}))
})
 
router.post('/orderSales',async(req,res)=>{

  console.log(req.body);
  let decoded = jwt.decode(req.cookies.jwt1);
  var vendorId = decoded.id
  let report = await vendorHelpers.getSalesReport(req.body,vendorId)
  res.render('vendor/orderReport',({report,vendorNav:true}))
})
router.get('/profile',async(req,res)=>{
  let decoded = jwt.decode(req.cookies.jwt1);
  var vendorId = decoded.id
  console.log(vendorId);
  let vendor = await vendorHelpers.getVendorInfo(vendorId)
  let vendor1=vendor[0]
console.log(vendor1);
  res.render('vendor/profile',({vendorNav:true,vendor1}))
})





  module.exports = router;