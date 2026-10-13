"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import DefaultUserImage from "./images/userImage.jpg";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PatientRecordDialog } from "@/app/components/patient-record-dialog";

export interface ClinicalHistory {
  symptoms?: string;
  previousDiseases?: string;
}

export interface RecordCardFormProps {
  name?: string;
  cpf?: string;
  gender?: string;
  birthDate?: string;
  recordDate?: string;
  image?: string;
  clinicalHistory?: ClinicalHistory;
}

export const RecordCard = ({
  name,
  cpf,
  gender,
  birthDate,
  recordDate,
  image,
  clinicalHistory,
}: RecordCardFormProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card className="w-full min-w-0">
        <CardContent className="flex flex-row gap-2">
          <div className="flex min-w-0 flex-1 items-center rounded-lg">
            <Image
              src={image ?? DefaultUserImage}
              alt="Imagem do usuario"
              width={300}
              height={300}
              className="h-auto w-full object-contain rounded-lg"
            />
          </div>

          <div className="flex-1">
            {name && (
              <p className="text-sm">
                <span className="font-semibold">Paciente:</span> {name}
              </p>
            )}

            {cpf && (
              <p className="text-sm">
                <span className="font-semibold">CPF:</span> {cpf}
              </p>
            )}

            {gender && (
              <p className="text-sm">
                <span className="font-semibold">Sexo:</span> {gender}
              </p>
            )}

            {recordDate && (
              <div>
                <p className="text-sm font-semibold">Data do Registro:</p>
                <p className="text-sm">{recordDate}</p>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-center">
          <Button className="cursor-pointer" onClick={() => setOpen(true)}>
            Abrir prontuário
          </Button>
        </CardFooter>
      </Card>

      <PatientRecordDialog
        patient={{
          name,
          cpf,
          gender,
          birthDate,
          recordDate,
          image,
          clinicalHistory,
        }}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
};
