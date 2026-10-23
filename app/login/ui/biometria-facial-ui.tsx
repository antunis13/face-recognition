import { ChangeEvent, RefObject } from "react";
import Image from "next/image";
import { PageContent, PageLayout } from "@/app/components/ui/page-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { ScanFace, Camera, ImagePlus, ArrowLeft } from "lucide-react";

interface BiometriaFacialUiProps {
  cameraAberta: boolean;
  imagem: string | null;
  foto: File | null;
  videoRef: RefObject<HTMLVideoElement | null>;
  arquivoRef: RefObject<HTMLInputElement | null>;
  error?: string;
  loading?: boolean;
  success?: string;
  onAlternarCamera(): void;
  onSelecionarArquivo(event: ChangeEvent<HTMLInputElement>): void;
  onCapturarFoto(): void;
  onConfirmar(): void;
  onVoltar(): void;
}

export const BiometriaFacialUi = ({
  cameraAberta,
  imagem,
  foto,
  videoRef,
  arquivoRef,
  error,
  loading,
  success,
  onAlternarCamera,
  onSelecionarArquivo,
  onCapturarFoto,
  onConfirmar,
  onVoltar,
}: BiometriaFacialUiProps) => {
  return (
    <PageLayout className="h-full">
      <PageContent className="flex flex-col h-full items-center justify-center">
        <h1 className="font-semibold text-3xl mb-8 text-center">
          Saint Paul Institute
        </h1>

        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">
              Agora cadastre sua biometria facial
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            <p className="text-sm text-gray-500 text-center">
              Escolha como deseja fornecer sua imagem facial.
            </p>

            <div className="flex flex-col gap-3">
              <Button
                type="button"
                className="w-full"
                onClick={onAlternarCamera}
                disabled={loading}
              >
                <Camera className="mr-2 size-5" />
                {cameraAberta ? "Fechar câmera" : "Abrir câmera"}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => arquivoRef.current?.click()}
                disabled={loading}
              >
                <ImagePlus className="mr-2 size-5" />
                Selecionar arquivo
              </Button>

              <input
                ref={arquivoRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onSelecionarArquivo}
              />
            </div>

            {cameraAberta && (
              <div className="flex flex-col gap-3">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full rounded-lg"
                />

                <Button type="button" onClick={onCapturarFoto} disabled={loading}>
                  <ScanFace className="mr-2 size-5" />
                  Capturar foto
                </Button>
              </div>
            )}

            {imagem && (
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-center">
                  Imagem selecionada
                </p>

                <Image
                  src={imagem}
                  alt="Pré-visualização da biometria facial"
                  width={640}
                  height={480}
                  unoptimized
                  className="h-auto w-full max-h-64 object-contain rounded-lg"
                />
              </div>
            )}

            {loading && (
              <div className="flex justify-center">
                <Spinner />
              </div>
            )}

            {error && (
              <p
                role="alert"
                className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700"
              >
                {error}
              </p>
            )}

            {success && (
              <p
                role="status"
                className="rounded-md border border-green-300 bg-green-50 p-3 text-sm text-green-700"
              >
                {success}
              </p>
            )}

            <Button
              type="button"
              className="w-full"
              onClick={onConfirmar}
              disabled={!foto || loading || !!success}
            >
              Confirmar cadastro
            </Button>
          </CardContent>

          <CardFooter>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={onVoltar}
              disabled={loading}
            >
              <ArrowLeft className="mr-2 size-4" />
              Voltar para login
            </Button>
          </CardFooter>
        </Card>
      </PageContent>
    </PageLayout>
  );
};
