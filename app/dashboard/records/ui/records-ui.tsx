import {
  RecordCard,
  type RecordCardFormProps,
} from "@/app/components/record-card";
import {
  PageContent,
  PageHeader,
  PageLayout,
} from "@/app/components/ui/page-layout";

interface RecordsUiProps {
  patients: RecordCardFormProps[];
}

export const RecordsUi = ({ patients }: RecordsUiProps) => {
  return (
    <PageLayout>
      <PageHeader title="Prontuário de pacientes" />

      <PageContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {patients.map((patient) => (
            <RecordCard key={patient.cpf} {...patient} />
          ))}
        </div>
      </PageContent>
    </PageLayout>
  );
};
