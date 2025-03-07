/**const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { Cashfree } = require('cashfree-pg');

// Configure Cashfree
Cashfree.XClientId = process.env.CLIENT_ID;
Cashfree.XClientSecret = process.env.CLIENT_SECRET;
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;

// Function to generate a unique order ID
function generateOrderId() {
    const uniqueId = crypto.randomBytes(16).toString('hex');
    const hash = crypto.createHash('sha256');
    hash.update(uniqueId);
    return hash.digest('hex').substr(0, 12);
}

// Payment initiation route
router.post('/initiate', async (req, res) => {
    const { orderAmount, customerDetails } = req.body;

    if (!orderAmount || !customerDetails) {
        return res.status(400).json({ message: "Order amount and customer details are required." });
    }

    const request = {
        order_id: generateOrderId(),
        order_amount: orderAmount,
        order_currency: 'INR',
        customer_details: customerDetails,
    };

    try {
        const response = await Cashfree.PGCreateOrder("2023-08-01", request);
        res.json(response.data);
    } catch (error) {
        console.error('Payment initiation error:', error);
        res.status(500).json({ error: 'Payment initiation failed', details: error.message });
    }
});

// Payment verification route
router.post('/verify', async (req, res) => {
    const { orderId } = req.body;

    try {
        const response = await Cashfree.PGOrderFetchPayments("2023-08-01", orderId);
        res.json(response.data);
    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({ message: "Error verifying payment." });
    }
});

module.exports = router;
*/

const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { Cashfree } = require('cashfree-pg');

// Configure Cashfree
Cashfree.XClientId = process.env.CLIENT_ID;
Cashfree.XClientSecret = process.env.CLIENT_SECRET;
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;

// Function to generate a unique order ID
function generateOrderId() {
    const uniqueId = crypto.randomBytes(16).toString('hex');
    const hash = crypto.createHash('sha256');
    hash.update(uniqueId);
    return hash.digest('hex').substr(0, 12);
}

// Payment initiation route
router.post('/initiate', async (req, res) => {
    const { orderAmount, customerDetails } = req.body;

    // Log received request for debugging
    console.log("Received payment initiation request with:", {
        orderAmount,
        customerDetails,
    });

    // Validate the required fields
    if (!orderAmount || !customerDetails || !customerDetails.customer_id) {
        return res.status(400).json({ message: "Order amount and customer details are required." });
    }

    const request = {
        order_id: generateOrderId(), // Generate unique order ID
        order_amount: orderAmount,
        order_currency: 'INR', // Assuming INR for Indian payments
        customer_details: customerDetails, // Customer details coming from the frontend
    };

    try {
        // Call Cashfree API to create the order
        const response = await Cashfree.PGCreateOrder("2023-08-01", request);
        // Send the payment session ID to the frontend
        res.json(response.data);
    } catch (error) {
        console.error('Payment initiation error:', error);
        res.status(500).json({ error: 'Payment initiation failed', details: error.message });
    }
});

// Payment verification route
router.post('/verify', async (req, res) => {
    const { orderId } = req.body;

    try {
        // Call Cashfree API to verify the payment for a specific order ID
        const response = await Cashfree.PGOrderFetchPayments("2023-08-01", orderId);
        res.json(response.data);
    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({ message: "Error verifying payment." });
    }
});

module.exports = router;
