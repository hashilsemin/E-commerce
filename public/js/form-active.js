(function ($) {
 "use strict";
 
	// Validation for login form
		$("#adminpro-form").validate(
		{					
			rules:
			{	
				email:
				{
					required: true,
					email: true
				},
				password:
				{
					required: true,
					minlength: 3,
					maxlength: 20
				}
			},
			messages:
			{	
				email:
				{
					required: 'Please enter your email address',
					email: 'Please enter a VALID email address'
				},
				password:
				{
					required: 'Please enter your password'
				}
			},					
			
			errorPlacement: function(error, element)
			{
				error.insertAfter(element.parent());
			}
		});
		

		$("#vendorLogin").validate(
			{					
				rules:
				{	
					email:
					{
						required: true,
						email: true
					},
					password:
					{
						required: true,
						minlength: 3,
						maxlength: 20
					}
				},
				messages:
				{	
					email:
					{
						required: 'Please enter your email address',
						email: 'Please enter a VALID email address'
					},
					password:
					{
						required: 'Please enter your password',
						minlength:"Please type 3 letters"
					}
				},					
				
				errorPlacement: function(error, element)
				{
					error.insertAfter(element.parent());
				}
			});



			$("#vendorSignup").validate(
				{					
					rules:
					{	
						email:
						{
							required: true,
							email: true
						},
						name:
						{
							required: true,
							minlength: 3,
							maxlength: 20
						}
						,
						mobile:
						{
							required: true,
							minlength: 3,
							maxlength: 20
						},
						
						address:
						{
							required: true,
							minlength: 3,
							maxlength: 20
						}
						

					},
					messages:
					{	
						email:
						{
							required: 'Please enter your email address',
							email: 'Please enter a VALID email address'
						},
						name:
						{
							required: 'Please enter the name',
						
						},
						mobile:
						{
							required: 'Please enter your mobile',
							
						},
						address:
						{
							required: 'Please enter your address',
							
						}
					},					
					
					errorPlacement: function(error, element)
					{
						error.insertAfter(element.parent());
					}
				});
	




		$("#adminpro-formsign").validate(
			{					
				rules:
				{	
					email:
					{
						required: true,
						email: true
					},
					password:
					{
						required: true,
						minlength: 3,
						maxlength: 20
					},
					conpassword : {
						
						equalTo : '[name="password"]'
					}
				},
				messages:
				{	
					email:
					{
						required: 'Please enter your email address',
						email: 'Please enter a VALID email address'
					},
					password:
					{
						required: 'Please enter your password'
					}
				},					
				
				errorPlacement: function(error, element)
				{
					error.insertAfter(element.parent());
				}
			});


			$("#editCategory").validate(
				{					
					rules:
					{	
						category:
						{
							required: true,
						
						},
						description:
						{
							required: true,
							
						}
						
						
					},
					messages:
					{	
						category:
						{
							required: 'Please enter the category name',
							
						},
						description:
						{
							required: 'Please enter the description'
						},
					
					},					
					
					errorPlacement: function(error, element)
					{
						error.insertAfter(element.parent());
					}
				});
	
				$("#addcategory").validate(
					{					
						rules:
						{	
							category:
							{
								required: true,
							
							},
							description:
							{
								required: true,
								
							}
							
							
						},
						messages:
						{	
							category:
							{
								required: 'Please enter the category name',
								
							},
							description:
							{
								required: 'Please enter the description'
							},
						
						},					
						
						errorPlacement: function(error, element)
						{
							error.insertAfter(element.parent());
						}
					});


					$("#addproduct").validate(
						{					
							rules:
							{	
								product:
								{
									required: true,
								
								},
								category:
								{
									required: true,
									
								},
								description:
								{
									required: true,
									
								},
								price:
								{
									required: true,
									
								},
								realfileInput:
								{
									required: true,
									
								},
								resultreal:
								{
									required: true,
									
								},
								fileInput:
								{
									required: true,
									
								},
								brfileInput:
								{
									required: true,
									
								}

								
								
							},
							messages:
							{	
								category:
								{
									required: 'Please enter the category name',
									
								},
								description:
								{
									required: 'Please enter the description'
								},
							
							},					
							
							errorPlacement: function(error, element)
							{
								error.insertAfter(element.parent());
							}
						});

						$("#editproduct").validate(
							{					
								rules:
								{	
									product:
									{
										required: true,
									
									},
									category:
									{
										required: true,
										
									},
									description:
									{
										required: true,
										
									},
									price:
									{
										required: true,
										
									},
									Image1:
									{
										required: true,
										
									},
									Image2:
									{
										required: true,
										
									},
									Image3:
									{
										required: true,
										
									},
									Image4:
									{
										required: true,
										
									}
	
									
									
								},
								messages:
								{	
									category:
									{
										required: 'Please enter the category name',
										
									},
									description:
									{
										required: 'Please enter the description'
									},
								
								},					
								
								errorPlacement: function(error, element)
								{
									error.insertAfter(element.parent());
								}
							});

		$("#addvendor").validate(
			{					
				rules:
				{	
					email:
					{
						required: true,
						email: true
					},
					address:
					{
						required: true,
						
					}
					,
					mobile:
					{
						required: true,
						number:true,
						minlength:10
						
					}
					,
					name:
					{
						required: true,
						
					}
				},
				messages:
				{	
					email:
					{
						required: 'Please enter your email address',
						email: 'Please enter a VALID email address'
					},
					password:
					{
						required: 'Please enter your password'
					},
					mobile:
					{
						number: 'Please only add numbers',
						minlength:'Please enter 10 digit number'
					}
				},					
				
				errorPlacement: function(error, element)
				{
					error.insertAfter(element.parent());
				}
			});

			$("#adminCoupon").validate(
				{					
					rules:
					{	
						name:
						{
							required: true,
							
						},
						code:
						{
							required: true,
							minlength:6,
							maxlength:6

							
						}
						,
						discount:
						{
							required: true,
							number:true,
							minlength:1,
							maxlength:2,
							min:1
							
						}
						,
						description:
						{
							required: true,
							
						}
					},
					messages:
					{	
						name:
						{
							required: 'Please enter the name',
							
						},
						code:
						{
							required: 'Please enter your Code',
							minlength:"It should be 6 letters",
							maxlength:"It should be 6 letters"
						},
						discount:
						{
							number: 'Please only add numbers',
							minlength:'Please enter the percentage,(2 digits)'
						}
					},					
					
					errorPlacement: function(error, element)
					{
						error.insertAfter(element.parent());
					}
				});

				$("#reportCustomer").validate(
					{					
						rules:
						{	
							
							message:
							{
								required: true,
								
								
							}
							
						},
						messages:
						{	
							message:
							{
								required: 'Please enter the message',
								
							},
							
						},					
						
						errorPlacement: function(error, element)
						{
							error.insertAfter(element.parent());
						}
					});


					// $("#otpNumber").validate(
					// 	{					
					// 		rules:
					// 		{	
								
					// 			mobile:
					// 			{
					// 				required: true,
									
					// 				minlength:10,
					// 				maxlength:10
									
					// 			}
								
					// 		},
					// 		messages:
					// 		{	
					// 			message:
					// 			{
					// 				required: 'Please enter the 10 digit number',
									
					// 			},
								
					// 		},					
							
					// 		errorPlacement: function(error, element)
					// 		{
					// 			error.insertAfter(element.parent());
					// 		}
					// 	});

	// Validation for Register form
		$("#adminpro-register-form").validate(
		{					
			rules:
			{	
				username:
				{
					required: true
				},
				email:
				{
					required: true,
					email: true
				},
				password:
				{
					required: true,
					minlength: 3,
					maxlength: 20
				},
				confarm_password:
				{
					required: true,
					minlength: 3,
					maxlength: 20
				}
			},
			messages:
			{	
				username:
				{
					required: 'Please enter your username'
				},
				email:
				{
					required: 'Please enter your email address',
					email: 'Please enter a VALID email address'
				},
				password:
				{
					required: 'Please enter your password'
				},
				confarm_password:
				{
					required: 'Please enter your confarm password'
				}
			},					
			
			errorPlacement: function(error, element)
			{
				error.insertAfter(element.parent());
			}
		});
	// Validation for Contact form
		$("#adminpro-contact-form").validate(
		{					
			rules:
			{	
				email:
				{
					required: true,
					email: true
				},
				subject:
				{
					required: true
				},
				message:
				{
					required: true
				}
			},
			messages:
			{	
				email:
				{
					required: 'Please enter your email address',
					email: 'Please enter a VALID email address'
				},
				subject:
				{
					required: 'Please enter your subject'
				},
				message:
				{
					required: 'Please enter your message'
				}
			},					
			
			errorPlacement: function(error, element)
			{
				error.insertAfter(element.parent());
			}
		});
	// Validation for Comment form
		$("#adminpro-comment-form").validate(
		{					
			rules:
			{	
				name:
				{
					required: true
				},
				email:
				{
					required: true,
					email: true
				},
				phone:
				{
					required: true
				},
				website:
				{
					required: true
				},
				comment:
				{
					required: true
				}
			},
			messages:
			{	
				name:
				{
					required: 'Please enter your full name'
				},
				email:
				{
					required: 'Please enter your email address',
					email: 'Please enter a VALID email address'
				},
				phone:
				{
					required: 'Please enter phone number'
				},
				website:
				{
					required: 'Please enter your website'
				},
				comment:
				{
					required: 'Please enter description'
				}
			},					
			
			errorPlacement: function(error, element)
			{
				error.insertAfter(element.parent());
			}
		});
	// Validation for review form
		$("#adminpro-review-form").validate(
		{					
			rules:
			{	
				name:
				{
					required: true
				},
				email:
				{
					required: true,
					email: true
				},
				subject:
				{
					required: true
				},
				review:
				{
					required: true
				}
			},
			messages:
			{	
				name:
				{
					required: 'Please enter your full name'
				},
				email:
				{
					required: 'Please enter your email address',
					email: 'Please enter a VALID email address'
				},
				subject:
				{
					required: 'Please enter your subject'
				},
				review:
				{
					required: 'Please enter your review text'
				}
			},					
			
			errorPlacement: function(error, element)
			{
				error.insertAfter(element.parent());
			}
		});
	// Validation for masking form
		$("#adminpro-masking-form").validate(
		{					
			rules:
			{	
				phone:
				{
					required: true
				},
				date:
				{
					required: true
				},
				serial:
				{
					required: true
				},
				card:
				{
					required: true
				},
				cvv:
				{
					required: true
				},
				tax:
				{
					required: true
				}
			},
			messages:
			{	
				phone:
				{
					required: 'Please enter masking phone number'
				},
				date:
				{
					required: 'Please enter masking date'
				},
				serial:
				{
					required: 'Please enter your serial number'
				},
				card:
				{
					required: 'Please enter your credit card number'
				},
				cvv:
				{
					required: 'Please enter your cvv2 number'
				},
				tax:
				{
					required: 'Please enter your tax id number'
				}
			},					
			
			errorPlacement: function(error, element)
			{
				error.insertAfter(element.parent());
			}
		});
	// Validation for checkout form
		$("#adminpro-checkout-form").validate(
		{					
			rules:
			{	
				firstname:
				{
					required: true
				},
				lastname:
				{
					required: true
				},
				email:
				{
					required: true,
					email: true
				},
				phone:
				{
					required: true
				},
				address:
				{
					required: true
				},
				interested:
				{
					required: true
				},
				city:
				{
					required: true
				},
				interestedbd:
				{
					required: true
				},
				cartname:
				{
					required: true
				},
				cardnumber:
				{
					required: true
				},
				cvv2:
				{
					required: true
				},
				finish:
				{
					required: true
				}
			},
			messages:
			{	
				firstname:
				{
					required: 'Please enter first name'
				},
				lastname:
				{
					required: 'Please enter last name'
				},
				email:
				{
					required: 'Please enter your email address',
					email: 'Please enter a VALID email address'
				},
				phone:
				{
					required: 'Please enter your phone number'
				},
				address:
				{
					required: 'Please enter your address'
				},
				interested:
				{
					required: 'Please select your country'
				},
				city:
				{
					required: 'Please enter your city'
				},
				interestedbd:
				{
					required: 'Please select your Budgets'
				},
				cartname:
				{
					required: 'Please enter your cartname'
				},
				cardnumber:
				{
					required: 'Please enter your card number'
				},
				cvv2:
				{
					required: 'Please enter your cvv2 number'
				},
				finish:
				{
					required: 'Please select expired date'
				}
			},					
			
			errorPlacement: function(error, element)
			{
				error.insertAfter(element.parent());
			}
		});
	// Validation for order form
		$("#adminpro-order-form").validate(
		{					
			rules:
			{	
				fullname:
				{
					required: true
				},
				email:
				{
					required: true,
					email: true
				},
				phone:
				{
					required: true
				},
				companyname:
				{
					required: true
				},
				start:
				{
					required: true
				},
				finish:
				{
					required: true
				},
				interestedcategory:
				{
					required: true
				},
				interestedbudget:
				{
					required: true
				},
				cardnumber:
				{
					required: true
				},
				cvv2:
				{
					required: true
				},
				finish:
				{
					required: true
				}
			},
			messages:
			{	
				fullname:
				{
					required: 'Please enter full name'
				},
				email:
				{
					required: 'Please enter your email address',
					email: 'Please enter a VALID email address'
				},
				phone:
				{
					required: 'Please enter your phone number'
				},
				companyname:
				{
					required: 'Please enter your company name'
				},
				start:
				{
					required: 'Please select your start date'
				},
				finish:
				{
					required: 'Please enter your end date'
				},
				interestedcategory:
				{
					required: 'Please select category'
				},
				interestedbudget:
				{
					required: 'Please enter your budgets'
				},
				cardnumber:
				{
					required: 'Please enter your card number'
				},
				cvv2:
				{
					required: 'Please enter your cvv2 number'
				},
				finish:
				{
					required: 'Please select expired date'
				}
			},					
			
			errorPlacement: function(error, element)
			{
				error.insertAfter(element.parent());
			}
		});
	// Validation for captcha form
		$("#adminpro-captcha-form").validate(
		{					
			rules:
			{	
				captcha:
				{
					required: true
				}
			},
			messages:
			{	
				captcha:
				{
					required: 'Please enter captcha'
				}
			},					
			
			errorPlacement: function(error, element)
			{
				error.insertAfter(element.parent());
			}
		});
		
 
})(jQuery); 