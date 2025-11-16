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
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { BackButton } from '../back-button';
import { SubmitButton } from '../submit-button';
import { ActionButtons } from './components/action-buttons';
import { ReorderButtons } from './components/reorder-buttons';
import { UploadArea } from './components/upload-area';

// TODO: Replace with Cloudinary for production
// TODO: Add image compression with Cloudinary transformations

export type ImageFile = {
  id: string;
  file: File;
  preview: string;
  isCover: boolean;
};

export const StepFourForm = () => {
  const t = useTranslations('CreateCottage.StepFour');
  const tNavigation = useTranslations('CreateCottage.FormNavigation');

  const [images, setImages] = useState<ImageFile[]>([]);

  const formSchema = z.object({
    images: z.array(z.string()).min(1, {
      message: t('Images.Error'),
    }),
  });

  type FormSchemaType = z.infer<typeof formSchema>;
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      images: [],
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
        'images',
        updatedImages.map((img) => img.id),
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
      'images',
      updatedImages.map((img) => img.id),
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
      'images',
      updatedImages.map((img) => img.id),
    );
  };

  const { handleSubmit } = form;

  const onSubmit = (data: FormSchemaType) => {
    console.log(data);
    console.log('Images:', images);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-[600px] py-6"
      >
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <BackButton />
            <SubmitButton>{tNavigation('NextButton')}</SubmitButton>
          </div>
          <div className="space-y-5">
            <FormField
              control={form.control}
              name="images"
              render={() => (
                <FormItem>
                  <FormLabel>{t('Images.Label')}</FormLabel>
                  <FormDescription>{t('Images.Description')}</FormDescription>
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
        </div>
      </form>
    </Form>
  );
};
