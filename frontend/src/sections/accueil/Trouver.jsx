import Map from "@/components/ui/Map";

function Trouver() {
  const content = [
    {
      id: 0,
      title: "Notre emplacement",
      text: `Le Centre Anti-Cancer (CAC) de Batna est situé sur la Route de
          Tazoult, dans un quartier accessible à quelques minutes du
          centre-ville de Batna. Avec des installations modernes et un accès
          pratique aux transports en commun, le centre est facilement accessible
          pour les patients et les visiteurs. Un parking est également
          disponible sur place pour plus de commodité.`,
    },
    { id: 1, title: "Accès", text: "À 10 minutes du centre-ville de Batna" },
    { id: 2, title: "Parking", text: "Gratuit pour les visiteurs" },
    {
      id: 3,
      title: "Transports en commun",
      text: `Ligne de bus 21, arrêt "CAC Batna"`,
    },
  ];
  return (
    <div className="flex bg-lgt-1 xl:py-14 4xl:py-24">
      <div className="mx-auto w-[78%] xl:gap-6 2xl:gap-20">
        <div className="grid grid-cols-[5fr,2fr,5fr] xl:gap-6">
          <div className="aspect-square w-full bg-slate-400">
            <Map />
          </div>
          <div className="bg-lgt-2 flex items-center justify-center text-center xl:rounded-2xl xl:px-8">
            <span className="text-blue-2 text-xl leading-[1.7]">
              Ouvert <b>24h/24</b> <br />
              et <br />
              <b>7j/7</b> <br />
              pour vous accueillir à tout moment
            </span>
          </div>
          <div className="space-y-2">
            <div className="space-y-2">
              <h1 className="text-[2.8rem] font-semibold leading-10">
                Où nous trouver
              </h1>
              <div className="xl:space-y-2">
                <div className="text-[1.09rem] font-medium text-acc">
                  {content[0].title}
                </div>
                <div className="text-[1.05rem] text-blk-70">
                  {content[0].text}
                </div>
              </div>
            </div>
            <div>
              {content.slice(1).map((i) => (
                <div key={i.id}>
                  <span className="font-medium text-acc">{i.title} : </span>
                  <span className="text-blk-70">{i.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Trouver;
