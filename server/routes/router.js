const express = require('express');
const router = new express.Router();
const bcrypt = require('bcryptjs')
const multer = require('multer');
const fs = require('fs-extra');
const path = require('path');

const userdb = require('../models/userSchema');


//  Basic route for testing

router.get('/',(req,res)=>{
    res.send('Welcome to My Assignment')
})



//  for user registration

router.post('/api/signup', async (req, res) => {
    const { password,username } = req.body

    if (!password || !username) {
        res.status(400).json({ error: "Fill all the details" })
    }

    try {


        const existingUser = await userdb.findOne({username});

        if (existingUser) {
            return res.status(409).json({ message:"username already exists" });

        }


        const finaluser = new userdb({
            password,username
        })


        const storeData = await finaluser.save();

        return res.status(201).json(storeData)

    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal server error" });
    }


})





// for user login
router.post('/api/login', async (req, res) => {
    // console.log(req.body);

    const { username, password } = req.body;

    try {
        const userValid = await userdb.findOne({ username });

        if (userValid) {
            const isMatch = await bcrypt.compare(password, userValid.password);

            if (!isMatch) {
                res.status(401).json({ status: 401, error: "Invalid Credentials" });
            } else {
                // Generate token
                const token = await userValid.generateAuthtoken();
                // Return the token in the response
                res.status(200).json({ status: 200, result: { token } });
            }
        } else {
            // User not found
            res.status(404).json({ status: 404, error: "User not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 500, error: "Internal Server Error" });
    }
});









// // for File Upload



// Function to generate a 6-digit unique code

const generateUniqueCode = () => {
    return Math.random().toString(36).substr(2, 6).toUpperCase();
  };



// for storing locally
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, 'upload');
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath);
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });
  
  const upload = multer({ storage });
  
  // Define route for upload name in db
  router.post('/api/upload', upload.single('file'), async (req, res) => {
    const { originalname } = req.file;
    const { username } = req.body;
  
    // Generate unique 6-digit code
    const uniqueCode = generateUniqueCode();
  
    try {
      // Check if the user exists
      let user = await userdb.findOne({ username });
        
      // console.log('req.body_---------->',req.body)
      if (user) {
        // User exists, update their file list
        user.files.push({ fileName: originalname, uniqueCode });
        await user.save();
      } else {
        // User does not exist, create a new user with file details
        user = new userdb({
          username,
          files: [{ fileName: originalname, uniqueCode }],
        });
        await user.save();
      }
  
      res.status(200).json({
        message: 'File uploaded and details saved successfully!',
        file: {
          fileName: originalname,
          uniqueCode,
          username,
        },
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  });
  












// for File Delete




router.delete('/api/delete/:uniqueCode', async (req, res) => {
  const { uniqueCode } = req.params;
  const { username ,filename } = req.body;

  // Paths to local files
  const filePath = path.join(__dirname, 'upload', `${filename}`);

  try {
    // Find the user
    let user = await userdb.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Filter out the file to delete
    const fileIndex = user.files.findIndex(file => file.uniqueCode === uniqueCode);
    
    if (fileIndex === -1) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Remove file from the user's files array
    user.files.splice(fileIndex, 1);
    await user.save();

    // Delete the local files
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    if (fs.existsSync(thumbnailPath)) {
      fs.unlinkSync(thumbnailPath);
    }

    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});








// for download 

router.get('/api/download/:fileName', (req, res) => {
  const { fileName } = req.params;

 
  const filePath = path.join(__dirname, 'upload', fileName);

  res.download(filePath, (err) => {
      if (err) {
          console.error('Error occurred while sending the file:', err);
          res.status(500).json({ message: 'Failed to download the file.' });
      }
  });
});





















// GET API to fetch user files
router.get('/api/user/files/:username', async (req, res) => {
  const { username } = req.params; 

  if (!username) {
      return res.status(400).json({ error: 'Username is required' });
  }

  try {
      const user = await userdb.findOne({ username });

      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json({ files: user.files });
  } catch (error) {
      console.error('Error fetching user files:', error);
      res.status(500).json({ error: 'An error occurred while fetching files' });
  }
});










module.exports = router;