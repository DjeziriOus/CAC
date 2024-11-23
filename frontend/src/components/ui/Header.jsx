import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import LinkButton from "./LinkButton";
import styles from "./Header.module.css";
import logo from "../../images/CAClogo.svg";
import { ChevronDown } from "lucide-react";

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
    {
      name: "Q&A",
      href: "/questions",
      secondaryName: "Q&A",
      components: [
        { name: "Espace des patients", href: "/questions/patients" },
        { name: "Espace des étudiants", href: "/questions/etudiants" },
        { name: "Espace Intenational", href: "/questions/international" },
      ],
    },
    {
      name: "Contactez-nous",
      href: "/contact",
      secondaryName: "Contactez-nous",
    },
  ];
  // let location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 z-[999] flex w-full bg-[#F7FCFD80] p-4 drop-shadow-[0px_0px_10px_#ffffff] backdrop-blur-md xl:p-3 4xl:p-4">
      <div className="flex w-full items-center justify-center gap-32 4xl:gap-56">
        <img src={logo} className="h-6 4xl:h-8" />
        <div className={styles.nav}>
          <div className="flex w-full justify-center gap-5 4xl:gap-4">
            {navItems.map((item) =>
              item.components ? (
                <div
                  key={item.name}
                  onMouseEnter={() => setOpen(true)}
                  onMouseLeave={() => setOpen(false)}
                >
                  <LinkButton
                    to={item.href}
                    className={`text-sm text-blk-60 xl:text-xs 2xl:text-lg 4xl:text-base`}
                    isDisabled={true}
                    isSublink={true}
                  >
                    {item.name}
                    <ChevronDown className="p-0" />
                  </LinkButton>
                  {open ? (
                    <div
                      className="absolute rounded-xl bg-gray-50 shadow-lg"
                      onMouseLeave={() => setOpen(false)}
                    >
                      {item.components.map((component, i) => (
                        <div
                          key={component.name}
                          onClick={() => {
                            setOpen(false); // Close the menu
                          }}
                          className={`p-1.5 hover:bg-slate-100 ${
                            i === item.components.length - 1
                              ? `rounded-b-xl`
                              : i === 0
                                ? `rounded-t-xl`
                                : ``
                          }`}
                        >
                          <LinkButton to={component.href}>
                            {component.name}
                          </LinkButton>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : (
                <LinkButton key={item.name} to={item.href}>
                  {item.name}
                </LinkButton>
              ),
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
