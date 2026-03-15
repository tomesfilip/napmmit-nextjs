import { validateRequest } from '@/lib/auth/validateRequest';
import {
  getHikerReservations,
  getOwnerReservations,
} from '@/server/db/queries';
import { HikerReservationCard } from './hiker-reservation-card';
import { OwnerReservationCard } from './owner-reservation-card';

const Reservations = async () => {
  const { user } = await validateRequest();
  if (!user) {
    return null;
  }

  const isOwner = user.role === 'cottage_owner' || user.role === 'admin';
  const { success: reservations, error } = isOwner
    ? await getOwnerReservations(user.id)
    : await getHikerReservations(user.id);

  return (
    <main className="py-4">
      {error && <p className="text-red-500">{error}</p>}
      {reservations && reservations.length < 1 ? (
        <div className="text-center text-gray-500">
          {isOwner
            ? 'Zatiaľ nemáte žiadne rezervácie pre vaše chaty.'
            : 'Zatiaľ nemáte žiadne rezervácie.'}
        </div>
      ) : (
        <div className="grid h-full w-full grid-cols-1 gap-4 pb-6 md:grid-cols-2 lg:py-8 2xl:grid-cols-3">
          {reservations?.map((reservation) =>
            isOwner ? (
              <OwnerReservationCard
                key={reservation.id}
                reservation={reservation}
              />
            ) : (
              <HikerReservationCard
                key={reservation.id}
                reservation={reservation}
              />
            ),
          )}
        </div>
      )}
    </main>
  );
};

export default Reservations;
