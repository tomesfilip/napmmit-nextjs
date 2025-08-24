import { Card, CardFooter, CardHeader } from './ui/card';
import { Skeleton } from './ui/skeleton';

export const SkeletonCard = () => {
  return (
    <Card className="relative flex aspect-video h-full w-full flex-col justify-between">
      <CardHeader>
        <Skeleton className="h-8 w-1/2" />
      </CardHeader>
      <CardFooter className="flex w-full justify-between">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-8 w-20" />
      </CardFooter>
    </Card>
  );
};
