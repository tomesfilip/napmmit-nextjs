import { SkeletonCard } from '@/components/skeletonCard';

const loading = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 py-8 justify-center place-items-center">
      {Array.from(Array(9).keys()).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
};

export default loading;
