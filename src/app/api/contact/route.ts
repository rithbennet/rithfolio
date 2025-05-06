import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Simple email validation regex
const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// In-memory store for rate limiting (will reset on server restart)
// In a production app, you might want to use Redis or another persistence solution
const rateLimitStore: Record<string, { count: number; timestamp: number }> = {};

// Rate limit config - 5 requests per 15 minutes
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

// Create nodemailer transporter
const createTransporter = () => {
  // For Gmail, use port 465 with secure:true OR port 587 with secure:false
  return nodemailer.createTransport({
    service: "Gmail", // Using the Gmail service preset instead of manual config
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Verify transporter on module initialization
const verifyTransporter = async () => {
  try {
    const transporter = createTransporter();
    const verified = await transporter.verify();
    console.log("SMTP connection verified successfully:", verified);
  } catch (error) {
    console.error("Failed to verify SMTP connection:", error);
  }
};

// Verify connection on startup (in development)
if (process.env.NODE_ENV !== "production") {
  verifyTransporter();
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();

    if (rateLimitStore[ip]) {
      const { count, timestamp } = rateLimitStore[ip];
      // If the window has expired, reset the counter
      if (now - timestamp > RATE_LIMIT_WINDOW_MS) {
        rateLimitStore[ip] = { count: 1, timestamp: now };
      } else if (count >= RATE_LIMIT_MAX) {
        // Rate limit exceeded
        return NextResponse.json(
          { error: "Too many requests, please try again later" },
          { status: 429 }
        );
      } else {
        // Increment counter
        rateLimitStore[ip].count += 1;
      }
    } else {
      // First request from this IP
      rateLimitStore[ip] = { count: 1, timestamp: now };
    }

    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate the data
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // Configure Nodemailer transport
    const transporter = createTransporter();

    // Process recipient emails (can handle comma or semicolon separated list)
    const recipients = process.env.EMAIL_RECIPIENT
      ? process.env.EMAIL_RECIPIENT.split(/[,;]\s*/).filter(Boolean)
      : [process.env.EMAIL_USER];

    // Get current date and time for the email
    const date = new Date().toLocaleString();

    // Create a more professional HTML email template
    const htmlEmail = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Contact Form Submission</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #f5f5f5;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            border-left: 4px solid #2563eb;
          }
          .content {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 5px;
            border: 1px solid #e5e5e5;
          }
          .message-box {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
            margin-top: 15px;
            white-space: pre-line;
            border-left: 2px solid #d1d5db;
          }
          .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #666;
            text-align: center;
          }
          h2 {
            color: #2563eb;
            margin-top: 0;
          }
          .label {
            font-weight: bold;
            margin-right: 10px;
          }
          .info-row {
            margin-bottom: 10px;
          }
          a {
            color: #2563eb;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>New Contact Form Submission</h2>
          <div class="info-row"><span class="label">Date:</span> ${date}</div>
        </div>
        
        <div class="content">
          <div class="info-row"><span class="label">Name:</span> ${name}</div>
          <div class="info-row"><span class="label">Email:</span> <a href="mailto:${email}">${email}</a></div>
          <div class="info-row"><span class="label">Subject:</span> ${subject}</div>
          
          <div class="info-row"><span class="label">Message:</span></div>
          <div class="message-box">
            ${message.replace(/\n/g, "<br>")}
          </div>
        </div>
        
        <div class="footer">
          <p>This email was sent from the contact form on your website.</p>
          <p>You can reply directly to this email to respond to ${name}.</p>
        </div>
      </body>
      </html>
    `;

    // Create plain text version as fallback
    const textEmail = `
Contact Form Submission
=======================
Date: ${date}

From: ${name} (${email})
Subject: ${subject}

Message:
${message}

---
This email was sent from the contact form on your website.
You can reply directly to this email to respond to ${name}.
    `;

    // Email content
    const mailOptions = {
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: recipients,
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      text: textEmail,
      html: htmlEmail,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
