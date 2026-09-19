import { ListLayout } from "@/components/layout/ListLayout";
import { DealsTable } from "@/components/deals/DealsTable";
import { DealsUpsell } from "@/components/deals/DealsUpsell";

export const metadata = {
  title: "Deals",
  description:
    "See deal momentum instantly — centralize every signal from your calls and forecast with confidence.",
};

export default function Page() {
  return (
    <ListLayout>
      {/* The upsell is absolutely positioned over the pipeline, so the table
          stays visible behind it rather than being swapped out. */}
      <div className="relative">
        <DealsTable />
        <DealsUpsell />
      </div>
    </ListLayout>
  );
}
