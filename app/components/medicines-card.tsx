"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import DefaultMedicineImage from "./images/medicines.jpg";

export interface MedicineFormProps {
  name: string;
  indication: string;
}

export interface MedicineProps extends MedicineFormProps {
  onClick(name: string): void;
}

export const MedicinesCard = ({
  name,
  indication,

  onClick,
}: MedicineProps) => {
  return (
    <Card className="w-full min-w-0">
      <CardContent className="flex flex-row gap-2">
        <div className="flex min-w-0 flex-1 items-center rounded-lg">
          <Image
            src={DefaultMedicineImage}
            alt="Imagem do usuario"
            width={300}
            height={300}
            className="h-auto w-full object-contain rounded-lg"
          />
        </div>

        <div className="flex-1">
          {name && (
            <p className="text-sm">
              <span className="font-semibold">Nome do remédio:</span> {name}
            </p>
          )}

          {indication && (
            <p className="text-sm">
              <span className="font-semibold">Indicação:</span> {indication}
            </p>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-center">
        <Button className="cursor-pointer" onClick={() => onClick(name)}>
          Retirar
        </Button>
      </CardFooter>
    </Card>
  );
};
