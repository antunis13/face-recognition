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
import { ScanFace } from "lucide-react";

interface LoginUiProps {
  onGoToSignIn(): void;
  isSignInForm: boolean;
  setIsSignInForm(value: boolean): void;
}

export const LoginUi = ({
  onGoToSignIn,
  isSignInForm,
  setIsSignInForm,
}: LoginUiProps) => {
  return (
    <PageLayout className="h-full">
      <PageContent className="flex flex-col h-full items-center justify-center">
        <h1 className="font-semibold text-3xl mb-8">
          Lab super hiper mega importante
        </h1>

        {isSignInForm ? (
          <Card className="w-96 max-w-2xl">
            <CardHeader>
              <CardTitle className="text-center">Entrar</CardTitle>

              <CardAction>
                <Button variant="ghost">
                  <ScanFace className="size-6" />
                </Button>
              </CardAction>
            </CardHeader>

            <CardContent>
              <form>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>

                    <Input
                      id="email"
                      type="email"
                      placeholder="email@exemplo.com"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Senha</Label>
                    </div>

                    <Input id="password" type="password" required />
                  </div>
                </div>
              </form>
            </CardContent>

            <CardFooter className="flex-col gap-2">
              <Button type="submit" className="w-full cursor-pointer">
                Entrar
              </Button>

              <div className="flex flex-1 items-center">
                <p className="text-gray-500">Não tem conta ainda ? </p>

                <Button
                  className="cursor-pointer"
                  variant="link"
                  onClick={() => setIsSignInForm(false)}
                >
                  Cadastre-se
                </Button>
              </div>
            </CardFooter>
          </Card>
        ) : (
          <Card className="w-96 max-w-2xl">
            <CardHeader>
              <CardTitle>Crie sua conta</CardTitle>

              <CardAction>
                <Button
                  className="cursor-pointer"
                  variant="link"
                  onClick={onGoToSignIn}
                >
                  Entrar
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent>
              <form>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>

                    <Input
                      id="email"
                      type="email"
                      placeholder="email@exemplo.com"
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Senha</Label>
                    </div>

                    <Input id="password" type="password" required />
                  </div>
                </div>
              </form>
            </CardContent>

            <CardFooter className="flex-col gap-2">
              <Button type="submit" className="w-full cursor-pointer">
                Cadastrar
              </Button>
            </CardFooter>
          </Card>
        )}
      </PageContent>
    </PageLayout>
  );
};
