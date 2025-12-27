"use client";

import { CloseIcon } from "@/components/icons";
import FollowingCollection from "@/components/profile/FollowingCollection";
import FollowingPeople from "@/components/profile/FollowingPeople";
import { useModal } from "@/context/useModal";
import { useState } from "react";

type Props = { closeModal: () => void };

const tabs = ["People", "Boards"];

function Following(props: Props) {
  const { closeModal } = props;

  const { stopPropagation } = useModal();
  const [activeTab, setActiveTab] = useState(tabs ? tabs[0] : "");

  const renderedTabs = tabs.map((t) => (
    <button
      key={t}
      onClick={() => setActiveTab(t)}
      className={`font-bold text-sml rounded-2xl cursor-pointer text-black/40 ${
        activeTab == t ? "bg-neutral-700 text-white" : ""
      } `}
    >
      {t}
    </button>
  ));

  const renderedContent =
    activeTab === tabs[0] ? <FollowingPeople /> : <FollowingCollection />;

  return (
    <section
      className="panel p-0 pb-6 max-w-sm flex flex-col"
      onClick={stopPropagation}
    >
      <header className="sticky top-0 z-10 p-8 bg-white">
        <h1 className="text-lg font-semibold text-neutral-800">Following</h1>

        <p className="text-sml">
          {activeTab === tabs[0]
            ? "People who this user is following."
            : "Collections this user is following."}
        </p>

        <button
          onClick={closeModal}
          className="absolute top-8 right-8 cursor-pointer"
        >
          <CloseIcon className="size-5" />
        </button>

        <div className="h-14 grid grid-cols-2 p-2 mt-6 gray rounded-3xl">
          {renderedTabs}
        </div>
      </header>

      <article className="h-full">{renderedContent}</article>
    </section>
  );
}

export default Following;
