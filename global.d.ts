interface Window {
  readonly navigation?: Navigation;
}

/**
 * Just a subset of the window.navigation API needed for this project.
 * See: https://developer.mozilla.org/en-US/docs/Web/API/Navigation
 */
interface Navigation { 
  readonly activation: NavigationActivation;
	readonly currentEntry: NavigationHistoryEntry | null;	
}

interface NavigationActivation { 
	readonly from: NavigationHistoryEntry | null;
}

interface NavigationHistoryEntry {
	readonly url: string;
}