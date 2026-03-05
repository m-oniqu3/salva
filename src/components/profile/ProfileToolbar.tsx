import { AddIcon, EditIcon, SortIcon } from "@/components/icons";
import Tool from "@/components/Tool";
import { useModal } from "@/context/useModal";
import { ModalEnum } from "@/types/modal";
import { ProfileSummary } from "@/types/user";

type Props = {
  profileSummary: ProfileSummary;
};
function ProfileToolbar(props: Props) {
  const { profileSummary } = props;

  const { openModal } = useModal();

  function handleEditModal() {
    openModal({
      type: ModalEnum.EDIT_PROFILE,
      payload: { profileSummary },
    });
  }

  function handleCreateCollection() {
    openModal({
      type: ModalEnum.CREATE_COLLECTION,
    });
  }

  const toolbar = [
    { name: "Edit", icon: EditIcon, handler: handleEditModal },

    { name: "Sort", icon: SortIcon, handler: () => {} },
    { name: "Create", icon: AddIcon, handler: handleCreateCollection },
  ];

  return (
    <div className="flex items-center flex-wrap gap-3">
      {
        <>
          {toolbar.map((tool) => (
            <Tool key={tool.name} tool={tool} />
          ))}
        </>
      }
    </div>
  );
}

export default ProfileToolbar;
