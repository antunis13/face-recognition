import { RefObject } from "react";
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
  ScanFace,
  ShieldCheck,
} from "lucide-react";

interface ReconhecimentoFacialUiProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  cameraAtiva: boolean;
  error?: string;
  loading?: boolean;
  success?: string;
  onAbrirCamera(): void;
  onReconhecer(): void;
  onPararCamera(): void;
  onVoltar(): void;
}

export const ReconhecimentoFacialUi = ({
  videoRef,
  cameraAtiva,
  error,
  loading,
  success,
  onAbrirCamera,
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
                Confirme sua identidade para acessar o sistema usando a câmera.
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

                {!cameraAtiva && (
                  <div className="flex flex-col items-center gap-3 p-6 text-center text-muted-foreground">
                    <ScanFace className="size-12" />
                    <p>Abra a câmera para continuar.</p>
                  </div>
                )}
              </div>

              <p className="text-center text-sm text-muted-foreground">
                Procure um local iluminado e mantenha o rosto visível.
              </p>

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

              {loading && (
                <div className="flex justify-center">
                  <Spinner />
                </div>
              )}

              {error && (
                <p
                  role="alert"
                  className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
                >
                  {error}
                </p>
              )}

              {success && (
                <div
                  role="status"
                  className="flex items-center gap-2 rounded-lg border border-green-600/30 bg-green-600/10 p-3 text-sm text-green-800 dark:text-green-300"
                >
                  <CheckCircle2 className="size-5 shrink-0" />
                  {success}
                </div>
              )}

              <Button
                type="button"
                onClick={onReconhecer}
                disabled={loading || !cameraAtiva}
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
