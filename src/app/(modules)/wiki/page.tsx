
export default function Wiki() {

    return (<div>
        <form action="/wiki/getWiki" method="post">
            <input type="search" name="search" placeholder="Search..." />
            <button type="submit">Search</button>
        </form>
    </div>);
}