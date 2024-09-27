import { type ClassValue, clsx } from 'clsx';
import {
	format,
	isBefore,
	isThisWeek,
	isToday,
	isTomorrow,
	isYesterday,
	startOfDay
} from 'date-fns';
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

export function formatDateOrDefault(
	dateString: string | Date,
	defaultValue: string = '-'
): string | Date {
	if (dateString === '0001-01-01T00:00:00Z' || dateString === null || dateString === undefined) {
		return defaultValue;
	}

	return dateString;
}

export function monthAndDay(date: string | Date | null | undefined): string {
	const d = formatDateOrDefault(date as string);
	if (d === '-') {
		return '-';
	}
	if (isToday(d)) return 'Today';
	if (isTomorrow(d)) return 'Tomorrow';
	if (isYesterday(d)) return 'Yesterday';
	if (isThisWeek(d, { weekStartsOn: 1 })) return format(d, 'EEEE');
	return format(d, 'MMM dd, yyyy');
}

export function getSelectedDateLabel(date: string | Date | null | undefined): string {
	if (!date) return 'Select due date';
	if (isToday(date)) return 'Today';
	if (isTomorrow(date)) return 'Tomorrow';
	if (isYesterday(date)) return 'Yesterday';
	if (isThisWeek(date, { weekStartsOn: 1 })) return format(date, 'EEEE');
	return format(date, 'MMM dd, yyyy');
}

export function isPastToday(date: Date | string): boolean {
	const today = startOfDay(new Date());
	return isBefore(date, today);
}
