function ProfileMenu() {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="size-48 bg-amber-200"
      style={{
        position: "absolute",
        top: "0px",
        right: "5%",
        transform: "translate(0,80px)",
      }}
    >
      <div>ProfileMenu</div>
    </div>
  );
}

export default ProfileMenu;
