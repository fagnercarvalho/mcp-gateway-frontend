export type UserRecord = {
  id: string;
  email: string;
  passwordStatus: "Password set" | "Reset required";
  roleNames: string[];
};

const users: UserRecord[] = [
  {
    id: "usr-1",
    email: "ana@northstar.dev",
    passwordStatus: "Password set",
    roleNames: ["Platform Admin"],
  },
  {
    id: "usr-2",
    email: "sam@northstar.dev",
    passwordStatus: "Reset required",
    roleNames: ["Gateway Operator", "Security Reviewer"],
  },
  {
    id: "usr-3",
    email: "kai@datadog-partner.io",
    passwordStatus: "Password set",
    roleNames: ["Developer"],
  },
  {
    id: "usr-4",
    email: "mia@enterprise.example",
    passwordStatus: "Password set",
    roleNames: ["Developer"],
  },
];

export async function getUsers() {
  return users;
}
