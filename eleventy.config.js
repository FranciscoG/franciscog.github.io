import { DateTime } from "luxon";
import markdownItAnchor from "markdown-it-anchor";
import markdownItFootnote from "markdown-it-footnote";
import fontAwesomePlugin from "@11ty/font-awesome";
import pluginRss from "@11ty/eleventy-plugin-rss";
import pluginSyntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import pluginBundle from "@11ty/eleventy-plugin-bundle";
import pluginNavigation from "@11ty/eleventy-navigation";
import { EleventyHtmlBasePlugin, EleventyRenderPlugin } from "@11ty/eleventy";
import pluginDrafts from "./eleventy.config.drafts.js";
import pluginImages from "./eleventy.config.images.js";

export default function (eleventyConfig) {
	// Copy the contents of the `public` folder to the output folder
	// For example, `./public/css/` ends up in `_site/css/`
	eleventyConfig.addPassthroughCopy({
		"./public/": "/",
		"./node_modules/prismjs/themes/prism-okaidia.css": "/css/prism-okaidia.css",
	});

	// Run Eleventy when these files change:
	// https://www.11ty.dev/docs/watch-serve/#add-your-own-watch-targets

	// Watch content images for the image pipeline.
	eleventyConfig.addWatchTarget("content/**/*.{svg,webp,png,jpeg}");

	// App plugins
	eleventyConfig.addPlugin(pluginDrafts);
	eleventyConfig.addPlugin(pluginImages);

	// Official plugins
	eleventyConfig.addPlugin(pluginRss);
	eleventyConfig.addPlugin(pluginSyntaxHighlight, {
		preAttributes: { tabindex: 0 },
	});
	eleventyConfig.addPlugin(pluginNavigation);
	eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
	eleventyConfig.addPlugin(pluginBundle);
	eleventyConfig.addPlugin(EleventyRenderPlugin);
	eleventyConfig.addPlugin(fontAwesomePlugin);

	eleventyConfig.addShortcode("icon", function (icon, a11yText) {
		return `<span title="${a11yText}"><i class="${icon} icon" aria-hidden="true"></i><span class="visually-hidden">${a11yText}</span></span>`;
	});

	eleventyConfig.addShortcode("externalLink", function (href, text) {
		return `<a href="${href}" target="_blank" rel="noopener">${text || href}</a>`;
	});

	eleventyConfig.addShortcode("clr", function (colorHex) {
		return `<span class="color-block" style="background-color: ${colorHex};"></span>`;
	});

	eleventyConfig.addFilter(
		"getNewestCollectionItemDate",
		pluginRss.getNewestCollectionItemDate
	);
	eleventyConfig.addFilter("dateToRfc3339", pluginRss.dateToRfc3339);

	// Filters
	eleventyConfig.addFilter("readableDate", (dateObj, format, zone) => {
		// Formatting tokens for Luxon: https://moment.github.io/luxon/#/formatting?id=table-of-tokens
		return DateTime.fromJSDate(dateObj, { zone: zone || "utc" }).toFormat(
			format || "dd LLLL yyyy"
		);
	});

	eleventyConfig.addFilter("htmlDateString", (dateObj) => {
		// dateObj input: https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
		return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("yyyy-LL-dd");
	});

	eleventyConfig.addFilter("year", () => {
		return DateTime.now().toFormat("yyyy");
	});

	// Get the first `n` elements of a collection.
	eleventyConfig.addFilter("head", (array, n) => {
		if (!Array.isArray(array) || array.length === 0) {
			return [];
		}
		if (n < 0) {
			return array.slice(n);
		}

		return array.slice(0, n);
	});

	// Return the smallest number argument
	eleventyConfig.addFilter("min", (...numbers) => {
		return Math.min.apply(null, numbers);
	});

	// Return all the tags used in a collection
	eleventyConfig.addFilter("getAllTags", (collection) => {
		let tagSet = new Set();
		for (let item of collection) {
			(item.data.tags || []).forEach((tag) => tagSet.add(tag));
		}
		return Array.from(tagSet);
	});

	eleventyConfig.addFilter("filterTagList", function filterTagList(tags) {
		return (tags || []).filter(
			(tag) => ["all", "nav", "post", "posts"].indexOf(tag) === -1
		);
	});

	// this filter moves all drafts up to the top of the list
	eleventyConfig.addFilter("sortDrafts", (collection) => {
		return collection.sort((a, b) => {
			if (a.data.tags && a.data.tags.includes("drafts")) {
				return 1;
			} else if (b.data.tags && b.data.tags.includes("drafts")) {
				return -1;
			}
			return 0;
		});
	});

	// 11ty by default reads your .gitignore and ignores files listed there.
	// I turned it off because it was ignoring my drafts folder.
	// https://www.11ty.dev/docs/ignores/
	eleventyConfig.setUseGitIgnore(false);

	// Customize Markdown library settings:
	eleventyConfig.amendLibrary("md", (mdLib) => {
		mdLib.use(markdownItAnchor, {
			permalink: markdownItAnchor.permalink.ariaHidden({
				placement: "after",
				class: "header-anchor",
				symbol: "#",
				ariaHidden: false,
			}),
			level: [1, 2, 3, 4],
			slugify: eleventyConfig.getFilter("slugify"),
		});
		mdLib.use(markdownItFootnote);

		// Remember the old renderer if overridden, or proxy to the default renderer.
		const defaultRender =
			mdLib.renderer.rules.link_open ||
			function (tokens, idx, options, env, self) {
				return self.renderToken(tokens, idx, options);
			};

		mdLib.renderer.rules.link_open = function (
			tokens,
			idx,
			options,
			env,
			self
		) {
			const hrefIndex = tokens[idx].attrIndex('href');
			const href = hrefIndex >= 0 ? tokens[idx].attrs[hrefIndex][1] : '';

			// Only add target="_blank" to external links (http/https)
			if (href.startsWith('http://') || href.startsWith('https://')) {
				tokens[idx].attrSet("target", "_blank");
			}

			// Pass the token to the default renderer.
			return defaultRender(tokens, idx, options, env, self);
		};
	});

	// Features to make your build faster (when you need them)

	// If your passthrough copy gets heavy and cumbersome, add this line
	// to emulate the file copy on the dev server. Learn more:
	// https://www.11ty.dev/docs/copy/#emulate-passthrough-copy-during-serve

	// eleventyConfig.setServerPassthroughCopyBehavior("passthrough");

	return {
		// Control which files Eleventy will process
		// e.g.: *.md, *.njk, *.html, *.liquid
		templateFormats: ["md", "njk", "html", "webc"],

		// Pre-process *.md files with: (default: `liquid`)
		markdownTemplateEngine: "njk",

		// Pre-process *.html files with: (default: `liquid`)
		htmlTemplateEngine: "njk",

		// These are all optional:
		dir: {
			input: "content", // default: "."
			includes: "../_includes", // default: "_includes"
			data: "../_data", // default: "_data"

			// during development we build to, and serve from, the gitignored _site folder
			// during production we build to the docs folder, which is served by GitHub Pages
			// we need to use "docs" instead of something like "dist" because GitHub Pages
			// only serves from the root or the docs folder
			output: process.env.ELEVENTY_RUN_MODE === "serve" ? "_site" : "docs",
		},

		// -----------------------------------------------------------------
		// Optional items:
		// -----------------------------------------------------------------

		// If your site deploys to a subdirectory, change `pathPrefix`.
		// Read more: https://www.11ty.dev/docs/config/#deploy-to-a-subdirectory-with-a-path-prefix

		// When paired with the HTML <base> plugin https://www.11ty.dev/docs/plugins/html-base/
		// it will transform any absolute URLs in your HTML to include this
		// folder name and does **not** affect where things go in the output folder.
		pathPrefix: "/",
	};
}
