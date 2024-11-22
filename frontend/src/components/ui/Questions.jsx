import Question from "./Question";
const questions = [
  {
    id: 1,
    user: {
      nom: "Ourred",
      prenom: "Islem Charaf Eddine",
      profile_picture: "/images/pfp/img-1.png",
    },
    question_text:
      "Est-il sécuritaire de pratiquer une activité sportive après une opération ?",
    time: "2024-11-22T15:53:07",
    answer: {
      user: {
        nom: "Allag",
        prenom: "Aymen",
        profile_picture: "/images/pfp/img-2.png",
      },
      answer_text:
        "Oui, les maux de tête légers sont un effet secondaire courant après certains vaccins. Ils sont généralement temporaires et disparaissent en un ou deux jours. Cependant, si le mal de tête persiste ou s’accompagne d’autres symptômes graves comme une forte fièvre, consultez un médecin immédiatement.",
      time: "2024-11-22T15:53:07",
    },
  },
  {
    id: 2,
    user: {
      nom: "Bouchareb",
      prenom: "Sofiane",
      profile_picture: "/images/pfp/img-1.png",
    },
    question_text:
      "Quels sont les risques associés à l'utilisation excessive des écrans chez les enfants ?",
    time: "2024-11-22T16:15:00",
    answer: {},
  },
  {
    id: 3,
    user: {
      nom: "Lemrani",
      prenom: "Meriem",
      profile_picture: "/images/pfp/img-1.png",
    },
    question_text:
      "Peut-on utiliser un téléphone portable pendant le vol si le mode avion est activé ?",
    time: "2024-11-22T16:20:45",
    answer: {
      user: {
        nom: "Belkacem",
        prenom: "Nabil",
        profile_picture: "/images/pfp/img-2.png",
      },
      answer_text:
        "Oui, l'utilisation d'un téléphone portable en mode avion est généralement autorisée pendant un vol, car ce mode désactive les signaux qui pourraient interférer avec les instruments de l'avion.",
      time: "2024-11-22T16:25:00",
    },
  },
  {
    id: 4,
    user: {
      nom: "Khelil",
      prenom: "Yasmine",
      profile_picture: "/images/pfp/img-1.png",
    },
    question_text:
      "Quelle est la meilleure façon d'améliorer ses compétences en programmation en autodidacte ?",
    time: "2024-11-22T16:30:00",
    answer: {},
  },
  {
    id: 5,
    user: {
      nom: "Saadi",
      prenom: "Amine",
      profile_picture: "/images/pfp/img-1.png",
    },
    question_text:
      "Les aliments biologiques sont-ils vraiment meilleurs pour la santé que les aliments conventionnels ?",
    time: "2024-11-22T16:45:15",
    answer: {
      user: {
        nom: "Bouaicha",
        prenom: "Lina",
        profile_picture: "/images/pfp/img-2.png",
      },
      answer_text:
        "Les aliments biologiques contiennent généralement moins de pesticides et d'additifs chimiques. Cependant, leurs bienfaits nutritionnels comparés aux aliments conventionnels varient selon les études. L'idéal est de privilégier une alimentation équilibrée.",
      time: "2024-11-22T16:50:00",
    },
  },
  {
    id: 6,
    user: {
      nom: "Meziane",
      prenom: "Rachid",
      profile_picture: "/images/pfp/img-1.png",
    },
    question_text: "Comment expliquer les aurores boréales à un enfant ?",
    time: "2024-11-22T17:00:00",
    answer: {},
  },
];

function Questions() {
  return (
    <div className="my-10 flex h-[25rem] w-full flex-col gap-8 overflow-y-scroll p-3">
      {questions.map((q) => (
        <Question question={q} key={q.id} />
      ))}
    </div>
  );
}

export default Questions;
