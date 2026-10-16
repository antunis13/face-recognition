"use client";

import { useState } from "react";
import { MedicinesUi } from "./ui/medicines-ui";
import { MedicineFormProps } from "@/app/components/medicines-card";

const medicines: MedicineFormProps[] = [
  { name: "Dipirona", indication: "Dor e febre" },
  { name: "Paracetamol", indication: "Dor e febre" },
  { name: "Ibuprofeno", indication: "Dor, febre e inflamação" },
  { name: "Amoxicilina", indication: "Infecções bacterianas" },
  { name: "Losartana", indication: "Hipertensão arterial" },
  { name: "Omeprazol", indication: "Azia e refluxo" },
  { name: "Loratadina", indication: "Alergia e rinite" },
  { name: "Metformina", indication: "Diabetes tipo 2" },
  { name: "Sinvastatina", indication: "Colesterol alto" },
  { name: "Captopril", indication: "Hipertensão e insuficiência cardíaca" },
];

export const MedicinesScreen = () => {
  const [medicineList, setMedicineList] =
    useState<MedicineFormProps[]>(medicines);

  const handleOnTakeMedicine = (name: string) => {
    const newMedicineArray = medicineList.filter(
      (medicine) => medicine.name !== name
    );

    setMedicineList(newMedicineArray);
  };

  return (
    <MedicinesUi medicines={medicineList} onClick={handleOnTakeMedicine} />
  );
};
