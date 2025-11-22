type Props = {
  closeModal: () => void;
};

function EditCollection(props: Props) {
  const { closeModal } = props;
  console.log(closeModal);
  return <div className="c-container max-w-sm">edit collection</div>;
}

export default EditCollection;
