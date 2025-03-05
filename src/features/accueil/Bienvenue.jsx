import bienvenue from "@/images/bienvenue.png";
import calendar from "@/images/Calendar.svg";
import message from "@/images/Message.svg";
import user from "@/images/User.svg";
const content = [
  {
    id: 1,
    title: "Horaires de travail",
    content:
      "Parce que votre santé n'attend pas, notre service est ouvert 24h/24 et 7j/7.",
    icon: calendar,
  },
  {
    id: 2,
    title: "Les meilleurs médecins",
    content:
      "Nous avons une équipe de médecins professionnels qui peuvent vous aider à tout moment",
    icon: user,
  },
  {
    id: 3,
    title: "Poser des questions",
    content: "Besoin d’informations ? Nous répondons à toutes vos questions",
    icon: message,
  },
];
function Bienvenue() {
  return (
    <div className="bg-lgt-1 py-14 pt-32">
      <div className="mx-auto flex w-[1000px] gap-10">
        <div>
          <div className="space-y-6">
            <h1 className="text-[2.5rem] font-bold leading-[1.2] text-blk">
              Bienvenue au Service d&apos;Hématologie du <br /> Centre
              Anti-Cancer de Batna
            </h1>
            <p className="text-[1.55rem] text-base text-blk-70">
              Le Service d&apos;Hématologie du Centre Anti-Cancer de Batna est
              dédié à offrir des soins spécialisés aux patients atteints de
              maladies du sang. Notre équipe d&apos;experts s&apos;engage à
              fournir des traitements innovants et un soutien complet pour les
              patients et leurs familles. En tant que service de référence dans
              la région, notre mission est d&apos;améliorer la qualité de vie
              grâce à des soins personnalisés, des traitements avancés, et une
              attention bienveillante à chaque étape du parcours de guérison.
            </p>
            <div className="grid grid-cols-3 gap-3">
              {content.map((i) => {
                return (
                  <div
                    key={i.id}
                    className="aspect-[306/250] space-y-4 rounded-3xl bg-white p-4 shadow-haze"
                  >
                    <div className="flex gap-2">
                      <div className="flex aspect-square h-10 w-auto items-center justify-center rounded-full bg-main-10">
                        <img
                          src={i.icon}
                          className="aspect-square max-h-4"
                          alt="Icon"
                        />
                      </div>
                      <h3 className="flex items-center text-sm font-semibold leading-[1.2] text-blk-80">
                        {i.title}
                      </h3>
                    </div>
                    <p className="text-[0.82rem] font-medium leading-[1.15] text-blk-70">
                      {i.content}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <img
          src={bienvenue}
          className="w-[clamp(80px,25dvw,320px)] rounded-3xl object-cover"
        />
      </div>
    </div>
  );
}

export default Bienvenue;
