// Import state helpers
import { whitelist } from "@state/whitelist"

// Export state wrapper
export function StateProvider({ children }) {
    return (
        <whitelist.Provider>
            {children}
        </whitelist.Provider>
    );
}
