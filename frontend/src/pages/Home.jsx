import Bienvenue from "@/sections/accueil/Bienvenue";
import Confiance from "@/sections/accueil/Confiance";
import Stats from "@/sections/accueil/Stats";
import Trouver from "@/sections/accueil/Trouver";
import { ScrollRestoration } from "react-router-dom";

function Home() {
  return (
    <div className="">
      <ScrollRestoration />
      <Bienvenue />
      <Trouver />
      <Stats />
      <Confiance />
    </div>
  );
}

export default Home;
