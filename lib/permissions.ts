import type { User } from "@/payload-types";

const ROLE_RANK: Record<User["roles"], number> = {
	viewer: 0,
	editor: 1,
	admin: 2,
};

export const can = (
	user: User | null | undefined,
	permission: User["roles"],
): boolean => {
	if (!user?.roles) return false;
	const userRank = ROLE_RANK[user.roles];
	const requiredRank = ROLE_RANK[permission];
	return userRank >= requiredRank;
};
