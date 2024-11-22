import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import LinkButton from "./LinkButton";
import styles from "./Header.module.css";
import logo from "../../images/CAClogo.svg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Button } from "./button";
import { useLayoutEffect } from "react";

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
  let location = useLocation();
  const [open, setOpen] = useState(false); // Dropdown menu state
  // Usage
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "scroll";
      document.body.style.paddingRight = "0px";
      document.body.style.marginRight = "0px";
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "0px";
      document.body.style.marginRight = "0px";
    }
  }, [open]);

  return (
    <header className="fixed top-0 z-[999] flex w-full bg-[#F7FCFD80] p-4 drop-shadow-[0px_0px_10px_#ffffff] backdrop-blur-md xl:p-3 4xl:p-4">
      <div className="flex w-full items-center justify-center gap-60">
        <img src={logo} className="h-6 4xl:h-8" />
        <div className={styles.nav}>
          <div className="flex w-full justify-center gap-5">
            <DropdownMenu open={open} onOpenChange={setOpen}>
              {navItems.map((item) =>
                item.components ? (
                  <div key={item.name}>
                    <DropdownMenuTrigger>
                      <LinkButton
                        to={item.href}
                        className={`text-sm text-blk-60 xl:text-xs 4xl:text-base`}
                      >
                        {item.name}
                      </LinkButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="z-[9999]">
                      {item.components.map((component) => (
                        <DropdownMenuItem
                          key={component.name}
                          onClick={() => {
                            setOpen(false); // Close the menu
                          }}
                        >
                          <LinkButton to={component.href}>
                            {component.name}
                          </LinkButton>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </div>
                ) : (
                  <LinkButton key={item.name} to={item.href}>
                    {item.name}
                  </LinkButton>
                ),
              )}
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
