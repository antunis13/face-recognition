"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { reconhecerRosto as enviarReconhecimento } from "@/lib/api";
import { ReconhecimentoFacialUi } from "./ui/reconhecimento-facial-ui";

interface ReconhecimentoFacialProps {
  token: string;
  onVoltar: () => void;
}

export function ReconhecimentoFacialScreen({
  token,
  onVoltar,
}: ReconhecimentoFacialProps) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraAtiva, setCameraAtiva] = useState(false);

  function pararCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraAtiva(false);
  }

  const reconhecimento = useMutation({
    mutationFn: async () => {
      const video = videoRef.current;

      if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
        throw new Error("Abra a câmera para continuar.");
      }

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const contexto = canvas.getContext("2d");

      if (!contexto) {
        throw new Error("Não foi possível capturar a imagem.");
      }

      contexto.drawImage(video, 0, 0, canvas.width, canvas.height);

      const foto = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Não foi possível gerar a foto."));
            }
          },
          "image/jpeg",
          0.9,
        );
      });

      return enviarReconhecimento(token, foto);
    },
    onSuccess: (resultado) => {
      pararCamera();
      sessionStorage.setItem("employeeToken", resultado.token);
      sessionStorage.setItem("nivelAcesso", resultado.nivelAcesso);
      router.push("/dashboard");
    },
  });

  const camera = useMutation({
    mutationFn: async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      return stream;
    },
    onSuccess: () => {
      setCameraAtiva(true);
    },
  });

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const error = reconhecimento.error?.message ?? camera.error?.message;
  const loading = reconhecimento.isPending || camera.isPending;
  const success = reconhecimento.isSuccess
    ? "Rosto reconhecido! Acesso autorizado."
    : undefined;

  return (
    <ReconhecimentoFacialUi
      videoRef={videoRef}
      cameraAtiva={cameraAtiva}
      error={error}
      loading={loading}
      success={success}
      onAbrirCamera={() => {
        reconhecimento.reset();
        camera.mutate();
      }}
      onReconhecer={() => {
        camera.reset();
        reconhecimento.mutate();
      }}
      onPararCamera={pararCamera}
      onVoltar={() => {
        pararCamera();
        onVoltar();
      }}
    />
  );
};
