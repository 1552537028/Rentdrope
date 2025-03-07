const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Routes
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/auth');
const paymentRoutes = require('./routes/payment');
const reviewRoutes = require('./routes/reviews');

// Models
const Product = require('./models/Product');
const User = require('./models/User');
const Reviews = require('./models/Reviews');
// Initialize the Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Serve static files (images) from the 'uploads' directory
const uploadsDir = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsDir)); // This allows access to uploaded images

// MongoDB connection
mongoose.connect('mongodb+srv://jayanth:jayanth@cluster0.ubyck.mongodb.net/rentdrope', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Middleware
app.use(cors({ origin: "https://rentdrope.onrender.com" }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail", // Use your email service (Gmail in this case)
  auth: {
    user: process.env.EMAIL_USER, // Your email (from environment variable)
    pass: process.env.EMAIL_PASS, // Your email password or app password (from environment variable)
  },
});

// Function to send email to both the user and admin
const sendEmail = async (userEmail, adminEmail, productTitle, orderAmount, selectedImage) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Your email address
    to: `${userEmail}, ${adminEmail}`, // Send to both user and admin
    subject: "Payment Successful",
    text: `Dear User,

Your payment of ₹${orderAmount} for the product "${productTitle}" has been successfully processed.

Thank you for your purchase!

Best regards,
Your Company Name`,

    html: `<p>Dear User,</p>
           <p>Your payment of <strong>₹${orderAmount}</strong> for the product <strong>"${productTitle}"</strong> has been successfully processed.</p>
           <img src="${selectedImage}" alt="Product Image" />
           <p>Thank you for your purchase!</p>
           <p>Best regards,</p>
           <p>Your Company Name</p>`,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        reject(error);
      } else {
        console.log("Email sent:", info.response);
        resolve(info.response);
      }
    });
  });
};

// Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', userRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/reviews', reviewRoutes); // Route for reviews

// Payment success route (Send email after payment success)
app.post("/api/payment/success", async (req, res) => {
  const { paymentData, productId } = req.body;

  try {
    // Log incoming request for debugging
    console.log("Received payment data:", paymentData);

    // Fetch product details
    const product = await Product.findById(productId);
    if (!product) {
      console.error("Product not found");
      return res.status(404).send("Product not found");
    }

    // Fetch admin email from the product's category (assuming category has adminEmail field)
    const adminEmail = product.email; // Assuming product has an email field for admin
    if (!adminEmail) {
      console.error("Admin email not found for this product");
      return res.status(404).send("Admin email not found for this product");
    }

    // Fetch user details from the payment data
    const user = await User.findById(paymentData.customerDetails.customer_id);
    if (!user) {
      console.error("User not found");
      return res.status(404).send("User not found");
    }

    console.log("Sending email to user:", user.email);
    console.log("Sending email to admin:", adminEmail);

    // Send email to both user and admin
    await sendEmail(user.email, adminEmail, product.title, paymentData.orderAmount, product.image); // Assuming `product.image` is the selected image URL

    console.log("Emails sent successfully");
    res.status(200).send("Payment successful, emails sent!");
  } catch (error) {
    console.error("Payment processing error:", error);
    res.status(500).send("Error processing payment");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



/*const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/products');
require('dotenv').config();

// Initialize the Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: "https://rentdrope.onrender.com" }));
app.use(bodyParser.json());

// Serve static files (images) from the 'uploads' directory
const uploadsDir = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsDir)); // This allows access to uploaded images

// MongoDB connection
mongoose.connect('mongodb+srv://jayanth:jayanth@cluster0.ubyck.mongodb.net/rentdrope', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Routes
app.use('/api/products', productRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
*/

