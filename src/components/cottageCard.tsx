import { CottageWithServices } from '@/lib/appTypes';
import Image from 'next/image';
import cottageFallbackImg from '../../public/cottage-fallback.webp';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';

type Props = {
  cottage: CottageWithServices;
};

export const CottageCard = ({ cottage }: Props) => {
  return (
    <Card className="w-full max-w-md h-fit">
      <CardHeader>
        <CardTitle className="line-clamp-1 leading-8">{cottage.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-6">
          <Image
            src={cottageFallbackImg}
            alt={`image ${cottage.name}`}
            placeholder="blur"
            className="w-40 h-full object-cover rounded-lg"
          />
          <div className="space-y-3">
            <p>{cottage.location}</p>
            <p>
              Voľné miesta: {cottage.availableBeds}/{cottage.totalBeds}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex w-full justify-between">
        <div className="flex gap-2">
          {cottage.cottageServices.map(({ id, name }) => (
            <Badge key={id} variant="secondary">
              {name}
            </Badge>
          ))}
        </div>
        <Button className="ml-auto">Viac</Button>
      </CardFooter>
    </Card>
  );
};
