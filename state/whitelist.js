import { createContainer } from "unstated-next";
import { useEffect, useState } from "react";
import { getAddress } from "ethers/lib/utils";
import axios from "axios";
import { WVET } from "vexchange-sdk";

function useWhitelist() {
    // Addresses are in checksummed format
    const [whiteListedTokens, setWhitelistedTokens] = useState(null);
    const FOUNDATION_WHITELIST_URL = "https://vechain.github.io/token-registry/main.json";

    // --> Lifecycle: on mount
    useEffect(() => {
        const fetchWhitelist = async () => {
            const result = await axios.get(FOUNDATION_WHITELIST_URL);
            const whitelist = new Map();
            result.data.forEach((token) => {
                // Converts all addresses into checksummed addresses
                const tokenContractAddress = getAddress(token.address);
                whitelist.set(tokenContractAddress, token);
            })
            // Need to include the WVET address manually as it is not in the foundation whitelist
            whitelist.set(WVET[1].address, WVET[1]);
            setWhitelistedTokens(whitelist);
        }

        fetchWhitelist();
    }, []);

    return {
        whiteListedTokens
    }
}

export const whitelist = createContainer(useWhitelist);
