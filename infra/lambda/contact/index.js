const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");
const { SSMClient, GetParameterCommand } = require("@aws-sdk/client-ssm");
const { randomUUID } = require("crypto");

const dynamo = new DynamoDBClient({});
const ses = new SESClient({ region: "us-east-1" });
const ssm = new SSMClient({ region: "us-east-1" });

const TABLE_NAME = process.env.TABLE_NAME;
const SES_FROM = process.env.SES_FROM;
const SES_TO = process.env.SES_TO;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "https://jasonljohnson.com";
const RECAPTCHA_SECRET_KEY_PARAM = process.env.RECAPTCHA_SECRET_KEY_PARAM;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": CORS_ORIGIN,
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
};

// Cache reCAPTCHA secret across warm invocations
let cachedRecaptchaSecret = null;
async function getRecaptchaSecret() {
  if (cachedRecaptchaSecret) return cachedRecaptchaSecret;
  const result = await ssm.send(new GetParameterCommand({
    Name: RECAPTCHA_SECRET_KEY_PARAM,
    WithDecryption: true,
  }));
  cachedRecaptchaSecret = result.Parameter.Value;
  return cachedRecaptchaSecret;
}

function response(statusCode, body) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
    body: JSON.stringify(body),
  };
}

function toEst(isoString) {
  return new Date(isoString).toLocaleString("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function emailHeader() {
  return `
    <tr>
      <td style="background:#0b1120;padding:28px 40px;text-align:center;">
        <img src="https://jasonljohnson.com/logo-email.png" alt="JLJ" width="40" height="40"
             style="display:inline-block;vertical-align:middle;margin-right:12px;" />
        <span style="color:#ffffff;font-size:1.3rem;font-weight:700;vertical-align:middle;">Jason L. Johnson</span>
        <br>
        <span style="color:rgba(255,255,255,0.85);font-size:0.8rem;letter-spacing:0.08em;text-transform:uppercase;">
          L&amp;D Manager &bull; Instructional Designer &bull; Web Developer
        </span>
      </td>
    </tr>`;
}

function emailFooter() {
  return `
    <tr>
      <td style="background:#f9f9f9;padding:24px 40px;text-align:center;border-top:1px solid #eee;">
        <div style="margin-bottom:14px;">
          <a href="https://www.linkedin.com/in/jason-johnson-264835146/"
             style="display:inline-block;width:36px;height:36px;border-radius:8px;background:#0a66c2;text-align:center;line-height:36px;margin:0 5px;text-decoration:none;" title="LinkedIn">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#ffffff" style="vertical-align:middle;margin-top:-2px;">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
          <a href="https://github.com/jasonjohnson3424"
             style="display:inline-block;width:36px;height:36px;border-radius:8px;background:#181717;text-align:center;line-height:36px;margin:0 5px;text-decoration:none;" title="GitHub">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#ffffff" style="vertical-align:middle;margin-top:-2px;">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
            </svg>
          </a>
        </div>
        <p style="margin:0;color:#999;font-size:0.8rem;">
          &copy; ${new Date().getFullYear()} Jason L. Johnson &bull;
          <a href="https://jasonljohnson.com" style="color:#7bb940;text-decoration:none;">jasonljohnson.com</a>
        </p>
      </td>
    </tr>`;
}

function notificationHtml({ name, email, subject, message, submittedAt, id }) {
  return `
<!DOCTYPE html>
<html>
<body style="font-family:sans-serif;margin:0;padding:0;background:#f4f4f4;">
  <table style="max-width:600px;margin:32px auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);border-collapse:collapse;width:100%;">
    ${emailHeader()}
    <tr>
      <td style="padding:32px 40px;">
        <h2 style="margin:0 0 20px;color:#1a1a1a;font-size:1.2rem;">New Contact Submission</h2>
        <table style="border-collapse:collapse;width:100%;font-size:0.92rem;">
          <tr><td style="padding:8px 12px;font-weight:bold;width:110px;color:#555;">Name</td><td style="padding:8px 12px;">${escHtml(name)}</td></tr>
          <tr style="background:#f5f5f5;"><td style="padding:8px 12px;font-weight:bold;color:#555;">Email</td><td style="padding:8px 12px;"><a href="mailto:${escHtml(email)}" style="color:#7bb940;">${escHtml(email)}</a></td></tr>
          <tr><td style="padding:8px 12px;font-weight:bold;color:#555;">Subject</td><td style="padding:8px 12px;">${escHtml(subject)}</td></tr>
          <tr style="background:#f5f5f5;"><td style="padding:8px 12px;font-weight:bold;color:#555;vertical-align:top;">Message</td><td style="padding:8px 12px;white-space:pre-wrap;">${escHtml(message)}</td></tr>
          <tr><td style="padding:8px 12px;font-weight:bold;color:#555;">Submitted</td><td style="padding:8px 12px;">${toEst(submittedAt)}</td></tr>
          <tr style="background:#f5f5f5;"><td style="padding:8px 12px;font-weight:bold;color:#555;">ID</td><td style="padding:8px 12px;font-size:0.82em;color:#888;">${id}</td></tr>
        </table>
      </td>
    </tr>
    ${emailFooter()}
  </table>
</body>
</html>`;
}

function confirmationHtml({ name, subject }) {
  const firstName = escHtml(name.split(" ")[0]);
  return `
<!DOCTYPE html>
<html>
<body style="font-family:sans-serif;margin:0;padding:0;background:#f4f4f4;">
  <table style="max-width:600px;margin:32px auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);border-collapse:collapse;width:100%;">
    ${emailHeader()}
    <tr>
      <td style="padding:40px;">
        <h2 style="margin:0 0 16px;color:#1a1a1a;font-size:1.3rem;">Thanks for reaching out, ${firstName}!</h2>
        <p style="color:#444;line-height:1.7;margin:0 0 12px;">
          I've received your message regarding <strong>${escHtml(subject)}</strong> and will get back to you as soon as possible — usually within one business day.
        </p>
        <p style="color:#444;line-height:1.7;margin:0 0 32px;">
          In the meantime, feel free to connect with me on LinkedIn.
        </p>
        <div style="text-align:center;margin-bottom:32px;">
          <a href="https://www.linkedin.com/in/jason-johnson-264835146/"
             style="display:inline-block;background:#7bb940;color:#fff;text-decoration:none;padding:12px 28px;border-radius:4px;font-weight:600;font-size:0.95rem;">
            Connect on LinkedIn
          </a>
        </div>
        <hr style="border:none;border-top:1px solid #eee;margin:0 0 24px;">
        <p style="color:#444;line-height:1.7;margin:0;">
          Respectfully,<br>
          <strong>Jason L. Johnson</strong>
        </p>
      </td>
    </tr>
    ${emailFooter()}
  </table>
</body>
</html>`;
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

  const { name, email, subject, message, honeypot, recaptchaToken } = body;

  // Honeypot check — bots fill hidden fields
  if (honeypot) {
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

  // reCAPTCHA verification
  try {
    const secret = await getRecaptchaSecret();
    const verifyRes = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${recaptchaToken}`,
      { method: "POST" }
    );
    const verifyData = await verifyRes.json();
    console.log("reCAPTCHA response:", JSON.stringify(verifyData));
    if (!verifyData.success || verifyData.score < 0.5) {
      return response(400, { error: "reCAPTCHA verification failed" });
    }
  } catch (err) {
    console.error("reCAPTCHA error:", err);
    return response(500, { error: "reCAPTCHA check failed" });
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
              Data: `New contact from ${name} <${email}>\n\nSubject: ${subject}\n\n${message}\n\nSubmitted: ${toEst(submittedAt)}\nID: ${id}`,
            },
          },
        },
      })
    );
  } catch (err) {
    console.error("SES notification error:", err);
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
            Html: { Data: confirmationHtml({ name, subject }) },
            Text: {
              Data: `Hi ${name.split(" ")[0]},\n\nThanks for reaching out! I've received your message regarding "${subject}" and will get back to you as soon as possible — usually within one business day.\n\nRespectfully,\nJason L. Johnson\nhttps://jasonljohnson.com`,
            },
          },
        },
      })
    );
  } catch (err) {
    console.error("SES confirmation error:", err);
  }

  return response(200, { success: true });
};
