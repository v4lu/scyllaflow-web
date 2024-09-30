<script lang="ts">
	import { Editor, type ChainedCommands } from '@tiptap/core';
	import Placeholder from '@tiptap/extension-placeholder';
	import Table from '@tiptap/extension-table';
	import TableCell from '@tiptap/extension-table-cell';
	import TableHeader from '@tiptap/extension-table-header';
	import TableRow from '@tiptap/extension-table-row';
	import StarterKit from '@tiptap/starter-kit';
	import { onDestroy, onMount } from 'svelte';
	import { Button } from '../button';
	import { inputVariants } from '../input';

	type Props = {
		content: object;
		placeholder: string;
		update: (val: object) => void;
	};

	let { content, placeholder, update }: Props = $props();
	let element = $state<HTMLElement>();
	let editor = $state<Editor>();
	let showCommandMenu = $state(false);
	let commandMenuPosition = $state({ x: 0, y: 0 });
	let dropdownElement = $state<HTMLDivElement>();
	let commandInput = $state('');
	let filteredCommands = $state<string[]>([]);
	let inputElement = $state<HTMLInputElement>();
	let selectedIndex = $state(0);

	const formatMethods = {
		Bold: (chain: ChainedCommands) => chain.toggleBold(),
		Italic: (chain: ChainedCommands) => chain.toggleItalic(),
		BulletList: (chain: ChainedCommands) => chain.toggleBulletList(),
		OrderedList: (chain: ChainedCommands) => chain.toggleOrderedList(),
		H1: (chain: ChainedCommands) => chain.toggleHeading({ level: 1 }),
		H2: (chain: ChainedCommands) => chain.toggleHeading({ level: 2 }),
		H3: (chain: ChainedCommands) => chain.toggleHeading({ level: 3 }),
		Table: (chain: ChainedCommands) => chain.insertTable({ rows: 3, cols: 3, withHeaderRow: true })
	} as const;

	type FormatMethod = keyof typeof formatMethods;
	onMount(() => {
		editor = new Editor({
			element: element,
			extensions: [
				StarterKit,
				Table.configure({ resizable: true }),
				TableRow,
				TableHeader,
				TableCell,
				Placeholder.configure({
					placeholder: placeholder,
					emptyEditorClass: 'is-editor-empty'
				})
			],
			content: content,
			editorProps: {
				attributes: {
					class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none p-4'
				}
			},
			onUpdate: ({ editor }) => {
				const json = editor.getJSON();
				update(json);
			}
		});
		if (!element) return;
		document.addEventListener('keydown', handleKeyDown);
		document.addEventListener('click', handleClickOutside);
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
		document.removeEventListener('keydown', handleKeyDown);
		document.removeEventListener('click', handleClickOutside);
	});

	$effect(() => {
		if (showCommandMenu && inputElement) {
			inputElement.focus();
		}
	});

	function handleKeyDown(event: KeyboardEvent) {
		if (!editor) return;
		if (event.altKey && event.key === 'i') {
			event.preventDefault();
			openCommandMenu();
		} else if (showCommandMenu && event.target === inputElement) {
			switch (event.key) {
				case 'ArrowLeft':
					event.preventDefault();
					selectedIndex = (selectedIndex - 1 + filteredCommands.length) % filteredCommands.length;
					break;
				case 'ArrowRight':
					event.preventDefault();
					selectedIndex = (selectedIndex + 1) % filteredCommands.length;
					break;
				case 'Enter':
					event.preventDefault();
					handleCommand(filteredCommands[selectedIndex] as FormatMethod);
					closeCommandMenu();
					break;
				case 'Escape':
					event.preventDefault();
					closeCommandMenu();
					break;
			}
		}
	}

	function openCommandMenu() {
		if (!element) return;
		if (!editor) return;
		const { from } = editor.state.selection;
		const coords = editor.view.coordsAtPos(from);
		const editorRect = element.getBoundingClientRect();
		showCommandMenu = true;
		commandMenuPosition = {
			x: coords.left - editorRect.left,
			y: coords.bottom - editorRect.top
		};
		commandInput = '';
		filteredCommands = Object.keys(formatMethods);
		selectedIndex = 0;
	}

	function closeCommandMenu() {
		if (!editor) return;
		showCommandMenu = false;
		editor.commands.focus();
	}

	function handleClickOutside(event: MouseEvent) {
		if (dropdownElement && !dropdownElement.contains(event.target as Node)) {
			closeCommandMenu();
		}
	}

	function handleCommand(command: FormatMethod) {
		const method = formatMethods[command];
		if (!editor) return;
		method(editor.chain().focus()).run();
	}

	function handleInputChange(event: Event) {
		const input = (event.target as HTMLInputElement).value.toLowerCase();
		commandInput = input;
		filteredCommands = Object.keys(formatMethods).filter((cmd) =>
			cmd.toLowerCase().includes(input)
		);
		selectedIndex = 0;
	}
</script>

<div class="rich-text-editor relative">
	<div bind:this={element} class="min-h-[200px]"></div>
	{#if showCommandMenu}
		<div
			bind:this={dropdownElement}
			class="absolute rounded-md border border-border bg-card p-2 shadow-lg"
			style="left: {commandMenuPosition.x}px; top: {commandMenuPosition.y}px;"
		>
			<input
				bind:this={inputElement}
				type="text"
				placeholder="Type a command..."
				bind:value={commandInput}
				oninput={handleInputChange}
				class={inputVariants({ variant: 'empty' })}
			/>
			<div class="mt-2 flex flex-wrap">
				{#each filteredCommands as format, index}
					<Button
						variant={index === selectedIndex ? 'secondary' : 'ghost'}
						size="sm"
						class="mb-2 mr-2"
						onclick={() => {
							handleCommand(format as FormatMethod);
							closeCommandMenu();
						}}
					>
						{format}
					</Button>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style lang="postcss">
	:global(.ProseMirror) {
		@apply min-h-[200px] outline-none;
	}
	:global(.ProseMirror p.is-editor-empty:first-child::before) {
		@apply pointer-events-none float-left h-0 text-muted-foreground;
		content: attr(data-placeholder);
	}
	:global(.ProseMirror table) {
		@apply w-full table-auto border-collapse;
	}
	:global(.ProseMirror td, .ProseMirror th) {
		@apply relative min-w-[100px] border border-gray-300 p-2;
	}
	:global(.ProseMirror ul) {
		@apply list-disc pl-5;
	}
	:global(.ProseMirror ol) {
		@apply list-decimal pl-5;
	}
	:global(.ProseMirror h1) {
		@apply text-2xl font-bold;
	}
	:global(.ProseMirror h2) {
		@apply text-xl font-semibold;
	}
	:global(.ProseMirror h3) {
		@apply text-lg font-medium;
	}
</style>
