<script lang="ts">
	import {
		addMonths,
		eachDayOfInterval,
		endOfMonth,
		format,
		isBefore,
		isSameDay,
		isSameMonth,
		startOfDay,
		startOfMonth,
		subMonths
	} from 'date-fns';

	type Props = {
		selected: Date | null;
		selectDate: (date: Date | null) => void;
	};

	let { selected, selectDate }: Props = $props();
	let currentMonth = $state(startOfMonth(new Date()));
	let today = $state(startOfDay(new Date()));

	function nextMonth() {
		currentMonth = addMonths(currentMonth, 1);
	}

	function prevMonth() {
		currentMonth = subMonths(currentMonth, 1);
	}

	let days = $derived(
		eachDayOfInterval({
			start: startOfMonth(currentMonth),
			end: endOfMonth(currentMonth)
		})
	);

	function handleDateClick(day: Date) {
		if (selected && isSameDay(day, selected)) {
			selectDate(null);
		} else {
			selectDate(day);
		}
	}
</script>

<div class="p-4">
	<div class="mb-4 flex justify-between">
		<button onclick={prevMonth}>&lt;</button>
		<span>{format(currentMonth, 'MMMM yyyy')}</span>
		<button onclick={nextMonth}>&gt;</button>
	</div>
	<div class="grid grid-cols-7 gap-1">
		{#each ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as day}
			<div class="text-center text-sm font-bold">{day}</div>
		{/each}
		{#each days as day}
			<button
				class="p-2 text-center
                    {isSameMonth(day, currentMonth) ? '' : 'text-muted-foreground'} 
                    {isBefore(day, today) ? 'text-muted-foreground' : ''}
                    {selected && isSameDay(day, selected)
					? 'rounded-md bg-primary text-primary-foreground'
					: ''}"
				onclick={() => handleDateClick(day)}
				disabled={!isSameMonth(day, currentMonth)}
			>
				{format(day, 'd')}
			</button>
		{/each}
	</div>
</div>
