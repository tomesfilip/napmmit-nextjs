import { Badge } from '@/components/ui/badge';
import cottageFallbackImg from '../../public/cottage-fallback.webp';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getCottages } from '@/server/db/queries';
import Image from 'next/image';

const Home = async () => {
  const cottages = await getCottages();

  return (
    <main>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 py-8 justify-center place-items-center">
        {cottages.map((cottage) => (
          <Card key={cottage.id} className="w-full h-full max-w-md">
            <CardHeader>
              <CardTitle className="line-clamp-1 leading-8">
                {cottage.name}
              </CardTitle>
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
                {cottage.hasBreakfast && (
                  <Badge variant="secondary">raňajky</Badge>
                )}
                {cottage.hasDinner && <Badge variant="secondary">večera</Badge>}
                {cottage.hasShower && <Badge variant="secondary">sprcha</Badge>}
              </div>
              <Button className="ml-auto">Viac</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
};

export default Home;
