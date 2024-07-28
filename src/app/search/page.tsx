import { type SearchParams, searchFood } from "../queries";
import { LoggableSearchResult } from "./LoggableSearchResult";

export default async function SearchPageTerm(props: {
  searchParams: SearchParams;
}) {
  const food = await searchFood(props.searchParams);

  return (
    <div className="p-4">
      <form action="/search" method="get" className="mb-4 flex w-full gap-2">
        <input
          type="search"
          name="term"
          defaultValue={props.searchParams.term}
          className="border p-2"
          autoFocus
        />
        <button type="submit" className="btn">
          Search
        </button>
      </form>

      <ul className="grid gap-4">
        {food.map((f, i) => (
          <LoggableSearchResult key={i} food={f} />
        ))}
      </ul>
    </div>
  );
}
