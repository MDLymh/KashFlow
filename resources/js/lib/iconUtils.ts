'use client';

import React from 'react';
import * as LucideIcons from 'lucide-react';

/**
 * Convierte un nombre de icono con guiones a camelCase
 * Ej: "shopping-bag" -> "ShoppingBag"
 */
export const iconNameToCamelCase = (iconName: string): string => {
  return iconName
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
};

/**
 * Obtiene el componente de icono de Lucide desde un nombre
 */
export const getIconComponent = (iconName: string) => {
  const camelCaseName = iconNameToCamelCase(iconName);
  return (LucideIcons as any)[camelCaseName] || null;
};

/**
 * Renderiza un icono de Lucide dinámicamente
 */
export const renderLucideIcon = (
  iconName: string,
  size: number = 32,
  className: string = 'text-indigo-600',
  fallbackIconName: string = 'folder'
): React.ReactElement => {
  const IconComponent = getIconComponent(iconName);
  
  if (IconComponent) {
    return React.createElement(IconComponent, { size, className });
  }
  
  // Fallback icon
  const FallbackIcon = getIconComponent(fallbackIconName);
  if (FallbackIcon) {
    return React.createElement(FallbackIcon, { 
      size, 
      className: className.replace('indigo-600', 'gray-400') 
    });
  }
  
  return React.createElement((LucideIcons as any).FolderOpen, { size, className: 'text-gray-400' });
};
