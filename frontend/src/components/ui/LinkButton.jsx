import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

function LinkButton({ children, to, isDisabled = false, isSublink = false }) {
  // nopx = nopx ?? true;
  const navigate = useNavigate();
  // const className = `text-xs md:text-2xs md:font-light 3xl:text-lg ${nopx ? "3xl:px-10 md:px-5 2md:px-[1.3rem] xl:px-[1.7rem]" : "px-0"} 3xl:py-4 xl:py-3 md:py-[0.6rem] 2md:font-normal 2md:text-[0.65rem] 2md:leading-[0.6rem] text-white hover:text-nouris transition-all duration-200 rounded-full font-medium active:bg-#FFDD0E active:text-black xl:text-base lg:text-sm lg:font-light`;

  if (to === "-1")
    return (
      <button className="" onClick={() => navigate(-1)}>
        {children}
      </button>
    );

  return (
    <NavLink
      to={to}
      className="font-medium"
      onClick={(e) => {
        if (isDisabled) {
          e.preventDefault();
        }
      }}
    >
      <Button
        variant="link"
        className={`rounded-xl text-sm text-blk-60 hover:bg-slate-100 xl:text-xs 4xl:text-base ${isSublink ? "flex gap-1" : ""}`}
      >
        {children}
      </Button>
    </NavLink>
  );
}

export default LinkButton;
