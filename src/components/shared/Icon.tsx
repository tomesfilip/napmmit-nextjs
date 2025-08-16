import { IconType } from '@/lib/appTypes';
import { createElement, SVGProps } from 'react';
import * as Icons from '../icons/index';

interface Props extends SVGProps<SVGSVGElement> {
  icon: IconType;
}

export const Icon = ({ icon, ...props }: Props) => {
  console.log('ICON_ICON: ', icon);
  const Component = createElement(Icons[icon], props);
  return <>{Component}</>;
};
