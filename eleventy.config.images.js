import path from "node:path";
import eleventyImage from "@11ty/eleventy-img";

export default function (eleventyConfig) {
	function relativeToInputPath(inputPath, relativeFilePath) {
		let split = inputPath.split("/");
		split.pop();

		return path.resolve(split.join(path.sep), relativeFilePath);
	}

	// Eleventy Image shortcode
	// https://www.11ty.dev/docs/plugins/image/
	eleventyConfig.addAsyncShortcode(
		"image",
		/**
		 *
		 * @param {string} src
		 * @param {string} alt
		 * @param {string} widths
		 * @param {string} sizes
		 * @param {"lazy" | "eager"} loading
		 * @returns
		 */
		async function imageShortcode(src, alt, widths, sizes, loading = "lazy") {
			// Full list of formats here: https://www.11ty.dev/docs/plugins/image/#output-formats
			// Warning: Avif can be resource-intensive so take care!
			let formats = ["avif", "webp", "auto"];
			let file = relativeToInputPath(this.page.inputPath, src);
			let metadata = await eleventyImage(file, {
				widths: widths || ["auto"],
				formats,
				outputDir: path.join(eleventyConfig.dir.output, "img"), // Advanced usage note: `eleventyConfig.dir` works here because we’re using addPlugin.
			});

			let imageAttributes = {
				alt,
				sizes,
				loading,
				decoding: "async",
			};
			return eleventyImage.generateHTML(metadata, imageAttributes);
		}
	);
}

/*
For now this site is hosted on Github pages so images are just stored in the repo and linked to directly. 

If we decide to move to another service to host the site that charges for bandwidth, maybe it would make
sense to convert images to base64 and embed them directly in the HTML. This would reduce the number of 
requests and bandwidth used, but it would also increase the size of the HTML files.

 1. Custom shortcode (no plugin needed)
	// eleventy.config.js
	const fs = require("fs");
	const path = require("path");

	eleventyConfig.addShortcode("inlineImg", (src, alt, mimeType = "image/png") => {
		const data = fs.readFileSync(src);
		const b64 = data.toString("base64");
		return `<img src="data:${mimeType};base64,${b64}" alt="${alt}" loading="lazy" decoding="async" />`;
	});

	2. Or run the image through @11ty/eleventy-img to get an optimized WebP/AVIF, then read that output file and base64 encode it in the same shortcode.


*/