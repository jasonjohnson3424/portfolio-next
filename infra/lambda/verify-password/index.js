const { SSMClient, GetParameterCommand } = require("@aws-sdk/client-ssm");
const { createHash } = require("crypto");

const ssm = new SSMClient({ region: "us-east-1" });
const CORS_ORIGIN = process.env.CORS_ORIGIN || "https://jasonljohnson.com";
const PASSWORD_HASH_PARAM = process.env.PASSWORD_HASH_PARAM;

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

// Cache hash across warm invocations
let cachedHash = null;
async function getPasswordHash() {
  if (cachedHash) return cachedHash;
  const result = await ssm.send(new GetParameterCommand({
    Name: PASSWORD_HASH_PARAM,
    WithDecryption: true,
  }));
  cachedHash = result.Parameter.Value;
  return cachedHash;
}

exports.handler = async (event) => {
  if (event.requestContext?.http?.method === "OPTIONS") {
    return { statusCode: 204, headers: CORS_HEADERS, body: "" };
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return response(400, { error: "Invalid JSON" });
  }

  const { password } = body;
  if (!password || typeof password !== "string") {
    return response(400, { error: "Missing password" });
  }

  try {
    const storedHash = await getPasswordHash();
    const submittedHash = createHash("sha256").update(password.trim()).digest("hex");
    if (submittedHash === storedHash) {
      return response(200, { success: true });
    } else {
      return response(200, { success: false });
    }
  } catch (err) {
    console.error("Error verifying password:", err);
    return response(500, { error: "Verification failed" });
  }
};
