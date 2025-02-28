import { API_URL } from "@/utils/constants";
import { QUESTIONS_PER_PAGE } from "@/utils/constants";
import { toast } from "sonner";

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

export async function getMyQuestions(page) {
  // const res = await fetch(`${API_URL}/questions/my`);

  // // fetch won't throw error on 400 errors (e.g. when URL is wrong), so we need to do it manually. This will then go into the catch block, where the message is set
  try {
    const res = await fetch(
      // `${API_URL}/FAQ/getMyQuestions?page=${page}`,
      `${API_URL}/FAQ/getMyQuestions?page=${page}`,
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
        throw new Error(data.message);
      } else {
        // throw Error("Failed getting my questions");
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
    if (error.message !== "not found")
      toast.error("Une erreur est survenue", {
        description:
          error.message + ", Erreur lors de la récupération des questions.",
      });
    return {
      questions: [],
      total: 0,
    };
  }
}

export async function addQuestionAPI(question) {
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
    throw new Error(data.message);
  }
  const data = await res.json();
  return data;
}
export async function updateResponseAPI(id, response) {
  console.log(id, response);
  const res = await fetch(`${API_URL}/FAQ/updateResponse`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
    body: JSON.stringify({ id, response }),
  });
  if (!res.ok) {
    throw new Error("Erreur lors de la mise à jour de la reponse.");
  }

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
  console.log(questions);
  return { total, questions };
}

export async function getUser() {
  if (!localStorage.getItem("token")) {
    console.log("no token");
    // toast.info("Veuillez vous connecter", {
    //   description:
    //     "Veuillez vous connecter pour avoir accès a toutes les fonctionnalités.",
    // });
    return {};
  }
  const res = await fetch(`${API_URL}/user/getUser`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
  });

  if (!res.ok) {
    const data = await res.json();
    toast.error("Erreur", {
      description: `${data.message}, Erreur lors de la récupération de l'utilisateur.`,
    });
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
      toast.error("Échec de la connexion", {
        description:
          "Échec de la connexion. Veuillez vérifier vos identifiants.",
      });
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
      toast.error("Serveur indisponible");
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

    console.log(credentials);
    const data = await res.json();
    console.log(data);
    if (res.status === 400) {
      throw new Error("Mail déja utilisé.");
    }

    if (res.status === 500) {
      throw new Error("Problème serveur (ERREUR 500)");
    }

    if (!res.ok) {
      throw new Error(`Erreur HTTP: (${res.status}) ${res.statusText}`);
    }

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

export async function getEvents(page) {
  const res = await fetch(`${API_URL}/event/getEvents`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
  });
  if (!res.ok) {
    const data = await res.json();
    console.log(data);
    throw new Error("Failed getting events");
  }
  const { events } = await res.json();
  console.log(events);
  return events;
}

export async function getEvent(id) {
  const res = await fetch(`${API_URL}/event/getEvent/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    const data = await res.json();
    console.log(data);
    throw new Error("Failed getting event");
  }
  const data = await res.json();
  return data;
}

// export async function addEvent(event) {
//   const res = await fetch(`${API_URL}/event/addEvent`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(event),
//   });
//   if (!res.ok) {
//     const data = await res.json();
//     console.log(data);
//     throw new Error("Failed adding event");
//   }
//   const data = await res.json();
//   return data;
// }
export async function deleteEventAPI(eventID) {
  console.log(eventID);
  const res = await fetch(`${API_URL}/event/deleteEvent`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
    body: JSON.stringify({ id: eventID }),
  });
  if (!res.ok) {
    const data = await res.json();
    console.log(data);
    throw new Error("Failed deleting event " + eventID);
  }
  const data = await res.json();
  return data;
}
// Helper function to convert a data URL (base64) into a Blob
function dataURLtoBlob(dataURL) {
  const [header, base64Data] = dataURL.split(",");
  const mimeMatch = header.match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : "image/png";
  const binary = atob(base64Data);
  const array = [];
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], { type: mime });
}

// API function to add an event using FormData
export async function addEvent(event) {
  const formData = new FormData();

  // Append text fields
  formData.append("title", event.title);
  formData.append("description", event.description);
  // Note: the backend expects "endroit" instead of "location"
  formData.append("endroit", event.location);
  formData.append("type", event.type);
  formData.append("date", new Date(event.date).toISOString());

  // Prepare sections; backend expects a JSON string.
  // Here we map each section: converting "content" to "paragraph" and setting imageCount.
  const sections = event.sections.map((section) => ({
    title: section.title,
    paragraph: section.content, // backend expects "paragraph"
    imageCount: section.image ? 1 : 0, // adjust if you support multiple images per section
  }));
  formData.append("sections", JSON.stringify(sections));

  // Append cover image (backend field: "cover")
  if (event.coverImage) {
    const coverBlob = dataURLtoBlob(event.coverImage);
    formData.append("cover", coverBlob, "cover.png");
  }

  // Append carousel images (backend field: "carousel")
  event.sections.forEach((section) => {
    if (section.image) {
      const carouselBlob = dataURLtoBlob(section.image);
      formData.append("carousel", carouselBlob, "section-image.png");
    }
  });

  // Send the POST request; let the browser set the proper Content-Type header for FormData
  const res = await fetch(`${API_URL}/event/addEvent`, {
    method: "POST",
    headers: {
      Authorization: localStorage.getItem("token"),
      contentType: "multipart/form-data",
    },
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json();
    console.error("Error adding event:", errorData);
    throw new Error("Failed adding event");
  }

  return await res.json();
}
