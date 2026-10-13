"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { RecordCardFormProps } from "@/app/components/record-card";

interface PatientRecordDialogProps {
  patient: RecordCardFormProps;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PatientRecordDialog = ({
  patient,
  open,
  onOpenChange,
}: PatientRecordDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{patient.name ?? "Prontuário médico"}</DialogTitle>

          <DialogDescription>
            Dados do prontuário do paciente.
          </DialogDescription>
        </DialogHeader>

        <div>
          <div className="flex flex-row gap-1">
            <p className="text-md font-semibold">Nome: </p>

            <p>{patient.name}</p>
          </div>

          {patient.birthDate ? (
            <div className="flex flex-row gap-1">
              <div className="flex flex-row gap-1 mr-2">
                <p className="text-md font-semibold">Data de nascimento: </p>

                <p>{patient.birthDate}</p>
              </div>

              <div className=" flex flex-row gap-1">
                <p className="text-md font-semibold">Sexo: </p>

                <p>{patient.gender}</p>
              </div>
            </div>
          ) : (
            <div className=" flex flex-row flex-1">
              <p className="text-md font-semibold">Sexo: </p>

              <p>{patient.gender}</p>
            </div>
          )}

          <div className="flex flex-row gap-1">
            <p className="text-md font-semibold">CPF: </p>

            <p>{patient.cpf}</p>
          </div>
        </div>

        <h1 className="mt-2 text-xl font-semibold">Histórico clínico</h1>

        <div>
          <p className="text-md font-semibold">Sintomas: </p>

          <p>
            {patient.clinicalHistory?.symptoms || "Nenhum sintoma registrado"}
          </p>
        </div>

        <div>
          <p className="text-md font-semibold">Doenças anteriores: </p>

          <p>
            {patient.clinicalHistory?.previousDiseases ||
              "Nenhuma doença anterior registrada"}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
