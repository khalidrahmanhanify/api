exports.handler = async (event, context) => {
  // Check if it's a POST request
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405, // Method Not Allowed
      body: JSON.stringify({ message: "Only POST requests are allowed" }),
    };
  }

  // Parse the incoming form data (assuming it's JSON)
  let body;
  try {
    body = JSON.parse(event.body); // Assuming JSON format for form data
  } catch (err) {
    return {
      statusCode: 400, // Bad Request
      body: JSON.stringify({ message: "Invalid JSON data" }),
    };
  }

  // Log the data received from the form (you can process or save it here)
  console.log("Form Data:", body);

  // Respond back with success
  return {
    statusCode: 200, // OK
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*", // Allow requests from any domain
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
    body: JSON.stringify({
      message: "Data received successfully!",
      data: body, // Optionally return the data that was sent
    }),
  };
};
