import Link from 'next/link';
import { Icon } from '../icon';

export const Socials = () => {
  return (
    <ul className="flex flex-wrap justify-center gap-5 lg:justify-start">
      <li>
        <Link href="/facebook" target="_blank" rel="noopener noreferrer">
          <Icon icon="Facebook" className="size-6 text-black" />
        </Link>
      </li>
      <li>
        <Link href="/instagram" target="_blank" rel="noopener noreferrer">
          <Icon icon="Instagram" className="size-6 text-black" />
        </Link>
      </li>
      <li>
        <Link href="/linked-in" target="_blank" rel="noopener noreferrer">
          <Icon icon="Linkedin" className="size-6 text-black" />
        </Link>
      </li>
    </ul>
  );
};
