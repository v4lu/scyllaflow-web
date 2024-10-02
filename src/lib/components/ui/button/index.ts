import { cva } from 'class-variance-authority';

export { default as Button } from './button.svelte';
export type AccordionContent = {
	title: string;
	content: string;
};

export const buttonVariants = cva(
	'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
	{
		variants: {
			variant: {
				default: 'bg-primary text-primary-foreground hover:bg-primary/90',
				destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
				outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
				secondary: 'bg-accent text-accent-foreground hover:bg-accent/80',
				ghost: 'hover:bg-accent hover:text-accent-foreground',
				link: 'text-primary underline-offset-4 hover:underline'
			},
			size: {
				default: 'h-10 px-4 py-2',
				xs: 'h-6 rounded px-2 text-xs',
				sm: 'h-9 rounded-md px-3',
				lg: 'h-11 rounded-md px-8',
				icon: 'size-10',
				'icon-sm': 'size-8',
				'icon-xs': 'size-7 p-0'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'default'
		}
	}
);
