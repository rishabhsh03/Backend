const db = require("../db");

// For getting Users
const getUser = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM userdata");

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
const updateUsers = async(req, res) =>{
    try{
        const result = await db.query(`
    UPDATE userdata
    SET 
        name = 'Rogers',
        email_id = 'Rogers@gmail.com',
        phone_no = 734732648
      WHERE user_id =11;  
`);
    
res.status(201).json({
    success: true,
    message:"User updated successfully",
});
}catch (error){
    console.error(error);

    res.status(500).json({
        success: false,
        message: error.message,
    });
  }
};
module.exports = {
    getUser,
    updateUsers
};