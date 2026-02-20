import type { APIRoute } from "astro";
import nodemailer from "nodemailer";

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// In-memory rate limiting
const rateLimitStore: Record<string, { count: number; timestamp: number }> = {};
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

const createTransporter = () =>
  nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: import.meta.env.EMAIL_USER,
      pass: import.meta.env.EMAIL_PASS,
    },
  });

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();

    if (rateLimitStore[ip]) {
      const { count, timestamp } = rateLimitStore[ip];
      if (now - timestamp > RATE_LIMIT_WINDOW_MS) {
        rateLimitStore[ip] = { count: 1, timestamp: now };
      } else if (count >= RATE_LIMIT_MAX) {
        return new Response(
          JSON.stringify({
            error: "Too many requests, please try again later",
          }),
          { status: 429, headers: { "Content-Type": "application/json" } }
        );
      } else {
        rateLimitStore[ip].count += 1;
      }
    } else {
      rateLimitStore[ip] = { count: 1, timestamp: now };
    }

    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!isValidEmail(email)) {
      return new Response(
        JSON.stringify({ error: "Please enter a valid email address" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const transporter = createTransporter();

    const recipients = import.meta.env.EMAIL_RECIPIENT
      ? import.meta.env.EMAIL_RECIPIENT.split(/[,;]\s*/).filter(Boolean)
      : [import.meta.env.EMAIL_USER];

    const date = new Date().toLocaleString();

    const htmlEmail = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Contact Form Submission</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px; border-left: 4px solid #2563eb; }
          .content { background-color: #ffffff; padding: 20px; border-radius: 5px; border: 1px solid #e5e5e5; }
          .message-box { background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 15px; white-space: pre-line; border-left: 2px solid #d1d5db; }
          .footer { margin-top: 20px; font-size: 12px; color: #666; text-align: center; }
          h2 { color: #2563eb; margin-top: 0; }
          .label { font-weight: bold; margin-right: 10px; }
          .info-row { margin-bottom: 10px; }
          a { color: #2563eb; }
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
          <div class="message-box">${message.replace(/\n/g, "<br>")}</div>
        </div>
        <div class="footer">
          <p>This email was sent from the contact form on your website.</p>
          <p>You can reply directly to this email to respond to ${name}.</p>
        </div>
      </body>
      </html>
    `;

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

    await transporter.sendMail({
      from: `"Portfolio Contact" <${import.meta.env.EMAIL_USER}>`,
      to: recipients,
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      text: textEmail,
      html: htmlEmail,
    });

    return new Response(
      JSON.stringify({ message: "Email sent successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(JSON.stringify({ error: "Failed to send email" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
