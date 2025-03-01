import { AppSidebar } from "@/components/app-sidebar";
import DelayedRedirect from "@/components/DelayedRedirect";
import Loader from "@/components/ui/Loader";
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb";
// import Loader from "@/components/ui/Loader";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { useUser } from "@/features/user/useUser";

import { useEffect } from "react";

import { Outlet } from "react-router-dom";

export default function Dashboard() {
  const { user, isPending, status, isSuccess } = useUser();

  // if (isPending) return <Loader />;
  if (user?.role !== "admin" && user?.role !== "medecin" && !isPending)
    return (
      <>
        <DelayedRedirect destination="/" time={5} />
      </>
    );
  if (isSuccess)
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              {/* TODO: <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb> */}
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <Outlet />
          </div>
        </SidebarInset>
        {/* <Toaster richColors /> */}
      </SidebarProvider>
    );
}
