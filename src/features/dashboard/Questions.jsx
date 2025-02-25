"use client";

import {
  DeleteIcon,
  Edit2Icon,
  MessageSquareReply,
  Trash2,
} from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  fetchQuestions,
  answerQuestion,
  updateResponse,
  deleteResponse,
  deleteQuestion,
} from "./questionsSlice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Paginator from "@/components/paginator";
import { useSearchParams } from "react-router-dom";
import { getQuestionsAPI } from "@/services/apiQuestions";
import { useQuery } from "@tanstack/react-query";
import { useQuestions } from "./useQuestions";
import { use } from "react";
import PaginatorSkeleton from "@/components/ui/PaginatorSkeleton";

export default function QuestionsDashboard() {
  const {
    questions,
    totalPages,
    isPending,
    error,
    page: currentPage,
  } = useQuestions();
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { status } = useSelector((state) => state.questions);
  const { user } = useSelector((state) => state.user); // Assuming user info is in auth slice

  useEffect(() => {
    searchParams.get("page") || searchParams.set("page", 1);
    searchParams.get("type") || searchParams.set("type", "patient");
    setSearchParams(searchParams);
  }, [searchParams, setSearchParams]);

  const answerForm = useForm({
    defaultValues: {
      response: "",
    },
    resolver: zodResolver(
      z.object({
        response: z
          .string()
          .min(3, "La réponse doit contenir au moins 3 caractères"),
      }),
    ),
  });

  const onEdit = (question) => {
    setSelectedQuestion(question);
    answerForm.reset({
      response: question.response || "",
    });
    setIsEditing(true);
    setIsAnswering(false);
  };

  const onSubmit = async (data) => {
    try {
      if (selectedQuestion.response) {
        await dispatch(
          updateResponse({ id: selectedQuestion.id, response: data.response }),
        ).unwrap();
      } else {
        await dispatch(
          answerQuestion({ id: selectedQuestion.id, response: data.response }),
        ).unwrap();
      }
      // dispatch(fetchQuestions(questionType));
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to submit response:", error);
    }
  };

  const onDeleteResponse = async (id) => {
    try {
      await dispatch(deleteResponse(id)).unwrap();
      dispatch(fetchQuestions());
    } catch (error) {
      console.error("Failed to delete response:", error);
    }
  };

  const onDeleteQuestion = async (id) => {
    try {
      await dispatch(deleteQuestion(id)).unwrap();
      dispatch(fetchQuestions());
    } catch (error) {
      console.error("Failed to delete question:", error);
    }
  };

  const panelRef = useRef();
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsEditing(false); // Close the panel
      }
    };

    if (isEditing) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing]);
  return (
    <div className="flex h-full">
      <div
        className={`flex-1 space-y-4 p-8 pt-6 transition-all duration-300 ${
          isEditing || isAnswering ? "pr-[400px]" : ""
        }`}
      >
        <div className="flex h-full flex-col gap-5">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Questions</h2>
            <Tabs
              defaultValue={searchParams.get("type") || "patient"}
              onValueChange={(e) => {
                searchParams.set("type", e);
                searchParams.set("page", 1);
                setSearchParams(searchParams);
              }}
              className="w-[400px]"
            >
              <TabsList className="grid h-12 w-full grid-cols-2">
                <TabsTrigger value="patient" className="h-10">
                  Questions Patients
                </TabsTrigger>
                <TabsTrigger value="etudiant" className="h-10">
                  Questions Étudiants
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex-1 overflow-auto">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Objet</TableHead>
                    <TableHead className="max-w-[2rem]">Contenu</TableHead>
                    <TableHead className="max-w-md">Réponse</TableHead>
                    <TableHead className="whitespace-nowrap">
                      Médecin à avoir répondu
                    </TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isPending
                    ? Array.from({ length: 5 }).map((_, idx) => (
                        <TableRow key={idx}>
                          <TableCell>
                            <div className="h-5 w-full animate-pulse rounded-lg bg-gray-300" />
                          </TableCell>
                          <TableCell>
                            <div className="h-8 w-[15vw] animate-pulse rounded-lg bg-gray-300" />
                          </TableCell>
                          <TableCell>
                            <div className="h-10 w-[20vw] animate-pulse rounded-xl bg-gray-300" />
                          </TableCell>
                          <TableCell>
                            <div className="h-10 w-[20vw] animate-pulse rounded-xl bg-gray-300" />
                          </TableCell>
                          <TableCell className="flex h-16 items-center justify-center gap-2">
                            <div className="h-10 w-10 animate-pulse rounded-xl bg-gray-300" />
                            <div className="h-10 w-10 animate-pulse rounded-xl bg-gray-300" />
                            <div className="h-10 w-10 animate-pulse rounded-xl bg-gray-300" />
                          </TableCell>
                        </TableRow>
                      ))
                    : questions.map((question) => {
                        return (
                          <TableRow key={question.id}>
                            <TableCell>{question.id}</TableCell>
                            <TableCell className="max-w-[14rem]">
                              {question.object}
                            </TableCell>
                            <TableCell className="max-w-[28rem]">
                              {question.content}
                            </TableCell>

                            <TableCell className="max-w-[28rem]">
                              {question.response || "Aucune réponse"}
                            </TableCell>
                            <TableCell>
                              {(question?.receiver &&
                                question?.receiver?.nom +
                                  " " +
                                  question?.receiver?.prenom) ||
                                "Aucun médecin"}
                            </TableCell>

                            <TableCell className="flex h-full items-center justify-center gap-2">
                              {question.response ? (
                                <>
                                  {user?.email === question.receiver.email && (
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() => onEdit(question)}
                                    >
                                      <Edit2Icon className="h-4 w-4" />
                                    </Button>
                                  )}
                                  <Button
                                    variant="destructive"
                                    size="icon"
                                    onClick={() =>
                                      onDeleteResponse(question.id)
                                    }
                                  >
                                    <DeleteIcon className="h-4 w-4" />
                                  </Button>
                                </>
                              ) : (
                                !question.response &&
                                (user?.role === "medecin" ||
                                  user?.role === "admin") && (
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => onEdit(question)}
                                  >
                                    <MessageSquareReply className="h-4 w-4" />
                                  </Button>
                                )
                              )}
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => onDeleteQuestion(question.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                </TableBody>
              </Table>
            </div>
          </div>
          <div className="mt-auto">
            {/* <Paginator variant={questionType} /> */}
            {<Paginator />}
          </div>
        </div>
      </div>

      {/* Edit/Answer Question Panel */}
      <div
        ref={panelRef}
        className={`fixed right-0 top-0 h-full w-[400px] border-l bg-background p-6 shadow-lg transition-transform duration-300 ${isEditing ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex h-full flex-col">
          <h3 className="text-lg font-medium">Répondre à la question</h3>
          <Form {...answerForm}>
            <form
              onSubmit={answerForm.handleSubmit(onSubmit)}
              className="flex h-full flex-col"
            >
              <div className="flex-1 space-y-4 py-4">
                <FormField
                  control={answerForm.control}
                  name="response"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Réponse</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Entrez votre réponse"
                          className="min-h-60"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  type="button"
                >
                  Annuler
                </Button>
                <Button type="submit">Enregistrer</Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
// const table = useReactTable({
//   data: questions,
//   columns: [
//     { accessorKey: "question", header: "Question" },
//     { accessorKey: "response", header: "Réponse" },
//     {
//       accessorKey: "actions",
//       header: "Actions",
//       cell: ({ row }) => (
//         <div className="flex space-x-2">
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={() => onEdit(row.original)}
//           >
//             <Edit2Icon className="h-4 w-4" />
//           </Button>
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={() => onDeleteResponse(row.original.id)}
//           >
//             Supprimer
//           </Button>
//           {!row.original.response &&
//             (user?.role === "medecin" || user?.role === "admin") && (
//               <Button
//                 variant="outline"
//                 size="icon"
//                 onClick={() => onEdit(row.original)}
//               >
//                 <Plus className="h-4 w-4" /> Répondre
//               </Button>
//             )}
//         </div>
//       ),
//     },
//   ],
//   getCoreRowModel: getCoreRowModel(),
//   onSortingChange: setSorting,
//   getSortedRowModel: getSortedRowModel(),
//   state: {
//     sorting,
//   },
// });
