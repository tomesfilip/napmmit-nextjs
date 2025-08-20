import { Icon } from '../shared/Icon';

interface Props {
  address: string;
  locationURL: string | null;
}

export const LocationSection = ({ address, locationURL }: Props) => {
  return (
    <section className="w-full space-y-4 px-4">
      <div className="flex gap-2">
        <Icon icon="Location" className="size-6 flex-shrink-0 fill-black" />
        <p className="lg:text-lg">{address}</p>
      </div>
      {locationURL && (
        <iframe
          className="w-full rounded-lg"
          style={{ border: 'none' }}
          src={locationURL}
          width="1024"
          height="460"
        />
      )}
    </section>
  );
};
