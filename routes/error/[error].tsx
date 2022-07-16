/** @jsx h */
import { h } from "preact";
import { PageProps, Handlers } from "$fresh/server.ts";
import { apiStuff, Error as BotError } from "../../static/apistuff.ts";
import { tw } from "@twind";
import TopNav from "../../islands/TopNav.tsx";
const { errors } = apiStuff;

export const handler: Handlers<BotError | null> = {
    GET(_, ctx) {
        const errorId = ctx.params.error;
        const error = errors.find((error) => error.id === errorId)
        return ctx.render(error!);
    },
};

export default function Error(props: PageProps<BotError | null>) {
    const error = props.data;
    if (!error) {
        return <h1>Error not found</h1>;
    }

    return (
        <div class={tw`bg-background h-screen`}>
            <TopNav /><br /><br /><br />
            <main>
                <h1>Error {error.id}</h1>
                <div>
                    <h2>{error.error}</h2>
                    <p>Interaction Name: <strong>{error.name}</strong></p>
                    <p>Interaction Type: <strong>{error.type}</strong></p>
                    <p>Stack: </p>
                    <pre class={tw`bg-code-bg rounded-md p-2.5`}><code class={tw`text-code-text-color bg-code-bg font-code`}>{error.stack}</code></pre>
                </div>
            </main>
        </div>
    );
}