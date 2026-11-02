// Who may do what on a plan (R3, R5, R7, R11, R84). Every server action and page that reads
// or changes a plan asks this one function; the server supplies the facts about the request.

export type MemberRole = "owner" | "editor" | "viewer";

export type PlanAccess = {
  /** The signed-in account's membership in this plan, if any; the owner has role `owner` (R84). */
  memberRole: MemberRole | null;
  /** The request carries the plan's current share key (R3). */
  hasShareLink: boolean;
  /** Passcode version in this device's signed edit cookie for the plan, if any (R5). */
  editSessionVersion: number | null;
  /** The plan's current passcode version; changing the passcode bumps it (R11). */
  passcodeVersion: number;
};

export type PlanPermissions = {
  view: boolean;
  edit: boolean;
  /** Why this request may edit; the owner and editors need no passcode (R7, R84). */
  editVia: "owner" | "member" | "passcode" | null;
  /** Owner only (R7). */
  delete: boolean;
  /** Owner only (R11). */
  changePasscode: boolean;
  /** Invite, approve, change roles, remove members: owner only (R84). */
  manageMembers: boolean;
  /** Anyone who may edit (R3). */
  changeShareKey: boolean;
  /** Members other than the owner may leave (R84). */
  leave: boolean;
};

export function planPermissions(access: PlanAccess): PlanPermissions {
  const { memberRole } = access;
  const isOwner = memberRole === "owner";
  // An old passcode stops working once the owner changes it (R11).
  const hasPasscode = access.editSessionVersion === access.passcodeVersion;
  const editVia = isOwner
    ? "owner"
    : memberRole === "editor"
      ? "member"
      : hasPasscode
        ? "passcode"
        : null;
  const edit = editVia !== null;

  return {
    // Members open the plan from their list without the link; a device that can edit is moved
    // to the new link when the share key changes (R3, R84).
    view: access.hasShareLink || memberRole !== null || hasPasscode,
    edit,
    editVia,
    delete: isOwner,
    changePasscode: isOwner,
    manageMembers: isOwner,
    changeShareKey: edit,
    leave: memberRole === "editor" || memberRole === "viewer",
  };
}
