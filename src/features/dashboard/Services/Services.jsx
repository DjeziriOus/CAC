"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import ServicesTable from "./Components/ServicesTable";
import { NavLink } from "react-router-dom";
import Paginator from "@/components/paginator-v2";
import { useTotalPagesServices } from "./useTotalPagesServices";

export default function Services() {
  // const [searchParams, setSearchParams] = useSearchParams();
  const { totalPages, isPending } = useTotalPagesServices();
  // const [selectedUser, setSelectedUser] = useState(null);
  // const [isEditing, setIsEditing] = useState(false);
  // const { isAddingService, addService } = useAddService();
  // const dispatch = useDispatch(); // const { status } = useSelector((state) => state.users);

  // const addServiceForm = useForm({
  //   defaultValues: {
  //     nom: "",
  //     prenom: "",
  //     email: "",
  //     password: "",
  //   },
  //   // Add validation rules
  //   resolver: zodResolver(
  //     z.object({
  //       nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  //       prenom: z
  //         .string()
  //         .min(2, "Le prénom doit contenir au moins 2 caractères"),
  //       email: z.string().email("Email invalide"),
  //       password: z
  //         .string()
  //         .min(3, "Le mot de passe doit contenir au moins 3 caractères"),
  //     }),
  //   ),
  // });

  return (
    <div className="flex h-full">
      <div className={`flex-1 space-y-4 p-8 pt-6 transition-all duration-300`}>
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Services</h2>
          <NavLink to="/dashboard/services/ajouter">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un Service
            </Button>
          </NavLink>
        </div>
        <div className="flex-1 overflow-auto">
          <ServicesTable />
        </div>
        <div className="mt-auto">
          {<Paginator totalPages={totalPages} isPending={isPending} />}
        </div>
      </div>
    </div>
  );
}
