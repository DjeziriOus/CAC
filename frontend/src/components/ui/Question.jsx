import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import img1 from "@/images/pfp/img-1.png";
import img2 from "@/images/pfp/img-2.png";
import { Button } from "./button";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Separator } from "./separator";
import { useState } from "react";
import moment from "moment";

function Question({ question }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      {Object.keys(question.answer).length !== 0 ? (
        <div className="flex flex-col gap-3">
          <div className="shadow-question space-y-2 rounded-lg bg-white px-4 py-3">
            <div className="flex items-center gap-1.5">
              <Avatar className="aspect-square h-8 w-auto">
                <AvatarImage
                  src={img1}
                  alt="@shadcn"
                  className="object-cover"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <span className="text-sm font-semibold">
                {question.user.nom + " " + question.user.prenom}
              </span>
            </div>
            <p className="text-xs">{question.question_text}</p>
            <Separator className="bg-black-10" />
            <div className="flex items-center justify-between">
              <span className="text-xs text-blk-60">
                {moment(question.time).format("DD/MM/YYYY - h:mm A")}
              </span>
              <Button
                className={`bg-blue-2 text-white ${isOpen && "cursor-default opacity-0"}`}
                onClick={() => setIsOpen(true)}
              >
                Voir la réponse <ArrowDown />
              </Button>
            </div>
          </div>
          {isOpen && (
            <>
              <div className="shadow-question bg-blue-20 space-y-2 rounded-lg px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <Avatar className="aspect-square h-8 w-auto">
                    <AvatarImage
                      src={img2}
                      alt="@shadcn"
                      className="object-cover"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-semibold">
                    Dr.{" "}
                    {question.answer.user.nom +
                      " " +
                      question.answer.user.prenom}
                  </span>
                </div>
                <p className="text-xs">{question.answer.answer_text}</p>
                <Separator className="bg-black-10" />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-blk-60">
                    {moment(question.answer.time).format("DD/MM/YYYY - h:mm A")}
                  </span>
                  <Button
                    className="bg-blue-2 text-white"
                    onClick={() => setIsOpen(false)}
                  >
                    Cacher <ArrowUp />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="shadow-question space-y-2 rounded-lg bg-white px-4 py-3">
          <div className="flex items-center gap-1.5">
            <Avatar className="aspect-square h-8 w-auto">
              <AvatarImage
                src={question.user.profile_picture}
                alt="@shadcn"
                className="object-cover"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <span className="text-sm font-semibold">
              {question.user.nom + " " + question.user.prenom}
            </span>
          </div>
          <p className="text-xs">{question.question_text}</p>
          <Separator className="bg-black-10" />
          <div className="flex items-center justify-between">
            <span className="text-xs text-blk-60">
              {moment(question.time).format("DD/MM/YYYY - h:mm A")}
            </span>
            <Button className="bg-blue-20 text-blue-2 hover:bg-blue-2 hover:text-white">
              Pas encore répondu
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Question;
