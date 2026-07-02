export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { message: 'Method not allowed' } });
  }

  try {
    // Get the messages array sent from the frontend
    const { messages } = req.body;

    if (!messages) {
      return res.status(400).json({ error: { message: 'Messages are required' } });
    }

    // Forward the request to Groq API securely
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`, // Uses the secure environment variable
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: messages,
        temperature: 0.7
      })
    });

    // Send the Groq response back to the frontend
    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: { message: "Internal Server Error" } });
  }
}
