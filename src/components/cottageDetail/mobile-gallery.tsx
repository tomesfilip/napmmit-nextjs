'use client';

import { ImageType } from '@/server/db/schema';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Counter from 'yet-another-react-lightbox/plugins/counter';
import NextImage from '../next-image';

import 'yet-another-react-lightbox/plugins/counter.css';
import 'yet-another-react-lightbox/styles.css';
import Link from 'next/link';
import { Icon } from '../shared/icon';

interface Props {
  images: ImageType[];
}

export const MobileGallery = ({ images }: Props) => {
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const scrollLeft = scrollRef.current.scrollLeft;
        const itemWidth = scrollRef.current.clientWidth;
        const index = Math.round(scrollLeft / itemWidth);
        setCurrentIndex(index);
      }
    };

    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
      return () => scrollElement.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <div className="lg:hidden">
      <div className="relative">
        <Link
          href="/"
          className="absolute left-4 top-4 z-[2] rounded-full bg-slate-100 p-2"
        >
          <Icon icon="ArrowRight" className="size-6 rotate-180 fill-black" />
        </Link>
        <ul
          ref={scrollRef}
          className="flex max-h-[640px] snap-x snap-mandatory overflow-x-auto rounded-b-lg"
        >
          {images.map((img, index) => (
            <li
              key={img.id}
              className="relative flex w-full shrink-0 snap-center items-center justify-center"
            >
              <button
                className="size-full cursor-pointer border-none outline-none"
                onClick={() => setLightboxIndex(index)}
              >
                <Image
                  src={img.src}
                  width={600}
                  height={600}
                  alt=""
                  className="aspect-[3/4] h-full w-full self-stretch bg-gray-400 object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
        <div className="glass-bg absolute bottom-4 left-4 rounded-full bg-black/40 px-3 py-1 text-sm text-white">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
      <Lightbox
        plugins={[Counter]}
        index={lightboxIndex}
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        slides={images}
        render={{ slide: NextImage }}
      />
    </div>
  );
};
