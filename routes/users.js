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
initializePassport(passport)


router.get('/', async function(req, res, next) {
let products = await userHelpers.getProducts()
console.log(products);
console.log(req.user);
if(req.user){
  let user = req.user
  res.render('user/userHome',({userNav:true,products,user}))
}else{

  res.render('user/userHome',({userNav:true,products}))
}

  

});

router.get('/signup',(req,res)=>{
  res.render('user/signup')
})

router.post('/signup',(req,res)=>{
 
  userHelpers.signUpUser(req.body).then(()=>{
    res.redirect('/login')
  })
  


})
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


router.get('/viewProduct/:id',(async(req,res)=>{
  let id = req.params.id
  console.log(id);
  console.log("----------------");
  let product = await vendorHelpers.getProductforEdit(id)
  console.log(product);
  res.render('user/prodDetails',({userNav:true,product}))
 


}

))

router.get('/x',((req,res)=>{
  res.render('user/sample',({userNav:true}))
}))


module.exports = router;  
