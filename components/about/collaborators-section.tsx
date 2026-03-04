import Image from "next/image";
import { Container } from "@/components/ui/container";
import { getCollaboratorInitials } from "@/lib/get-initials";
import { getMediaSrc } from "@/lib/media-src";
import type { Collaborator, Media } from "@/payload-types";

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
		<section className="bg-blanc-casse py-20">
			<Container>
				<h2 className="text-sm uppercase tracking-[0.2em] text-muted font-sans mb-10">
					{titleLabel}
				</h2>
				<ul className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
					{list.map((collab) => {
						const photo =
							typeof collab.photo === "object" && collab.photo
								? (collab.photo as Media)
								: null;
						const src = photo ? getMediaSrc(photo, "thumbnail") : null;
						return (
							<li
								key={collab.id}
								className="flex flex-col items-center text-center"
							>
								{src ? (
									<div className="relative aspect-square w-40 overflow-hidden border border-sand bg-sand/20">
										<Image
											src={src}
											alt={collab.name}
											width={160}
											height={160}
											className="object-cover"
										/>
									</div>
								) : (
									<div className="flex aspect-square w-40 items-center justify-center border border-sand bg-sand/20 text-muted">
										<span className="text-4xl font-serif italic">
											{getCollaboratorInitials(collab.name)}
										</span>
									</div>
								)}
								<p className="mt-4 font-serif text-xl italic text-charcoal">
									{collab.name}
								</p>
								{(collab.email ?? collab.phone) && (
									<div className="mt-2 space-y-1 text-sm text-muted">
										{collab.email && (
											<a
												href={`mailto:${collab.email}`}
												className="block hover:text-bordeaux transition-colors"
											>
												{collab.email}
											</a>
										)}
										{collab.phone && (
											<a
												href={`tel:${collab.phone.replace(/\s/g, "")}`}
												className="block hover:text-bordeaux transition-colors"
											>
												{collab.phone}
											</a>
										)}
									</div>
								)}
							</li>
						);
					})}
				</ul>
			</Container>
		</section>
	);
};
