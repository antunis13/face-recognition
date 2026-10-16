"use client";

import { useState } from "react";
import { GeneticCodesUi, type GeneticCodesList } from "./ui/genetic-codes-ui";

const geneticCodes: GeneticCodesList[] = [
  {
    code: "GC-1042",
    risk: "baixa",
    description: "Marcador associado a uma resposta inflamatória leve.",
    transmissibilityRate: "8%",
    incubationPeriod: "2 dias",
    mortalityRate: "0,1%",
    geneticSequence: "ATGCCGTAACTGACCTTG",
  },
  {
    code: "GC-2187",
    risk: "moderada",
    description: "Variante ligada a sintomas respiratórios moderados.",
    transmissibilityRate: "24%",
    incubationPeriod: "4 dias",
    mortalityRate: "1,2%",
    geneticSequence: "GCTTAGCGAATCCCGTAA",
  },
  {
    code: "GC-3301",
    risk: "alta",
    description: "Perfil associado a complicação sistêmica rápida.",
    transmissibilityRate: "46%",
    incubationPeriod: "3 dias",
    mortalityRate: "7,5%",
    geneticSequence: "TTACGGATCCTGAACTGC",
  },
  {
    code: "GC-4419",
    risk: "extrema",
    description: "Código de alerta máximo no catálogo interno.",
    transmissibilityRate: "71%",
    incubationPeriod: "1 dia",
    mortalityRate: "28%",
    geneticSequence: "CCGTAATGCTAGGACTTA",
  },
  {
    code: "GC-5520",
    risk: "baixa",
    description: "Alteração estável, sem sinal de progressão.",
    transmissibilityRate: "5%",
    incubationPeriod: "6 dias",
    mortalityRate: "0,05%",
    geneticSequence: "AAGCTTGCATGCCGATTA",
  },
  {
    code: "GC-6634",
    risk: "moderada",
    description: "Padrão observado em quadros febris recorrentes.",
    transmissibilityRate: "19%",
    incubationPeriod: "5 dias",
    mortalityRate: "2,1%",
    geneticSequence: "TGCAACCGTTAGGCTATG",
  },
  {
    code: "GC-7748",
    risk: "alta",
    description: "Sequência de acompanhamento com risco elevado.",
    transmissibilityRate: "38%",
    incubationPeriod: "2 dias",
    mortalityRate: "9,4%",
    geneticSequence: "GGATCCCGTATGCAACTT",
  },
  {
    code: "GC-8851",
    risk: "extrema",
    description: "Registro prioritário para isolamento do catálogo.",
    transmissibilityRate: "64%",
    incubationPeriod: "12 horas",
    mortalityRate: "33%",
    geneticSequence: "CTAGGATCCGAATGCCAT",
  },
  {
    code: "GC-9066",
    risk: "baixa",
    description: "Variante comum, com evolução lenta.",
    transmissibilityRate: "11%",
    incubationPeriod: "7 dias",
    mortalityRate: "0,3%",
    geneticSequence: "ATGCCTAGGTTCAAGCCG",
  },
  {
    code: "GC-0173",
    risk: "moderada",
    description: "Código intermediário, com transmissão ocasional.",
    transmissibilityRate: "27%",
    incubationPeriod: "4 dias",
    mortalityRate: "1,8%",
    geneticSequence: "CGTATGCCAAGTTGACCT",
  },
];

export const GeneticCodes = () => {
  const [isGeneticCodeModalOpen, setIsGeneticCodeModalOpen] = useState(false);
  const [selectedGeneticCode, setSelectedGeneticCode] =
    useState<GeneticCodesList>();

  return (
    <GeneticCodesUi
      geneticCodes={geneticCodes}
      selectedGeneticCode={selectedGeneticCode}
      setSelectedGeneticCode={setSelectedGeneticCode}
      isGeneticCodeModalOpen={isGeneticCodeModalOpen}
      setIsGeneticCodeModalOpen={setIsGeneticCodeModalOpen}
    />
  );
};
