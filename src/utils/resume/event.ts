import type React from "react";

/**
 * Handles clicks on hyperlinks within contentEditable containers.
 * Browsers naturally disable link navigation within contentEditable areas.
 * This function intercepts the click and manually triggers navigation if an <a> tag is found.
 */
export const handleContentEditableLinkClick = (e: React.MouseEvent<HTMLElement>) => {
	const target = e.target as HTMLElement;
	const anchor = target.closest("a");

	if (anchor?.href) {
		// Manually trigger navigation since contentEditable blocks it
		const url = anchor.href;
		const targetAttr = anchor.getAttribute("target") || "_blank";

		window.open(url, targetAttr, "noopener,noreferrer");

		e.preventDefault();
		e.stopPropagation();
	}
};
