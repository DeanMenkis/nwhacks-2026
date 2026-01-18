import React from 'react';

export interface CardState {
  name: string;
  email: string;
  jobTitle: string;
  phoneNumber: string;
  github: string;
  linkedin: string;
  showQrCode: boolean;
  showGithub: boolean;
  showLinkedin: boolean;
  qrCodeLink: string;
  color: string;
  fontColor: string;
  font: string;
  fontBold: boolean;
  filletRadius: number;
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setJobTitle: (jobTitle: string) => void;
  setPhoneNumber: (phone: string) => void;
  setGithub: (github: string) => void;
  setLinkedin: (linkedin: string) => void;
  setShowQrCode: (show: boolean) => void;
  setShowGithub: (show: boolean) => void;
  setShowLinkedin: (show: boolean) => void;
  setQrCodeLink: (link: string) => void;
  setColor: (color: string) => void;
  setFontColor: (color: string) => void;
  setFontBold: (bold: boolean) => void;
  setFilletRadius: (radius: number) => void;
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