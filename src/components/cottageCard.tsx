import cottageFallbackImg from '@/assets/img/cottage-fallback.webp';
import { CottageWithServices } from '@/lib/appTypes';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from './ui/badge';
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
    <Card className="w-full max-w-[400px] h-fit">
      <CardHeader>
        <CardTitle className="line-clamp-1 leading-8">{cottage.name}</CardTitle>
        <p>{cottage.mountainArea}</p>
      </CardHeader>
      <CardContent>
        <div className="flex gap-6">
          <Image
            src={cottageFallbackImg}
            alt={`image ${cottage.name}`}
            placeholder="blur"
            className="w-40 h-full object-cover rounded-lg"
          />
          {/* TODO: show some basic availibility details after functional reservation system connection */}
          {/* <div className="space-y-3">
            <p>
              Voľné miesta: {cottage.availableBeds}/{cottage.capacity}
            </p>
          </div> */}
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
        <Link
          className="ml-auto bg-slate-100 px-4 py-1 rounded-lg font-medium"
          href={`/cottage/${cottage.id}`}
        >
          Viac
        </Link>
      </CardFooter>
    </Card>
  );
};
