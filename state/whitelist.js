import { createContainer } from "unstated-next";
import { useEffect, useState } from "react";
import axios from "axios";

function useWhitelist() {
    const [whiteListedTokens, setWhitelistedTokens] = useState(null);

    const FOUNDATION_WHITELIST_URL = "https://vechain.github.io/token-registry/main.json";

    const fetchWhitelist = async () =>
    {
        const result = await axios.get(FOUNDATION_WHITELIST_URL);
        console.log(result);
    }

    // --> Lifecycle: on mount
    useEffect(fetchWhitelist, [])
}

export const whitelist = createContainer(useWhitelist)
