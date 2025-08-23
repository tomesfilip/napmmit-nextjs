import { Icon } from '@/components/shared/icon';
import { DetailSection } from '@/components/ui/detail-section';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

const loading = () => {
  return (
    <div className="flex w-full flex-col items-center gap-10 lg:gap-16 lg:py-20">
      {/* MOBILE GALLERY */}
      <div className="w-full lg:hidden">
        <div className="relative rounded-b-lg">
          <Link
            href="/"
            className="absolute left-4 top-4 z-[2] rounded-full bg-slate-100 p-2"
          >
            <Icon icon="ArrowRight" className="size-6 rotate-180 fill-black" />
          </Link>
        </div>
        <Skeleton className="h-[640px] w-full" />
      </div>

      <DetailSection>
        <div className="w-full max-w-[600px] space-y-6">
          <Skeleton className="h-10 w-4/5 lg:h-12" />
          <div className="space-y-1">
            {Array.from(Array(9).keys()).map((_, index) => (
              <Skeleton key={index} className="h-5 w-full" />
            ))}
          </div>
        </div>

        {/* DETAIL GALLERY */}
        <div className="hidden lg:block">
          <ul className="relative grid flex-1 content-stretch items-stretch rounded-lg sm:max-h-[400px] lg:grid-cols-3 lg:grid-rows-2 lg:gap-4">
            {Array.from(Array(3).keys()).map((_, index) => (
              <li
                key={index}
                className="relative flex size-full items-center justify-center outline-none first:col-span-2 first:row-span-2"
              >
                <Skeleton className="aspect-[4/3] h-full w-full self-stretch" />
              </li>
            ))}
          </ul>
        </div>
      </DetailSection>

      {/* CONTACT SECTION */}
      <section className="w-full space-y-4 px-4 lg:px-12">
        <hr />
        <h2 className="text-lg font-medium lg:text-xl">Kontakt</h2>
        <div className="flex w-full flex-col gap-6 lg:flex-row lg:gap-12">
          <Skeleton className="h-7 w-80" />
          <Skeleton className="h-7 w-80" />
          <Skeleton className="h-7 w-80" />
        </div>
        <hr />
      </section>

      {/* LOCATION SECTION */}
      <section className="w-full space-y-4 px-4 lg:px-12">
        <Skeleton className="h-7 w-1/3" />
        <Skeleton className="h-[460px] w-full" />
      </section>
    </div>
  );
};

export default loading;
