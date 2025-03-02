import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUser } from "@/features/user/useUser";
import { useAddQuestion } from "@/features/dashboard/Questions/useAddQuestion";

const formSchema = z.object({
  object: z.string().min(5, {
    message: "L'objet doit contenir au moins 5 caractères.",
  }),
  content: z.string().min(20, {
    message: "Le contenu doit contenir au moins 20 caractères.",
  }),
  type: z.string(), // Ensure schema accepts type as a string
});

export default function AjouterQuestion() {
  const navigate = useNavigate();
  // const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useUser();
  // const [isAddingQuestion, setisAddingQuestion] = useState(false);
  const location = useLocation();
  // useEffect(() => {
  //   if (user?.role && user?.role !== searchParams.get("type")) {
  //     if (user?.role === "admin") navigate("/");
  //     searchParams.set("type", user?.role);
  //   }
  //   searchParams.delete("page");
  //   setSearchParams(searchParams);
  // }, [searchParams, setSearchParams, user?.role, navigate]);

  const questionType = location.pathname.includes("patient")
    ? "patient"
    : "etudiant";
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      object: "",
      content: "",
      type: questionType, // default value
    },
  });
  const { addQuestion, isAddingQuestion } = useAddQuestion();
  function onSubmit(values) {
    console.log(values);
    addQuestion(values);
    navigate("/questions");
  }

  return (
    <Card className="mx-auto my-10 w-full max-w-full">
      <CardHeader>
        <CardTitle>Poser une question</CardTitle>
        <CardDescription>
          Posez votre question à la communauté médicale.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="object"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Objet</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Consultation pour douleurs abdominales"
                      {...field}
                      disabled={isAddingQuestion}
                    />
                  </FormControl>
                  <FormDescription>
                    L&apos;objet de votre question en quelques mots.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contenu</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez votre question en détail..."
                      className="min-h-[200px] resize-y"
                      {...field}
                      disabled={isAddingQuestion}
                    />
                  </FormControl>
                  <FormDescription>
                    Soyez précis et incluez tous les détails pertinents.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* You can include this hidden input if you prefer explicit registration */}
            <input
              type="hidden"
              {...form.register("type")}
              value={questionType}
            />

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                disabled={isAddingQuestion}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isAddingQuestion}>
                {isAddingQuestion && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Soumettre la question
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
