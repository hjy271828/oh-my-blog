import siteConfig from "./src/utils/config";

const config = siteConfig({
	title: "Jiayu Hu's Blog",
	prologue: "Better late\nthan never.",
	author: {
		name: "Jiayu Hu",
		email: "hjy271828@gmail.com",
		link: "https://hjy271828.github.io"
	},
	description: "A learner.",
	copyright: {
		type: "CC BY-NC-ND 4.0",
		year: "2025"
	},
	i18n: {
		locales: ["en"],
		defaultLocale: "en"
	},
	pagination: {
		note: 15,
		jotting: 24
	},
	heatmap: {
		unit: "day",
		weeks: 20
	},
	feed: {
		section: "*",
		limit: 20
	},
	latest: "*"
});

export const monolocale = Number(config.i18n.locales.length) === 1;

export default config;
