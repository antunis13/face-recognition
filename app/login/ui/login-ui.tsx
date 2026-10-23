
"use client";

import { PageContent, PageLayout } from "@/app/components/ui/page-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { ScanFace } from "lucide-react";

interface LoginUiProps {
  onGoToSignIn(): void;
  onLogin(usuario: string, senha: string): void;
  onRegister(usuario: string, senha: string): void;
  isSignInForm: boolean;
  setIsSignInForm(value: boolean): void;
  error?: string;
  loading?: boolean;
}

export const LoginUi = ({
  onGoToSignIn,
  onLogin,
  onRegister,
  isSignInForm,
  setIsSignInForm,
  error,
  loading,
}: LoginUiProps) => {
  return (
    <PageLayout className="h-full">
      <PageContent className="flex flex-col h-full items-center justify-center">
        <h1 className="font-semibold text-3xl mb-8">
          Saint Paul Institute
        </h1>

        {isSignInForm ? (
          <Card className="w-96 max-w-2xl">
            <CardHeader>
              <CardTitle className="text-center">Entrar</CardTitle>

              <CardAction>
                <Button type="button" variant="ghost">
                  <ScanFace className="size-6" />
                </Button>
              </CardAction>
            </CardHeader>

            <form
              onSubmit={(event) => {
                event.preventDefault();

                const dados = new FormData(event.currentTarget);
                const usuario = String(
                  dados.get("usuario") ?? ""
                ).trim();
                const senha = String(dados.get("senha") ?? "");

                onLogin(usuario, senha);
              }}
            >
              <CardContent>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="login-usuario">
                      Nome de usuário
                    </Label>

                    <Input
                      id="login-usuario"
                      name="usuario"
                      type="text"
                      placeholder="Digite seu nome de usuário"
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="login-senha">Senha</Label>

                    <Input
                      id="login-senha"
                      name="senha"
                      type="password"
                      required
                    />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex-col gap-2">
                <Button
                  type="submit"
                  className="w-full cursor-pointer"
                  disabled={loading}
                >
                  Entrar
                </Button>

                <div className="flex flex-wrap items-center justify-center">
                  <p className="text-gray-500">
                    Não tem conta ainda?
                  </p>

                  <Button
                    type="button"
                    className="cursor-pointer"
                    variant="link"
                    onClick={() => setIsSignInForm(false)}
                  >
                    Cadastre-se
                  </Button>
                </div>
              </CardFooter>
            </form>
          </Card>
        ) : (
          <Card className="w-96 max-w-2xl">
            <CardHeader>
              <CardTitle>Crie sua conta</CardTitle>

              <CardAction>
                <Button
                  type="button"
                  className="cursor-pointer"
                  variant="link"
                  onClick={onGoToSignIn}
                >
                  Entrar
                </Button>
              </CardAction>
            </CardHeader>

            <form
              onSubmit={(event) => {
                event.preventDefault();

                const dados = new FormData(event.currentTarget);
                const usuario = String(
                  dados.get("usuario") ?? ""
                ).trim();
                const senha = String(dados.get("senha") ?? "");

                onRegister(usuario, senha);
              }}
            >
              <CardContent>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="cadastro-usuario">
                      Nome de usuário
                    </Label>

                    <Input
                      id="cadastro-usuario"
                      name="usuario"
                      type="text"
                      placeholder="Digite seu nome de usuário"
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="cadastro-senha">Senha</Label>

                    <Input
                      id="cadastro-senha"
                      name="senha"
                      type="password"
                      required
                    />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex-col gap-2">
                <Button
                  type="submit"
                  className="w-full cursor-pointer"
                  disabled={loading}
                >
                  Continuar para biometria
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}

        {loading && (
          <div className="mt-4 flex justify-center">
            <Spinner />
          </div>
        )}

        {error && (
          <p
            role="alert"
            className="mt-4 w-96 max-w-2xl rounded-lg border border-red-500/40 bg-slate-900 p-4 text-center text-sm text-red-300"
          >
            {error}
          </p>
        )}
      </PageContent>
    </PageLayout>
  );
};
