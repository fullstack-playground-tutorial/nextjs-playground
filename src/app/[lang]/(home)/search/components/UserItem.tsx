"use client";
import { InternalizationContext } from "@/app/core/client/context/internalization/InternalizationContext";
import { FriendStatus, SearchItem } from "@/app/feature/search/search";
import React, {
  TransitionStartFunction,
  useContext,
} from "react";

interface Props {
  item: SearchItem;
  userId?: string;
  startTransition: TransitionStartFunction;
  handleAddFriend(friendId: string): Promise<boolean>;
  handleUnfriend(friendId: string): Promise<boolean>;
  handleCancel(friendId: string): Promise<boolean>;
}

export const UserItem = (props: Props) => {
  const internalization = useContext(InternalizationContext);
  const handleAddFriendOnClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    props.startTransition(() => {
      props.item.id && props.handleAddFriend(props.item.id);
    });
  };
  const handleUnfriendOnClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    props.startTransition(() => {
      props.item.id && props.handleUnfriend(props.item.id);
    });
  };

  const handleCancelFriendRequestOnClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    props.startTransition(() => {
      props.item.id && props.handleCancel(props.item.id);
    });
  };

  const renderButton = (friendStatus?: FriendStatus) => {
    let content;
    let action: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    switch (friendStatus) {
      case "A":
        // show unfriend button
        content = internalization?.localize("unfriend");
        action = handleUnfriendOnClick;
        break;
      case "C":
      case "R":
      case "U":
      case undefined:
        // show add friend button
        content = internalization?.localize("friend_request_send");
        action = handleAddFriendOnClick;
        break;
      case "P":
        // show cancel friend request button
        content = internalization?.localize("friend_request_cancel");
        action = handleCancelFriendRequestOnClick;
        break;
      default:
        break;
    }
    return (
      <button
        type="button"
        className="ml-auto rounded-full shadow-lg block text-sm h-8 bg-glass-200 px-2 border border-t-glass-500 border-l-glass-500 border-r-glass-200 border-b-glass-200"
        onClick={(e) => action(e)}
      >
        {content}
      </button>
    );
  };

  return (
    <div
      className="flex flex-row gap-2 text-white rounded-lg items-center shadow-lg p-2 bg-glass-100  border border-l-glass-500 backdrop-blur-md border-t-glass-500 border-r-glass-200 border-b-glass-200"
      key={props.item.id}
    >
      <div className="flex shadow-md items-center justify-center h-12 w-12 rounded-full bg-glass-200 border border-t-glass-500 border-l-glass-500 border-r-glass-200 border-b-glass-200">
        <img
          className="h-full w-full rounded-full border-2 border-white"
          src="https://i.pinimg.com/736x/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg"
          alt=""
          srcSet="https://i.pinimg.com/736x/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg"
        />
      </div>
      <div className="flex flex-col">
        <div className="font-semibold text-lg">{props.item.name}</div>
        <div className="font-normal text-sm">{props.item.description}</div>
      </div>
      {props.userId &&
        props.item.id != props.userId &&
        renderButton(props.item.friendStatus)}
    </div>
  );
};
