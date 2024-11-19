import bienvenue from "@/images/bienvenue.png";
import calendar from "@/images/Calendar.svg";
import message from "@/images/message.svg";
import user from "@/images/user.svg";

function Bienvenue() {
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
  return (
    <div className="bg-lgt-1 xl:py-14 4xl:py-24">
      <div className="mx-auto flex w-[78%] xl:gap-10 2xl:gap-20">
        <div>
          <div className="xl:space-y-6 2xl:space-y-8">
            <h1 className="font-bold text-blk xl:text-[2.5rem] xl:leading-[1.2] 2xl:text-[3.5rem] 2xl:leading-[1.2] 4xl:text-[3.925rem]">
              Bienvenue au Service d&apos;Hématologie du <br /> Centre
              Anti-Cancer de Batna
            </h1>
            <p className="text-blk-70 xl:text-base 2xl:text-[20.5px] 4xl:text-[1.55rem]">
              Le Service d&apos;Hématologie du Centre Anti-Cancer de Batna est
              dédié à offrir des soins spécialisés aux patients atteints de
              maladies du sang. Notre équipe d&apos;experts s&apos;engage à
              fournir des traitements innovants et un soutien complet pour les
              patients et leurs familles. En tant que service de référence dans
              la région, notre mission est d&apos;améliorer la qualité de vie
              grâce à des soins personnalisés, des traitements avancés, et une
              attention bienveillante à chaque étape du parcours de guérison.
            </p>
            <div className="grid grid-cols-3 gap-3 2xl:gap-4">
              {content.map((i) => {
                return (
                  <div
                    key={i.id}
                    className="aspect-[306/250] space-y-4 rounded-3xl bg-white shadow-haze xl:p-4 2xl:p-5 4xl:space-y-6"
                  >
                    <div className="flex xl:gap-2 2xl:gap-2">
                      {/* <img
                        src={i.icon}
                        className="bg-main-10 4xl:h-16 4xl:p-[1.25rem] aspect-square h-14 p-[1.1rem]"
                      /> */}
                      <div className="flex aspect-square items-center justify-center rounded-full bg-main-10 xl:h-10 xl:w-10 2xl:h-14 2xl:w-14 4xl:h-16 4xl:w-16">
                        <img
                          src={i.icon}
                          className="aspect-square xl:max-h-4 2xl:max-h-3 4xl:max-h-6"
                          alt="Icon"
                        />
                      </div>
                      <h3 className="flex items-center text-sm font-semibold leading-[1.2] text-blk-80 4xl:text-xl 4xl:leading-[1.2]">
                        {i.title}
                      </h3>
                    </div>
                    <p className="text-[0.85rem] font-medium leading-[1.15] text-blk-70 2xl:text-lg 4xl:text-xl 4xl:leading-[1.2]">
                      {i.content}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <img src={bienvenue} className="w-[25dvw] rounded-3xl object-cover" />
      </div>
    </div>
  );
}

export default Bienvenue;
