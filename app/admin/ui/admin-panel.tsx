"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  ApiError,
  atualizarNivelUsuario,
  buscarUsuariosAdmin,
  usuariosAdminQueryKey,
  type UsuarioAdmin,
} from "@/lib/api";

const NIVEIS = [0, 1, 2, 3];

const CORES_NIVEIS = [
  "border-gray-500 bg-gray-600 text-gray-200 hover:bg-gray-500",
  "border-green-500 bg-green-700 text-white hover:bg-green-600",
  "border-yellow-400 bg-yellow-500 text-gray-950 hover:bg-yellow-400",
  "border-red-500 bg-red-700 text-white hover:bg-red-600",
];

export function AdminPanel() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [pesquisa, setPesquisa] = useState("");
  const [selecionado, setSelecionado] = useState<number | null>(null);
  const [nivelPendente, setNivelPendente] = useState<number | null>(null);

  const usuariosQuery = useQuery({
    queryKey: usuariosAdminQueryKey,
    queryFn: () => {
      return buscarUsuariosAdmin();
    },
  });

  const salvarNivel = useMutation({
    mutationFn: ({ id, nivel }: { id: number; nivel: number }) => {
      return atualizarNivelUsuario(id, nivel);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: usuariosAdminQueryKey });
    },
  });

  const error =
    (salvarNivel.error instanceof ApiError &&
    salvarNivel.error.code === "sem-token"
      ? undefined
      : salvarNivel.error?.message) ??
    (usuariosQuery.error instanceof ApiError &&
    usuariosQuery.error.code === "sem-token"
      ? undefined
      : usuariosQuery.error?.message);
  const loading = usuariosQuery.isPending || salvarNivel.isPending;

  useEffect(() => {
    const erroAtual = salvarNivel.error ?? usuariosQuery.error;

    if (erroAtual instanceof ApiError && erroAtual.code === "sem-token") {
      router.replace("/");
    }
  }, [router, salvarNivel.error, usuariosQuery.error]);

  const usuarios = usuariosQuery.data ?? [];

  const usuariosFiltrados = usuarios.filter((usuario) =>
    usuario.nome.toLowerCase().includes(pesquisa.trim().toLowerCase()),
  );

  function selecionarUsuario(usuario: UsuarioAdmin) {
    setSelecionado(usuario.id);
    setNivelPendente(usuario.nivel_acesso ?? 0);
    salvarNivel.reset();
  }

  function confirmarAlteracao() {
    if (selecionado === null || nivelPendente === null) {
      return;
    }

    salvarNivel.mutate({ id: selecionado, nivel: nivelPendente });
  }

  function sairDoPainel() {
    sessionStorage.removeItem("adminToken");
    router.replace("/");
  }

  const sessaoInvalida =
    (salvarNivel.error instanceof ApiError &&
      salvarNivel.error.code === "sem-token") ||
    (usuariosQuery.error instanceof ApiError &&
      usuariosQuery.error.code === "sem-token");

  if (usuariosQuery.isPending || sessaoInvalida) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-6 text-foreground">
        <Spinner className="size-6" />
      </main>
    );
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-background px-4 py-8 text-foreground sm:px-8">
      <Button
        type="button"
        variant="outline"
        onClick={sairDoPainel}
        className="absolute top-4 left-4 sm:top-6 sm:left-8"
      >
        ← Sair do Painel
      </Button>

      <section className="mx-auto flex w-full max-w-5xl flex-col gap-5 pt-12 sm:pt-10">
        <h1 className="text-center text-3xl font-semibold sm:text-4xl">
          Painel do Administrador
        </h1>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-2xl sm:p-6">
          <Input
            value={pesquisa}
            onChange={(event) => setPesquisa(event.target.value)}
            placeholder="Pesquisar usuário por nome"
            aria-label="Pesquisar usuário por nome"
            className="mb-5 h-14 rounded-xl text-lg sm:text-xl"
          />

          <div className="overflow-hidden rounded-xl border border-border">
            <div className="grid grid-cols-[64px_minmax(100px,1fr)_minmax(180px,260px)] border-b border-border bg-muted font-semibold text-foreground sm:grid-cols-[80px_minmax(140px,1fr)_260px]">
              <div className="p-3">ID</div>
              <div className="p-3">Nome</div>
              <div className="p-3 text-center text-sm sm:text-base">
                Nível de acesso
              </div>
            </div>

            <div className="max-h-[55vh] overflow-y-auto">
              {usuariosFiltrados.map((usuario) => {
                const nivelAtual = usuario.nivel_acesso ?? 0;
                const estaSelecionado = selecionado === usuario.id;

                return (
                  <div
                    key={usuario.id}
                    role="button"
                    tabIndex={0}
                    aria-pressed={estaSelecionado}
                    onClick={() => selecionarUsuario(usuario)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        selecionarUsuario(usuario);
                      }
                    }}
                    className={`grid cursor-pointer grid-cols-[64px_minmax(100px,1fr)_minmax(180px,260px)] border-b border-border last:border-b-0 sm:grid-cols-[80px_minmax(140px,1fr)_260px] ${
                      estaSelecionado
                        ? "bg-accent"
                        : "bg-card hover:bg-muted"
                    }`}
                  >
                    <div className="p-3 text-muted-foreground sm:p-4">
                      {usuario.id}
                    </div>

                    <div className="break-words p-3 text-foreground sm:p-4">
                      {usuario.nome}
                    </div>

                    <div
                      className="flex items-center justify-center gap-1 border-l border-border p-2 sm:gap-2"
                      onClick={(event) => event.stopPropagation()}
                    >
                      {NIVEIS.map((nivel) => {
                        const nivelEscolhido = estaSelecionado
                          ? nivelPendente === nivel
                          : nivelAtual === nivel;

                        return (
                          <button
                            key={nivel}
                            type="button"
                            aria-label={`Selecionar nível ${nivel} para ${usuario.nome}`}
                            aria-pressed={
                              estaSelecionado && nivelPendente === nivel
                            }
                            title={
                              nivel === 0
                                ? "Sem acesso atribuído"
                                : `Nível ${nivel}`
                            }
                            onClick={() => {
                              if (!estaSelecionado) {
                                setSelecionado(usuario.id);
                              }

                              setNivelPendente(nivel);
                              salvarNivel.reset();
                            }}
                            className={`flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:size-10 sm:text-lg ${
                              CORES_NIVEIS[nivel]
                            } ${
                              nivelEscolhido
                                ? "scale-110 ring-2 ring-ring ring-offset-2 ring-offset-background"
                                : "opacity-50 hover:scale-105 hover:opacity-100"
                            }`}
                          >
                            {nivel}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {usuariosFiltrados.length === 0 && (
                <p className="bg-card p-6 text-center text-muted-foreground">
                  Nenhum funcionário encontrado.
                </p>
              )}
            </div>
          </div>

          <p className="mt-3 text-sm text-muted-foreground">
            Nível 0 = nenhum acesso atribuído. Selecione um funcionário e
            escolha o nível desejado.
          </p>

          <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <span>0 — Sem acesso</span>
            <span className="text-green-700 dark:text-green-400">1 — Nível 1</span>
            <span className="text-yellow-700 dark:text-yellow-300">2 — Nível 2</span>
            <span className="text-red-700 dark:text-red-400">3 — Nível 3</span>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center">
            <Spinner />
          </div>
        )}

        {error && (
          <p role="alert" className="text-center text-sm text-destructive">
            {error}
          </p>
        )}

        {salvarNivel.isSuccess && (
          <p role="status" className="text-center text-sm text-green-700 dark:text-green-400">
            Nível de acesso atualizado com sucesso!
          </p>
        )}

        <div className="flex justify-center">
          <Button
            type="button"
            onClick={confirmarAlteracao}
            disabled={
              selecionado === null ||
              nivelPendente === null ||
              salvarNivel.isPending
            }
            className={`h-auto min-h-14 w-full max-w-md whitespace-normal rounded-xl border px-6 py-4 text-lg font-semibold transition-colors sm:text-2xl ${
              salvarNivel.isSuccess
                ? "border-green-500 bg-green-600 text-white hover:bg-green-500"
                : ""
            }`}
          >
            {salvarNivel.isPending
              ? "Salvando..."
              : salvarNivel.isSuccess
                ? "Alteração confirmada ✓"
                : "Confirmar alteração"}
          </Button>
        </div>
      </section>
    </main>
  );
}