
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { buscarFuncionarioAtual, funcionarioQueryKey } from "@/lib/api";
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
  LockKeyhole,
} from "lucide-react";

const areas = [
  {
    nome: "Prontuários",
    rota: "/dashboard/records",
    nivelNecessario: 1,
    Icone: FilePenLine,
  },
  {
    nome: "Medicamentos",
    rota: "/dashboard/medicines",
    nivelNecessario: 2,
    Icone: Pill,
  },
  {
    nome: "Códigos genéticos",
    rota: "/dashboard/geneticCodes",
    nivelNecessario: 3,
    Icone: Dna,
  },
];

export const DashboardSidebar = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [mensagem, setMensagem] = useState("");
  const acesso = useQuery({
    queryKey: funcionarioQueryKey,
    queryFn: buscarFuncionarioAtual,
    staleTime: Infinity,
  });
  const nivelAcesso = acesso.data?.nivel_acesso ?? 0;

  function sair() {
    sessionStorage.removeItem("employeeToken");
    sessionStorage.removeItem("nivelAcesso");
    queryClient.removeQueries({ queryKey: funcionarioQueryKey });
    router.replace("/");
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex flex-row items-center gap-2">
          <div className="rounded-lg border bg-black p-2">
            <Dome size={18} color="#ffffff" />
          </div>
          <p>Saint Paul Institute</p>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            {mensagem && (
              <p
                role="alert"
                className="mb-3 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700"
              >
                {mensagem}
              </p>
            )}

            <SidebarMenu>
              {areas.map((area) => {
                const autorizado =
                  nivelAcesso >= area.nivelNecessario;
                const Icone = area.Icone;

                return (
                  <SidebarMenuItem key={area.rota}>
                    <SidebarMenuButton
                      className={
                        autorizado
                          ? "cursor-pointer"
                          : "cursor-not-allowed opacity-60"
                      }
                      onClick={() => {
                        if (!autorizado) {
                          setMensagem(
                            "Você não tem autorização."
                          );
                          return;
                        }

                        setMensagem("");
                        router.push(area.rota);
                      }}
                    >
                      <Icone />
                      <span>{area.nome}</span>
                      {!autorizado && (
                        <LockKeyhole className="ml-auto size-4" />
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="cursor-pointer"
              onClick={sair}
            >
              <SquareArrowRightExit />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
