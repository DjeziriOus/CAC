import Bienvenue from "@/sections/accueil/Bienvenue";
import Confiance from "@/sections/accueil/Confiance";
import Stats from "@/sections/accueil/Stats";
import Trouver from "@/sections/accueil/Trouver";

function Home() {
  return (
    <div className="">
      <Bienvenue />
      <Trouver />
      <Stats />
      <Confiance />
    </div>
  );
}

export default Home;
