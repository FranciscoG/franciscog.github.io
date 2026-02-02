#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

/**
 * Prompts the user for input and returns their answer
 * @param {string} question - The question to display
 * @returns {Promise<string>} The user's input
 */
function askQuestion(question) {
	return new Promise((resolve) => {
		rl.question(question, (answer) => {
			resolve(answer);
		});
	});
}

/**
 * Sanitizes a string to create a valid filename
 * @param {string} str - The string to sanitize
 * @returns {string} The sanitized filename
 */
function sanitizeFilename(str) {
	// Convert to lowercase
	let filename = str.toLowerCase();
	// Replace spaces with hyphens
	filename = filename.replace(/\s+/g, '-');
	// Remove special characters (keep only letters, numbers, hyphens, underscores)
	filename = filename.replace(/[^a-z0-9\-_]/g, '');
	return filename;
}

/**
 * Generates the front matter for the markdown file
 * @param {string} title 
 * @returns {string}
 */
function printHeader(title) {
	return `
---
title: ${title}
date:
draft: true
syntax: false
tags:
  - post
---

`.trimStart();
}

/**
 * Main function to scaffold a new blog post
 * @returns {Promise<void>}
 */
async function main() {
	try {
		// Ask for post name (required)
		let postName = '';
		while (!postName.trim()) {
			postName = await askQuestion('Post name (required): ');
			if (!postName.trim()) {
				console.log('Post name cannot be blank. Please try again.');
			}
		}

		// Ask for file name (optional)
		let fileName = await askQuestion('File name (optional, press Enter to skip): ');

		// Determine the filename to use
		console.log('Generating filename, removing special characters...');
		console.log('original:', fileName || postName);
		if (fileName.trim()) {
			fileName = sanitizeFilename(fileName);
		} else {
			fileName = sanitizeFilename(postName);
		}

		// Add .md extension
		const fullFileName = `${fileName}.md`;
		console.log('final:', fullFileName);

		// generate the markdown content for the new post
		const content = printHeader(postName);

		// Write to content/drafts folder
		const outputPath = path.join(__dirname, 'content', 'drafts', fullFileName);
		fs.writeFileSync(outputPath, content, 'utf-8');

		console.log(`✓ Post created successfully at: ${outputPath}`);
		rl.close();
	} catch (error) {
		console.error('An unexpected error occurred.', error);
		rl.close();
		process.exit(1);
	}
}

await main();
