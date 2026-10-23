
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { buscarFuncionarioAtual, funcionarioQueryKey } from "@/lib/api";
import {
  FilePenLine,
  Pill,
  Dna,
  LockKeyhole,
} from "lucide-react";

const areas = [
  {
    nome: "Prontuários médicos",
    descricao: "Consultar os prontuários dos pacientes.",
    rota: "/dashboard/records",
    nivelNecessario: 1,
    Icone: FilePenLine,
  },
  {
    nome: "Medicamentos",
    descricao: "Consultar e retirar medicamentos.",
    rota: "/dashboard/medicines",
    nivelNecessario: 2,
    Icone: Pill,
  },
  {
    nome: "Códigos genéticos",
    descricao: "Consultar informações genéticas.",
    rota: "/dashboard/geneticCodes",
    nivelNecessario: 3,
    Icone: Dna,
  },
];

export default function DashboardPage() {
  const [mensagem, setMensagem] = useState("");
  const acesso = useQuery({
    queryKey: funcionarioQueryKey,
    queryFn: buscarFuncionarioAtual,
    staleTime: Infinity,
  });
  const nivelAcesso = acesso.data?.nivel_acesso ?? 0;

  function tentarAcessar(nivelNecessario: number) {
    if (nivelAcesso < nivelNecessario) {
      setMensagem("Você não tem autorização.");
      return false;
    }

    setMensagem("");
    return true;
  }

  return (
    <main className="min-h-screen space-y-6 p-6 md:p-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Dashboard
        </h1>
        <p className="mt-2 text-muted-foreground">
          Selecione uma área do sistema para continuar.
        </p>
      </div>

      {mensagem && (
        <div
          role="alert"
          className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-700"
        >
          {mensagem}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {areas.map((area) => {
          const autorizado =
            nivelAcesso >= area.nivelNecessario;
          const Icone = area.Icone;

          return (
            <button
              key={area.rota}
              type="button"
              onClick={() => {
                if (tentarAcessar(area.nivelNecessario) && autorizado) {
                  window.location.href = area.rota;
                }
              }}
              className={`rounded-xl border p-6 text-left transition-colors ${
                autorizado
                  ? "hover:border-primary hover:bg-accent"
                  : "cursor-not-allowed opacity-70 hover:bg-muted"
              }`}
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-lg bg-primary/10 p-3">
                  <Icone className="size-6 text-primary" />
                </div>

                {!autorizado && (
                  <LockKeyhole className="size-5 text-muted-foreground" />
                )}
              </div>

              <h2 className="text-lg font-semibold">
                {area.nome}
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                {area.descricao}
              </p>

              <p className="mt-4 text-sm font-medium">
                {autorizado
                  ? "Acessar área →"
                  : "Acesso restrito"}
              </p>
            </button>
          );
        })}
      </div>
    </main>
  );
}
