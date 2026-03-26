export default function () {
	const isDev = process.env.ELEVENTY_RUN_MODE === "serve";
	return {
		permalink: isDev ? "/drafts/" : false,
	};
}
