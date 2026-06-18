import { ReactNode } from 'react';
import { CiShoppingBasket } from 'react-icons/ci';
import { BsCapsulePill } from 'react-icons/bs';
import { GiLipstick } from 'react-icons/gi';
import { PiDress, PiHouseLight } from 'react-icons/pi';
import { MdOutlineComputer } from 'react-icons/md';
import { IoGameControllerOutline } from 'react-icons/io5';
import { TbHorseToy } from 'react-icons/tb';
import React from 'react';

export interface Categoria {
  label: string;
  icon: ReactNode;
}

export const categoriasMock: Categoria[] = [
  { label: 'Mercado',     icon: React.createElement(CiShoppingBasket, { size: 28 }) },
  { label: 'Farmácia',    icon: React.createElement(BsCapsulePill, { size: 24 }) },
  { label: 'Beleza',      icon: React.createElement(GiLipstick, { size: 24 }) },
  { label: 'Moda',        icon: React.createElement(PiDress, { size: 40 }) },
  { label: 'Eletrônicos', icon: React.createElement(MdOutlineComputer, { size: 26 }) },
  { label: 'Jogos',       icon: React.createElement(IoGameControllerOutline, { size: 26 }) },
  { label: 'Brinquedos',  icon: React.createElement(TbHorseToy, { size: 26 }) },
  { label: 'Casa',        icon: React.createElement(PiHouseLight, { size: 26 }) },
];

export const pilulasCategoriasBackup = ['Celulares', 'Notebooks', 'TVs', 'Acessórios', 'Outros'];
