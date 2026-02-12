import {
  EditIcon,
  LockClosedIcon,
  LockOpenIcon,
  MoreHorizontalIcon,
  OrganizeIcon,
  SortIcon,
} from "@/components/icons";

type Props = {
  isCollectionPrivate: boolean;
  isCollectionOwner: boolean;
  // user: { avatar: string | null; username: string; firstname: string };
};

function CollectionToolbar(props: Props) {
  const {
    isCollectionOwner,
    isCollectionPrivate,
    // user: { avatar, username, firstname },
  } = props;

  const toolbar = [
    {
      name: "Edit",
      icon: EditIcon,
      fn: () => {},
    },
    {
      name: "Privacy",
      icon: isCollectionPrivate ? LockOpenIcon : LockClosedIcon,
      fn: () => {},
    },
    {
      name: "Organize",
      icon: OrganizeIcon,
      fn: () => {},
    },

    {
      name: "Sort",
      icon: SortIcon,
      fn: () => {},
    },

    {
      name: "More",
      icon: MoreHorizontalIcon,
      fn: () => {},
    },
  ];

  const rendered_icons = toolbar.map((tool) => {
    const Icon = tool.icon;
    return (
      <button
        key={tool.name}
        className="rounded-full size-8.5 flex justify-center items-center gray cursor-pointer transition-colors duration-200 ease-in-out hover:bg-zinc-200"
      >
        <Icon className="size-3.5 text-neutral-800/60" />
      </button>
    );
  });
  return <>{rendered_icons}</>;
}

export default CollectionToolbar;
