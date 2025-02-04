import { Separator } from "@/components/ui/separator";
import React from "react";

const content = [
  {
    id: 1,
    value: "89%",
    title: "Commentaires positifs",
  },
  {
    id: 2,
    value: "150+",
    title: "Nouveaux patients par an",
  },
  {
    id: 3,
    value: "43",
    title: "Médecins professionnels",
  },
  {
    id: 4,
    value: "10",
    title: "Types de traitements",
  },
];

function Stats() {
  return (
    <div className="flex h-[11rem] w-full items-center justify-center gap-10 bg-blk py-5">
      {content.map((item, index) => (
        <React.Fragment key={item.id}>
          <div className="flex flex-col text-center">
            <span className="text-center text-[2.7rem] font-extrabold tracking-wider text-white">
              {item.value}
            </span>
            <span className="text-main">{item.title}</span>
          </div>
          {index < content.length - 1 && (
            <Separator
              orientation="vertical"
              className="=page?=3/ h-[95%] bg-wht-30"
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default Stats;
