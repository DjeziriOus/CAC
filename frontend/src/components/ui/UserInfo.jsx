import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { logoutUser } from "@/features/user/userSlice";
import { LoginDialog } from "../../features/user/Defunct/LoginDialog";

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
import { LayoutDashboard, LayoutDashboardIcon, UnplugIcon } from "lucide-react";
import AuthDialog from "@/features/user/AuthDialog";
import { NavLink, useNavigate } from "react-router-dom";

function UserInfo() {
  const dispatch = useDispatch();
  const { user, status } = useSelector((state) => state.user);
  const navigate = useNavigate();
  // If user info is still loading, render a skeleton
  if (status === "loadingUser") return <SkeletonUser />;

  // If user info failed to load, show an error
  // if (status === "failed") return <p></p>;
  // If no user, show the LoginDialog trigger
  if (!user) {
    return (
      <AuthDialog>
        <Button variant="outline" className="my-2">
          Connectez-vous
        </Button>
      </AuthDialog>
    );
  }

  // Handler for logout
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  return (
    <DropdownMenu className="z-[999999]">
      {/* 
        The "trigger" is the clickable area that toggles the dropdown.
        Here, we're displaying the user avatar and name as the trigger. 
      */}
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex cursor-pointer items-center justify-start gap-3 py-7"
        >
          <Avatar className="h-9 w-9">
            <AvatarImage alt="@shadcn" />
            <AvatarFallback>{user.prenom[0] + user.nom[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
            <p className="text-sm font-semibold">
              {user.nom} {user.prenom}
            </p>
            <p className="text-xs capitalize text-muted-foreground">
              {user.role}
            </p>
          </div>
        </Button>
      </DropdownMenuTrigger>

      {/* 
        The dropdown menu content that appears when the trigger is clicked. 
      */}
      <DropdownMenuContent className="w-48">
        <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="hover:cursor-pointer">
          <NavLink to={"/dashboard"} className="flex items-center gap-2">
            <LayoutDashboardIcon className="h-4 w-4" />
            Dashboard
          </NavLink>
        </DropdownMenuItem>
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
