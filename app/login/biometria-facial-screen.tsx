"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { cadastrarBiometria } from "@/lib/api";
import { BiometriaFacialUi } from "./ui/biometria-facial-ui";

interface BiometriaFacialProps {
  usuario: string;
  senha: string;
  onVoltar(): void;
}

export const BiometriaFacialScreen = ({
  usuario,
  senha,
  onVoltar,
}: BiometriaFacialProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const arquivoRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraAberta, setCameraAberta] = useState(false);
  const [imagem, setImagem] = useState<string | null>(null);
  const [foto, setFoto] = useState<File | null>(null);

  function fecharCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraAberta(false);
  }

  const cadastro = useMutation({
    mutationFn: () => {
      if (!foto) {
        throw new Error(
          "Tire uma foto ou selecione uma imagem antes de continuar.",
        );
      }

      return cadastrarBiometria({ usuario, senha, foto });
    },
  });

  const camera = useMutation({
    mutationFn: async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("A câmera não está disponível neste navegador.");
      }

      return navigator.mediaDevices.getUserMedia({ video: true });
    },
    onSuccess: (stream) => {
      streamRef.current = stream;
      setCameraAberta(true);
    },
  });

  const arquivo = useMutation({
    mutationFn: async (selecionado: File) => {
      if (!selecionado.type.startsWith("image/")) {
        throw new Error("Selecione um arquivo de imagem válido.");
      }

      return selecionado;
    },
    onSuccess: (selecionado) => {
      fecharCamera();
      setFoto(selecionado);
      setImagem(URL.createObjectURL(selecionado));
      cadastro.reset();
    },
  });

  const captura = useMutation({
    mutationFn: async () => {
      const video = videoRef.current;

      if (!video || !video.videoWidth || !video.videoHeight) {
        throw new Error("Aguarde a câmera carregar antes de tirar a foto.");
      }

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const contexto = canvas.getContext("2d");

      if (!contexto) {
        throw new Error("Não foi possível capturar a imagem.");
      }

      contexto.drawImage(video, 0, 0);

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, "image/jpeg");
      });

      if (!blob) {
        throw new Error("Não foi possível preparar a foto.");
      }

      return new File([blob], "biometria.jpg", { type: "image/jpeg" });
    },
    onSuccess: (arquivoCapturado) => {
      setFoto(arquivoCapturado);
      setImagem(URL.createObjectURL(arquivoCapturado));
      fecharCamera();
      cadastro.reset();
    },
  });

  useEffect(() => {
    if (cameraAberta && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [cameraAberta]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);








  


  return (
    <BiometriaFacialUi
      cameraAberta={cameraAberta}
      imagem={imagem}
      foto={foto}
      videoRef={videoRef}
      arquivoRef={arquivoRef}
      error={    cadastro.error?.message || 
        camera.error?.message || 
        arquivo.error?.message || 
        captura.error?.message}
      loading={    cadastro.isPending ||
        camera.isPending ||
        arquivo.isPending ||
        captura.isPending}
      success={cadastro.isSuccess
        ? "Cadastro realizado com sucesso! Aguarde o administrador atribuir seu nível de acesso."
        : undefined}
      onAlternarCamera={() => {
        if (cameraAberta) {
          fecharCamera();
          return;
        }

        cadastro.reset();
        arquivo.reset();
        captura.reset();
        camera.mutate();
      }}
      onSelecionarArquivo={(event) => {
        const selecionado = event.target.files?.[0];
        event.target.value = "";

        if (!selecionado) return;

        camera.reset();
        captura.reset();
        arquivo.mutate(selecionado);
      }}
      onCapturarFoto={() => {
        camera.reset();
        arquivo.reset();
        captura.mutate();
      }}
      onConfirmar={() => {
        camera.reset();
        arquivo.reset();
        captura.reset();
        cadastro.mutate();
      }}
      onVoltar={onVoltar}
    />
  );
};
