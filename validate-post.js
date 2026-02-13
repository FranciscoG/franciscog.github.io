#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const BLOG_DIR = './content/blog';
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/**
 * 
 * @param {string} content 
 */
function parseFrontMatter(content) {
	const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
	if (!frontMatterMatch) {
		return null;
	}

	/**
	 * @type {Record<string, string>}
	 */
	const frontMatter = {};
	const lines = frontMatterMatch[1].split('\n');

	for (const line of lines) {
		const [key, ...valueParts] = line.split(':');
		if (!key.trim() || valueParts.length === 0) continue;

		const value = valueParts.join(':').trim();
		const cleanValue = value.replace(/^["']|["']$/g, '');
		frontMatter[key.trim()] = cleanValue;
	}

	return frontMatter;
}

/**
 * 
 * @param {string} dateString 
 * @returns 
 */
function validateDateFormat(dateString) {
	if (!dateString) return false;
	return DATE_PATTERN.test(dateString);
}

function main() {
	try {
		let filesToCheck = [];

		// If files are passed as arguments (from lefthook), use those
		if (process.argv.length > 2) {
			filesToCheck = process.argv.slice(2);
		} else {
			// Otherwise, scan the entire blog directory
			filesToCheck = fs.readdirSync(BLOG_DIR)
				.filter(file => file.endsWith('.md'))
				.map(file => path.join(BLOG_DIR, file));
		}

		if (filesToCheck.length === 0) {
			console.log('No markdown files found to validate');
			return;
		}

		let hasErrors = false;
		const errors = [];

		for (const filePath of filesToCheck) {
			// Only validate files that end with .md
			if (!filePath.endsWith('.md')) continue;

			const fileName = path.basename(filePath);

			try {
				const content = fs.readFileSync(filePath, 'utf-8');
				const frontMatter = parseFrontMatter(content);

				if (!frontMatter) {
					errors.push(`${fileName}: No front-matter found`);
					hasErrors = true;
					continue;
				}

				// Validate the date field has a value and is in the correct format
				if (!frontMatter.date) {
					errors.push(`${fileName}: Missing 'date' property`);
					hasErrors = true;
				} else if (!validateDateFormat(frontMatter.date)) {
					errors.push(`${fileName}: Invalid date format '${frontMatter.date}' (expected YYYY-MM-DD)`);
					hasErrors = true;
				}

				// Validate the the `draft: true` has been removed
				if (typeof frontMatter.draft !== 'undefined') {
					errors.push(`${fileName}: 'draft' property should be removed`);
					hasErrors = true;
				}
			} catch (error) {
				if (error instanceof Error) {
					errors.push(`${fileName}: Error reading file - ${error.message}`);
				} else {
					errors.push(`${fileName}: Unknown error reading file: ${error}`);
				}
				hasErrors = true;
			}
		}

		if (hasErrors) {
			console.error('❌ Post validation failed:\n');
			errors.forEach(error => console.error(`  ${error}`));
			process.exit(1);
		} else {
			console.log(`✅ All ${filesToCheck.length} file(s) are valid`);
		}
	} catch (error) {
		if (error instanceof Error) {
			console.error(`Error: ${error.message}`);
		} else {
			console.error(`Unknown error occurred: ${error}`);
		}
		process.exit(1);
	}
}

main();
