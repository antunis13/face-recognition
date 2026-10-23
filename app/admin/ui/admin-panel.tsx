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
      <main className="flex min-h-screen items-center justify-center bg-gray-950 p-6 text-gray-100">
        <Spinner className="size-6" />
      </main>
    );
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-gray-950 px-4 py-8 text-gray-100 sm:px-8">
      <Button
        type="button"
        onClick={sairDoPainel}
        className="absolute left-4 top-4 border border-gray-600 bg-gray-800 text-gray-100 hover:bg-gray-700 sm:left-8 sm:top-6"
      >
        ← Sair do Painel
      </Button>

      <section className="mx-auto flex w-full max-w-5xl flex-col gap-5 pt-12 sm:pt-10">
        <h1 className="text-center text-3xl font-semibold text-white sm:text-4xl">
          Painel do Administrador
        </h1>

        <div className="rounded-2xl border border-gray-700 bg-gray-900 p-4 shadow-2xl sm:p-6">
          <Input
            value={pesquisa}
            onChange={(event) => setPesquisa(event.target.value)}
            placeholder="Pesquisar usuário por nome"
            aria-label="Pesquisar usuário por nome"
            className="mb-5 h-14 rounded-xl border border-gray-600 bg-gray-800 text-lg text-white placeholder:text-gray-400 focus-visible:ring-gray-400 sm:text-xl"
          />

          <div className="overflow-hidden rounded-xl border border-gray-700">
            <div className="grid grid-cols-[64px_minmax(100px,1fr)_minmax(180px,260px)] border-b border-gray-700 bg-gray-800 font-semibold text-gray-200 sm:grid-cols-[80px_minmax(140px,1fr)_260px]">
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
                    className={`grid cursor-pointer grid-cols-[64px_minmax(100px,1fr)_minmax(180px,260px)] border-b border-gray-700 last:border-b-0 sm:grid-cols-[80px_minmax(140px,1fr)_260px] ${
                      estaSelecionado
                        ? "bg-gray-700/80"
                        : "bg-gray-900 hover:bg-gray-800"
                    }`}
                  >
                    <div className="p-3 text-gray-300 sm:p-4">
                      {usuario.id}
                    </div>

                    <div className="break-words p-3 text-gray-100 sm:p-4">
                      {usuario.nome}
                    </div>

                    <div
                      className="flex items-center justify-center gap-1 border-l border-gray-700 p-2 sm:gap-2"
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
                            className={`flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 sm:size-10 sm:text-lg ${
                              CORES_NIVEIS[nivel]
                            } ${
                              nivelEscolhido
                                ? "scale-110 ring-2 ring-white ring-offset-2 ring-offset-gray-900"
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
                <p className="bg-gray-900 p-6 text-center text-gray-400">
                  Nenhum funcionário encontrado.
                </p>
              )}
            </div>
          </div>

          <p className="mt-3 text-sm text-gray-400">
            Nível 0 = nenhum acesso atribuído. Selecione um funcionário e
            escolha o nível desejado.
          </p>

          <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm text-gray-300">
            <span>0 — Sem acesso</span>
            <span className="text-green-400">1 — Nível 1</span>
            <span className="text-yellow-400">2 — Nível 2</span>
            <span className="text-red-400">3 — Nível 3</span>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center">
            <Spinner />
          </div>
        )}

        {error && (
          <p role="alert" className="text-center text-sm text-red-400">
            {error}
          </p>
        )}

        {salvarNivel.isSuccess && (
          <p role="status" className="text-center text-sm text-green-400">
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
                : "border-gray-600 bg-gray-800 text-gray-100 hover:bg-gray-700"
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