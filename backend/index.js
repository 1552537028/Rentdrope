const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const { GridFSBucket } = require("mongodb");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Global GridFS Bucket
global.gfsBucket = null;

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.once("open", () => {
  const db = mongoose.connection.db;
  global.gfsBucket = new GridFSBucket(db, { bucketName: "uploads" });
  console.log("✅ GridFSBucket initialized");
});

// Email setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (userEmail, adminEmail, productTitle, orderAmount, imageUrl) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: `${userEmail}, ${adminEmail}`,
    subject: "Payment Successful",
    html: `
      <p>Dear User,</p>
      <p>Your payment of <strong>₹${orderAmount}</strong> for <strong>${productTitle}</strong> is successful.</p>
      ${imageUrl ? `<img src="${imageUrl}" alt="Product Image" style="width:300px;" />` : ''}
      <p>Thanks for your purchase!</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("📧 Email sent to:", userEmail, adminEmail);
  } catch (err) {
    console.error("❌ Email error:", err.message);
  }
};

// Serve file from GridFS
app.get("/file/:filename", async (req, res) => {
  if (!global.gfsBucket) return res.status(500).json({ message: "GridFS not initialized" });

  try {
    const files = await global.gfsBucket.find({ filename: req.params.filename }).toArray();
    if (!files || files.length === 0) return res.status(404).json({ message: "File not found" });

    const file = files[0];
    res.set("Content-Type", file.contentType || "image/jpeg");
    global.gfsBucket.openDownloadStreamByName(file.filename).pipe(res);
  } catch (err) {
    console.error("File error:", err.message);
    res.status(500).json({ message: "Error retrieving file" });
  }
});

// Debug route
app.get("/files", async (req, res) => {
  try {
    const files = await global.gfsBucket.find().toArray();
    res.json(files);
  } catch (err) {
    res.status(500).json({ message: "File listing error", error: err.message });
  }
});

// Payment confirmation
const Product = require("./models/Product");
const User = require("./models/User");

app.post("/api/payment/success", async (req, res) => {
  const { paymentData, productId } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const adminEmail = product.email;
    const user = await User.findById(paymentData.customerDetails.customer_id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const imageUrl = product.images.length
      ? `${req.protocol}://${req.get("host")}/file/${product.images[0]}`
      : null;

    await sendEmail(user.email, adminEmail, product.title, paymentData.orderAmount, imageUrl);
    res.status(200).json({ message: "Emails sent successfully" });
  } catch (err) {
    console.error("Payment route error:", err.message);
    res.status(500).json({ message: "Error processing payment" });
  }
});

// Routes
app.use("/api/products", require("./routes/products"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/payment", require("./routes/payment"));
app.use("/api/reviews", require("./routes/reviews"));

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
