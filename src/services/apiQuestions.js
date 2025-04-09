import { API_URL } from "@/utils/constants";
import { QUESTIONS_PER_PAGE } from "@/utils/constants";
import { toast } from "sonner";

if (localStorage.getItem("token")) localStorage.clear();
export async function getUsers() {
  const res = await fetch(`${API_URL}/user/getUsers`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: JSON.parse(localStorage.getItem("jwt")).token,
    },
  });
  if (!res.ok) throw Error("Failed getting users");
  const { users } = await res.json();
  return users;
}
export async function addDoctorAPI(doctor) {
  const response = await fetch(`${API_URL}/user/addDoctor`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: JSON.parse(localStorage.getItem("jwt")).token,
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
      Authorization: JSON.parse(localStorage.getItem("jwt")).token,
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
          Authorization: JSON.parse(localStorage.getItem("jwt")).token,
        },
      },
    );
    // await new Promise((resolve) => setTimeout(resolve, 500));
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
      Authorization: JSON.parse(localStorage.getItem("jwt")).token,
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

  // await new Promise((resolve) => setTimeout(resolve, 500));

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
      Authorization: JSON.parse(localStorage.getItem("jwt")).token,
    },
    body: JSON.stringify({ id, response }),
  });
  if (!res.ok) {
    toast.error("Erreur", {
      description: "Erreur lors de l'ajout de la reponse.",
    });
    throw new Error("Failed to add doctor");
  }
  // toast.success("Réponse ajoutée", {
  //   description: "La reponse a bien été ajoutée.",
  // });
  const data = await res.json();
  console.log(data);
  return data;
}
export async function deleteQuestionAPI(id) {
  const res = await fetch(`${API_URL}/FAQ/deleteQuestion`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: JSON.parse(localStorage.getItem("jwt")).token,
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
      Authorization: JSON.parse(localStorage.getItem("jwt")).token,
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
      Authorization: JSON.parse(localStorage.getItem("jwt")).token,
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
  console.log(type, page);
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
  let { total, questions } = await res.json();
  await new Promise((r) => setTimeout(r, 500));
  // questions = [];
  return { total, questions };
}

export async function getUser() {
  if (!localStorage.getItem("jwt")) {
    return {};
  }
  const res = await fetch(`${API_URL}/user/getUser`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: JSON.parse(localStorage.getItem("jwt")).token,
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
  // throw new Error("Failed getting user");
  // await new Promise((r) => setTimeout(r, 1000));
  return data;
}
export async function postLoginUser(credentials) {
  let res = null;

  try {
    res = await fetch(`${API_URL}/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    if (res.status === 400) {
      throw new Error("Mail ou mot de passe incorrect.");
    }

    if (!res.ok) {
      console.log("res not ok");
      throw new Error(`Erreur HTTP: (${res.status}) ${res.statusText}`);
    }
    const data = await res.json();
    return data;
  } catch {
    if (res.status === 500) {
      console.log("res not ok");
      throw new Error("Problème serveur (ERREUR 500)");
    }

    if (res.status === 404) {
      console.log("res not ok");
      throw new Error("Route non trouvée (ERREUR 404)");
    }

    if (res.status === 503) {
      console.log("res not ok");
      throw new Error("Serveur indisponible");
    }
    if (res.status === 400) {
      console.log("res not ok");
      toast.error("Échec de la connexion", {
        description:
          "Échec de la connexion. Veuillez vérifier vos identifiants.",
      });
      const error = new Error(
        "Échec de la connexion. Veuillez vérifier vos identifiants.",
      );
      error.status = 400;
      error.isAuthError = true; // Special flag to identify this as an auth error
      throw error;
    }
    if (!res.ok) {
      console.log("res not ok");
      throw new Error(`Erreur HTTP: (${res.status}) ${res.statusText}`);
    }
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

export async function getEvents(page, type) {
  const res = await fetch(
    `${API_URL}/event/getEvents?type=${type}&page=${page}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Authorization: JSON.parse(localStorage.getItem("jwt")).token,
      },
    },
  );
  if (!res.ok) {
    await res.json();
    throw new Error("Failed getting events");
  }
  const data = await res.json();
  const { events, total } = data;
  return { events, total };
}

export async function getEvent(id) {
  const res = await fetch(`${API_URL}/event/getEventDetails?id=${id}`, {
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
      Authorization: JSON.parse(localStorage.getItem("jwt")).token,
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
function dataURLtoFile(dataUrl, filename) {
  const [header, base64Data] = dataUrl.split(",");
  const mimeMatch = header.match(/:(.*?);/);
  if (!mimeMatch) {
    throw new Error("Invalid data URL");
  }
  const mime = mimeMatch[1];
  const binaryStr = atob(base64Data);
  const len = binaryStr.length;
  const u8arr = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    u8arr[i] = binaryStr.charCodeAt(i);
  }
  return new File([u8arr], filename, { type: mime });
}

export async function addEvent(eventData, signal) {
  // Create a new FormData instance
  const formData = new FormData();

  // Append the cover image file (field name "cover")
  const coverFile = dataURLtoFile(eventData.coverImage, "cover.png");
  formData.append("cover", coverFile);

  // Append basic event details
  formData.append("title", eventData.title);
  formData.append("description", eventData.description);
  formData.append("date", eventData.date);
  formData.append("endroit", eventData.location); // note: field expected by backend is "endroit"
  formData.append("type", eventData.type);

  // Ensure each section has an "imageCount" property (derived from the number of images)
  const sectionsWithCount = eventData.sections.map((section) => {
    return {
      title: section.title,
      paragraph: section.paragraph,
      imageCount: section.images.length,
    };
  });
  // Append sections as a JSON string
  formData.append("sections", JSON.stringify(sectionsWithCount));

  // Append all section images in order as "carousel"
  // The backend expects these files in the order defined by imageCount in sections.
  eventData.sections.forEach((section, sectionIndex) => {
    section.images.forEach((imgData, imageIndex) => {
      // Convert each base64 image to a File
      const filename = `section-${sectionIndex}-img-${imageIndex}.png`;
      const file = dataURLtoFile(imgData, filename);
      formData.append("carousel", file);
    });
  });

  // Post the FormData to the backend route
  try {
    const response = await fetch(`${API_URL}/event/addEvent`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: JSON.parse(localStorage.getItem("jwt")).token,
      },
      // Note: Do not set Content-Type; the browser will add the correct multipart boundary.
      signal: signal,
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Something went wrong");
    }
    return result;
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
}
export async function updateEvent(eventData, signal) {
  // Convert the date to a string the backend can parse:
  const dateValue =
    eventData.date instanceof Date
      ? eventData.date.toISOString()
      : eventData.date; // if it's already a string
  console.log(eventData.type);
  const formData = new FormData();
  formData.append("id", eventData.id);
  formData.append("title", eventData.title);
  formData.append("description", eventData.description);
  formData.append("date", dateValue);
  formData.append("endroit", eventData.location);
  formData.append("type", eventData.type);
  // If we have a NEW base64 image to upload, convert it to a Blob and attach as 'file'
  if (
    eventData.coverImage &&
    typeof eventData.coverImage === "string" &&
    eventData.coverImage.startsWith("data:image")
  ) {
    const blob = base64ToBlob(eventData.coverImage);
    formData.append("file", blob, "cover.png");
  }

  try {
    // const json = JSON.stringify(Object.fromEntries(formData.entries()));
    // console.log(json);
    const response = await fetch(`${API_URL}/event/updateEvent`, {
      method: "PATCH",
      headers: {
        // If your auth middleware requires a token:
        Authorization: JSON.parse(localStorage.getItem("jwt")).token,
        // Do NOT set Content-Type to multipart/form-data; fetch sets it automatically
      },
      body: formData,
      signal: signal,
    });
    if (!response.ok) {
      const result = await response.json();
      console.log(response);
      console.log(result);
      console.log(eventData);
      throw new Error(`Server error: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.log("Error updating event:", error);
    throw error;
  }
}

// Helper function to convert base64 to a Blob
function base64ToBlob(base64) {
  const [header, data] = base64.split(",");
  const mimeMatch = header.match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : "image/png";
  const byteChars = atob(data);
  const byteNumbers = new Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) {
    byteNumbers[i] = byteChars.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mime });
}
export async function updateSectionAPI(data, type = "event", signal) {
  try {
    // console.log(type, {
    //   serviceId: data.serviceId,
    //   sectionId: data.id, // Adjusting to match API's expected field name
    //   title: data.title,
    //   paragraph: data.paragraph,
    // });
    const response = await fetch(`${API_URL}/${type}/updateSection`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: JSON.parse(localStorage.getItem("jwt")).token,
      },
      body:
        type === "service"
          ? JSON.stringify({
              serviceId: data.serviceId,
              sectionId: data.id, // Adjusting to match API's expected field name
              title: data.title,
              paragraph: data.paragraph,
            })
          : JSON.stringify({
              eventId: data.eventId,
              sectionId: data.id, // Adjusting to match API's expected field name
              title: data.title,
              paragraph: data.paragraph,
            }),
      signal: signal,
    });

    if (!response.ok) {
      try {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update section");
      } catch {
        throw new Error(`Failed to update section: ${response.statusText}`);
      }
    }

    const dataReceived = await response.json(); // { message: "Section updated" }
    console.log("updated the section", data);
    return dataReceived;
  } catch (error) {
    console.error("Error updating section:", error);
    throw error;
  }
}

export async function deleteSectionAPI(data) {
  try {
    console.log(data);
    const response = await fetch(`${API_URL}/event/deleteSection`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${JSON.parse(localStorage.getItem("jwt")).token}`, // Adjust if needed
      },
      body: JSON.stringify({
        eventId: data.eventId,
        sectionId: data.id, // Adjusting to match API's expected field name
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete section");
    }

    return await response.json(); // { message: "Section deleted successfully" }
  } catch (error) {
    console.error("Error deleting section:", error);
    throw error;
  }
}
export async function deleteSectionServiceAPI(data) {
  try {
    const response = await fetch(`${API_URL}/service/deleteSection`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${JSON.parse(localStorage.getItem("jwt")).token}`, // Adjust if needed
      },
      body: JSON.stringify({
        serviceId: data.service,
        sectionId: data.id, // Adjusting to match API's expected field name
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete section");
    }

    return await response.json(); // { message: "Section deleted successfully" }
  } catch (error) {
    console.error("Error deleting section:", error);
    throw error;
  }
}
export async function updateSectionImagesAPI(data) {
  console.log(data);
}

function base64ToFile(base64, filename = "image.png") {
  const blob = base64ToBlob(base64);
  return new File([blob], filename, { type: blob.type });
}

export async function addSectionAPI(data, signal, type = "event") {
  console.log(JSON.parse(localStorage.getItem("jwt")).token, data);
  // Expected data shape:
  // {
  //   eventId: 2,
  //   title: "Impact des pandémies",
  //   paragraph: "Impact des pandémies ...",
  //   images: [{ imgUrl: 'data:image/png;base64,...' }, ...]
  // }

  // Create a new FormData instance.
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("paragraph", data.paragraph);
  if (type === "event") {
    formData.append("eventId", data.eventId);
  } else {
    formData.append("serviceId", data.serviceId);
  }

  // Process each image in the data.images array.
  if (data.images && Array.isArray(data.images)) {
    data.images.forEach((imgObj, index) => {
      if (imgObj.imgUrl && imgObj.imgUrl.startsWith("data:image/")) {
        // Convert the base64 string to a File object.
        const file = base64ToFile(imgObj.imgUrl, `image_${index}.png`);
        // Append the file to the FormData under the key "files".
        formData.append("files", file);
      }
    });
  }

  try {
    const response = await fetch(`${API_URL}/${type}/addSection`, {
      method: "POST",
      // Do not set the Content-Type header manually when using FormData.
      headers: {
        Authorization: `${JSON.parse(localStorage.getItem("jwt")).token}`, // Adjust token retrieval if needed.
        // "Content-Type": "multipart/form-data",
      },
      body: formData,
      signal: signal,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to add section");
    }

    return await response.json(); // Expected to return an object like: { section: { ... } }
  } catch (error) {
    console.error("Error adding section:", error);
    throw error;
  }
}

const addSectionImages = async (sectionId, eventId, files) => {
  const formData = new FormData();
  formData.append("eventId", eventId);
  formData.append("sectionId", sectionId);

  files.forEach((image, index) => {
    const file = base64ToFile(image, `image_${index}.png`);
    formData.append("files", file);
  });
  console.log(formData, sectionId, eventId, files);
  const response = await fetch(`${API_URL}/event/addImg`, {
    method: "POST",
    headers: {
      Authorization: JSON.parse(localStorage.getItem("jwt")).token,
    },
    body: formData,
  });

  if (!response.ok) {
    toast.error("Échec de l'ajout des images de la section", {
      description: response.statusText,
    });
    const data = response.json();
    console.log(data, response);
    throw new Error("Failed to add section images");
  }
  const data = response.json();
  console.log(data, response);
  return data;
};

// Helper function to delete images from a section
const deleteSectionImages = async (sectionId, eventId, imgUrls) => {
  const response = await fetch(`${API_URL}/event/deleteImg`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: JSON.parse(localStorage.getItem("jwt")).token,
    },
    body: JSON.stringify({
      imgUrls,
      eventId,
      sectionId,
    }),
  });

  if (!response.ok) {
    toast.error("Échec de la suppression des images de la section", {
      description: response.statusText,
    });
    const data = response.json();
    console.log(data, response);
    throw new Error("Failed to delete section images");
  }
};

const addSectionImagesService = async (sectionId, serviceId, files) => {
  const formData = new FormData();
  formData.append("serviceId", serviceId);
  formData.append("sectionId", sectionId);

  // files.forEach((image, index) => {
  //   const file = base64ToFile(image, `image_${index}.png`);
  //   formData.append("files", file);
  // });
  files.forEach((media, index) => {
    console.log(media);
    formData.append("files", media.url);
  });
  const response = await fetch(`${API_URL}/service/addImg`, {
    method: "POST",
    headers: {
      Authorization: JSON.parse(localStorage.getItem("jwt")).token,
    },
    body: formData,
  });
  if (!response.ok) {
    toast.error("Échec de l'ajout des images de la section", {
      description: response.statusText,
    });
    const data = await response.json();
    console.log(data, response);
    throw new Error("Failed to add section images");
  }
  const data = response.json();
  return data;
};

// Helper function to delete images from a section
const deleteSectionImagesService = async (sectionId, serviceId, imgUrls) => {
  const response = await fetch(`${API_URL}/service/deleteImg`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: JSON.parse(localStorage.getItem("jwt")).token,
    },
    body: JSON.stringify({
      imgUrls,
      serviceId,
      sectionId,
    }),
  });

  if (!response.ok) {
    toast.error("Échec de la suppression des images de la section", {
      description: response.statusText,
    });
    const data = await response.json();
    console.log(data, {
      imgUrls,
    });
    throw new Error("Failed to delete section images");
  }
};

// Main update function that orchestrates the entire update process
export const updateSection = async (
  originalSection,
  updatedSection,
  newMediaFiles = [],
  type = "event",
  signal,
) => {
  // Update section text if it has changed
  if (
    originalSection.title !== updatedSection.title ||
    originalSection.paragraph !== updatedSection.paragraph
  ) {
    type === "event"
      ? await updateSectionAPI(
          {
            id: updatedSection.id,
            eventId: updatedSection.eventId,
            title: updatedSection.title,
            paragraph: updatedSection.paragraph,
          },
          type,
          signal,
        )
      : await updateSectionAPI(
          {
            id: updatedSection.id,
            serviceId: updatedSection.serviceId,
            title: updatedSection.title,
            paragraph: updatedSection.paragraph,
          },
          type,
          signal,
        );
  }

  // Find images to delete (present in original but not in updated)
  const imagesToDelete = originalSection.images
    .filter(
      (originalImg) =>
        !updatedSection.images.some(
          (updatedImg) => updatedImg.imgUrl === originalImg.imgUrl,
        ),
    )
    .map((img) => img.imgUrl);
  if (type == "event") {
    // Delete removed images if any
    if (imagesToDelete.length > 0) {
      await deleteSectionImages(
        updatedSection.id,
        updatedSection.eventId,
        imagesToDelete,
      );
    }

    // Add new images if any
    if (newMediaFiles.length > 0) {
      await addSectionImages(
        updatedSection.id,
        updatedSection.eventId,
        newMediaFiles,
      );
    }
  } else if (type == "service") {
    if (imagesToDelete.length > 0) {
      await deleteSectionImagesService(
        updatedSection.id,
        updatedSection.serviceId,
        imagesToDelete,
      );
    }

    // Add new images if any
    if (newMediaFiles.length > 0) {
      await addSectionImagesService(
        updatedSection.id,
        updatedSection.serviceId,
        newMediaFiles,
      );
    }
  }

  // Return the updated section
  return updatedSection;
};

export async function getServices(page) {
  const res = await fetch(`${API_URL}/service/getServices?page=${page}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // Authorization: JSON.parse(localStorage.getItem("jwt")).token,
    },
  });
  if (!res.ok) {
    await res.json();
    throw new Error("Failed getting services");
  }
  const data = await res.json();
  const { services, total } = data;
  return { services, total };
}

// export async function addService(serviceData, abortControllerRef) {
export async function addService(serviceData, signal) {
  // Create a new FormData instance
  const formData = new FormData();
  // Append the cover image file (field name "cover")
  const coverFile = dataURLtoFile(serviceData.coverImage, "cover.png");
  formData.append("cover", coverFile);
  // Append basic service details
  formData.append("nom", serviceData.nom);
  formData.append("description", serviceData.description);

  // Ensure each section has an "imageCount" property (derived from the number of images)
  const sectionsWithCount = serviceData.sections.map((section) => {
    return {
      title: section.title,
      paragraph: section.paragraph,
      imageCount: section.images.length,
    };
  });
  // Append sections as a JSON string
  formData.append("sections", JSON.stringify(sectionsWithCount));

  // Append all section images in order as "carousel"
  // The backend expects these files in the order defined by imageCount in sections.
  serviceData.sections.forEach((section, sectionIndex) => {
    section.images.forEach((imgData, imageIndex) => {
      // Convert each base64 image to a File
      const filename = `section-${sectionIndex}-img-${imageIndex}.png`;
      const file = dataURLtoFile(imgData, filename);
      formData.append("carousel", file);
    });
  });

  // abortControllerRef.current = new AbortController();
  // const signal = abortControllerRef.current.signal;

  // Post the FormData to the backend route
  try {
    const response = await fetch(`${API_URL}/service/addService`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: JSON.parse(localStorage.getItem("jwt")).token,
      },
      signal: signal,
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Something went wrong");
    }
    return result;
  } catch (error) {
    console.error("Error creating service:", error);
    throw error;
  }
}
export async function deleteService(serviceID) {
  console.log(serviceID);
  const res = await fetch(`${API_URL}/service/deleteService`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: JSON.parse(localStorage.getItem("jwt")).token,
    },
    body: JSON.stringify({ id: serviceID }),
  });
  if (!res.ok) {
    const data = await res.json();
    console.log(data);
    throw new Error("Failed deleting service " + serviceID);
  }
  const data = await res.json();
  return data;
}
export async function getService(id) {
  const res = await fetch(`${API_URL}/service/getServiceDetails?id=${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(
      "Failed getting service" + data?.message && ` ${data?.message}`,
    );
  }

  const data = await res.json();
  // console.log(
  //   data.service.sections.map((section) => {
  //     return {
  //       ...section,
  //       images: section.images.map((img) => {
  //         return { data: img.imgUrl };
  //       }),
  //     };
  //   }),
  // );
  console.log(data);
  console.log({
    ...data,
    service: {
      ...data.service,
      coverUrl: data.service.coverUrl.startsWith("/")
        ? API_URL + data.service.coverUrl
        : data.service.coverUrl,
      sections: data.service.sections.map((section) => {
        return {
          ...section,
          images: section.images.map((image) => {
            const { imgUrl, ...rest } = image;
            return {
              data: imgUrl,
              ...rest,
            };
          }),
        };
      }),
    },
  });
  return {
    ...data,
    service: {
      ...data.service,
      coverUrl: data.service.coverUrl.startsWith("/")
        ? API_URL + data.service.coverUrl
        : data.service.coverUrl,
      sections: data.service.sections.map((section) => {
        return {
          ...section,
          images: section.images.map((image) => {
            const { imgUrl, ...rest } = image;
            return {
              data: imgUrl,
              ...rest,
            };
          }),
        };
      }),
    },
  };
}

export async function updateService(serviceData, signal) {
  console.log(serviceData);
  const formData = new FormData();
  formData.append("id", serviceData.id);
  formData.append("nom", serviceData.nom);
  formData.append("description", serviceData.description);
  // If we have a NEW base64 image to upload, convert it to a Blob and attach as 'file'
  if (
    serviceData.coverImage &&
    typeof serviceData.coverImage === "string" &&
    serviceData.coverImage.startsWith("data:image")
  ) {
    const blob = base64ToBlob(serviceData.coverImage);
    formData.append("file", blob, "cover.png");
  }

  try {
    const json = JSON.stringify(Object.fromEntries(formData.entries()));
    console.log(json);
    const response = await fetch(`${API_URL}/service/updateService`, {
      method: "PATCH",
      headers: {
        // If your auth middleware requires a token:
        Authorization: JSON.parse(localStorage.getItem("jwt")).token,
        // Do NOT set Content-Type to multipart/form-data; fetch sets it automatically
      },
      body: formData,
      signal: signal,
    });
    if (!response.ok) {
      const result = await response.json();
      console.log(response);
      console.log(result);
      console.log(serviceData);
      throw new Error(`Server error: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error updating service:", error);
    throw error;
  }
}
