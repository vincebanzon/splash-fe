import { Chat } from "./chat";

function Header({ title }) {
return <h1>{title ? title : "Default title"}</h1>
}

export default function HomePage() {
const names = ["Ada Lovelace", "Grace Hopper", "Margaret Hamilton"]

return (
    <div>
        <Chat currentUser="CPU 1"/>
    </div>
)
}

<HomePage />
