import { getThreadService, getCommentService } from "@/app/core/server/context";
import { getUser } from "@/app/dal";
import { CACHE_TAG } from "@/app/utils/cache/tag";
import { Comment } from "../comment";
import { ThreadClient } from "./ThreadClient";

interface Props {
  ownerId: string;
  ownerType: string;
}

export const Thread = async ({ ownerId, ownerType }: Props) => {
  const threadService = getThreadService();
  const user = await getUser();

  let threads = await threadService
    .loadByOwner(ownerId, ownerType, {
      tags: [CACHE_TAG.THREAD + "-" + ownerId],
    })
    .catch(() => []);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <ThreadClient
        initialThreads={threads}
        ownerId={ownerId}
        ownerType={ownerType}
        currentUser={user?.user}
      />
    </div>
  );
};
