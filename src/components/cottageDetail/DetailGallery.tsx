'use client';

import { ImageType } from '@/server/db/schema';
import Image from 'next/image';
import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import NextImage from '../NextImage';

import 'yet-another-react-lightbox/styles.css';

interface Props {
  images: ImageType[];
}

const DetailGallery = ({ images }: Props) => {
  const [index, setIndex] = useState(-1);

  return (
    <>
      <ul className="grid grid-cols-3 gap-4 flex-1 grid-rows-2 items-stretch content-stretch max-h-[400px] relative overflow-hidden rounded-lg">
        {images.map((img, index) => (
          <li
            key={img.id}
            className="first:col-span-2 first:row-span-2 &:nth-child(n+3)]:hidden"
          >
            <button
              className="outline-none border-none cursor-pointer size-full"
              onClick={() => setIndex(index)}
            >
              <Image
                src={img.src}
                width={600}
                height={600}
                alt=""
                className="bg-gray-400 w-full aspect-[4/3] object-cover h-full self-stretch"
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
