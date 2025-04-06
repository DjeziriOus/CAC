import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import { ArrowUp } from "lucide-react";
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
      {question?.closed ? (
        <div className="flex flex-col gap-2 2xl:gap-4">
          <div className="space-y-2 rounded-lg bg-white px-4 py-3 shadow-question 2xl:space-y-3">
            <div className="flex items-center gap-1.5 2xl:gap-3">
              <Avatar className="aspect-square h-8 w-auto 2xl:h-10">
                <AvatarImage alt="@shadcn" className="object-cover" />
                <AvatarFallback className="text-sm font-semibold uppercase 2xl:text-base">
                  {question?.sender?.nom[0] + question?.sender?.prenom[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-semibold 2xl:text-base">
                  {question?.sender?.nom + " " + question?.sender?.prenom}
                </span>
                <div className="flex gap-2">
                  <span className="text-xs lowercase text-blk-60">
                    {question?.sender?.email}
                  </span>
                </div>
              </div>
            </div>
            <h2 className="text-lg font-semibold">{question?.object}</h2>
            <p className="text-xs 2xl:text-sm">{question?.content}</p>
            <Separator className="bg-black-10" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-blk-60">
                {moment(question?.createdAt).format("DD/MM/YYYY - h:mm A")}
              </span>
              {isOpen ? (
                <div className="px-10 py-5"></div>
              ) : (
                <Button
                  className="rounded-md bg-blue-2 px-4 py-2 text-sm font-medium text-white"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  Voir la reponse
                </Button>
              )}
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
                      // src={question?.answer.user.profile_picture}
                      alt="@shadcn"
                      className="object-cover"
                    />
                    <AvatarFallback>
                      {question?.receiver?.nom[0] +
                        question?.receiver?.prenom[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-semibold 2xl:text-base">
                    Dr.{" "}
                    {question?.receiver?.nom + " " + question?.receiver?.prenom}
                  </span>
                </div>
                <p className="text-xs 2xl:text-sm">{question?.response}</p>
                <Separator className="bg-black-10" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blk-60">
                    {moment(question?.updatedAt).format("DD/MM/YYYY - h:mm A")}
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
                // src={question?.sender?.profile_picture}
                alt="@shadcn"
                className="object-cover"
              />
              <AvatarFallback className="text-sm font-semibold uppercase 2xl:text-base">
                {question?.sender?.nom[0] + question?.sender?.prenom[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-semibold 2xl:text-base">
                {question?.sender?.nom + " " + question?.sender?.prenom}
              </span>
              <div className="flex gap-2">
                <span className="text-xs lowercase text-blk-60">
                  {question?.sender?.email}
                </span>
              </div>
            </div>
          </div>
          <h2 className="text-lg font-semibold">{question?.object}</h2>
          <p className="text-xs 2xl:text-sm">{question?.content}</p>
          <Separator className="bg-black-10" />
          <div className="flex items-center justify-between">
            <span className="text-xs text-blk-60">
              {moment(question?.createdAt).format("DD/MM/YYYY - h:mm A")}
            </span>
            <div className="rounded-md bg-blue-20 px-4 py-2 text-sm font-medium text-blue-2">
              Pas encore répondu
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Question;
