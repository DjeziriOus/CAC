import { useState } from "react";

import LinkButton from "./LinkButton";
import styles from "./Header.module.css";
import logo from "@/images/CAClogo.svg";
// import { ReactComponent as logo } from "./CAClogo.svg";
import { ChevronDown } from "lucide-react";
import UserInfo from "@/features/user/UserInfo";

function Header() {
  const navItems = [
    { name: "Accueil", href: "/", secondaryName: "Page d'Accueil" },
    {
      name: "Services Hospitaliers",
      href: "/services",
      secondaryName: "Services Hospitaliers",
    },
    {
      name: "Événements",
      href: "/evenements",
      secondaryName: "Événements",
    },
    {
      name: "Q&A",
      href: "/questions",
      secondaryName: "Q&A",
      components: [
        {
          name: "Espace des patients",
          href: "/questions/patient",
        },
        {
          name: "Espace des étudiants",
          href: "/questions/etudiant",
        },
      ],
    },
  ];
  // let location = useLocation();
  const [open, setOpen] = useState(false);
  // if (user?.role === "admin" || user?.role === "medecin") {
  //   navItems.push({
  //     name: "Dashboard",
  //     href: "/dashboard",
  //     secondaryName: "Dashboard",
  //   });
  // }
  return (
    <header className="fixed top-0 z-[2] flex w-[100dvw] justify-center bg-[#F7FCFD80] p-2 drop-shadow-[0px_0px_10px_#ffffff] backdrop-blur-md">
      <div className="flex w-full items-center justify-center gap-32 4xl:gap-56">
        <img src={logo} className="h-6 4xl:h-8" />
        <div className={styles.nav}>
          <div className="flex w-full items-center justify-center gap-5 4xl:gap-4">
            <div className="flex w-[35vw]">
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
            <UserInfo />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
