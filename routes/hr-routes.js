const router = require('express').Router();
const User = require('../models/user-model');
const authCheck = (req, res, next)=>{
    console.log("*************************");
    console.log(req.user);
    if(!req.user){
        // User is not logged in
        res.redirect('/auth/login');
    }
    else{
        // User is logged in
        next();
    }
}
router.get('/emp',authCheck,(req, res)=>{
    User.query(`select row_to_json(employees)  from "barcelo_hr".employees`,(err,res1)=>{
        if(err){
            console.log(err);
        }else{   
            console.log(res1.rows)  
            res.render('employee',{result: res1.rows, user: req.user});                   
              
        }        
    });
    
});

router.get('/dept',authCheck,(req, res)=>{
    User.query(`select row_to_json(departments)  from "barcelo_hr".departments`,(err,res1)=>{
        if(err){
            console.log(err);
        }else{   
            console.log(res1.rows)  
            res.render('department',{result: res1.rows, user: req.user});                   
              
        }        
    });
    
});

router.get('/empdept',authCheck,(req, res)=>{
    User.query(`SELECT row_to_json(group_dept) FROM "barcelo_hr".group_dept() `,(err,res1)=>{
        if(err){
            console.log(err);
        }else{   
            console.log(res1.rows)  
            res.render('empdept',{result: res1.rows, user: req.user});                   
              
        }        
    });
});

router.get('/salary',authCheck,(req, res)=>{
    User.query(`SELECT row_to_json(group_salary) FROM "barcelo_hr".group_salary() `,(err,res1)=>{
        if(err){
            console.log(err);
        }else{   
            console.log(res1.rows)  
            res.render('salary',{result: res1.rows, user: req.user});                   
              
        }        
    });
});
module.exports = router;