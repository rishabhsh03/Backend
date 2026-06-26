const db = require("../db");
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const transporter = require("../mail");
const router = express.Router();
const otpGenerator = require("otp-generator");
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
console.log("Outside the delete function");

 const deleteUser = async (req, res) => {
  console.log("Inside function");
  try{
    const {user_id} = req.params;
    console.log("User Id: ", user_id);
    const result = await db.query(`
      DELETE FROM userdata
      WHERE user_id = $1`, [user_id]);
      console.log(result);

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
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await db.query(
      "SELECT * FROM details WHERE email_id = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      {
        email: user.email_id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    console.log("Token: ", token);

    res.status(200).json({
      success: true,
      token,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
const sendResetEmail = async (email, resetToken) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Password Reset",
      html: `
        <h2>Password Reset Request</h2>
        <p>Your reset token is:</p>
        <b>${resetToken}</b>
      `,
    });

    console.log("Email Sent:", info.messageId);
  } catch (error) {
    console.error("Email Error:", error);
    throw error;
  }
};

const ForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const result = await db.query(
      "SELECT * FROM details WHERE email_id = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const resetToken = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    await sendResetEmail(email, resetToken);

    res.status(200).json({
      success: true,
      message: "Reset email sent successfully",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
const testMail = async (req, res) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER,
      subject: "Test Email",
      html: "<h1>Nodemailer Working!</h1>",
    });
    console.log("Mail sent:", info)
    res.json({
      success: true,
      messageId: info.messageId,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const sendotp = async(req, res) => {

  try{
    const {phone_no} = req.body;
    console.log("Request params: ", req.body);
    const otp = otpGenerator.generate(6,{
      upperCaseAlphabets: false,
      lowerCaseAlphabets:false,
      specialChars:false
  })
  

    const result = await db.query(`
    INSERT INTO otp_verification(
      phone_no, otp, expires_at)
      VALUES
      ($1, $2, NOW () + INTERVAL '5 minutes')
      `,
      [phone_no, otp]
      );
      
      console.log("Result: ", result);
      res.status(200).json({
       " success":true,
        "message": "OTP generated successfully"
        
      });
      console.log("otp :", otp);
    } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error
    });
  }
};

const verify = async (req, res) => {
    try{
      const {phone_no, otp} = req.body;
     const result = await db.query(`
       SELECT *
      FROM otp_verification
      WHERE phone_no = $1
      AND otp = $2
      AND expires_at > NOW()
      `,
      [phone_no, otp]
      );
      res.status(200).json({
        "success":true,
        "message": "OTP generated successfully",
        "otp" : otp
      });
     } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

const saveTodo = async (req, res) => {
  console.log("Headers:", req.headers);
  console.log("BODY: ", req.body);
  console.log(req.body);
  try{
    const {tasks, completed, pending, date} = req.body;
    console.log(tasks, completed, pending,);
    const result = await db.query(`
      INSERT INTO todo_app(
      tasks, completed, pending, date)      
      VALUES( 
      $1, $2, $3, CURRENT_DATE)
      `,
    [tasks, completed, pending, ]
    );
    res.status(200).json({
      "success":"true",
      "message":"TASK INSERTED SUCCESSFULLY"
    });
  }catch(error){
    console.error(error)
  res.status(500).json({
    "success":"false",
    "message":"INTERNAL SERVER ERROR"
  })
  }
};

const getTodo = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM todo_app ORDER BY todo_id");

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
const deleteTodo = async (req, res) => {
  console.log("Inside function");
  try{
    console.log("req.param:",req.params);
    const {todo_id} = req.params;
    
    console.log("todo_id:",todo_id);  
    const result = await db.query(`
      DELETE FROM todo_app
      WHERE todo_id = $1`, 
      [todo_id]
    );
    

      res.status(200).json({
        success: true,
        message: "TASK DELETED SUCCESSFULLY",
        
      
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: "INTERNAL SERVER ERROR",
      });
    }
  };
const updateToDo = async (req, res) => {
  try {
    
    const { todo_id } = req.params;
    const { tasks, completed, pending} = req.body;
    console.log("req.body", req.body);
    await db.query(`
      UPDATE todo_app
      SET tasks = $1, completed = $2, pending = $3
      WHERE todo_id = $4`,
      [tasks, completed, pending, todo_id]
    );

    res.status(200).json({
      success: true,
      message: "TASK UPDATED SUCCESSFULLY",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "INTERNAL SERVER ERROR",
    });
  }
};
module.exports = {
    getUsers,
    saveUsers,
    getDuplicateUsers,
    deleteUser,
    updateUser,
    register,
    login,
    ForgotPassword,
    testMail,
    sendotp,
    verify,
    saveTodo,
    getTodo,
    deleteTodo,
    updateToDo
};