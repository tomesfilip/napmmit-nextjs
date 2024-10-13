'use client';

import { ImageType } from '@/server/db/schema';
import Image from 'next/image';
import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import NextImage from '../NextImage';

import clsx from 'clsx';
import 'yet-another-react-lightbox/styles.css';

interface Props {
  images: ImageType[];
}

const DetailGallery = ({ images }: Props) => {
  const [index, setIndex] = useState(-1);

  return (
    <>
      <ul className="relative grid max-h-[400px] flex-1 grid-cols-3 grid-rows-2 content-stretch items-stretch gap-4 overflow-hidden rounded-lg">
        {images.map((img, index) => (
          <li
            key={img.id}
            className={clsx(
              'relative size-full outline-none after:pointer-events-none after:absolute after:bottom-0 after:left-0 after:right-0 after:top-0 after:z-[2] after:bg-black after:opacity-0 after:transition-opacity first:col-span-2 first:row-span-2 hover:after:opacity-15 focus:after:opacity-15 [&:nth-child(n+4)]:hidden',
              images.length > 3 && '[&:nth-child(3)]:after:opacity-40',
            )}
          >
            {index === 2 && images.length > 3 && (
              <p className="pointer-events-none absolute left-1/2 top-1/2 z-[3] -translate-x-1/2 -translate-y-1/2 select-none text-xl font-medium text-white lg:text-3xl">
                +{images.length - 3} fotky
              </p>
            )}
            <button
              className="size-full cursor-pointer border-none outline-none"
              onClick={() => setIndex(index)}
            >
              <Image
                src={img.src}
                width={600}
                height={600}
                alt=""
                className="aspect-[4/3] h-full w-full self-stretch bg-gray-400 object-cover"
              />
            </button>
          </li>
        ))}
      </ul>
      <Lightbox
        index={index}
        open={index >= 0}
        close={() => setIndex(-1)}
        slides={images}
        render={{ slide: NextImage }}
      />
    </>
  );
};
export default DetailGallery;
