import { RefObject } from "react";
import Image from "next/image";
import { PageContent, PageLayout } from "@/app/components/ui/page-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  ImagePlus,
  ScanFace,
  ShieldCheck,
} from "lucide-react";

interface ReconhecimentoFacialUiProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  cameraAtiva: boolean;
  previewFoto: string;
  fotoSelecionada: File | null;
  error?: string;
  loading?: boolean;
  success?: string;
  onAbrirCamera(): void;
  onSelecionarFoto(arquivo: File | null): void;
  onRemoverFoto(): void;
  onReconhecer(): void;
  onPararCamera(): void;
  onVoltar(): void;
}

export const ReconhecimentoFacialUi = ({
  videoRef,
  cameraAtiva,
  previewFoto,
  fotoSelecionada,
  error,
  loading,
  success,
  onAbrirCamera,
  onSelecionarFoto,
  onRemoverFoto,
  onReconhecer,
  onPararCamera,
  onVoltar,
}: ReconhecimentoFacialUiProps) => {
  return (
    <PageLayout>
      <PageContent>
        <div className="flex min-h-[80vh] items-center justify-center px-4 py-8">
          <Card className="w-full max-w-lg">
            <CardHeader className="items-center text-center">
              <div className="mb-2 flex size-16 items-center justify-center rounded-full bg-primary/10">
                <ScanFace className="size-9 text-primary" />
              </div>

              <CardTitle className="text-2xl">Reconhecimento facial</CardTitle>

              <CardDescription>
                Confirme sua identidade para acessar o sistema. Você pode usar
                a câmera ou selecionar uma foto para teste.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl border bg-muted">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`size-full object-cover ${
                    cameraAtiva ? "" : "hidden"
                  }`}
                />

                {!cameraAtiva && !previewFoto && (
                  <div className="flex flex-col items-center gap-3 p-6 text-center text-muted-foreground">
                    <ScanFace className="size-12" />
                    <p>Nenhuma imagem selecionada.</p>
                  </div>
                )}

                {previewFoto && (
                  <Image
                    src={previewFoto}
                    alt="Foto selecionada para teste"
                    fill
                    unoptimized
                    sizes="(max-width: 512px) 100vw, 512px"
                    className="object-contain"
                  />
                )}
              </div>

              <p className="text-center text-sm text-muted-foreground">
                Procure um local iluminado e mantenha o rosto visível.
              </p>

              <div className="space-y-2">
                <Button
                  type="button"
                  onClick={onAbrirCamera}
                  disabled={loading || cameraAtiva}
                  variant="outline"
                  className="w-full"
                >
                  <Camera className="mr-2 size-4" />
                  Abrir câmera
                </Button>

                <label
                  htmlFor="foto-teste"
                  className={`flex w-full cursor-pointer items-center justify-center rounded-md border border-input bg-background px-4 py-3 text-sm font-medium transition-colors hover:bg-accent ${
                    loading ? "pointer-events-none opacity-50" : ""
                  }`}
                >
                  <ImagePlus className="mr-2 size-4" />
                  Selecionar foto do computador
                </label>

                <input
                  id="foto-teste"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={loading}
                  onChange={(evento) => {
                    onSelecionarFoto(evento.target.files?.[0] ?? null);
                    evento.target.value = "";
                  }}
                />

                {fotoSelecionada && (
                  <div className="space-y-2">
                    <p className="text-center text-sm text-muted-foreground">
                      Foto selecionada: {fotoSelecionada.name}
                    </p>

                    <Button
                      type="button"
                      variant="ghost"
                      onClick={onRemoverFoto}
                      disabled={loading}
                      className="w-full"
                    >
                      Remover foto selecionada
                    </Button>
                  </div>
                )}
              </div>

              {loading && (
                <div className="flex justify-center">
                  <Spinner />
                </div>
              )}

              {error && (
                <p
                  role="alert"
                  className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700"
                >
                  {error}
                </p>
              )}

              {success && (
                <div
                  role="status"
                  className="flex items-center gap-2 rounded-lg border border-green-300 bg-green-50 p-3 text-sm text-green-700"
                >
                  <CheckCircle2 className="size-5 shrink-0" />
                  {success}
                </div>
              )}

              <Button
                type="button"
                onClick={onReconhecer}
                disabled={loading || (!cameraAtiva && !fotoSelecionada)}
                className="w-full"
              >
                <ShieldCheck className="mr-2 size-4" />
                Reconhecer meu rosto
              </Button>

              {cameraAtiva && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onPararCamera}
                  disabled={loading}
                  className="w-full"
                >
                  Desligar câmera
                </Button>
              )}

              <Button
                type="button"
                variant="ghost"
                onClick={onVoltar}
                disabled={loading}
                className="w-full"
              >
                <ArrowLeft className="mr-2 size-4" />
                Voltar para login
              </Button>
            </CardContent>
          </Card>
        </div>
      </PageContent>
    </PageLayout>
  );
};
