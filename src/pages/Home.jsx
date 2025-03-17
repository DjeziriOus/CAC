import Bienvenue from "@/features/accueil/Bienvenue";
import Confiance from "@/features/accueil/Confiance";
import Stats from "@/features/accueil/Stats";
import Trouver from "@/features/accueil/Trouver";
import { ScrollRestoration } from "react-router-dom";

function Home() {
  return (
    <div className="bg-lgt-1">
      {/* <ScrollRestoration /> */}
      <Bienvenue />
      <Trouver />
      <Stats />
      <Confiance />
    </div>
  );
}

export default Home;
