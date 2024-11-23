const API_URL = "http://localhost:9000/questions";

export async function getMyQuestions() {
  const res = await fetch(`${API_URL}/my`);

  // fetch won't throw error on 400 errors (e.g. when URL is wrong), so we need to do it manually. This will then go into the catch block, where the message is set
  if (!res.ok) throw Error("Failed getting my questions");

  const data = await res.json();
  console.log(data);

  return data;
}
export async function getRecentQuestions() {
  const res = await fetch(`${API_URL}/recents`);

  // fetch won't throw error on 400 errors (e.g. when URL is wrong), so we need to do it manually. This will then go into the catch block, where the message is set
  if (!res.ok) throw Error("Failed getting recent questions");

  const data = await res.json();
  return data;
}
