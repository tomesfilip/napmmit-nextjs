import { StepFiveForm } from '@/app/create/step-five/step-five-form';
import { StepFourForm } from '@/app/create/step-four/step-four-form';
import { StepOneForm } from '@/app/create/step-one/step-one-form';
import { StepSixForm } from '@/app/create/step-six/step-six-form';
import { StepThreeForm } from '@/app/create/step-three/step-three-form';
import { StepTwoForm } from '@/app/create/step-two/step-two-form';
import { redirect } from 'next/navigation';
import { use } from 'react';

const steps = {
  'step-one': StepOneForm,
  'step-two': StepTwoForm,
  'step-three': StepThreeForm,
  'step-four': StepFourForm,
  'step-five': StepFiveForm,
  'step-six': StepSixForm,
};

export default function EditStepPage({
  params,
}: {
  params: Promise<{ id: string; step: string }>;
}) {
  const { id, step } = use(params);
  const StepComponent = steps[step as keyof typeof steps];

  if (!StepComponent) {
    redirect(`/edit/${id}/step-one`);
  }

  return <StepComponent />;
}
