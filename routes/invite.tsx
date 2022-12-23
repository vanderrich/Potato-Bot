import { Handlers } from "$fresh/server.ts"

export const handler: Handlers = {
    GET() {
        return Response.redirect('https://discord.com/api/oauth2/authorize?client_id=894060283373449317&permissions=1375329578096&scope=bot%20applications.commands')
    }
}