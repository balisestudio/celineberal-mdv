import Image from "next/image";
import { getCollaboratorInitials } from "@/lib/get-initials";
import { getMediaSrc } from "@/lib/media-src";
import type { Collaborator, Media } from "@/payload-types";

export const CollaboratorCard = ({
	collaborator,
	variant = "card",
}: {
	collaborator: Collaborator;
	variant?: "card" | "compact" | "horizontal";
}) => {
	const photo =
		typeof collaborator.photo === "object" && collaborator.photo
			? (collaborator.photo as Media)
			: null;
	const src = photo ? getMediaSrc(photo, "thumbnail") : null;
	const showContact = variant === "card" || variant === "compact";
	const hasContact = collaborator.email ?? collaborator.phone;

	if (variant === "horizontal") {
		return (
			<div className="flex flex-row items-center gap-6">
				{src ? (
					<div className="relative w-24 h-24 shrink-0 overflow-hidden border border-sand bg-sand/20 rounded-full">
						<Image
							src={src}
							alt={collaborator.name}
							width={96}
							height={96}
							className="object-cover w-full h-full"
						/>
					</div>
				) : (
					<div className="flex w-24 h-24 shrink-0 items-center justify-center border border-sand bg-sand/20 rounded-full text-muted">
						<span className="text-2xl font-serif italic">
							{getCollaboratorInitials(collaborator.name)}
						</span>
					</div>
				)}
				<div className="min-w-0">
					<p className="font-serif text-xl italic text-charcoal">
						{collaborator.name}
					</p>
					<p className="text-sm uppercase tracking-widest text-muted mt-0.5">
						{collaborator.role}
					</p>
					{hasContact && (
						<div className="mt-2 space-y-0.5 text-sm text-muted">
							{collaborator.email && (
								<a
									href={`mailto:${collaborator.email}`}
									className="block hover:text-bordeaux transition-colors"
								>
									{collaborator.email}
								</a>
							)}
							{collaborator.phone && (
								<a
									href={`tel:${collaborator.phone.replace(/\s/g, "")}`}
									className="block hover:text-bordeaux transition-colors"
								>
									{collaborator.phone}
								</a>
							)}
						</div>
					)}
				</div>
			</div>
		);
	}

	if (variant === "compact") {
		return (
			<div className="flex h-full w-full flex-col items-center text-center gap-6">
				<div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-full border border-sand">
					{src ? (
						<Image
							src={src}
							alt={photo?.alt ?? collaborator.name}
							fill
							className="object-cover"
						/>
					) : (
						<div className="flex h-full w-full items-center justify-center bg-sand">
							<span className="font-serif text-2xl italic text-bordeaux/50">
								{getCollaboratorInitials(collaborator.name)}
							</span>
						</div>
					)}
				</div>
				<div className="flex min-h-0 w-full flex-1 flex-col items-center gap-3">
					<p className="text-sm uppercase tracking-[0.2em] text-bordeaux">
						{collaborator.role}
					</p>
					<p className="font-serif text-2xl italic text-charcoal">
						{collaborator.name}
					</p>
					{collaborator.bio ? (
						<p className="max-w-prose text-sm leading-relaxed text-muted whitespace-pre-line">
							{collaborator.bio}
						</p>
					) : null}
				</div>
				{showContact && hasContact ? (
					<div className="mt-auto flex w-full flex-col gap-1 border-t border-sand pt-4">
						{collaborator.email && (
							<a
								href={`mailto:${collaborator.email}`}
								className="text-sm text-muted transition-colors hover:text-bordeaux"
							>
								{collaborator.email}
							</a>
						)}
						{collaborator.phone && (
							<a
								href={`tel:${collaborator.phone.replace(/\s/g, "")}`}
								className="text-sm text-muted transition-colors hover:text-bordeaux"
							>
								{collaborator.phone}
							</a>
						)}
					</div>
				) : null}
			</div>
		);
	}

	// card (default) – about page style
	return (
		<li className="flex h-full flex-col items-center text-center gap-y-6">
			{src ? (
				<div className="relative aspect-square w-40 shrink-0 overflow-hidden border border-sand bg-sand/20">
					<Image
						src={src}
						alt={collaborator.name}
						width={160}
						height={160}
						className="object-cover"
					/>
				</div>
			) : (
				<div className="flex aspect-square w-40 shrink-0 items-center justify-center border border-sand bg-sand/20 text-muted">
					<span className="font-serif text-4xl italic">
						{getCollaboratorInitials(collaborator.name)}
					</span>
				</div>
			)}
			<div className="flex min-h-0 w-full flex-1 flex-col items-center gap-1">
				<p className="font-serif text-xl italic text-charcoal">
					{collaborator.name}
				</p>
				<p className="text-sm uppercase tracking-widest text-muted">
					{collaborator.role}
				</p>
				{collaborator.bio ? (
					<p className="mt-2 max-w-prose text-sm leading-relaxed text-muted whitespace-pre-line">
						{collaborator.bio}
					</p>
				) : null}
			</div>
			{showContact && hasContact ? (
				<div className="mt-auto w-full space-y-1 border-t border-sand pt-4 text-sm text-muted">
					{collaborator.email && (
						<a
							href={`mailto:${collaborator.email}`}
							className="block transition-colors hover:text-bordeaux"
						>
							{collaborator.email}
						</a>
					)}
					{collaborator.phone && (
						<a
							href={`tel:${collaborator.phone.replace(/\s/g, "")}`}
							className="block transition-colors hover:text-bordeaux"
						>
							{collaborator.phone}
						</a>
					)}
				</div>
			) : null}
		</li>
	);
};
