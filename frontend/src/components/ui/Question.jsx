import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Separator } from "./separator";
import { useState, useRef } from "react";
import moment from "moment";
import { CSSTransition } from "react-transition-group";
import "./Question.css"; // Ensure the animations are defined here

function Question({ question }) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);

  return (
    <div>
      {Object.keys(question.answer).length !== 0 ? (
        <div className="flex flex-col gap-2 2xl:gap-4">
          <div className="space-y-2 rounded-lg bg-white px-4 py-3 shadow-question 2xl:space-y-3 2xl:p-5">
            <div className="flex items-center gap-1.5 2xl:gap-3">
              <Avatar className="aspect-square h-8 w-auto 2xl:h-10">
                <AvatarImage
                  src={question.user.profile_picture}
                  alt="@shadcn"
                  className="object-cover"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <span className="text-sm font-semibold 2xl:text-base">
                {question.user.nom + " " + question.user.prenom}
              </span>
            </div>
            <p className="text-xs 2xl:text-sm">{question.question_text}</p>
            <Separator className="bg-black-10" />
            <div className="flex items-center justify-between">
              <span className="text-xs text-blk-60 2xl:text-sm">
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
          <div
            ref={contentRef}
            className={`answer-container overflow-hidden rounded-lg transition-all duration-300 ease-linear ${
              isOpen ? "max-h-[1000px]" : "max-h-0"
            }`}
          >
            <CSSTransition
              in={isOpen}
              timeout={300}
              classNames="fade"
              unmountOnExit
            >
              <div className="space-y-2 rounded-lg bg-blue-20 px-4 py-3 shadow-question 2xl:space-y-3 2xl:p-5">
                <div className="flex items-center gap-1.5 2xl:gap-3">
                  <Avatar className="aspect-square h-8 w-auto 2xl:h-10">
                    <AvatarImage
                      src={question.answer.user.profile_picture}
                      alt="@shadcn"
                      className="object-cover"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-semibold 2xl:text-base">
                    Dr.{" "}
                    {question.answer.user.nom +
                      " " +
                      question.answer.user.prenom}
                  </span>
                </div>
                <p className="text-xs 2xl:text-sm">
                  {question.answer.answer_text}
                </p>
                <Separator className="bg-black-10" />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-blk-60 2xl:text-sm">
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
            </CSSTransition>
          </div>
        </div>
      ) : (
        <div className="space-y-2 rounded-lg bg-white px-4 py-3 shadow-question 2xl:space-y-3">
          <div className="flex items-center gap-1.5 2xl:gap-3">
            <Avatar className="aspect-square h-8 w-auto 2xl:h-10">
              <AvatarImage
                src={question.user.profile_picture}
                alt="@shadcn"
                className="object-cover"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <span className="text-sm font-semibold 2xl:text-base">
              {question.user.nom + " " + question.user.prenom}
            </span>
          </div>
          <p className="text-xs 2xl:text-sm">{question.question_text}</p>
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
