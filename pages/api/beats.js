async function fetchBeats(story) {
  const prompt = `What are the story beats in the book ${story}? (If you aren't sure what book this is, don't make up a response, and instead just say "No.") List them as a set of bullet points that avoid assuming knowledge of subsequent story beats. For each bullet point, indicate how that beat contributes to the overall plot and character development. Format your response as markdown, with each story beat as a bullet point, with sub-bullets for each how the story beat contributes to the plot and how the story beat contributes to character development. Don't use bold or italic formatting.
  You are aware that your target audience is writers who want to understand how stories are structured and why.`;

  const url = "https://api.openai.com/v1/chat/completions";
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.75,
      max_tokens: 800,
    }),
  };

  const response = await fetch(url, options);

  const data = await response.json();

  if (!data) return false;

  return data;
}

export default async function handler(req, res) {
  // Get title to pass on
  const query = req.body.title;

  if (!query) {
    return res.status(400).json({ data: "No query provided" });
  }

  try {
    const beats = await fetchBeats(query);
    return res.status(200).json(beats);
  } catch (error) {
    return res.status(400).json(error);
  }
}
