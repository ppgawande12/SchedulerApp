const express = require("express");

const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
require("dotenv").config();
const compression = require("compression");

app.use(compression());
app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
// create a new post
const multer = require("multer");
const { BlobServiceClient } = require("@azure/storage-blob");
const upload = multer({ storage: multer.memoryStorage() });
const nodemailer = require("nodemailer");
const cron = require("node-cron");

const bcrypt = require("bcrypt");
const { run, client } = require("./mongodb");
//sent email

run();
const db = client.db("scheduleApp");
const usersCollection = db.collection("users");
const postsCollection = db.collection("Posts");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "email@gmail.com",
    pass: "password",
  },
});
const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: "email@gmail.com",
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const scheduleEmail = (to, subject, text, date) => {
  const cronExpression = `${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${
    date.getMonth() + 1
  } *`;
  cron.schedule(cronExpression, () => {
    sendEmail(to, subject, text);
  });
  return `Email scheduled for ${date}`;
};
// Azure Blob Storage setup

const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_BLOB_URL);
const containerClient = blobServiceClient.getContainerClient("postimages");

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const blobName = req.file.originalname;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    const uploadBlobResponse = await blockBlobClient.upload(req.file.buffer, req.file.size);

    const blobUrl = blockBlobClient.url;
    res.status(200).send({ url: blobUrl });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).send({ error: "Error uploading file" });
  }
});

app.post("/register", async (req, res) => {
  const { email, password, first_name, last_name } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      email,
      password: hashedPassword,
      first_name,
      last_name,
    };
    const result = await usersCollection.insertOne(newUser);
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error registering user" });
  }
});

// Login user
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await usersCollection.findOne({ email });
    console.log(user);
    const bcryptpass = await bcrypt.compare(password, user.password);
    console.log(bcryptpass);
    if (!user || !bcryptpass) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.status(200).json({ message: "Login Successfull", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error logging in" });
  }
});

// Middleware to authenticate the token
const authenticateToken = (req, res, next) => {
  const access_token = req.headers.authorization;

  if (!access_token) {
    return res.status(401).json({ error: "Token missing" });
  }

  req.user = access_token;
  next();
};

// Create post
app.post("/posts", authenticateToken, async (req, res) => {
  try {
    const { title, content, image, scheduleDate, scheduleTime, email } = req.body;

    const post = {
      title,
      content,
      image,
      scheduleDate,
      scheduleTime,
      email,
      userId: req.user,
    };

    const result = await postsCollection.insertOne(post);

    const scheduledDate = new Date(scheduleDate + "T" + scheduleTime);
    const cronResult = scheduleEmail(email, title, content, scheduledDate);
    // console.log(cronResult);

    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating post" });
  }
});

// Fetch posts
app.get("/posts", authenticateToken, async (req, res) => {
  try {
    const posts = await postsCollection.find({ userId: req.user }).toArray();
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching posts" });
  }
});

// Logout user
app.post("/logout", (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
});
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
