const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");
const { randomUUID } = require("crypto");

const dynamo = new DynamoDBClient({});
const ses = new SESClient({ region: "us-east-1" });

const TABLE_NAME = process.env.TABLE_NAME;
const SES_FROM = process.env.SES_FROM;
const SES_TO = process.env.SES_TO;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "https://jasonljohnson.com";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": CORS_ORIGIN,
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
};

function response(statusCode, body) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
    body: JSON.stringify(body),
  };
}

function notificationHtml({ name, email, subject, message, submittedAt, id }) {
  return `
<!DOCTYPE html>
<html>
<body style="font-family:sans-serif;color:#222;max-width:600px;margin:0 auto;padding:24px;">
  <h2 style="color:#7bb940;">New Contact Submission</h2>
  <table style="border-collapse:collapse;width:100%;">
    <tr><td style="padding:6px 12px;font-weight:bold;width:120px;">Name</td><td style="padding:6px 12px;">${escHtml(name)}</td></tr>
    <tr style="background:#f5f5f5;"><td style="padding:6px 12px;font-weight:bold;">Email</td><td style="padding:6px 12px;"><a href="mailto:${escHtml(email)}">${escHtml(email)}</a></td></tr>
    <tr><td style="padding:6px 12px;font-weight:bold;">Subject</td><td style="padding:6px 12px;">${escHtml(subject)}</td></tr>
    <tr style="background:#f5f5f5;"><td style="padding:6px 12px;font-weight:bold;">Message</td><td style="padding:6px 12px;white-space:pre-wrap;">${escHtml(message)}</td></tr>
    <tr><td style="padding:6px 12px;font-weight:bold;">Submitted</td><td style="padding:6px 12px;">${submittedAt}</td></tr>
    <tr style="background:#f5f5f5;"><td style="padding:6px 12px;font-weight:bold;">ID</td><td style="padding:6px 12px;font-size:0.85em;color:#666;">${id}</td></tr>
  </table>
</body>
</html>`;
}

function confirmationHtml({ name }) {
  return `
<!DOCTYPE html>
<html>
<body style="font-family:sans-serif;margin:0;padding:0;background:#f4f4f4;">
  <table style="max-width:600px;margin:32px auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
    <!-- Header -->
    <tr>
      <td style="background:#1a1a1a;padding:32px 40px;text-align:center;">
        <p style="margin:0;color:#7bb940;font-size:1.5rem;font-weight:700;letter-spacing:0.05em;">Jason L. Johnson</p>
        <p style="margin:8px 0 0;color:#aaa;font-size:0.85rem;letter-spacing:0.1em;text-transform:uppercase;">Full-Stack Engineer &amp; Creative Technologist</p>
      </td>
    </tr>
    <!-- Body -->
    <tr>
      <td style="padding:40px;">
        <h2 style="margin:0 0 16px;color:#1a1a1a;font-size:1.3rem;">Thanks for reaching out, ${escHtml(name)}!</h2>
        <p style="color:#444;line-height:1.7;margin:0 0 16px;">
          I've received your message and will get back to you as soon as possible — usually within one business day.
        </p>
        <p style="color:#444;line-height:1.7;margin:0 0 32px;">
          In the meantime, feel free to connect with me on LinkedIn or explore my work below.
        </p>
        <div style="text-align:center;margin-bottom:32px;">
          <a href="https://www.linkedin.com/in/jasonljohnson"
             style="display:inline-block;background:#7bb940;color:#fff;text-decoration:none;padding:12px 28px;border-radius:4px;font-weight:600;font-size:0.95rem;">
            Connect on LinkedIn
          </a>
        </div>
        <hr style="border:none;border-top:1px solid #eee;margin:0 0 24px;">
        <p style="color:#444;line-height:1.7;margin:0;">
          Best,<br>
          <strong>Jason L. Johnson</strong>
        </p>
      </td>
    </tr>
    <!-- Footer -->
    <tr>
      <td style="background:#f9f9f9;padding:20px 40px;text-align:center;border-top:1px solid #eee;">
        <p style="margin:0;color:#999;font-size:0.8rem;">
          &copy; ${new Date().getFullYear()} Jason L. Johnson &bull;
          <a href="https://jasonljohnson.com" style="color:#7bb940;text-decoration:none;">jasonljohnson.com</a>
        </p>
        <p style="margin:6px 0 0;color:#bbb;font-size:0.75rem;">
          You're receiving this because you submitted the contact form at jasonljohnson.com.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

exports.handler = async (event) => {
  // Handle preflight
  if (event.requestContext?.http?.method === "OPTIONS") {
    return { statusCode: 204, headers: CORS_HEADERS, body: "" };
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return response(400, { error: "Invalid JSON" });
  }

  const { name, email, subject, message, honeypot } = body;

  // Honeypot check — bots fill hidden fields
  if (honeypot) {
    // Return 200 to fool the bot
    return response(200, { success: true });
  }

  // Basic validation
  if (!name || !email || !subject || !message) {
    return response(400, { error: "Missing required fields" });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return response(400, { error: "Invalid email address" });
  }

  if (message.length > 5000) {
    return response(400, { error: "Message too long" });
  }

  const id = randomUUID();
  const submittedAt = new Date().toISOString();

  // Write to DynamoDB
  try {
    await dynamo.send(
      new PutItemCommand({
        TableName: TABLE_NAME,
        Item: {
          PK: { S: `CONTACT#${id}` },
          id: { S: id },
          name: { S: name },
          email: { S: email },
          subject: { S: subject },
          message: { S: message },
          submittedAt: { S: submittedAt },
          status: { S: "new" },
        },
      })
    );
  } catch (err) {
    console.error("DynamoDB error:", err);
    return response(500, { error: "Failed to save submission" });
  }

  // Send notification email to site owner
  try {
    await ses.send(
      new SendEmailCommand({
        Source: SES_FROM,
        Destination: { ToAddresses: [SES_TO] },
        ReplyToAddresses: [email],
        Message: {
          Subject: { Data: `[Portfolio Contact] ${subject}` },
          Body: {
            Html: { Data: notificationHtml({ name, email, subject, message, submittedAt, id }) },
            Text: {
              Data: `New contact from ${name} <${email}>\n\nSubject: ${subject}\n\n${message}\n\nSubmitted: ${submittedAt}\nID: ${id}`,
            },
          },
        },
      })
    );
  } catch (err) {
    console.error("SES notification error:", err);
    // Don't fail the request — submission is saved; notify owner separately if needed
  }

  // Send confirmation email to sender
  try {
    await ses.send(
      new SendEmailCommand({
        Source: SES_FROM,
        Destination: { ToAddresses: [email] },
        Message: {
          Subject: { Data: "Thanks for reaching out — Jason L. Johnson" },
          Body: {
            Html: { Data: confirmationHtml({ name }) },
            Text: {
              Data: `Hi ${name},\n\nThanks for reaching out! I've received your message and will get back to you as soon as possible — usually within one business day.\n\nBest,\nJason L. Johnson\nhttps://jasonljohnson.com`,
            },
          },
        },
      })
    );
  } catch (err) {
    console.error("SES confirmation error:", err);
    // Don't fail the request
  }

  return response(200, { success: true });
};
