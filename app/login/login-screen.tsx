
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { entrar } from "@/lib/api";
import { LoginUi } from "./ui/login-ui";
import { BiometriaFacialScreen } from "./biometria-facial-screen";
import { ReconhecimentoFacialScreen } from "./reconhecimento-facial-login";

export const LoginScreen = () => {
  const router = useRouter();

  const [isSignInForm, setIsSignInForm] = useState(true);
  const [cadastrandoBiometria, setCadastrandoBiometria] = useState(false);
  const [reconhecendoRosto, setReconhecendoRosto] = useState(false);

  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [tokenFuncionario, setTokenFuncionario] = useState("");

  const login = useMutation({
    mutationFn: ({
      nomeUsuario,
      senhaUsuario,
    }: {
      nomeUsuario: string;
      senhaUsuario: string;
    }) => {
      return entrar(nomeUsuario, senhaUsuario);
    },
    onSuccess: (resultado) => {
      if (resultado.tipo === "admin") {
        sessionStorage.setItem("adminToken", resultado.token);
        router.push("/admin");
        return;
      }

      sessionStorage.removeItem("employeeToken");
      sessionStorage.removeItem("nivelAcesso");
      setTokenFuncionario(resultado.token);
      setReconhecendoRosto(true);
    },
  });

  if (cadastrandoBiometria) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <BiometriaFacialScreen
          usuario={usuario}
          senha={senha}
          onVoltar={() => setCadastrandoBiometria(false)}
        />
      </div>
    );
  }

  if (reconhecendoRosto) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <ReconhecimentoFacialScreen
          token={tokenFuncionario}
          onVoltar={() => {
            setReconhecendoRosto(false);
            setTokenFuncionario("");
            login.reset();
          }}
        />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <LoginUi
        onGoToSignIn={() => {
          login.reset();
          setIsSignInForm(true);
        }}
        onRegister={(novoUsuario, novaSenha) => {
          setUsuario(novoUsuario);
          setSenha(novaSenha);
          setCadastrandoBiometria(true);
        }}
        onLogin={(nomeUsuario, senhaUsuario) => {
          login.mutate({ nomeUsuario, senhaUsuario });
        }}
        isSignInForm={isSignInForm}
        setIsSignInForm={(value) => {
          login.reset();
          setIsSignInForm(value);
        }}
        error={login.error?.message}
        loading={login.isPending}
      />
    </main>
  );
};
