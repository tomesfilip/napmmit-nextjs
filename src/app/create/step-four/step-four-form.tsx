'use client';

import { Badge } from '@/components/ui/badge';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { MAX_IMAGES_PER_COTTAGE, ROUTES } from '@/lib/constants';
import { stepFourSchema, StepFourSchemaType } from '@/lib/formSchemas';
import { useCreateFormStore } from '@/stores/createFormStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { upload } from '@vercel/blob/client';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { StepNavigation } from '../step-navigation';
import { ActionButtons } from './components/action-buttons';
import { ReorderButtons } from './components/reorder-buttons';
import { UploadArea } from './components/upload-area';

// TODO: Add image compression

export type ImageItemType = {
  id: string;
  src: string;
  width: number;
  height: number;
  order: number;
  isCover: boolean;
};

export const StepFourForm = () => {
  const t = useTranslations('CreateCottage');
  const router = useRouter();

  const setData = useCreateFormStore((state) => state.setData);
  const storedImages = useMemo(
    () => useCreateFormStore.getState().images ?? [],
    [],
  );

  const [images, setImages] = useState<ImageItemType[]>(() =>
    storedImages.length
      ? storedImages.map((img, index) => ({
          id: uuidv4(),
          src: img.src,
          width: img.width,
          height: img.height,
          order: img.order ?? index,
          isCover: index === 0,
        }))
      : [],
  );

  const form = useForm<StepFourSchemaType>({
    resolver: zodResolver(stepFourSchema),
    defaultValues: {
      images: images.map(({ src, width, height, order }) => ({
        src,
        width,
        height,
        order,
      })),
    },
  });

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const uploaded: ImageItemType[] = [];

      for (const file of acceptedFiles.slice(
        0,
        MAX_IMAGES_PER_COTTAGE - images.length,
      )) {
        const res = await upload(file.name, file, {
          access: 'public',
          handleUploadUrl: '/api/cottage-images/upload',
        });

        const img = new window.Image();
        img.src = res.url;
        await img.decode();

        uploaded.push({
          id: uuidv4(),
          src: res.url,
          width: img.naturalWidth,
          height: img.naturalHeight,
          order: images.length + uploaded.length,
          isCover: images.length === 0 && uploaded.length === 0,
        });
      }

      const next: ImageItemType[] = [...images, ...uploaded];
      setImages(next);

      form.setValue(
        'images',
        next.map(({ src, width, height, order }) => ({
          src,
          width,
          height,
          order,
        })),
        { shouldValidate: true },
      );
    },
    [images, form],
  );

  const removeImage = (id: string) => {
    const next = images.filter((img) => img.id !== id);

    if (next.length && !next.some((i) => i.isCover)) {
      next[0].isCover = true;
    }

    next.forEach((img, i) => (img.order = i));

    setImages(next);

    form.setValue(
      'images',
      next.map(({ src, width, height, order }) => ({
        src,
        width,
        height,
        order,
      })),
      { shouldValidate: true },
    );
  };

  const setCoverImage = (id: string) => {
    setImages((prev) =>
      prev.map((img) => ({
        ...img,
        isCover: img.id === id,
      })),
    );
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    const next = [...images];
    const [moved] = next.splice(fromIndex, 1);

    next.splice(toIndex, 0, moved);
    next.forEach((img, i) => (img.order = i));

    setImages(next);
    form.setValue(
      'images',
      next.map(({ src, width, height, order }) => ({
        src,
        width,
        height,
        order,
      })),
      { shouldValidate: true },
    );
  };

  const { handleSubmit } = form;

  const onSubmit = (data: StepFourSchemaType) => {
    setData(data);
    router.push(ROUTES.CREATE_COTTAGE.STEP_FIVE);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[600px]">
        <div className="space-y-5">
          <div className="space-y-5">
            <FormField
              control={form.control}
              name="images"
              render={() => (
                <FormItem>
                  <FormLabel>
                    <h1 className="text-lg font-medium">{t('Images.Label')}</h1>
                  </FormLabel>
                  <FormDescription className="text-sm">
                    {t('Images.Description')}
                  </FormDescription>
                  <FormControl>
                    <div className="space-y-4">
                      {images.length < 8 && (
                        <UploadArea
                          onDrop={onDrop}
                          imagesLength={images.length}
                        />
                      )}

                      {images.length > 0 && (
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                          {images.map((image, index) => (
                            <div key={image.id} className="group relative">
                              <Image
                                width={200}
                                height={128}
                                src={image.src}
                                alt={`Upload ${index + 1}`}
                                className="h-32 w-full rounded-lg object-cover"
                              />
                              {image.isCover && (
                                <Badge className="absolute left-2 top-2 rounded bg-primary px-2 py-1 text-xs text-primary-foreground">
                                  {t('Images.Cover')}
                                </Badge>
                              )}
                              <ActionButtons
                                currImg={image}
                                setCoverImage={setCoverImage}
                                removeImage={removeImage}
                              />
                              <ReorderButtons
                                index={index}
                                totalImages={images.length}
                                moveImage={moveImage}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <StepNavigation />
        </div>
      </form>
    </Form>
  );
};
