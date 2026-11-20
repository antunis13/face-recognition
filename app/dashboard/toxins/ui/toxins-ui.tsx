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

export type ToxinsRisk = "baixa" | "moderada" | "alta" | "extrema";

export interface ToxinsList {
  code: string;
  risk: ToxinsRisk;
  description: string;
  transmissibilityRate: string;
  incubationPeriod: string;
  mortalityRate: string;
  geneticSequence: string;
}

interface ToxinsUiProps {
  toxins: ToxinsList[];
  selectedToxin?: ToxinsList;
  setSelectedToxin(toxin: ToxinsList): void;
  isToxinModalOpen: boolean;
  setIsToxinModalOpen(value: boolean): void;
}

export const ToxinsUi = ({
  toxins,
  selectedToxin,
  setSelectedToxin,
  isToxinModalOpen,
  setIsToxinModalOpen,
}: ToxinsUiProps) => {
  return (
    <>
      <PageLayout>
        <PageHeader title="Toxinas" />

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
                {toxins.map((toxin) => (
                  <TableRow
                    key={toxin.code}
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedToxin(toxin);
                      setIsToxinModalOpen(true);
                    }}
                  >
                    <TableCell>{toxin.code}</TableCell>
                    <TableCell className="capitalize">{toxin.risk}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </PageContent>
      </PageLayout>

      <Dialog
        open={isToxinModalOpen}
        onOpenChange={setIsToxinModalOpen}
      >
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              Toxina: {selectedToxin?.code}
            </DialogTitle>
            <DialogDescription>
              {selectedToxin?.description}
            </DialogDescription>
          </DialogHeader>

          {selectedToxin && (
            <div className="flex flex-col gap-2">
              <div>
                <p className="font-semibold">Taxa de transmissibilidade:</p>
                <p>{selectedToxin.transmissibilityRate}</p>
              </div>

              <div>
                <p className="font-semibold">Período de incubação:</p>
                <p>{selectedToxin.incubationPeriod}</p>
              </div>

              <div>
                <p className="font-semibold">Taxa de mortalidade:</p>
                <p>{selectedToxin.mortalityRate}</p>
              </div>

              <div>
                <p className="font-semibold">Sequência genética:</p>
                <p className="break-all font-mono text-xs">
                  {selectedToxin.geneticSequence}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
