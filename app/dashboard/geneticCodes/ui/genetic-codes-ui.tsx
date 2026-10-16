import type { Dispatch, SetStateAction } from "react";
import {
  PageContent,
  PageHeader,
  PageLayout,
} from "@/app/components/ui/page-layout";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type GeneticCodeRisk = "baixa" | "moderada" | "alta" | "extrema";

export interface GeneticCodesList {
  code: string;
  risk: GeneticCodeRisk;
  description: string;
  transmissibilityRate: string;
  incubationPeriod: string;
  mortalityRate: string;
  geneticSequence: string;
}

interface GeneticCodesUiProps {
  geneticCodes: GeneticCodesList[];
  selectedGeneticCode?: GeneticCodesList;
  setSelectedGeneticCode(geneticCode: GeneticCodesList): void;
  isGeneticCodeModalOpen: boolean;
  setIsGeneticCodeModalOpen(value: boolean): void;
}

export const GeneticCodesUi = ({
  geneticCodes,
  selectedGeneticCode,
  setSelectedGeneticCode,
  isGeneticCodeModalOpen,
  setIsGeneticCodeModalOpen,
}: GeneticCodesUiProps) => {
  return (
    <>
      <PageLayout>
        <PageHeader title="Códigos genéticos" />

        <PageContent>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Periculosidade</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {geneticCodes.map((geneticCode) => (
                  <TableRow
                    key={geneticCode.code}
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedGeneticCode(geneticCode);
                      setIsGeneticCodeModalOpen(true);
                    }}
                  >
                    <TableCell>{geneticCode.code}</TableCell>
                    <TableCell className="capitalize">
                      {geneticCode.risk}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </PageContent>
      </PageLayout>

      <Dialog
        open={isGeneticCodeModalOpen}
        onOpenChange={setIsGeneticCodeModalOpen}
      >
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              Perfil genético: {selectedGeneticCode?.code}
            </DialogTitle>
            <DialogDescription>
              {selectedGeneticCode?.description}
            </DialogDescription>
          </DialogHeader>

          {selectedGeneticCode && (
            <div className="flex flex-col gap-2">
              <div>
                <p className="font-semibold">Taxa de transmissibilidade:</p>
                <p>{selectedGeneticCode.transmissibilityRate}</p>
              </div>

              <div>
                <p className="font-semibold">Período de incubação:</p>
                <p>{selectedGeneticCode.incubationPeriod}</p>
              </div>

              <div>
                <p className="font-semibold">Taxa de mortalidade:</p>
                <p>{selectedGeneticCode.mortalityRate}</p>
              </div>

              <div>
                <p className="font-semibold">Sequência genética:</p>
                <p className="break-all font-mono text-xs">
                  {selectedGeneticCode.geneticSequence}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
