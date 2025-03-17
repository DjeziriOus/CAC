import SkeletonUser from "@/components/ui/SkeletonUser";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Shadcn Dropdown components
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LayoutDashboardIcon, UnplugIcon } from "lucide-react";
import AuthDialog from "@/features/user/AuthDialog";
import { NavLink } from "react-router-dom";
import { useUser } from "@/features/user/useUser";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

function UserInfo() {
  const userData = useUser();
  const { user, allowedTabs, error, isPending, isSuccess, isError } = userData;
  const queryClient = useQueryClient();
  // If user info is still loading, render a skeleton

  if (!user && !isPending) {
    return (
      <AuthDialog>
        <Button variant="outline" className="my-2">
          Connectez-vous
        </Button>
      </AuthDialog>
    );
  } else if (isPending)
    return (
      <div className="py-0">
        <SkeletonUser />
      </div>
    );
  if (error) {
    toast.error("Serveur indisponible", {
      description: ` Serveur indisponible - vérifiez votre connexion internet.`,
    });
    return <SkeletonUser />;
  }

  // If user info failed to load, show an error
  // if (status === "failed") return <p></p>;
  // If no user, show the LoginDialog trigger

  // Handler for logout
  const handleLogout = () => {
    localStorage.removeItem("jwt");
    // navigate("/");
    queryClient.refetchQueries({
      queryKey: ["user"],
    });
  };

  return (
    <DropdownMenu className="z-[999999]">
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex cursor-pointer items-center justify-start gap-3 py-7"
        >
          <Avatar className="h-9 w-9">
            <AvatarImage alt="@shadcn" />
            <AvatarFallback>
              {user?.prenom?.[0] + user?.nom?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
            <p className="text-sm font-semibold">
              {user?.nom} {user?.prenom}
            </p>
            <p className="text-xs capitalize text-muted-foreground">
              {user?.role}
            </p>
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-48">
        <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {(user?.role === "admin" || user?.role === "medecin") && (
          <NavLink to={"/dashboard"} className="flex w-full items-center gap-2">
            <DropdownMenuItem className="w-full hover:cursor-pointer">
              <LayoutDashboardIcon className="h-4 w-4" />
              Tableau de Bord
            </DropdownMenuItem>
          </NavLink>
        )}
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-red-500 hover:cursor-pointer"
        >
          <UnplugIcon />
          Se Déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserInfo;
