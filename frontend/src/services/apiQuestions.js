import { toast } from "@/hooks/use-toast";

const API_URL = "http://localhost:3000";
const QUESTIONS_PER_PAGE = 2;
export async function getMyQuestions(page) {
  // const res = await fetch(`${API_URL}/questions/my`);

  // // fetch won't throw error on 400 errors (e.g. when URL is wrong), so we need to do it manually. This will then go into the catch block, where the message is set
  try {
    const res = await fetch(`${API_URL}/FAQ/getMyQuestions?page=${page}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    });

    await new Promise((resolve) => setTimeout(resolve, 500));
    if (!res.ok) {
      if (res.status === 400 || res.status === 500) {
        return {
          questions: [],
          totalPages: 0,
        };
      } else {
        throw Error("Failed getting my questions");
      }
    }
    const data = await res.json();
    // console.log(data, res);
    if (!data) return [];
    return {
      questions: data.questions,
      totalPages: Math.ceil(data.total / QUESTIONS_PER_PAGE),
    };
  } catch (error) {
    console.error(error);
    toast({
      title: "Erreur",
      message: "Erreur lors de la récupération de vos questions",
      type: "error",
    });
  }
}

export async function addQuestion(question) {
  const response = await fetch(`${API_URL}/FAQ/sendQuestion`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
    body: JSON.stringify(question),
  });

  if (!response.ok) {
    throw new Error("Failed to add question");
  }

  const data = await response.json();
  console.log(data);
  return data;
}
export async function getRecentQuestions(pageNumber) {
  const res = await fetch(`${API_URL}/FAQ/getQuestions?page=${pageNumber}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  // await new Promise((resolve) => setTimeout(resolve, 3000));
  // fetch won't throw error on 400 errors (e.g. when URL is wrong), so we need to do it manually. This will then go into the catch block, where the message is set
  if (!res.ok) throw Error("Failed getting recent questions");
  const data = await res.json();

  await new Promise((resolve) => setTimeout(resolve, 5000));
  console.log(data);
  return {
    questions: data.questions,
    totalPages: Math.ceil(data.total / QUESTIONS_PER_PAGE),
  };
}
export async function getUser() {
  const res = await fetch(`${API_URL}/user/getUser`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
  });

  if (!res.ok) throw Error("Failed getting user");
  const data = await res.json();
  return data;
}
export async function postLoginUser(credentials) {
  try {
    const res = await fetch(`${API_URL}/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

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
      throw new Error("Route non trouvée (ERREUR 404)");
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
export async function postSignupUser(credentials) {
  try {
    const res = await fetch(`${API_URL}/user/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    console.log(res);

    if (res.status === 400) {
      throw new Error("Échec de l'inscription. Mail déja utilisé.");
    }

    if (res.status === 500) {
      throw new Error("Problème serveur (ERREUR 500)");
    }

    if (!res.ok) {
      throw new Error(`Erreur HTTP: (${res.status}) ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    if (error.message === "Failed to fetch") {
      throw new Error(
        "Serveur indisponible - vérifiez votre connexion internet",
      );
    }
    throw error;
  }
}
