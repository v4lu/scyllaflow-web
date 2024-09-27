<script lang="ts">
	import { Editor, type ChainedCommands } from '@tiptap/core';
	import Placeholder from '@tiptap/extension-placeholder';
	import Table from '@tiptap/extension-table';
	import TableCell from '@tiptap/extension-table-cell';
	import TableHeader from '@tiptap/extension-table-header';
	import TableRow from '@tiptap/extension-table-row';
	import StarterKit from '@tiptap/starter-kit';
	import { onDestroy, onMount } from 'svelte';

	type Props = {
		content: object;
		placeholder: string;
		update: (val: object) => void;
	};

	let { content, placeholder, update }: Props = $props();
	let element = $state<HTMLElement>();
	let editor = $state<Editor>();

	const formatMethods = {
		Bold: (chain: ChainedCommands) => chain.toggleBold(),
		Italic: (chain: ChainedCommands) => chain.toggleItalic(),
		BulletList: (chain: ChainedCommands) => chain.toggleBulletList(),
		OrderedList: (chain: ChainedCommands) => chain.toggleOrderedList()
	} as const;

	type FormatMethod = keyof typeof formatMethods;

	onMount(() => {
		editor = new Editor({
			element: element,
			extensions: [
				StarterKit,
				Table.configure({
					resizable: true
				}),
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
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});

	function toggleFormat(format: FormatMethod) {
		const method = formatMethods[format];
		if (!editor) return;
		method(editor.chain().focus()).run();
	}

	function setHeading(level: 1 | 2 | 3) {
		if (!editor) return;
		editor.chain().focus().toggleHeading({ level }).run();
	}

	function insertTable() {
		if (!editor) return;
		editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
	}
</script>

<div class="rich-text-editor rounded-md border border-gray-300">
	<div bind:this={element} class="min-h-[200px]"></div>
	<div class="flex flex-wrap gap-2 border-t border-gray-300 p-2">
		<button
			onclick={() => toggleFormat('Bold')}
			class="rounded px-2 py-1 text-sm font-medium hover:bg-gray-100">B</button
		>
		<button
			onclick={() => toggleFormat('Italic')}
			class="rounded px-2 py-1 text-sm font-medium italic hover:bg-gray-100">I</button
		>
		<button
			onclick={() => setHeading(1)}
			class="rounded px-2 py-1 text-sm font-bold hover:bg-gray-100">H1</button
		>
		<button
			onclick={() => setHeading(2)}
			class="rounded px-2 py-1 text-sm font-semibold hover:bg-gray-100">H2</button
		>
		<button onclick={() => setHeading(3)} class="rounded px-2 py-1 text-sm hover:bg-gray-100"
			>H3</button
		>
		<button
			onclick={() => toggleFormat('BulletList')}
			class="rounded px-2 py-1 text-sm hover:bg-gray-100">• List</button
		>
		<button
			onclick={() => toggleFormat('OrderedList')}
			class="rounded px-2 py-1 text-sm hover:bg-gray-100">1. List</button
		>
		<button onclick={insertTable} class="rounded px-2 py-1 text-sm hover:bg-gray-100">Table</button>
	</div>
</div>

<style lang="postcss">
	:global(.ProseMirror) {
		@apply min-h-[200px] outline-none;
	}
	:global(.ProseMirror p.is-editor-empty:first-child::before) {
		@apply pointer-events-none float-left h-0 text-gray-400;
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
