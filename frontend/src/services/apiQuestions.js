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
  try {
    const res = await fetch(`${API_URL}/user/token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    console.log(res);
    // Handle specific error codes first
    if (res.status === 400) {
      throw new Error(
        "Échec de la connexion. Veuillez vérifier vos identifiants.",
      );
    }

    if (res.status === 500) {
      throw new Error("Problème serveur (ERREUR 500)");
    }

    if (res.status === 404) {
      throw new Error("Ressource non trouvée (ERREUR 404)");
    }

    if (!res.ok) {
      throw new Error(`Erreur HTTP: (${res.status}) ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    // Add generic network error handling
    if (error.message === "Failed to fetch") {
      throw new Error(
        "Serveur indisponible - vérifiez votre connexion internet",
      );
    }
    throw error;
  }
}
