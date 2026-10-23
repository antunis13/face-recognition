"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout as DashboardShell } from "@/app/components/dashboard-layout";
import { Spinner } from "@/components/ui/spinner";
import {
  ApiError,
  buscarFuncionarioAtual,
  funcionarioQueryKey,
} from "@/lib/api";

function nivelNecessario(pathname: string): number {
  if (pathname.startsWith("/dashboard/records")) return 1;
  if (pathname.startsWith("/dashboard/medicines")) return 2;
  if (pathname.startsWith("/dashboard/geneticCodes")) return 3;
  return 0;
}

function sessaoInvalida(error: unknown) {
  return error instanceof ApiError && error.code !== "api";
}

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const necessario = nivelNecessario(pathname);

  const acesso = useQuery({
    queryKey: funcionarioQueryKey,
    queryFn: () => {
      return buscarFuncionarioAtual();
    },
    staleTime: Infinity,
  });

  const nivel = acesso.data?.nivel_acesso ?? 0;
  const semPermissao = acesso.isSuccess && nivel < necessario;
  const error =
    acesso.isError && !sessaoInvalida(acesso.error)
      ? acesso.error.message
      : undefined;
  const loading = acesso.isPending || semPermissao || (acesso.isError && !error);

  useEffect(() => {
    if (sessaoInvalida(acesso.error)) {
      router.replace("/");
    }
  }, [acesso.error, router]);

  useEffect(() => {
    if (semPermissao) {
      router.replace("/dashboard");
    }
  }, [router, semPermissao]);

  if (loading || error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
        {loading && <Spinner className="size-6" />}


        {error && <p>{error}</p>}

        {error && (
          <p className="text-sm text-muted-foreground">
            Verifique se o backend FastAPI está funcionando e tente novamente.
          </p>
        )}
        
        {error && (
          <button
            className="rounded-md border px-4 py-2"
            onClick={() => {
              void acesso.refetch();
            }}
          >
            Tentar novamente
          </button>
        )}
      </main>
    );
  }

  return <DashboardShell>{children}</DashboardShell>;
}
