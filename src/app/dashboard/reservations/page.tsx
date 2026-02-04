import { validateRequest } from '@/lib/auth/validateRequest';
import { getOwnerReservations } from '@/server/db/queries';

const Reservations = async () => {
  const { user } = await validateRequest();
  if (!user) {
    return null;
  }

  const { success: reservations, error } = await getOwnerReservations(user.id);

  return (
    <main className="py-4">
      {error && <p>{error}</p>}
      {reservations && reservations?.length < 1 ? (
        'no reservations'
      ) : (
        <div className="grid h-full w-full grid-cols-1 place-items-center gap-8 pb-6 md:grid-cols-2 md:place-items-start lg:py-8 2xl:grid-cols-3">
          NUM OF RESERVATIONS: {reservations?.length}
        </div>
      )}
    </main>
  );
};

export default Reservations;
