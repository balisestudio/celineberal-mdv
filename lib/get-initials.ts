export const getCollaboratorInitials = (name: string): string => {
	const parts = name.trim().split(/\s+/).filter(Boolean);
	if (parts.length === 0) return "";
	if (parts.length === 1) {
		const s = parts[0];
		return (s[0] ?? "").toUpperCase() + (s[1] ?? "").toUpperCase();
	}
	const first = parts[0][0] ?? "";
	const lastPart = parts[parts.length - 1];
	const last = lastPart[0] ?? "";
	return (first + last).toUpperCase();
};
