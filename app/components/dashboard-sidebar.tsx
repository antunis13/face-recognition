import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Dna,
  Dome,
  FilePenLine,
  Pill,
  SquareArrowRightExit,
} from "lucide-react";

const enum Routes {
  records = "/dashboard/records",
  medicines = "/dashboard/medicines",
  geneticCodes = "/dashboard/geneticCodes",
}

export const DashboardSidebar = () => {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex flex-row items-center gap-2">
          <div className="p-2 border rounded-lg bg-black">
            <Dome size={18} color="#ffffff" />
          </div>

          <p>Saint Paul Institute</p>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="cursor-pointer">
                  <Link href={Routes.records} className="flex flex-row gap-1">
                    <FilePenLine />

                    <p>Prontuários </p>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton className="cursor-pointer">
                  <Link href={Routes.medicines} className="flex flex-row gap-1">
                    <Pill />

                    <p>Medicamentos </p>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton className="cursor-pointer">
                  <Link
                    href={Routes.geneticCodes}
                    className="flex flex-row gap-1"
                  >
                    <Dna />

                    <p>Códigos genéticos</p>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuButton className="cursor-pointer">
          <SquareArrowRightExit />
          <p>Sair</p>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
};
