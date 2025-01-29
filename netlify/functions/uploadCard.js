const admin = require("firebase-admin");

// Initialize Firebase Admin with service account credentials
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      require("./../../firebase-service-account.json")
    ), // Path to the service account JSON file
  });
}
const db = admin.firestore(); // Reference to Firestore database

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405, // Method Not Allowed
      body: JSON.stringify({ message: "Only POST requests are allowed" }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body); // Parse incoming request body
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid JSON data" }),
    };
  }

  // Store card data in Firestore
  try {
    const cardRef = db.collection("cards").doc(); // Create a new document in 'cards' collection
    await cardRef.set({
      name: body.name,
      description: body.description,
      date: new Date(),
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Allow CORS
      },
      body: JSON.stringify({ message: "Card uploaded successfully!" }),
    };
  } catch (err) {
    return {
      statusCode: 500, // Internal Server Error
      body: JSON.stringify({
        message: "Failed to upload card",
        error: err.message,
      }),
    };
  }
};
