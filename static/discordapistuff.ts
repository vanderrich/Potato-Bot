import { APIGuild, APIGuildChannel, APIRole, RESTGetAPIOAuth2CurrentAuthorizationResult } from "discord-api-types";
import * as APIStuff from "./apistuff.ts";
const config = Deno.env.toObject();

export function getOAuthUrl() {
    const state = crypto.randomUUID();

    const url = new URL('https://discord.com/api/oauth2/authorize');
    url.searchParams.set('client_id', config.CLIENT_ID);
    url.searchParams.set('redirect_uri', config.REDIRECT_URI);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('state', state);
    url.searchParams.set('scope', 'role_connections.write identify guilds');
    url.searchParams.set('prompt', 'consent');
    return { state, url: url.toString() };
}

/**
 * Given an OAuth2 code from the scope approval page, make a request to Discord's
 * OAuth2 service to retreive an access token, refresh token, and expiration.
 */
export async function getOAuthTokens(code: string) {
    const url = 'https://discord.com/api/v10/oauth2/token';
    const body = new URLSearchParams({
        client_id: config.CLIENT_ID,
        client_secret: config.CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: config.REDIRECT_URI,
    });

    const response = await fetch(url, {
        body,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
    if (response.ok) {
        const data = await response.json();
        return data;
    } else {
        throw new Error(`Error fetching OAuth tokens: [${response.status}] ${response.statusText}`);
    }
}

/**
 * The initial token request comes with both an access token and a refresh
 * token.  Check if the access token has expired, and if it has, use the
 * refresh token to acquire a new, fresh access token.
 */
export async function getAccessToken(tokens: APIStuff.Tokens) {
    if (Date.now() > tokens.expires_at) {
        const url = 'https://discord.com/api/v10/oauth2/token';
        const body = new URLSearchParams({
            client_id: config.CLIENT_ID,
            client_secret: config.CLIENT_SECRET,
            grant_type: 'refresh_token',
            refresh_token: tokens.refresh_token,
        });
        const response = await fetch(url, {
            body,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        if (response.ok) {
            const tokens = await response.json();
            tokens.expires_at = Date.now() + tokens.expires_in * 1000;
            return tokens.access_token;
        } else {
            throw new Error(`Error refreshing access token: [${response.status}] ${response.statusText}`);
        }
    }
    return tokens.access_token;
}

/**
 * Given a user based access token, fetch profile information for the current user.
 */
export async function getUserData(tokens: APIStuff.Tokens): Promise<RESTGetAPIOAuth2CurrentAuthorizationResult> {
    const url = 'https://discord.com/api/v10/oauth2/@me';
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${tokens.access_token}`,
        },
    });
    if (response.ok) {
        const data = await response.json();
        return data;
    } else {
        throw new Error(`Error fetching user data: [${response.status}] ${response.statusText}`);
    }
}

export async function getUserGuilds(tokens: APIStuff.Tokens): Promise<APIGuild[]> {
    const url = 'https://discord.com/api/v10/users/@me/guilds';
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${tokens.access_token}`,
        },
    });
    if (response.ok) {
        const data = await response.json();
        console.log(data)
        return data;
    } else {
        throw new Error(`Error fetching user guilds: [${response.status}] ${response.statusText}`);
    }

}

export async function getGuildChannels(guildId: string): Promise<APIGuildChannel<any>[]> {
    const url = `https://discord.com/api/v10/guilds/${guildId}/channels`;
    const response = await fetch(url, {
        headers: {
            Authorization: `Bot ${config.DISCORD_TOKEN}`,
        },
    });
    if (response.ok) {
        const data = await response.json();
        console.log(data)
        return data;
    } else {
        throw new Error(`Error fetching guild channels: [${response.status}] ${response.statusText}`);
    }
}

export async function getGuildRoles(guildId: string): Promise<APIRole[]> {
    const url = `https://discord.com/api/v10/guilds/${guildId}/roles`;
    const response = await fetch(url, {
        headers: {
            Authorization: `Bot ${config.DISCORD_TOKEN}`,
        },
    });
    if (response.ok) {
        const data = await response.json();
        console.log(data)
        return data;
    } else {
        throw new Error(`Error fetching guild: [${response.status}] ${response.statusText}`);
    }
}

/**
 * Given metadata that matches the schema, push that data to Discord on behalf
 * of the current user.
 */
export async function pushMetadata(tokens: APIStuff.Tokens, metadata: any) {
    // GET/PUT /users/@me/applications/:id/role-connection
    const url = `https://discord.com/api/v10/users/@me/applications/${config.CLIENT_ID}/role-connection`;
    const accessToken = await getAccessToken(tokens);
    const body = {
        platform_name: 'Example Linked Role Discord Bot',
        metadata,
    };
    const response = await fetch(url, {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        throw new Error(`Error pushing discord metadata: [${response.status}] ${response.statusText}`);
    }
}

/**
 * Fetch the metadata currently pushed to Discord for the currently logged
 * in user, for this specific bot.
 */
export async function getMetadata(tokens: APIStuff.Tokens) {
    // GET/PUT /users/@me/applications/:id/role-connection
    const url = `https://discord.com/api/v10/users/@me/applications/${config.CLIENT_ID}/role-connection`;
    const accessToken = await getAccessToken(tokens);
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    if (response.ok) {
        const data = await response.json();
        return data;
    } else {
        throw new Error(`Error getting discord metadata: [${response.status}] ${response.statusText}`);
    }
}

export async function updateMetadata(tokens: APIStuff.Tokens) {
    let metadata = {};
    try {
        // Fetch the new metadata you want to use from an external source. 
        // This data could be POST-ed to this endpoint, but every service
        // is going to be different.  To keep the example simple, we'll
        // just generate some random data. 
        metadata = {
            birthday: "2003-12-20"
        };
    } catch (e) {
        e.message = `Error fetching external data: ${e.message}`;
        console.error(e);
        // If fetching the profile data for the external service fails for any reason,
        // ensure metadata on the Discord side is nulled out. This prevents cases
        // where the user revokes an external app permissions, and is left with
        // stale linked role data.
    }

    // Push the data to Discord.
    await pushMetadata(tokens!, metadata);
}

export async function revokeAccess(tokens: APIStuff.Tokens) {
    const url = 'https://discord.com/api/oauth2/token/revoke';

    // push empty Metadata to Discord to null out the verified role
    await pushMetadata(tokens, {});

    // revoke the refresh token
    await fetch(url,
        {
            method: 'POST',
            body: new URLSearchParams({
                client_id: config.DISCORD_CLIENT_ID,
                client_secret: config.DISCORD_CLIENT_SECRET,
                token: tokens!.refresh_token,
                token_type_hint: 'refresh_token',
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
}