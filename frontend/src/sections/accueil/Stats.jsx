import { Separator } from "@/components/ui/separator";

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
    <div className="flex h-[11rem] items-center justify-center gap-10 bg-blk py-5">
      {content.map((item, index) => (
        <>
          <div key={item.id} className="flex flex-col text-center">
            <span className="text-center text-[2.7rem] font-extrabold tracking-wider text-white">
              {item.value}
            </span>
            <span className="text-main">{item.title}</span>
          </div>
          {index < content.length - 1 && (
            <Separator
              orientation="vertical"
              className="bg-wht-30 =page?=3/ h-[95%]"
            />
          )}
        </>
      ))}
    </div>
  );
}

export default Stats;
