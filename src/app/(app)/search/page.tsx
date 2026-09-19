import { Suspense } from "react";
import { SearchView } from "@/components/command/search-view";
import SearchLoading from "./loading";

export const metadata = {
  title: "Search — KhanijDrishti",
};

/**
 * Global Search route. `SearchView` reads/writes the `?q=` param via
 * `useSearchParams`, which requires a Suspense boundary for static shells.
 */
export default function SearchPage() {
  return (
    <Suspense fallback={<SearchLoading />}>
      <SearchView />
    </Suspense>
  );
}
