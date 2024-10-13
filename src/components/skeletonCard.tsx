import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Skeleton } from './ui/skeleton';

export const SkeletonCard = () => {
  return (
    <Card className="h-full min-h-[280px] w-full max-w-[400px]">
      <CardHeader>
        <Skeleton className="h-8 w-full" />
      </CardHeader>
      <CardContent>
        <div className="flex gap-6">
          <Skeleton className="h-24 w-40 rounded-lg" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex w-full justify-between">
        <Skeleton className="h-16 flex-grow" />
      </CardFooter>
    </Card>
  );
};
