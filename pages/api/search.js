import { searchForBooks } from "@/lib/openlibrary";

export default async function handler(req, res) {
  const query = req.body.search;
  console.log("search triggered");

  if (!query) {
    return res.status(400).json({ data: "No query provided" });
  }

  try {
    const topResult = await searchForBooks(query);
    return res.status(200).json(topResult);
  } catch (error) {
    console.error(error);
    return res.status(400).json(error);
  }
}
