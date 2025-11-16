import { Button } from '@/components/ui/button';

interface Props {
  disabled?: boolean;
  children: React.ReactNode;
}

export const SubmitButton = ({ disabled, children }: Props) => {
  return (
    <Button disabled={disabled} type="submit">
      {children}
    </Button>
  );
};
