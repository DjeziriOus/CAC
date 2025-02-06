const API_URL = "http://localhost:3000";

export async function getMyQuestions() {
  // const res = await fetch(`${API_URL}/questions/my`);

  // // fetch won't throw error on 400 errors (e.g. when URL is wrong), so we need to do it manually. This will then go into the catch block, where the message is set
  // if (!res.ok) throw Error("Failed getting my questions");

  // const data = await res.json();

  //   const data = [
  //     {
  //       id: 1,
  //       user: {
  //         nom: "Ourred",
  //         prenom: "Islem Charaf Eddine",
  //         profile_picture: "/images/pfp/img-1.png",
  //       },
  //       question_text:
  //         "Est-il sécuritaire de pratiquer une activité sportive après une opération ?",
  //       time: "2024-11-22T15:53:07",
  //       answer: {
  //         user: {
  //           nom: "Allag",
  //           prenom: "Aymen",
  //           profile_picture: "/images/pfp/img-1.png",
  //         },
  //         answer_text:
  //           "Oui, les maux de tête légers sont un effet secondaire courant après certains vaccins. Ils sont généralement temporaires et disparaissent en un ou deux jours. Cependant, si le mal de tête persiste ou s’accompagne d’autres symptômes graves comme une forte fièvre, consultez un médecin immédiatement.",
  //         time: "2024-11-22T15:53:07",
  //       },
  //     },
  //     {
  //       id: 2,
  //       user: {
  //         nom: "Bouchareb",
  //         prenom: "Sofiane",
  //         profile_picture: "/images/pfp/img-1.png",
  //       },
  //       question_text:
  //         "Quels sont les risques associés à l'utilisation excessive des écrans chez les enfants ?",
  //       time: "2024-11-22T16:15:00",
  //       answer: {},
  //     },
  //     {
  //       id: 3,
  //       user: {
  //         nom: "Lemrani",
  //         prenom: "Meriem",
  //         profile_picture: "/images/pfp/img-1.png",
  //       },
  //       question_text:
  //         "Peut-on utiliser un téléphone portable pendant le vol si le mode avion est activé ?",
  //       time: "2024-11-22T16:20:45",
  //       answer: {
  //         user: {
  //           nom: "Belkacem",
  //           prenom: "Nabil",
  //           profile_picture: "/images/pfp/img-1.png",
  //         },
  //         answer_text:
  //           "Oui, l'utilisation d'un téléphone portable en mode avion est généralement autorisée pendant un vol, car ce mode désactive les signaux qui pourraient interférer avec les instruments de l'avion.",
  //         time: "2024-11-22T16:25:00",
  //       },
  //     },
  //     {
  //       id: 4,
  //       user: {
  //         nom: "Khelil",
  //         prenom: "Yasmine",
  //         profile_picture: "/images/pfp/img-1.png",
  //       },
  //       question_text:
  //         "Quelle est la meilleure façon d'améliorer ses compétences en programmation en autodidacte ?",
  //       time: "2024-11-22T16:30:00",
  //       answer: {},
  //     },
  //     {
  //       id: 5,
  //       user: {
  //         nom: "Saadi",
  //         prenom: "Amine",
  //         profile_picture: "/images/pfp/img-1.png",
  //       },
  //       question_text:
  //         "Les aliments biologiques sont-ils vraiment meilleurs pour la santé que les aliments conventionnels ?",
  //       time: "2024-11-22T16:45:15",
  //       answer: {
  //         user: {
  //           nom: "Bouaicha",
  //           prenom: "Lina",
  //           profile_picture: "/images/pfp/img-1.png",
  //         },
  //         answer_text:
  //           "Les aliments biologiques contiennent généralement moins de pesticides et d'additifs chimiques. Cependant, leurs bienfaits nutritionnels comparés aux aliments conventionnels varient selon les études. L'idéal est de privilégier une alimentation équilibrée.",
  //         time: "2024-11-22T16:50:00",
  //       },
  //     },
  //     {
  //       id: 6,
  //       user: {
  //         nom: "Meziane",
  //         prenom: "Rachid",
  //         profile_picture: "/images/pfp/img-1.png",
  //       },
  //       question_text: "Comment expliquer les aurores boréales à un enfant ?",
  //       time: "2024-11-22T17:00:00",
  //       answer: {},
  //     },
  //   ];
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  //   return data;
  console.log("getMyQuestions");
  const res = await fetch(`${API_URL}/FAQ/getMyQuestions`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
  });
  if (res.status === 400) {
    return [];
  }
  const data = await res.json();
  console.log(data);
  return data.questions;
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
export async function getRecentQuestions() {
  const res = await fetch(`${API_URL}/FAQ/getQuestions`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
  });

  // fetch won't throw error on 400 errors (e.g. when URL is wrong), so we need to do it manually. This will then go into the catch block, where the message is set
  if (!res.ok) throw Error("Failed getting recent questions");
  const data = await res.json();
  console.log(data);
  // const data = [
  //   {
  //     id: 1,
  //     user: {
  //       nom: "Ourred",
  //       prenom: "Islem Charaf Eddine",
  //       profile_picture: "/images/pfp/img-1.png",
  //     },
  //     question_text:
  //       "Est-il sécuritaire de pratiquer une activité sportive après une opération ?",
  //     time: "2024-11-22T15:53:07",
  //     answer: {
  //       user: {
  //         nom: "Allag",
  //         prenom: "Aymen",
  //         profile_picture: "/images/pfp/img-1.png",
  //       },
  //       answer_text:
  //         "Oui, les maux de tête légers sont un effet secondaire courant après certains vaccins. Ils sont généralement temporaires et disparaissent en un ou deux jours. Cependant, si le mal de tête persiste ou s’accompagne d’autres symptômes graves comme une forte fièvre, consultez un médecin immédiatement.",
  //       time: "2024-11-22T15:53:07",
  //     },
  //   },
  //   {
  //     id: 2,
  //     user: {
  //       nom: "Bouchareb",
  //       prenom: "Sofiane",
  //       profile_picture: "/images/pfp/img-1.png",
  //     },
  //     question_text:
  //       "Quels sont les risques associés à l'utilisation excessive des écrans chez les enfants ?",
  //     time: "2024-11-22T16:15:00",
  //     answer: {},
  //   },
  //   {
  //     id: 3,
  //     user: {
  //       nom: "Lemrani",
  //       prenom: "Meriem",
  //       profile_picture: "/images/pfp/img-1.png",
  //     },
  //     question_text:
  //       "Peut-on utiliser un téléphone portable pendant le vol si le mode avion est activé ?",
  //     time: "2024-11-22T16:20:45",
  //     answer: {
  //       user: {
  //         nom: "Belkacem",
  //         prenom: "Nabil",
  //         profile_picture: "/images/pfp/img-1.png",
  //       },
  //       answer_text:
  //         "Oui, l'utilisation d'un téléphone portable en mode avion est généralement autorisée pendant un vol, car ce mode désactive les signaux qui pourraient interférer avec les instruments de l'avion.",
  //       time: "2024-11-22T16:25:00",
  //     },
  //   },
  //   {
  //     id: 4,
  //     user: {
  //       nom: "Khelil",
  //       prenom: "Yasmine",
  //       profile_picture: "/images/pfp/img-1.png",
  //     },
  //     question_text:
  //       "Quelle est la meilleure façon d'améliorer ses compétences en programmation en autodidacte ?",
  //     time: "2024-11-22T16:30:00",
  //     answer: {},
  //   },
  //   {
  //     id: 5,
  //     user: {
  //       nom: "Saadi",
  //       prenom: "Amine",
  //       profile_picture: "/images/pfp/img-1.png",
  //     },
  //     question_text:
  //       "Les aliments biologiques sont-ils vraiment meilleurs pour la santé que les aliments conventionnels ?",
  //     time: "2024-11-22T16:45:15",
  //     answer: {
  //       user: {
  //         nom: "Bouaicha",
  //         prenom: "Lina",
  //         profile_picture: "/images/pfp/img-1.png",
  //       },
  //       answer_text:
  //         "Les aliments biologiques contiennent généralement moins de pesticides et d'additifs chimiques. Cependant, leurs bienfaits nutritionnels comparés aux aliments conventionnels varient selon les études. L'idéal est de privilégier une alimentation équilibrée.",
  //       time: "2024-11-22T16:50:00",
  //     },
  //   },
  //   {
  //     id: 6,
  //     user: {
  //       nom: "Meziane",
  //       prenom: "Rachid",
  //       profile_picture: "/images/pfp/img-1.png",
  //     },
  //     question_text: "Comment expliquer les aurores boréales à un enfant ?",
  //     time: "2024-11-22T17:00:00",
  //     answer: {},
  //   },
  // ];
  // await new Promise((resolve) => setTimeout(resolve, 1000));

  return data.questions;
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
