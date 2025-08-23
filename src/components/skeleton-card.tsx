import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Skeleton } from './ui/skeleton';

export const SkeletonCard = () => {
  return (
    <Card className="relative aspect-video h-full w-full">
      <CardHeader>
        <Skeleton className="h-8 w-1/2" />
      </CardHeader>
      <CardContent>
        <div className="flex gap-6">
          <Skeleton className="size-full rounded-lg" />
        </div>
      </CardContent>
      <CardFooter className="flex w-full justify-between">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-8 w-20" />
      </CardFooter>
    </Card>
  );
};
