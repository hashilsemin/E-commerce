var express = require('express');
const { JsonWebTokenError } = require('jsonwebtoken');
var router = express.Router();
const maxAge = 3 *34 * 60 * 60
const adminHelpers = require("../helper/admin-helper")
var jwt = require('jsonwebtoken');
const { Db } = require('mongodb');
const createToken = (id) =>{
  return jwt.sign({id},'my secret',{
    expiresIn:maxAge
  })
}
const requireAuth = (req,res,next)=>{
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  const token = req.cookies.jwt
  if(token){
    jwt.verify(token,'my secret', (err,decodedToken)=>{
      if(err){
        console.log(err.message);
        res.redirect('/admin/login')
      }else{
         next()
      }
    })
  }else{
    res.redirect('/admin/login')
  } 
}
var errEmail;
var errPass;
/* GET home page. */
router.get('/',requireAuth, async function(req, res, next) {

 let totalUser = await adminHelpers.getTotalUser()
let totalVendor = await adminHelpers.getTotalVendor()
let totalOrder = await adminHelpers.getTotalOrder()
let totalBusiness = await adminHelpers.getTotalBusiness()
let totalCOD = await adminHelpers.getTotalCOD()
let totalRazorpay = await adminHelpers.getTotalRazorPay()

let totalPaypal = await adminHelpers.getTotalPaypal()
console.log(totalCOD,totalRazorpay,totalPaypal);

totalB = totalBusiness[0].totalAmount

    res.render('admin/admHom', ({ adminNav:true,totalUser,totalVendor,totalOrder,totalB,totalCOD,totalRazorpay,totalPaypal }));

  
});
router.get('/login', async function(req, res, next) {
  let status = await adminHelpers.checkAdmin()
  if(req.cookies.jwt){
res.redirect('/admin')
  }else{
  if(errEmail){
    console.log("rerer");

    res.render('admin/admLogin', { adminHbs: true,status });
    errEmail=false
  }else if(errPass){

    res.render('admin/admLogin', { passHbs: true,status });
    errPass=false
  }else{
    console.log("lolololololo");
    
    res.render('admin/admLogin',{status});
  }
}
});
router.post('/login',async(req, res)=>{

  let response =await adminHelpers.checkUser(req.body)
  console.log(response);
  let admin=response.admindb
  if(response.Login){
    
     const token = createToken(admin._id)
     console.log(token);
     res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000})
     res.redirect('/admin')
  }else if(response.passwordErr){
    console.log("password thett");
   errPass=true
    res.redirect('/admin/login')
  }else{
    errEmail=true
    console.log("email not exist");
    res.redirect('/admin/login')
  }
})


router.post('/signup', function(req, res, next) {
  console.log(req.body);
adminHelpers.Signupadmin(req.body).then((data)=>{
console.log(data);
res.redirect('/admin')
})




});

router.get('/logout',((req,res)=>{
  res.cookie('jwt','')
  res.redirect('/admin/login')
}))

router.post('/orderSales',async(req,res)=>{
  console.log(req.body);
  let report = await adminHelpers.getSalesReport(req.body)
  res.render('admin/orderReport',({report,adminNav:true}))
})



router.get('/vendor',requireAuth,async function (req, res, next) {
  let vendor = await adminHelpers.getVendor()
  res.render('admin/vendor', ({ adminNav:true ,vendor }));
});

router.get('/user',requireAuth,async function (req, res, next) {
  let user = await adminHelpers.getUser()
  res.render('admin/admUser', ({ adminNav:true ,user }));
});


router.get('/addVendor',requireAuth,((req, res)=> {
 
  res.render('admin/addVendor', ({ adminNav:true}));
}));
router.get('/signup',((req, res)=> {
 if(req.cookies.jwt){
   res.redirect('/admin')
 }else{
  res.render('admin/admSignup');
 }

}));
router.get('/pendingVendor',async(req,res)=>{
  let pending = await adminHelpers.getpendingVendor()
  console.log(pending);
  res.render('admin/pendingVendor',({pending,adminNav:true}))
})

router.get('/orderReport',async(req,res)=>{

  res.render('admin/orderReport',({adminNav:true}))
})

router.post('/addVendor',requireAuth,((req,res)=>{
  console.log(req.body);
adminHelpers.addVendor(req.body).then(()=>{
  res.redirect('/admin/vendor')
})
}))

router.get('/deleteVendor/:id',((req,res)=>{
  let id=req.params.id
  console.log(id);
  adminHelpers.deleteVendor(id).then(()=>{
    res.redirect('/admin/vendor')
  })
}))

