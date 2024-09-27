import { type ClassValue, clsx } from 'clsx';
import { addDays, format, isSameDay, isThisWeek, parseISO } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
	return twMerge(clsx(inputs));
}

export function capitalize(s: string): string {
	return s.charAt(0).toUpperCase() + s.slice(1);
}

export function convertRole(role: string): string {
	return capitalize(role.split('workspace:')[1]);
}

export function formatRelativeDate(date: Date | string) {
	const today = new Date();
	const tomorrow = addDays(today, 1);
	if (isSameDay(date, today)) {
		return 'Today';
	} else if (isSameDay(date, tomorrow)) {
		return 'Tomorrow';
	} else if (isThisWeek(date, { weekStartsOn: 1 })) {
		return 'This Week';
	} else {
		return format(date, 'dd.MM');
	}
}

export function formatDateOrDefault(dateString: string | Date, defaultValue: string = '-'): string {
	if (dateString === '0001-01-01T00:00:00Z' || dateString === null || dateString === undefined) {
		return defaultValue;
	}

	const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
	return format(date, 'dd MMM');
}

export function monthAndDay(date: string | Date | null | undefined): string {
	return formatDateOrDefault(date as string);
}
