import { createSessionStore } from "./sessionStore";

// When the user accepted the consent screen. Only used for the report's
// "Kesto" figure, and session-scoped like every other piece of state: the
// consent copy promises nothing outlives the tab.
const store = createSessionStore<number>("lukiseula-started-at");

export const markScreeningStarted = (): void => store.save(Date.now());
export const loadScreeningStartedAt = (): number | null => store.load();
