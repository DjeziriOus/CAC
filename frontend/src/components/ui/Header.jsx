// import { useState } from "react";
// import { useLocation } from "react-router-dom";
import LinkButton from "./LinkButton";
import styles from "./Header.module.css";
import logo from "../../images/CAClogo.svg";

function Header() {
  const navItems = [
    { name: "Accueil", href: "/", secondaryName: "Page d'Accueil" },
    {
      name: "Activités hospitalière",
      href: "/hospitaliere",
      secondaryName: "Activités hospitalière",
    },
    {
      name: "Activité universitaire",
      href: "/universitaire",
      secondaryName: "Activité universitaire",
    },
    { name: "Evénements", href: "/evenements", secondaryName: "Evénements" },
    { name: "Q&A", href: "/questions", secondaryName: "Q&A" },
    {
      name: "Contactez-nous",
      href: "/contact",
      secondaryName: "Contactez-nous",
    },
  ];

  return (
    <div className="flex justify-between bg-lgt-1 p-4 xl:p-3 4xl:p-6">
      <div className="flex grow items-center justify-center">
        <img src={logo} className="h-6 4xl:h-10" />
      </div>
      <div className={styles.nav}>
        <div className="mr-28 flex gap-5 xl:gap-5 4xl:mr-52 4xl:gap-12">
          {navItems.map((item) => (
            <LinkButton to={item.href} key={item.name}>
              {item.name}
            </LinkButton>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Header;
