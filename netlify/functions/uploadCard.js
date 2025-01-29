const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      require("./firebase-service-account.json")
    ), // 🔹 Replace with your service account file
    databaseURL: "https://khalidapi-ac2fb-default-rtdb.firebaseio.com", // 🔹 Replace with your actual Firebase Database URL
  });
}

const db = admin.database(); // ✅ Reference to Realtime Database

exports.handler = async (event) => {
  console.log("Incoming request:", event);

  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Only POST requests are allowed" }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body); // Parse JSON body
    console.log("Parsed body:", body);
  } catch (err) {
    console.error("Invalid JSON:", err);
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid JSON data" }),
    };
  }

  try {
    const ref = db.ref("cards").push(); // 🔹 Push a new entry into 'cards'
    await ref.set({
      name: body.name,
      description: body.description,
      date: new Date().toISOString(),
    });

    console.log("Data successfully written to Realtime Database!");

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Enable CORS
      },
      body: JSON.stringify({ message: "Card uploaded successfully!" }),
    };
  } catch (err) {
    console.error("Database write failed:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to upload card",
        error: err.message,
      }),
    };
  }
};
