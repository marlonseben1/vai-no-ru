import type { ElementType } from 'react';
import { FaWheatAwn } from 'react-icons/fa6';
import { GiMeat, GiMilkCarton, GiPig, GiRawEgg } from 'react-icons/gi';
import { PiPlantFill } from 'react-icons/pi';

export const iconesMapa: Record<string, ElementType> = {
  carne: GiMeat,
  suino: GiPig,
  vegetariano: PiPlantFill,
  lactose: GiMilkCarton,
  gluten: FaWheatAwn,
  ovo: GiRawEgg,
};
