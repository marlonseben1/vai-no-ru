import type { ElementType } from 'react';
import { FaWheatAwn } from 'react-icons/fa6';
import { GiMeat, GiMilkCarton, GiPig, GiRawEgg } from 'react-icons/gi';
import { PiPlantFill } from 'react-icons/pi';

import { colorPalette } from '@/styles/colorPalette';

export const iconesMapa: Record<string, ElementType> = {
  carne: GiMeat,
  suino: GiPig,
  vegetariano: PiPlantFill,
  lactose: GiMilkCarton,
  gluten: FaWheatAwn,
  ovo: GiRawEgg,
};

export const coresMapa: Record<string, string> = {
  carne: colorPalette.red[900],
  suino: colorPalette.red[900],
  vegetariano: colorPalette.primary[900],
  lactose: colorPalette.blue[600],
  gluten: colorPalette.yellow[600],
  ovo: colorPalette.yellow[600],
};