router.get('/deleteUser/:id',((req,res)=>{
  let id=req.params.id
  console.log(id);
  adminHelpers.deleteUser(id).then(()=>{
    res.redirect('/admin/user')
  })
}))


router.get('/blockVendor/:id',((req,res)=>{
  let id=req.params.id
  console.log(id);
  adminHelpers.blockVendor(id).then(()=>{
    res.redirect('/admin/vendor')
  })
}))
router.get('/unblockVendor/:id',((req,res)=>{
  let id=req.params.id
  console.log(id);
  adminHelpers.unBlockVendor(id).then(()=>{
    res.redirect('/admin/vendor')
  })
}))

router.get('/blockUser/:id',((req,res)=>{
  let id=req.params.id
  console.log(id);
  adminHelpers.blockUser(id).then(()=>{
    res.redirect('back')
  })
}))
router.get('/unblockUser/:id',((req,res)=>{
  let id=req.params.id
  console.log(id);
  adminHelpers.unBlockUser(id).then(()=>{
    res.redirect('/admin/user')
  })
}))


router.get('/category',requireAuth,async function (req, res, next) {
  let category = await adminHelpers.getCategory()
  console.log(category);
  res.render('admin/admCategory', ({ adminNav:true,category }));
});


router.get('/editCategory/:id',requireAuth,async function (req, res, next) {
  let ID=req.params.id
  console.log(ID);
     let category = await adminHelpers.getCategoryForEdit(ID)
  res.render('admin/editCategory', ({ adminNav:true,category }));
});

router.get('/deleteCategory/:id',(req,res)=>{
  let ID=req.params.id
  console.log(ID);
  adminHelpers.deleteCategory(ID).then(()=>{
    res.redirect('/admin/category')
  })
})
  


router.post('/editCategory',(req,res)=>{
  console.log(req.body);
  let data = req.body
  adminHelpers.editCategory(data).then(()=>{
    res.redirect('/admin/category')
  })
})

router.get('/addCategory',requireAuth,((req, res)=> {
 
  res.render('admin/addCategory', ({ adminNav:true}));
}));


router.get('/acceptVendor/:id',requireAuth,(async(req, res)=> {
 let id = req.params.id

 let vendor = await adminHelpers.getVendorById(id)
 console.log(vendor);
 console.log("909090900909090");
 adminHelpers.addpendingVendor(vendor).then(()=>{
  res.render('admin/pendingVendor', ({ adminNav:true}));
 })
  
}));
router.post('/addCategory',requireAuth,((req,res)=>{
  console.log(req.body);
adminHelpers.addCategory(req.body).then(()=>{
  res.redirect('/admin/category')
})
}))
router.get('/blockUserByReport/:id/:report',((req,res)=>{
  let id=req.params.id
  let report = req.params.report
  console.log(report);
  console.log("naaaaaaaaaaaaaaaaaaaaaaaaa");
  console.log(id);
  adminHelpers.blockUser(id).then(()=>{
    console.log(report);
    adminHelpers.deleteReport(report).then(()=>{
      res.redirect('back')
    })
    
  })
}))
router.get('/deleteUserByReport/:id/:report',((req,res)=>{
  let id=req.params.id
  let report = req.params.report
  console.log(report);
  console.log("naaaaaaaaaaaaaaaaaaaaaaaaa");
  console.log(id);
  adminHelpers.deleteUser(id).then(()=>{
    console.log(report);
    adminHelpers.deleteReport(report).then(()=>{
      res.redirect('back')
    })
    
  })
}))

router.get('/order',(async(req,res)=>{
  let order = await adminHelpers.getOrder()
res.render('admin/admOrder',({adminNav:true,order}))

  console.log(order);
}))

router.get('/vendorComplaints',async(req,res)=>{
  let report = await adminHelpers.getVendReports()
    res.render('admin/admVendReport',({report,adminNav:true}))

})

router.get('/offer',async(req,res)=>{
  let offer = await adminHelpers.getCoupon()
  console.log("this is the offer");
console.log(offer);
    res.render('admin/offer',({adminNav:true,offer}))

})

router.post('/offer',async(req,res)=>{
  //let offer = await adminHelpers.getOffer()
  console.log(req.body);
  adminHelpers.addCoupon(req.body).then(()=>{
    res.redirect('/admin/offer')
  })
})
router.get('/deleteOffer/:id',(req,res)=>{
let id = req.params.id
console.log(id);
adminHelpers.deleteOffer(id).then(()=>{
  res.redirect('/admin/offer')
})
})


module.exports = router;
