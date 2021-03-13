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
router.get('/',requireAuth, function(req, res, next) {

 

    res.render('admin/admHom', ({ adminNav:true }));

  
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
    console.log("kitii");
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




router.get('/vendor',requireAuth,async function (req, res, next) {
  let vendor = await adminHelpers.getVendor()
  res.render('admin/vendor', ({ adminNav:true ,vendor }));
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

router.get('/blockVendor/:id',((req,res)=>{
  let id=req.params.id
  console.log(id);
  adminHelpers.blockVendor(id).then(()=>{
    res.redirect('/admin/vendor')
  })
}))
router.get('/unblock/:id',((req,res)=>{
  let id=req.params.id
  console.log(id);
  adminHelpers.unBlockVendor(id).then(()=>{
    res.redirect('/admin/vendor')
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
module.exports = router;
