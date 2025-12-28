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
import { ROUTES } from '@/lib/constants';
import { stepFourSchema, StepFourSchemaType } from '@/lib/formSchemas';
import { useCreateFormStore } from '@/stores/createFormStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { StepNavigation } from '../step-navigation';
import { ActionButtons } from './components/action-buttons';
import { ReorderButtons } from './components/reorder-buttons';
import { UploadArea } from './components/upload-area';

// TODO: Replace with Vercel Blob for production
// TODO: Add image compression

export type ImageFile = {
  id: string;
  file: File;
  preview: string;
  isCover: boolean;
};

export const StepFourForm = () => {
  const t = useTranslations('CreateCottage');

  const router = useRouter();

  const setData = useCreateFormStore((state) => state.setData);
  const storedData = useCreateFormStore((state) => state);

  const [images, setImages] = useState<ImageFile[]>([]);

  const form = useForm<StepFourSchemaType>({
    resolver: zodResolver(
      stepFourSchema.refine((data) => data.uploadImages.length >= 1, {
        message: t('Images.Error'),
        path: ['uploadImages'],
      }),
    ),
    defaultValues: {
      uploadImages: storedData.uploadImages || [],
    },
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newImages = acceptedFiles
        .slice(0, 8 - images.length)
        .map((file) => ({
          id: uuidv4(),
          file,
          preview: URL.createObjectURL(file),
          isCover: images.length === 0,
        }));

      const updatedImages = [...images, ...newImages];
      setImages(updatedImages);
      form.setValue(
        'uploadImages',
        updatedImages.map((img) => img.file),
      );
    },
    [images, form],
  );

  const removeImage = (id: string) => {
    const updatedImages = images.filter((img) => img.id !== id);

    if (updatedImages.length > 0 && !updatedImages.some((img) => img.isCover)) {
      updatedImages[0].isCover = true;
    }
    setImages(updatedImages);
    form.setValue(
      'uploadImages',
      updatedImages.map((img) => img.file),
    );
  };

  const setCoverImage = (id: string) => {
    const updatedImages = images.map((img) => ({
      ...img,
      isCover: img.id === id,
    }));
    setImages(updatedImages);
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    const updatedImages = [...images];
    const [movedImage] = updatedImages.splice(fromIndex, 1);
    updatedImages.splice(toIndex, 0, movedImage);
    setImages(updatedImages);
    form.setValue(
      'uploadImages',
      updatedImages.map((img) => img.file),
    );
  };

  const { handleSubmit } = form;

  const onSubmit = (data: StepFourSchemaType) => {
    console.log('Step Four Data:', data);
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
              name="uploadImages"
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
                                src={image.preview}
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
