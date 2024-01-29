const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const multer = require("multer");

const app = express();
app.use(cors());
app.use("/uploads",express.static("uploads"))

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

app.post("/signup", upload.array("profilePic"), async (req, res) => {
  console.log(req.body);
  console.log(req.files);

  let userarr = await User.find().and({ email: req.body.email });

  if (userarr.length > 0) {
    res.json({ status: "failure", msg: "User already exist" });
  } else {
    try {
      let newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        age: req.body.age,
        email: req.body.email,
        password: req.body.password,
        profilePic: req.files[0].path,
      });

      await newUser.save();

      res.json({ status: "success", msg: "User created successfully" });
    } catch (err) {
      res.json({ status: "failure", err: err });
    }
  }
});

app.post("/login", upload.none(), async (req, res) => {
  console.log(req.body);

  let fetchedData = await User.find().and({ email: req.body.email });

  if (fetchedData.length > 0) {
    if (fetchedData[0].password === req.body.password) {

let dataToSend = {
  firstName:fetchedData[0].firstName,
  lastName:fetchedData[0].lastName,
  age:fetchedData[0].age,
  email:fetchedData[0].email,
  profilePic:fetchedData[0].profilePic,
}

      res.json({ status: "success", data: dataToSend });
    } else {
      res.json({ status: "failure", msg: "Invalid password" });
    }
  } else {
    res.json({ status: "failure", msg: "User doesnot exist" });
  }
});

let userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  age: Number,
  email: String,
  password: String,
  profilePic: String,
});

let User = new mongoose.model("user7", userSchema);

app.listen(12345, () => {
  console.log("Listening to port 12345");
});

let connectToMDB = async () => {
  try {
    mongoose.connect(
      "mongodb+srv://ashok007:9912768721@cluster0.nmhu0bo.mongodb.net/Ashok@MongoDB007?retryWrites=true&w=majority"
    );
    console.log("Successfully connected to MDB");
  } catch (err) {
    console.log("Unable to connect MDB");
    console.log(err);
  }
};

connectToMDB();
