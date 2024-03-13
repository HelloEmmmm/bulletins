import { InputHTMLAttributes, MutableRefObject } from 'react';

export interface InputProps
	extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix' | 'suffix' | 'size'> {
	ref?: MutableRefObject<HTMLInputElement | null>;
	label: string;
}
