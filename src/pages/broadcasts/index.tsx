import { useBroadcastPublicListQuery } from "@/common/queries/broadcast.query";
import { PaginationCustom } from "@/components/custom/pagination-custom";
import { PageContainer, PageHeader } from "@/components/layout/site-header";

import { listItems } from "@/lib/mock/store";
import { ISearchBroadcast } from "@/lib/types";
import { BroadcastStatusEnum } from "@/utils/enums";
import { useState } from "react";
import { BroadcastCard } from "./components/broadcast-card";
import { FeaturedBroadcastCard } from "./components/featured-broadcast-card";

export default function BroadcastsPage() {
  const [filters, setFilters] = useState<ISearchBroadcast>({
    page: 1,
    per_page: 20,
    filter: {
      status: BroadcastStatusEnum.PAST,
    },
  });
  const { data: live, isLoading: isLoadingLive } = useBroadcastPublicListQuery({
    page: 1,
    per_page: 1,
    filter: {
      status: BroadcastStatusEnum.LIVE,
    },
  });
  const { data: upcomingResponse, isLoading: isLoadingUpcoming } = useBroadcastPublicListQuery({
    page: 1,
    per_page: 1,
    filter: {
      status: BroadcastStatusEnum.UPCOMING,
    },
  });

  const { data: pastResponse, isLoading: isLoadingPast } = useBroadcastPublicListQuery(filters);

  const isLoading = isLoadingLive || isLoadingUpcoming || isLoadingPast;

  const upcoming = upcomingResponse?.items ?? [];
  const past = pastResponse?.items ?? [];
  const featured = live?.items[0] ?? upcoming[0] ?? past[0];

  return (
    <div>
      <PageHeader
        eyebrow="Ao Vivo"
        title="Transmissões da Paróquia"
        description="Acompanhe missas, novenas e celebrações da comunidade."
      />

      <PageContainer>
        {featured && <FeaturedBroadcastCard broadcast={featured} />}

        {upcoming.length > 0 && <BroadcastSection title="Próximas transmissões" items={upcoming} />}

        {past.length > 0 && (
          <>
            <BroadcastSection title="Histórico" items={past} />
            {pastResponse && (
              <PaginationCustom
                currentPage={pastResponse.currentPage}
                totalPages={pastResponse.totalPages}
                onChange={(page) =>
                  setFilters((prev) => ({
                    ...prev,
                    page,
                  }))
                }
              />
            )}
          </>
        )}
      </PageContainer>
    </div>
  );
}

function BroadcastSection({
  title,
  items,
}: {
  title: string;
  items: ReturnType<typeof listItems<"broadcasts">>;
}) {
  return (
    <section className="mt-14">
      <h2 className="border-b border-gold/40 pb-3 font-serif text-2xl text-primary">{title}</h2>
      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((b) => {
          return <BroadcastCard key={b.id} broadcast={b} />;
        })}
      </div>
    </section>
  );
}
