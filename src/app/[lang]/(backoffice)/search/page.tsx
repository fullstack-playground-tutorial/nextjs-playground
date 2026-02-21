"use client";
import { search } from "@/app/feature/search/action";
import { SearchItem } from "@/app/feature/search/search";
import { UserItem } from "./components/UserItem";
import { useEffect, useState, useTransition } from "react";
import { addFriend, cancel, unfriend } from "@/app/feature/friend/actions";
import Loading from "../../loading";
import { getLocaleService } from "@/app/utils/resource/locales";
import { useParams } from "next/navigation";

interface Props {
  params: { language: string };
  searchParams: { q: string | undefined };
}

interface InternalState {
  list: SearchItem[];
  total: number;
  userId?: string;
}

const initialState: InternalState = {
  total: 0,
  list: [],
};

function SearchPage({ params, searchParams }: Props) {
  const [isPending, startTransition] = useTransition(); // should set at top
  const [state, setState] = useState(initialState);
  const routeParams = useParams();
  const { localize } = getLocaleService(routeParams.lang as string);

  async function handleUnFriend(friendId: string): Promise<boolean> {
    const res = await unfriend(friendId);
    if (res > 0) {
      const newList = state.list.map((item) => {
        if (item.id == friendId) {
          item.friendStatus = "U";
        }
        return item;
      });
      setState((prevState) => ({ ...prevState, list: newList }));
      return true;
    }
    return false;
  }

  async function handleCancel(friendId: string): Promise<boolean> {
    const res = await cancel(friendId);
    if (res > 0) {
      const newList = state.list.map((item) => {
        if (item.id == friendId) {
          item.friendStatus = "C";
        }
        return item;
      });

      setState((prevState) => ({ ...prevState, list: newList }));
      return true;
    }
    return false;
  }

  async function handleAddFriend(friendId: string): Promise<boolean> {
    const res = await addFriend(friendId);
    if (res > 0) {
      const newList = state.list.map((item) => {
        if (item.id == friendId) {
          item.friendStatus = "P";
        }
        return item;
      });
      setState((prevState) => ({ ...prevState, list: newList }));
      return true;
    }
    return false;
  }

  useEffect(() => {
    startTransition(async function () {
      const { result, userId } = await search(searchParams.q ?? "");
      setState({
        list: result.list,
        total: result.total,
        userId: userId,
      });
    });
  }, [searchParams.q]);

  const renderList = (items: SearchItem[]) => {
    return (
      <div className="flex flex-col gap-4 h-full overflow-clip p-4">
        {items &&
          items.map((item) => {
            switch (item.type) {
              case "user":
                return (
                  <UserItem
                    key={item.id}
                    userId={state.userId}
                    item={item}
                    handleAddFriend={handleAddFriend}
                    handleUnfriend={handleUnFriend}
                    handleCancel={handleCancel}
                    startTransition={startTransition}
                  />
                );
              default:
                return <></>;
            }
          })}
      </div>
    );
  };
  return (
    <>
      {isPending && <Loading />}
      {
        <div className="bg-transparent flex-1 rounded-lg flex sm:flex-col md:flex-row overflow-hidden gap-4 p-4 mx-auto w-3/4">
          <h1 className="text-2xl font-bold text-white text-center">
            {localize("search_title")}
          </h1>
          <div>{renderList(state.list)}</div>
        </div>
      }
    </>
  );
}
export default SearchPage;
