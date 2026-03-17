import { CollaboratorCard } from "@/components/collaborator/collaborator-card";
import { Container } from "@/components/ui/container";
import type { Collaborator } from "@/payload-types";

type CollaboratorItem = number | Collaborator;

const isPopulated = (c: CollaboratorItem): c is Collaborator =>
	typeof c === "object" && c !== null && "name" in c;

export const CollaboratorsSection = ({
	collaborators,
	titleLabel,
}: {
	collaborators: (number | Collaborator)[] | null | undefined;
	titleLabel: string;
}) => {
	const list = collaborators?.filter(isPopulated) ?? [];
	if (list.length === 0) return null;

	return (
		<section className="bg-blanc-casse py-20 border-t border-sand/50">
			<Container>
				<h2 className="font-serif italic text-3xl text-charcoal mb-10">
					{titleLabel}
				</h2>
				<ul className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
					{list.map((collab) => (
						<CollaboratorCard
							key={collab.id}
							collaborator={collab}
							variant="card"
						/>
					))}
				</ul>
			</Container>
		</section>
	);
};
