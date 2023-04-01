export async function fetchBeats(story) {
  const url = `/api/beats`;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(story),
  };

  const response = await fetch(url, options);

  const data = await response.json();

  if (!data) return false;

  return data;
}
