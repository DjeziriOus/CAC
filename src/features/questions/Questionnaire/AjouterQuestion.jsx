import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
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
import { useDispatch, useSelector } from "react-redux";
import { addQuestion } from "@/features/questions/questionSlice";
import { fetchUser } from "@/features/user/userSlice";

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
  const { user, status } = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useDispatch();
  const location = useLocation();
  const questionType = location.pathname.includes("/patients/")
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

  // Update the "type" field if questionType changes
  useEffect(() => {
    form.setValue("type", questionType);
    if (!user) {
      dispatch(fetchUser()).then((e) => {
        if (!e.payload.id || e.payload.role !== questionType) {
          navigate("/");
        }
      });
    }
  }, [questionType, form, dispatch, navigate, user]);

  async function onSubmit(values) {
    try {
      setIsLoading(true);
      console.log(values);
      await dispatch(addQuestion(values)).unwrap();

      toast({
        title: "Question soumise",
        description: "Votre question a été soumise avec succès.",
      });

      navigate(`/questions/${questionType}s/my`);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description:
          "Une erreur est survenue lors de la soumission de votre question. " +
          error.message,
      });
    } finally {
      setIsLoading(false);
    }
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
                      disabled={isLoading}
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
                      disabled={isLoading}
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
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Soumettre la question
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
