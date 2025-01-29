// netlify/functions/uploadCard.js

const fs = require("fs");
const path = require("path");

// This function will be triggered by the frontend request
exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405, // Method Not Allowed
      body: JSON.stringify({ message: "Only POST requests are allowed." }),
    };
  }

  // Parse the JSON body
  const { name, description } = JSON.parse(event.body);

  if (!name || !description) {
    return {
      statusCode: 400, // Bad Request
      body: JSON.stringify({ message: "Name and description are required." }),
    };
  }

  // Example of saving data to a file (you can replace this with a database in production)
  const filePath = path.join(__dirname, "cards.json");

  try {
    const existingData = fs.existsSync(filePath)
      ? JSON.parse(fs.readFileSync(filePath))
      : [];
    existingData.push({
      name,
      description,
      timestamp: new Date().toISOString(),
    });

    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Card uploaded successfully!" }),
    };
  } catch (error) {
    return {
      statusCode: 500, // Internal Server Error
      body: JSON.stringify({ message: "Failed to save card data." }),
    };
  }
};
