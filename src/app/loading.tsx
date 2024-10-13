import { SkeletonCard } from '@/components/skeletonCard';

const loading = () => {
  return (
    <div className="grid grid-cols-1 place-items-center justify-center gap-8 py-8 lg:grid-cols-2 2xl:grid-cols-3">
      {Array.from(Array(9).keys()).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
};

export default loading;
