import { validateRequest } from '@/lib/auth/validateRequest';
import {
  getHikerReservations,
  getOwnerReservations,
} from '@/server/db/queries';
import { format } from 'date-fns';

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
          {reservations?.map((reservation) => (
            <div
              key={reservation.id}
              className="rounded-lg border bg-white p-4 shadow-sm"
            >
              <div className="space-y-2">
                {isOwner ? (
                  <h3 className="font-semibold">
                    Rezervácia #{reservation.id}
                  </h3>
                ) : (
                  <h3 className="font-semibold">
                    {/* TODO: Display cottage name */}
                    {reservation.cottageId || 'Chata'}
                  </h3>
                )}

                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-medium">Termín:</span>{' '}
                    {format(new Date(reservation.from), 'dd.MM.yyyy')} -{' '}
                    {format(new Date(reservation.to), 'dd.MM.yyyy')}
                  </p>
                  <p>
                    <span className="font-medium">Lôžka:</span>{' '}
                    {reservation.bedsReserved}
                  </p>
                  <p>
                    <span className="font-medium">Celková cena:</span>{' '}
                    {reservation.totalPrice} €
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>{' '}
                    <span
                      className={
                        reservation.status === 'confirmed'
                          ? 'text-green-600'
                          : reservation.status === 'pending'
                            ? 'text-yellow-600'
                            : 'text-red-600'
                      }
                    >
                      {reservation.status === 'confirmed'
                        ? 'Potvrdené'
                        : reservation.status === 'pending'
                          ? 'Čakajúce'
                          : 'Zrušené'}
                    </span>
                  </p>
                  {!isOwner && reservation.guestEmail && (
                    <p>
                      <span className="font-medium">Email:</span>{' '}
                      {reservation.guestEmail}
                    </p>
                  )}
                  {!isOwner && reservation.guestPhone && (
                    <p>
                      <span className="font-medium">Telefón:</span>{' '}
                      {reservation.guestPhone}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default Reservations;
