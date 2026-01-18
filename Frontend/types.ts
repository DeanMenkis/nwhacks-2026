import React from 'react';

export interface CardState {
  name: string;
  email: string;
  jobTitle: string;
  phoneNumber: string;
  github: string;
  linkedin: string;
  showQrCode: boolean;
  qrCodeLink: string;
  color: string;
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setJobTitle: (jobTitle: string) => void;
  setPhoneNumber: (phone: string) => void;
  setGithub: (github: string) => void;
  setLinkedin: (linkedin: string) => void;
  setShowQrCode: (show: boolean) => void;
  setQrCodeLink: (link: string) => void;
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