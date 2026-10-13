import { type RecordCardFormProps } from "@/app/components/record-card";
import { RecordsUi } from "./ui/records-ui";

const patients: RecordCardFormProps[] = [
  {
    name: "Ana Beatriz Souza",
    cpf: "391.284.670-15",
    gender: "Feminino",
    birthDate: "14/06/1995",
    recordDate: "03/02/2024",
    image: "https://i.pravatar.cc/300?img=5",
    clinicalHistory: {
      symptoms: "Dor de cabeça frequente e cansaço ao fim do dia.",
      previousDiseases: "Enxaqueca e rinite alérgica.",
    },
  },
  {
    name: "Carlos Eduardo Lima",
    cpf: "504.517.458-41",
    gender: "Masculino",
    birthDate: "22/11/1988",
    recordDate: "12/04/2007",
    image: "https://i.pravatar.cc/300?img=12",
    clinicalHistory: {
      symptoms: "Tosse seca há duas semanas e falta de ar leve.",
      previousDiseases: "Asma na infância e hipertensão.",
    },
  },
  {
    name: "Mariana Oliveira Costa",
    cpf: "218.903.546-88",
    gender: "Feminino",
    birthDate: "09/03/1992",
    recordDate: "19/08/2021",
    image: "https://i.pravatar.cc/300?img=9",
    clinicalHistory: {
      symptoms: "Dor abdominal e náusea após as refeições.",
      previousDiseases: "Gastrite e anemia.",
    },
  },
  {
    name: "João Pedro Almeida",
    cpf: "672.145.390-22",
    gender: "Masculino",
    birthDate: "18/07/1990",
    recordDate: "27/11/2019",
    image: "https://i.pravatar.cc/300?img=15",
    clinicalHistory: {
      symptoms: "Dor lombar ao permanecer sentado por longos períodos.",
      previousDiseases: "Hérnia de disco e sinusite.",
    },
  },
  {
    name: "Fernanda Rocha Martins",
    cpf: "845.760.123-07",
    gender: "Feminino",
    birthDate: "30/01/1998",
    recordDate: "05/06/2023",
    image: "https://i.pravatar.cc/300?img=20",
    clinicalHistory: {
      symptoms: "Febre baixa e dor de garganta.",
      previousDiseases: "Amigdalite de repetição.",
    },
  },
  {
    name: "Ricardo Nunes Ferreira",
    cpf: "130.458.972-63",
    gender: "Masculino",
    birthDate: "05/09/1984",
    recordDate: "14/01/2016",
    image: "https://i.pravatar.cc/300?img=33",
    clinicalHistory: {
      symptoms: "Dor no peito ao esforço e palpitações.",
      previousDiseases: "Colesterol alto e diabetes tipo 2.",
    },
  },
  {
    name: "Camila Duarte Ribeiro",
    cpf: "956.321.084-50",
    gender: "Feminino",
    birthDate: "11/12/1996",
    recordDate: "22/09/2025",
    image: "https://i.pravatar.cc/300?img=25",
    clinicalHistory: {
      symptoms: "Tontura e visão embaçada esporádica.",
      previousDiseases: "Labirintite.",
    },
  },
  {
    name: "Lucas Henrique Barbosa",
    cpf: "407.892.615-34",
    gender: "Masculino",
    birthDate: "27/05/1993",
    recordDate: "30/03/2018",
    image: "https://i.pravatar.cc/300?img=52",
    clinicalHistory: {
      symptoms: "Dor no joelho direito após atividade física.",
      previousDiseases: "Entorse de tornozelo e tendinite.",
    },
  },
  {
    name: "Patrícia Gomes Azevedo",
    cpf: "763.014.829-91",
    gender: "Feminino",
    birthDate: "02/08/1987",
    recordDate: "08/12/2020",
    image: "https://i.pravatar.cc/300?img=47",
    clinicalHistory: {
      symptoms: "Insônia e ansiedade.",
      previousDiseases: "Hipotireoidismo.",
    },
  },
  {
    name: "Bruno César Teixeira",
    cpf: "289.675.431-76",
    gender: "Masculino",
    birthDate: "19/04/1991",
    recordDate: "16/07/2022",
    image: "https://i.pravatar.cc/300?img=68",
    clinicalHistory: {
      symptoms: "Azia e refluxo noturno.",
      previousDiseases: "Refluxo gastroesofágico.",
    },
  },
];

export const RecordsScreen = () => {
  return <RecordsUi patients={patients} />;
};
