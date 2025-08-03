
const jwt = require("jsonwebtoken");
require("dotenv").config();

const express = require('express')
const jwt = require('jsonwebtoken')


const JWT_USER_SECRET = process.env.JWT_USER_SECRET;


async function jwtmiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token missing or malformed" });

require('dotenv').config()
const Jwt_USER_SECRET=process.env.Jwt_USER_SECRET

async function jwtmiddleware(req,res,next){
    try{
        const authHeader = req.headers['authorization'] || req.headers['token']
        if(!authHeader){
           return res.status(401).json({
                message:"Authorization token missing."
            })
        }

        const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader
        if(!token){
            return res.status(401).json({
               message: "Token not found in Authorization header"
            })
        }
        const decoded = jwt.verify( token , Jwt_USER_SECRET)
        req.user = decoded;
        next()
    }catch(error){  
        console.error("JWT Middleware Error:", error.message)
         return res.status(403).json({
            message:"Invalid or expired token"
        })
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_USER_SECRET);
    req.userid = decoded.userId;

    next();
  } catch (e) {
    console.error("JWT Middleware Error:", e.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
}


module.exports = jwtmiddleware;
