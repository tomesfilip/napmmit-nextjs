import { CottageDetailType } from '@/lib/appTypes';
import Link from 'next/link';
import { FaLink, FaPhone } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

export const ContactSection = ({
  phoneNumber,
  email,
  website,
}: CottageDetailType) => {
  return (
    <div className="flex w-full flex-wrap gap-6 px-4 lg:gap-12">
      {phoneNumber && (
        <div className="flex items-center gap-2">
          <FaPhone className="size-7 flex-shrink-0" />
          <a href={`tel:${phoneNumber}`}>{phoneNumber}</a>
        </div>
      )}
      {email && (
        <div className="flex items-center gap-2">
          <MdEmail className="size-7 flex-shrink-0" />
          <a href={`mailto:${email}`}>{email}</a>
        </div>
      )}
      {website && (
        <div className="flex items-center gap-2">
          <FaLink className="size-7 flex-shrink-0" />
          <Link
            className="max-w-[230px] overflow-hidden overflow-ellipsis lg:max-w-[360px]"
            target="_blank"
            href={website}
          >
            {website}
          </Link>
        </div>
      )}
    </div>
  );
};
