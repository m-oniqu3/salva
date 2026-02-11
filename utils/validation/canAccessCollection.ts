type AccessCheckParams = {
  collectionOwnerID: string;
  isPrivate: boolean;
  currentUserID?: string | null;
};

// can view the collection is it belongs to the current user or if the collection is public
export function canAccessCollection({
  collectionOwnerID,
  isPrivate,
  currentUserID,
}: AccessCheckParams): boolean {
  const isOwnedByCurrentUser = currentUserID === collectionOwnerID;
  return !isPrivate || isOwnedByCurrentUser;
}
