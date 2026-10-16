import {
  MedicineFormProps,
  MedicinesCard,
} from "@/app/components/medicines-card";
import {
  PageContent,
  PageHeader,
  PageLayout,
} from "@/app/components/ui/page-layout";

interface MedicinesUiProps {
  medicines: MedicineFormProps[];
  onClick(name: string): void;
}

export const MedicinesUi = ({ medicines, onClick }: MedicinesUiProps) => {
  return (
    <PageLayout>
      <PageHeader title="Medicamentos" />

      <PageContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {medicines.map((medicine) => (
            <MedicinesCard
              key={medicine.name}
              name={medicine.name}
              indication={medicine.indication}
              onClick={onClick}
            />
          ))}
        </div>
      </PageContent>
    </PageLayout>
  );
};
