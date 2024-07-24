const express = require("express");
const cors = require("cors");
const compression = require("compression");
const multer = require("multer");
const { BlobServiceClient } = require("@azure/storage-blob");
const nodemailer = require("nodemailer");
const cron = require("node-cron");
const bcrypt = require("bcrypt");
const { run, client } = require("./mongodb");
require("dotenv").config();
const { ObjectId } = require("mongodb");
const app = express();
const port = 5000;
const NodeCache = require("node-cache");
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: "50mb", extended: true }));

run();
const db = client.db("scheduleApp");
const usersCollection = db.collection("users");
const postsCollection = db.collection("Posts");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const cache = new NodeCache({ stdTTL: 60 * 60, checkperiod: 60 * 10 });

const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
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

const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_BLOB_URL);
const containerClient = blobServiceClient.getContainerClient("postimages");
const upload = multer({ storage: multer.memoryStorage() });

//upload image
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const blobName = req.file.originalname;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.upload(req.file.buffer, req.file.size);
    const blobUrl = blockBlobClient.url;
    res.status(200).send({ url: blobUrl });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).send({ error: "Error uploading file" });
  }
});

//signup
app.post("/register", async (req, res) => {
  const { email, password, first_name, last_name } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { email, password: hashedPassword, first_name, last_name };
    const result = await usersCollection.insertOne(newUser);
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error registering user" });
  }
});

//login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await usersCollection.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    res.status(200).json({ message: "Login Successful", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error logging in" });
  }
});

//user authentication
const authenticateToken = (req, res, next) => {
  const access_token = req.headers.authorization;
  if (!access_token) {
    return res.status(401).json({ error: "Token missing" });
  }
  req.user = access_token;
  next();
};

//create post
app.post("/posts", authenticateToken, async (req, res) => {
  try {
    const { title, content, image, scheduleDate, scheduleTime, email } = req.body;
    const post = { title, content, image, scheduleDate, scheduleTime, email, userId: req.user };
    const result = await postsCollection.insertOne(post);
    const scheduledDate = new Date(`${scheduleDate}T${scheduleTime}`);
    const response = scheduleEmail(email, title, content, scheduledDate);
    res.status(201).json({ response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating post" });
  }
});

//get post
app.get("/posts", authenticateToken, async (req, res) => {
  try {
    const cacheKey = `posts_${req.user}`;
    let posts = cache.get(cacheKey);
    if (!posts) {
      posts = await postsCollection.find({ userId: req.user }).toArray();
      cache.set(cacheKey, posts);
    }
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching posts" });
  }
});

//get user
app.get("/get-user", authenticateToken, async (req, res) => {
  try {
    const userId = new ObjectId(req.user);
    const cacheKey = `user_${userId}`;
    let user = cache.get(cacheKey);
    if (!user) {
      user = await usersCollection.findOne({ _id: userId });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      cache.set(cacheKey, user); // Cache the user
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching user" });
  }
});

//logout
app.post("/logout", (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
