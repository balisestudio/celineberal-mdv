import type { User } from "@/payload-types";

const ROLE_RANK: Record<User["role"], number> = {
	viewer: 0,
	editor: 1,
	admin: 2,
};

export const can = (
	user: User | null | undefined,
	permission: User["role"],
): boolean => {
	if (!user?.role) return false;
	const userRank = ROLE_RANK[user.role];
	const requiredRank = ROLE_RANK[permission];
	return userRank >= requiredRank;
};
