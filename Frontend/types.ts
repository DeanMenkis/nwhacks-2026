import React from 'react';

export interface CardState {
  name: string;
  email: string;
  jobTitle: string;
  color: string;
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setJobTitle: (jobTitle: string) => void;
  setColor: (color: string) => void;
}

export interface InputFieldProps {
  label: string;
  icon: string;
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

export interface FilamentColor {
  hex: string;
  name: string;
}