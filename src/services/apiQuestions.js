import { toast } from "sonner";

const API_URL = "http://localhost:3000";
const QUESTIONS_PER_PAGE = 1;

export async function getUsers() {
  const res = await fetch(`${API_URL}/user/getUsers`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
  });
  await new Promise((resolve) => setTimeout(resolve, 500));
  if (!res.ok) throw Error("Failed getting users");
  const { users } = await res.json();
  return users;
}
export async function addDoctorAPI(doctor) {
  const response = await fetch(`${API_URL}/user/addDoctor`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
    body: JSON.stringify(doctor),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message);
  }
  const data = await response.json();
  console.log(data);
  return data;
}

export async function deleteAccountAPI(id) {
  const res = await fetch(`${API_URL}/user/deleteAccount`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
    body: JSON.stringify({ id: id }),
  });
  if (!res.ok) {
    const data = await res.json();
    console.log(data);
    throw new Error(data.message);
  }
  const data = await res.json();
  console.log(data);
  return data;
}

export async function getMyQuestions(page, type) {
  // const res = await fetch(`${API_URL}/questions/my`);

  // // fetch won't throw error on 400 errors (e.g. when URL is wrong), so we need to do it manually. This will then go into the catch block, where the message is set
  try {
    const res = await fetch(
      // `${API_URL}/FAQ/getMyQuestions?page=${page}`,
      `${API_URL}/FAQ/getMyQuestions?page=${page}&type=${type}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      },
    );

    await new Promise((resolve) => setTimeout(resolve, 500));
    const data = await res.json();
    console.log(data);
    if (!res.ok) {
      if (res.status === 400) {
        return {
          questions: [],
          totalPages: 0,
        };
      } else {
        throw Error("Failed getting my questions");
      }
    }
    // const data = await res.json();
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
export async function getRecentQuestions(page, type) {
  const res = await fetch(
    // `${API_URL}/FAQ/getQuestions?page=${page}`,
    `${API_URL}/FAQ/getQuestions?page=${page}&type=${type}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  // await new Promise((resolve) => setTimeout(resolve, 3000));
  // fetch won't throw error on 400 errors (e.g. when URL is wrong), so we need to do it manually. This will then go into the catch block, where the message is set
  console.log("calling getRecentQuestions");
  if (!res.ok) throw Error("Failed getting recent questions");
  const data = await res.json();

  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    questions: data.questions,
    totalPages: Math.ceil(data.total / QUESTIONS_PER_PAGE),
  };
}
export async function answerQuestionAPI(id, response) {
  const res = await fetch(`${API_URL}/FAQ/respond/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
    body: JSON.stringify({ id, response }),
  });
  if (!res.ok) {
    toast.error("Erreur", {
      description: "Erreur lors de l'ajout de la reponse.",
    });
    throw new Error("Failed to add doctor");
  }
  toast.success("Réponse ajoutée", {
    description: "La reponse a bien été ajoutée.",
  });
  const data = await res.json();
  console.log(data);
  return data;
}
export async function deleteQuestionAPI(id) {
  const res = await fetch(`${API_URL}/FAQ/deleteQuestion`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
    body: JSON.stringify({ id: id }),
  });
  if (!res.ok) {
    const data = await res.json();
    console.log(data);
    toast.error("Erreur", {
      description: "Erreur lors de la suppression de la question.",
    });
    throw new Error("Erreur lors de la suppression de la question.");
  }
  toast.success("Question supprimée", {
    description: "La question a bien été supprimée.",
  });
  const data = await res.json();
  return data;
}
export async function updateResponseAPI(id, response) {
  const res = await fetch(`${API_URL}/FAQ/updateResponse`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
    body: JSON.stringify({ id, response }),
  });
  if (!res.ok) {
    toast.error("Erreur", {
      description: "Erreur lors de la mise à jour de la reponse.",
    });
    throw new Error("Erreur lors de la mise à jour de la reponse.");
  }
  toast.success("Réponse mise à jour", {
    description: "La reponse a bien été mise à jour.",
  });

  const data = await res.json();
  return data;
}
export async function deleteResponseAPI(id) {
  const res = await fetch(`${API_URL}/FAQ/deleteResponse/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
    body: JSON.stringify({ id: id }),
  });
  if (!res.ok) {
    toast.error("Erreur", {
      description: "Erreur lors de la suppression de la reponse.",
    });
    throw new Error("Erreur lors de la suppression de la reponse.");
  }
  toast.success("Réponse supprimée", {
    description: "La réponse a bien été supprimée.",
  });
  const data = await res.json();
  console.log(data);
  return data;
}
export async function getQuestionsAPI(type = "patient", page = 1) {
  const res = await fetch(
    `${API_URL}/FAQ/getQuestions?type=${type}&page=${page}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  if (!res.ok) {
    const data = await res.json();
    console.log(data, type, page);
    toast.error("Erreur", {
      description: "Erreur lors de la récupération des questions.",
    });
    throw new Error("Erreur lors de la récupération des questions.");
  }
  await new Promise((resolve) => setTimeout(resolve, 500));
  const { total, questions } = await res.json();
  return { total, questions };
}

export async function getUser() {
  const res = await fetch(`${API_URL}/userr/getUser`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
  });
  // await new Promise((resolve) => setTimeout(resolve, 500));

  if (!res.ok) {
    const data = await res.json();
    console.log(data);
    throw new Error("Failed getting user");
  }
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
