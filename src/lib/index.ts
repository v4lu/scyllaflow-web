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

export function getContrastColor(hexColor: string): string {
	hexColor = hexColor.replace('#', '');

	const r = Number.parseInt(hexColor.substr(0, 2), 16);
	const g = Number.parseInt(hexColor.substr(2, 2), 16);
	const b = Number.parseInt(hexColor.substr(4, 2), 16);

	const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

	return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

export function debounce<T extends (...args: never[]) => unknown>(
	func: T,
	wait: number
): (...args: Parameters<T>) => void {
	let timeout: ReturnType<typeof setTimeout> | null = null;

	return (...args: Parameters<T>): void => {
		const later = () => {
			timeout = null;
			func(...args);
		};

		if (timeout !== null) {
			clearTimeout(timeout);
		}
		timeout = setTimeout(later, wait);
	};
}

export function clickOutside(node: HTMLElement, onClickOutside: () => void) {
	function handleClick(event: MouseEvent) {
		if (node && !node.contains(event.target as Node) && !event.defaultPrevented) {
			event.stopPropagation();
			onClickOutside();
		}
	}

	document.addEventListener('click', handleClick, true);

	return {
		destroy() {
			document.removeEventListener('click', handleClick, true);
		}
	};
}

export function clickOutsideTimeout(node: HTMLElement, onClickOutside: () => void) {
	function handleClick(event: MouseEvent) {
		if (node && !node.contains(event.target as Node) && !event.defaultPrevented) {
			setTimeout(() => {
				onClickOutside();
			}, 0);
		}
	}
	document.addEventListener('click', handleClick, true);
	return {
		destroy() {
			document.removeEventListener('click', handleClick, true);
		}
	};
}

export function getStatusColor(status: string): string {
	switch (status) {
		case 'InProgress':
			return 'text-yellow-500';
		case 'Blocked':
		case 'Cancelled':
			return 'text-red-500';
		case 'Done':
			return 'text-green-500';
		case 'Backlog':
			return 'text-purple-500';
		default:
			return 'text-blue-500';
	}
}

export function getPriorityColor(priority: string): string {
	switch (priority) {
		case 'Urgent':
			return 'text-red-500';
		case 'High':
			return 'text-orange-500';
		case 'Medium':
			return 'text-yellow-500';
		case 'Low':
			return 'text-green-500';
		default:
			return 'text-blue-500';
	}
}
