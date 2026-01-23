<script lang="ts">
import { getRelativeLocaleUrl } from "astro:i18n";
import type { Snippet } from "svelte";
import { fade } from "svelte/transition";
import i18nit from "$i18n";

let { locale, password, back, children }: { locale: string; password?: string; back: string; children: Snippet } = $props();

const t = i18nit(locale);

// 密码保护状态
let passwordInput = $state("");
let passwordError = $state(false);

// 初始化时检查是否需要密码保护以及是否已解锁
function checkUnlocked(): boolean {
	// 如果没有设置密码，直接解锁
	if (!password) return true;

	// 在浏览器环境检查 sessionStorage
	if (typeof window !== "undefined") {
		const storageKey = `unlocked_${btoa(password)}`;
		return sessionStorage.getItem(storageKey) === "true";
	}

	// SSR 时默认锁定
	return false;
}

let isUnlocked = $state(checkUnlocked());

function handlePasswordSubmit() {
	if (passwordInput === password) {
		isUnlocked = true;
		passwordError = false;
		// 保存解锁状态到 sessionStorage
		if (typeof window !== "undefined" && password) {
			const storageKey = `unlocked_${btoa(password)}`;
			sessionStorage.setItem(storageKey, "true");
		}
	} else {
		passwordError = true;
		passwordInput = "";
	}
}

function handleKeydown(e: KeyboardEvent) {
	if (e.key === "Enter") {
		handlePasswordSubmit();
	}
}
</script>

{#if password && !isUnlocked}
	<!-- 密码保护界面 -->
	<div transition:fade={{ duration: 150 }} class="flex flex-col items-center justify-center gap-6 min-h-[50vh]">
		<div class="flex flex-col items-center gap-2">
			<span class="text-4xl">🔒</span>
			<h2 class="text-xl font-bold">{t("protected.title") || "Password Protected"}</h2>
		</div>
		<p class="text-secondary text-center">{t("protected.description") || "This content requires a password to view."}</p>
		<div class="flex flex-col items-center gap-3 w-full max-w-xs">
			<input
				type="password"
				bind:value={passwordInput}
				onkeydown={handleKeydown}
				placeholder={t("protected.placeholder") || "Enter password"}
				class="w-full px-3 py-2 border border-weak rounded-md bg-background text-primary focus:outline-none focus:ring-2 focus:ring-primary"
			/>
			{#if passwordError}
				<p transition:fade={{ duration: 100 }} class="text-red-500 text-sm">{t("protected.error") || "Incorrect password"}</p>
			{/if}
			<div class="flex gap-3">
				<button
					type="button"
					onclick={handlePasswordSubmit}
					class="font-bold text-background bg-primary py-2 px-4 rounded-md hover:opacity-90 transition-opacity"
				>
					{t("protected.submit") || "Unlock"}
				</button>
				<a
					href={getRelativeLocaleUrl(locale, back)}
					class="flex items-center font-bold text-background bg-secondary py-2 px-4 rounded-md hover:opacity-90 transition-opacity"
				>
					{t("protected.back") || "Go Back"}
				</a>
			</div>
		</div>
	</div>
{:else}
	<div transition:fade={{ delay: 150, duration: 150 }}>{@render children()}</div>
{/if}
