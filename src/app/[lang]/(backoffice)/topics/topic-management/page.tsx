"use client"
import {
  FilterBar,
  FilterDropdown,
  SearchComponent,
  type FilterDropdownItem,
} from "../../components/Search";
import { useState } from "react";
import Link from "next/link";
import { deleteTopic, searchTopics } from "@/app/feature/topic";
import Topics from "./components/Topics";

type InternalState = {
  loadCount: number;
  searchQuery: string;
  filterVisibility: boolean;
  sort?: string;
};

const initialState: InternalState = {
  loadCount: 1,
  searchQuery: "",
  filterVisibility: false,
};

const selectedList: FilterDropdownItem[] = [
  {
    value: "createdAt",
    title: "Last used",
  },
  {
    value: "-createdAt",
    title: "Newest",
  },
];

export default function TopicManagement() {
  const [state, setState] = useState(initialState);
  const { loadCount, searchQuery, filterVisibility, sort } = state;
  const pageSize = 8;
  const updateState = (val: Partial<InternalState>) => {
    setState((prev) => ({ ...prev, ...val }));
  };

  const handleDeleteTopic = async (id: string) => {
    const { success } = await deleteTopic(id);
  };

  const loadMore = async () => {
    await searchTopics(searchQuery, pageSize * loadCount, sort);
    // update load count on server side ???
  };

  // Don't await the data fetching function
  const searchResult = searchTopics(searchQuery, pageSize * loadCount, sort);

  // const search = async () => {
  //   return getTopicService()
  //     .search(
  //       searchQuery,
  //       {},
  //       {
  //         sort: sort,
  //         limit: pageSize * loadCount,
  //       }
  //     )
  //     .then((res) => {
  //       updateState({ loadCount: loadCount + 1 });
  //       return res;
  //     });
  // };

  // const deleteMutation = useMutation({
  //   mutationFn: topicService.delete,
  //   onSuccess: async () => {
  //     toast.addToast("success", "Topic've already deleted");
  //     await queryClient.invalidateQueries({ queryKey: ["topics"] });
  //   },
  //   onError: (err) => {
  //     console.log(err);
  //     throw err;
  //   },
  // });

  const handleSelected = (k: string) => {
    setState((prev) => ({ ...prev, sortOptionsVisibility: false, sort: k }));
  };

  // const { data, refetch, isFetching, isLoading } = useQuery({
  //   queryKey: ["topics", sort],
  //   queryFn: search,
  //   refetchOnMount: true,
  //   refetchOnWindowFocus: false,
  //   staleTime: 0,
  // });

  return (
    <div className="p-4 dark:bg-surface-0 h-screen dark:text-primary max-w-300 mx-auto flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 mt-2">
        <h1 className="font-semibold text-accent-0">Topic Management</h1>
      </div>

      <div className="flex flex-row justify-between gap-2 sm:gap-4 items-start mb-2">
        <SearchComponent
          placeHolder={"Search Title or Author"}
          onQueryChange={(q) => updateState({ searchQuery: q })}
          filterOn={filterVisibility}
          onFilterToggle={() =>
            updateState({ filterVisibility: !filterVisibility })
          }
          onSearch={() => searchTopics(searchQuery, pageSize * loadCount, sort)}
        />
        <Link
          href={"/topics/topic-management/create"}
          className="btn btn-md dark:bg-accent-0 dark:text-primary cursor-pointer transition dark:hover:bg-accent-1 dark:active:bg-accent-1"
        >
          + New Topic
        </Link>
      </div>
      <div
        className={`transition-all self-start ${
          filterVisibility ? "mt-2" : "h-0"
        }`}
      >
        <FilterBar visible={filterVisibility}>
          <FilterDropdown
            name={"sort"}
            selectedList={selectedList}
            placeHolder="Sort by"
            onItemSelected={(val) => handleSelected(val)}
          />
        </FilterBar>
      </div>
      <Topics
        pageSize={pageSize}
        searchResult={searchResult}
        searchQ={searchQuery}
        onDeleteTopic={handleDeleteTopic}
        loadMore={loadMore}
      />
    </div>
  );
}
