import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getCottages } from '@/server/db/queries';

const Home = async () => {
  const cottages = await getCottages();

  return (
    <main>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 py-8">
        {cottages.map((cottage) => (
          <Card key={cottage.id}>
            <CardHeader>
              <CardTitle>{cottage.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                {cottage.totalBeds}/{cottage.availableBeds}
              </p>
            </CardContent>
            <CardFooter>
              <span>{cottage.pricePerNight} eur</span>
              {cottage.hasBreakfast && <p>breakfast included</p>}
              <Button>View details</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
};

export default Home;
