import Image from 'next/image';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Skeleton } from './ui/skeleton';

export const SkeletonCard = () => {
  return (
    <Card className="w-full min-h-[280px] h-full max-w-md">
      <CardHeader>
        <Skeleton className="w-full h-8" />
      </CardHeader>
      <CardContent>
        <div className="flex gap-6">
          <Skeleton className="w-40 h-24 rounded-lg" />
          <div className="space-y-3">
            <Skeleton className="w-20 h-4"></Skeleton>
            <Skeleton className="w-32 h-4"></Skeleton>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex w-full justify-between">
        <Skeleton className="flex-grow h-16" />
      </CardFooter>
    </Card>
  );
};
