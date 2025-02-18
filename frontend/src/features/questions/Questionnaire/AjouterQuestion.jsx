"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
// import { useToast } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { loginUser } from "@/features/user/userSlice";
import { useDispatch } from "react-redux";
import { addQuestion } from "@/features/questions/questionSlice";

// Form validation schema
const formSchema = z.object({
  object: z.string().min(5, {
    message: "L'objet doit contenir au moins 5 caractères.",
  }),
  content: z.string().min(20, {
    message: "Le contenu doit contenir au moins 20 caractères.",
  }),
});

export default function AjouterQuestion() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useDispatch();
  // Initialize form with react-hook-form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      object: "",
      content: "",
    },
  });

  // Handle form submission
  async function onSubmit(values) {
    try {
      setIsLoading(true);
      // dispatch();
      // TODO: Replace with your actual API call
      // await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      console.log(values);
      await dispatch(addQuestion(values)).unwrap();

      // Show success message
      toast({
        title: "Question soumise",
        description: "Votre question a été soumise avec succès.",
      });

      // Redirect to questions list
      navigate("/questions/patients/my");
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
