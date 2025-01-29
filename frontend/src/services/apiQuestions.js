const API_URL = "http://localhost:8000";

export async function getMyQuestions() {
  const res = await fetch(`${API_URL}/questions/my`);

  // fetch won't throw error on 400 errors (e.g. when URL is wrong), so we need to do it manually. This will then go into the catch block, where the message is set
  if (!res.ok) throw Error("Failed getting my questions");

  const data = await res.json();

  return data;
}
export async function getRecentQuestions() {
  const res = await fetch(`${API_URL}/questions/recents`);

  // fetch won't throw error on 400 errors (e.g. when URL is wrong), so we need to do it manually. This will then go into the catch block, where the message is set
  if (!res.ok) throw Error("Failed getting recent questions");

  const data = await res.json();
  return data;
}
export async function getUser() {
  const res = await fetch(`${API_URL}/user/manage/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
  });

  if (!res.ok) throw Error("Failed getting user");

  const data = await res.json();

  return data;
}
export async function postLoginUser(credentials) {
  // const response = await fetch(`${API_URL}/auth/login/`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(credentials),
  // });
  // if (!response.ok) {
  //   throw new Error("Login failed");
  // }
  // const data = await response.json();
  const res = await fetch(`${API_URL}/user/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  if (!res.ok) throw Error("Login failed"); // This will go into the catch block, where the message is set
  const data = await res.json();
  return data;
}
