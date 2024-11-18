const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { getFirestore } = require("firebase-admin/firestore");
const admin = require("firebase-admin");
const { LambdaClient, InvokeCommand } = require("@aws-sdk/client-lambda");

// Configure AWS Lambda client
const awsLambdaClient = new LambdaClient({
  region: process.env.AWS_REGION,
  credentials: {
    accountId: process.env.AWS_ACCOUNT_ID,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY,
  },
});

// Configure Firebase Admin SDK using environment variables
const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
};

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = getFirestore();

const TIER_LIMITS = {
  free: 10,
  hobby: 500,
  business: 10000,
};

// Language configurations
const LANGUAGES = ["javascript", "python"];
// @route   POST /api/generate-token
// @desc    Generate new API token
router.post("/generate-token", async (req, res) => {
  try {
    const { type, user_email } = req.body; // type can be 'free', 'hobby', or 'business'

    if (!type || !Object.keys(TIER_LIMITS).includes(type)) {
      return res.status(400).json({
        msg: "Please specify valid token type (free/hobby/business)",
      });
    }

    const token = jwt.sign(
      {
        type,
        user_email,
        createdAt: new Date().toISOString(),
        dailyLimit: TIER_LIMITS[type],
      },
      process.env.JWT_SECRET
    );
    // Store token usage data in Firebase
    await db.collection("tokenUsage").doc(token).set({
      type,
      user_email,
      createdAt: new Date().toISOString(),
      requestCount: 0,
      lastReset: new Date().toISOString(),
    });

    res.json({
      token,
      type,
      dailyLimit: TIER_LIMITS[type],
      message: `Limited to ${TIER_LIMITS[type]} requests per day`,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Helper function to check and update token usage
async function checkTokenUsage(token, decodedToken) {
  const tokenDoc = await db.collection("tokenUsage").doc(token).get();

  if (!tokenDoc.exists) {
    throw new Error("Token not found in database");
  }

  const tokenData = tokenDoc.data();
  const now = new Date();
  const lastReset = new Date(tokenData.lastReset);

  // Check if we need to reset the counter (new day)
  if (
    lastReset.getDate() !== now.getDate() ||
    lastReset.getMonth() !== now.getMonth() ||
    lastReset.getFullYear() !== now.getFullYear()
  ) {
    // Reset counter for new day
    await tokenDoc.ref.update({
      requestCount: 1,
      lastReset: now.toISOString(),
    });
    return true;
  }

  // Check if limit exceeded
  if (tokenData.requestCount >= TIER_LIMITS[decodedToken.type]) {
    throw new Error("Daily limit exceeded");
  }

  // Increment counter
  await tokenDoc.ref.update({
    requestCount: admin.firestore.FieldValue.increment(1),
  });

  return true;
}

// Helper function to execute code in lambda

async function invokePythonCode(code) {
  const input = {
    FunctionName: "pycoderunner",
    InvocationType: "RequestResponse",
    Payload: JSON.stringify({ code }),
  };

  try {
    const command = new InvokeCommand(input);
    const response = await awsLambdaClient.send(command);

    // Convert Uint8Array to string
    const responseData = JSON.parse(Buffer.from(response.Payload).toString());
    return responseData;
  } catch (error) {
    console.error("Error invoking Lambda:", error);
    throw error;
  }
}

async function invokeJSCode(code) {
  const input = {
    FunctionName: "jscoderunner",
    InvocationType: "RequestResponse",
    Payload: JSON.stringify({ code }),
  };

  try {
    const command = new InvokeCommand(input);
    const response = await awsLambdaClient.send(command);

    // Convert Uint8Array to string
    const responseData = JSON.parse(Buffer.from(response.Payload).toString());
    console.log(responseData);
    return responseData;
  } catch (error) {
    console.error("Error invoking Lambda:", error);
    throw error;
  }
}

// @route   POST /api/execute
// @desc    Execute code with token validation
router.post("/execute", async (req, res) => {
  const { code, lang } = req.body;

  if (!code || !lang) {
    return res.status(400).json({ msg: "Code and language are required" });
  }

  if (!LANGUAGES.includes(lang)) {
    return res.status(400).json({ msg: "Unsupported language" });
  }

  try {
    const token = req.header("x-api-token");

    if (!token) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user_email = decoded.user_email;

    // Get all tokens for this user
    const userTokensRef = db.collection("tokenUsage");
    const userTokensSnapshot = await userTokensRef
      .where("user_email", "==", user_email)
      .get();

    const today = new Date().toISOString().split("T")[0];
    let totalRequestsToday = 0;

    // Calculate total requests across all user tokens
    userTokensSnapshot.forEach((doc) => {
      const tokenData = doc.data();
      const lastReset = tokenData.lastReset.split("T")[0];

      // Only count requests from today
      if (lastReset === today) {
        totalRequestsToday += tokenData.requestCount;
      }
    });

    // Get the highest tier limit for this user
    let userHighestTierLimit = TIER_LIMITS.free; // Default to free tier
    userTokensSnapshot.forEach((doc) => {
      const tokenData = doc.data();
      const tierLimit = TIER_LIMITS[tokenData.type];
      if (tierLimit > userHighestTierLimit) {
        userHighestTierLimit = tierLimit;
      }
    });

    // Check if user has exceeded their highest tier limit
    if (totalRequestsToday >= userHighestTierLimit) {
      return res.status(429).json({
        msg: `Daily limit of ${userHighestTierLimit} requests exceeded across all your tokens. Please upgrade your plan or wait for tomorrow.`,
        totalRequestsToday,
        limitPerDay: userHighestTierLimit,
      });
    }

    // Get the specific token being used
    const tokenRef = db.collection("tokenUsage").doc(token);
    const tokenDoc = await tokenRef.get();

    if (!tokenDoc.exists) {
      return res.status(401).json({ msg: "Invalid token" });
    }

    const tokenData = tokenDoc.data();
    const lastReset = tokenData.lastReset.split("T")[0];

    // Reset counter if it's a new day
    if (lastReset !== today) {
      await tokenRef.update({
        requestCount: 1, // Set to 1 since we're about to use it
        lastReset: new Date().toISOString(),
      });
    } else {
      // Increment the counter
      await tokenRef.update({
        requestCount: admin.firestore.FieldValue.increment(1),
      });
    }

    // Execute code
    let output;
    if (lang === "python") {
      output = await invokePythonCode(code);
    } else if (lang == "javascript") {
      output = await invokeJSCode(code);
    }

    // Get updated usage
    const updatedDoc = await tokenRef.get();
    const updatedData = updatedDoc.data();

    res.json({
      output,
      tokenType: decoded.type,
      requestsUsed: updatedData.requestCount,
      totalRequestsToday: totalRequestsToday + 1, // Include the current request
      requestsRemaining: userHighestTierLimit - (totalRequestsToday + 1),
      limitPerDay: userHighestTierLimit,
    });
  } catch (err) {
    console.error(err.message);
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ msg: "Invalid token" });
    }
    return res.status(500).json({
      msg: "Server error",
      error: err.message,
    });
  }
});

module.exports = router;
