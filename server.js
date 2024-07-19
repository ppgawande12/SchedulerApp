const express = require("express");
const { createClient } = require("@supabase/supabase-js");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
require("dotenv").config();
const compression = require("compression");
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
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
const { config } = require("dotenv");
//sent email
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
app.get("/get-user", async (req, res) => {
  try {
    const authToken = req.headers.authorization;

    const {
      data: { user },
    } = await supabase.auth.getUser(authToken);
    if (!user) {
      throw new Error("supabase token is not valid");
    }

    let { data: users, usererror } = await supabase.from("users").select("*").eq("uid", user.id);

    if (usererror) throw new Error(error.usererror);

    // console.log(data);
    res.send(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
});

app.post("/posts", async (req, res) => {
  try {
    const { title, content, image, scheduleDate, scheduleTime, email } = req.body;
    const authToken = req.headers.authorization;

    const {
      data: { user },
    } = await supabase.auth.getUser(authToken);
    if (!user) {
      throw new Error("user not found");
    }
    const { data, error } = await supabase.from("schedule_posts").insert([
      {
        post_title: title,
        post_content: content,
        image_url: image,
        schedule_date: scheduleDate,
        schedule_time: scheduleTime,
        receivers_email: email,
        uid: user.id,
      },
    ]);

    if (error) throw new Error(error.message);
    const scheduledDate = new Date(scheduleDate + "T" + scheduleTime);
    const result = scheduleEmail(email, title, content, scheduledDate);
    console.log(result);
    res.status(201).json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

// Fetch all posts
app.get("/posts", async (req, res) => {
  try {
    const authToken = req.headers.authorization;

    if (!authToken) {
      throw new Error("access_token missing");
    }
    const {
      data: { user },
    } = await supabase.auth.getUser(authToken);
    if (!user) {
      throw new Error("user not found");
    }
    const { data, error } = await supabase.from("schedule_posts").select("*").eq("uid", user.id);

    if (error) throw new Error(error.message);

    res.status(200).json(data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

// user registration
app.post("/register", async (req, res) => {
  const { email, password, first_name, last_name } = req.body;

  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });
  if (error) return res.status(500).json({ error: error.message });

  const { data: userdata, usererror } = await supabase
    .from("users")
    .insert([
      {
        first_name: first_name,
        last_name: last_name,
        email: email,
        uid: data.user.id,
      },
    ])
    .select();
  if (usererror) {
    res.send(usererror);
    return;
  }
  res.send({ data });
});

// user login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json(data);
});

// user logout
app.post("/logout", async (req, res) => {
  try {
    const authToken = req.headers.authorization;

    const { error } = await supabase.auth.signOut(authToken);

    if (error) throw new Error(error.message);

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
