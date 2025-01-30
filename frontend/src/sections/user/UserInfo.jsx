import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { logoutUser } from "@/sections/user/userSlice";
import { LoginDialog } from "./LoginDialog";

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

function UserInfo() {
  const dispatch = useDispatch();
  const { user, status } = useSelector((state) => state.user);

  // If user info is still loading, render a skeleton
  if (status === "loadingUser") return <SkeletonUser />;

  // If no user, show the LoginDialog trigger
  if (!user) {
    // console.log("re-rendering");
    return <LoginDialog />;
  }

  // Handler for logout
  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <DropdownMenu className="z-[999999]">
      {/* 
        The "trigger" is the clickable area that toggles the dropdown.
        Here, we're displaying the user avatar and name as the trigger. 
      */}
      <DropdownMenuTrigger asChild>
        <div className="flex cursor-pointer items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
            <p className="text-sm font-semibold">{user.first_name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
      </DropdownMenuTrigger>

      {/* 
        The dropdown menu content that appears when the trigger is clicked. 
      */}
      <DropdownMenuContent className="w-48">
        <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* 
          If you want more items, e.g. "Profile", "Settings", etc., 
          you can add more <DropdownMenuItem> elements here.
        */}

        <DropdownMenuItem onClick={handleLogout}>
          <Button variant="ghost">Se déconnecter</Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserInfo;
