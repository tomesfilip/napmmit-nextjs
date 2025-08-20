'use client';

import { ImageType } from '@/server/db/schema';
import clsx from 'clsx';
import Image from 'next/image';
import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Counter from 'yet-another-react-lightbox/plugins/counter';
import NextImage from '../NextImage';

import 'yet-another-react-lightbox/plugins/counter.css';
import 'yet-another-react-lightbox/styles.css';

interface Props {
  images: ImageType[];
}

export const DetailGallery = ({ images }: Props) => {
  const [index, setIndex] = useState(-1);

  return (
    <div className="hidden lg:block">
      <ul className="relative grid flex-1 content-stretch items-stretch overflow-hidden rounded-lg sm:max-h-[400px] lg:grid-cols-3 lg:grid-rows-2 lg:gap-4">
        {images.map((img, index) => (
          <li
            key={img.id}
            className={clsx(
              'relative flex size-full items-center justify-center outline-none after:pointer-events-none after:absolute after:bottom-0 after:left-0 after:right-0 after:top-0 after:z-[2] after:bg-black after:opacity-0 after:transition-opacity first:col-span-2 first:row-span-2 hover:after:opacity-15 focus:after:opacity-15 [&:nth-child(n+4)]:hidden',
              images.length > 3 && '[&:nth-child(3)]:after:opacity-40',
            )}
          >
            {index === 2 && images.length > 3 && (
              <p className="pointer-events-none absolute z-[3] hidden select-none text-xl font-medium text-white lg:block lg:text-3xl">
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
        plugins={[Counter]}
        index={index}
        open={index >= 0}
        close={() => setIndex(-1)}
        slides={images}
        render={{ slide: NextImage }}
      />
    </div>
  );
};
