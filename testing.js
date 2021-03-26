
//OTPPPPPPPPPPPPPPPPPPPPPPP
router.get('/signupOtp',(req,res)=>{
    res.render('user/otpSignupPage',)
  })
  router.get('/otpLoginPage',(req,res)=>{
    res.render('user/otpLoginPage',)
  })
   
  //otplogin
  
  router.post('/otpLogin',(req,res)=>{
    
    console.log(req.body);
    if (req.body.mobile) {
      client
      .verify
      .services("VA8a7eec9348e83c9f2388de7b256b884e")
      .verifications
      .create({
          to:'+91'+req.body.mobile,
          channel:'sms'
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
      .services("VA8a7eec9348e83c9f2388de7b256b884e")
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
            .services("VA8a7eec9348e83c9f2388de7b256b884e")
            .verificationChecks
            .create({
                to: '+91'+req.body.mobile,
                code: req.body.code
            })
            .then(data => {
              console.log(data);
                if (data.status === "approved") {
                  userHelpers.getUserByNumber(req.body.mobile).then((response)=>{
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
            .services("VA8a7eec9348e83c9f2388de7b256b884e")
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
  