import { Icon } from '@/components/shared/icon';
import { SkeletonCard } from '@/components/skeleton-card';
import { Skeleton } from '@/components/ui/skeleton';

const loading = () => {
  return (
    <div className="flex size-full w-full gap-8 px-4 pt-8 lg:px-12">
      {/* SKELETON: side filters */}
      <div className="hidden xl:block">
        <div className="h-full space-y-8">
          <div className="mb-4 space-y-4">
            <h2 className="text-lg font-bold">Oblasť</h2>
            <Skeleton className="h-10 w-[276px]" />
          </div>
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Extra služby</h2>
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>

      <div className="w-full space-y-4">
        <div className="sticky top-0 z-10 flex w-full items-center justify-center gap-4 bg-white bg-opacity-75 py-4 backdrop-blur-sm transition-all md:p-0 xl:relative xl:justify-start xl:bg-none xl:backdrop-blur-none">
          <Skeleton className="h-[46px] w-full rounded-md lg:max-w-[400px]" />
          <div className="block xl:hidden">
            <div className="flex size-10 items-center justify-center rounded-full bg-slate-100">
              <Icon icon="Filter" className="size-5 fill-black" />
            </div>
          </div>
        </div>

        <div className="grid w-full grid-cols-1 place-items-center gap-8 py-8 lg:grid-cols-2 lg:place-items-start 2xl:grid-cols-3">
          {Array.from(Array(9).keys()).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default loading;
