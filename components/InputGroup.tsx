import React from 'react';
import { InputFieldProps } from '../types';

export const InputGroup: React.FC<InputFieldProps> = ({ 
  label, 
  icon, 
  value, 
  placeholder, 
  onChange, 
  type = "text" 
}) => {
  return (
    <div className="flex flex-col gap-2 px-4">
      <label className="text-white/80 text-sm font-semibold pl-1">{label}</label>
      <div className="relative group">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-primary transition-colors">
          {icon}
        </span>
        <input 
          type={type}
          className="form-input flex w-full rounded-xl text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-input-border bg-input-bg focus:border-primary h-12 pl-12 pr-4 placeholder:text-white/20 text-sm font-medium transition-all shadow-sm" 
          placeholder={placeholder} 
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
};
