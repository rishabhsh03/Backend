const db = require("../db");
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
require("dotenv").config(); 
// For getting Users
const getUsers = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM userdata ORDER BY user_id");

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "INTERNAL SERVER ERROR",
    });
  }
};


// For Inserting data in users table
const saveUsers = async(req, res) =>{
    try{
        const {name, email_id, password} = req.body
        console.log(req.body);
        const result = await db.query(`
          INSERT INTO details
          (name, email_id, password)
          VALUES($1, $2, $3)`, [name, email_id, password]);

    
res.status(201).json({
    success: true,
    message:"DATA INSERTED SUCCESSFULLY",
});
}catch (error){
    console.error(error);

    res.status(500).json({
        success: false,
        message: error.message,
    });
  }
};
//GET duplicate user data 
const getDuplicateUsers = async (req, res) => {
  try{
    const result = await db.query(`
      SELECT * FROM userdata
      WHERE name IN (
      SELECT name FROM userdata
      GROUP BY name
      HAVING COUNT(*) > 1)
      `);
       res.status(200).json({
      success: true,
      data: result.rows,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// delete user data
const deleteUser = async (req, res) => {
  try{
    const {user_id} = req.params;
    const result = await db.query(`
      DELETE FROM userdata
      WHERE user_id = $1`, [user_id]);

      res.status(200).json({
        success: true,
        message: "USER DELETED SUCCESSFULLY",
    
      
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "INTERNAL SERVER ERROR",
      });
    }
  };
//Update User data
const updateUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { name, email_id, phone_no } = req.body;

    await db.query(`
      UPDATE userdata
      SET name = $1, email_id = $2, phone_no = $3
      WHERE user_id = $4`,
      [name, email_id, phone_no, user_id]
    );

    res.status(200).json({
      success: true,
      message: "USER UPDATED SUCCESSFULLY",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "INTERNAL SERVER ERROR",
    });
  }
};

// Register User
const register =  async(req, res) => {
  try{
    const {name, email, password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const result =  await db.query(`
      INSERT INTO details(name, email_id, password)
      VALUES($1, $2, $3)
      Returning *`,
      [name, email, hashedPassword]);
      console.log("Insert successful");
      console.log(result.rows);
      console.log(result.rows[0]);

    const token = jwt.sign({
       email,
    },
    process.env.JWT_SECRET, {
      expiresIn: '1d'    
    }
  );

  res.status(201).json({
    success: true,
    message: "USER REGISTERED SUCCESSFULLY",
    token: token
  });
} catch (error) {
  console.error(error); 
  res.status(500).json({
    success: false,
    message: "INTERNAL SERVER ERROR"
  });
}
};

module.exports = {
    getUsers,
    saveUsers,
    getDuplicateUsers,
    deleteUser,
    updateUser,
    register
};