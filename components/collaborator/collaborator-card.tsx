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
			<div className="flex flex-col items-center text-center gap-3">
				<div className="relative w-32 h-32 rounded-full border border-sand overflow-hidden shrink-0">
					{src ? (
						<Image
							src={src}
							alt={photo?.alt ?? collaborator.name}
							fill
							className="object-cover"
						/>
					) : (
						<div className="w-full h-full bg-sand flex items-center justify-center">
							<span className="font-serif italic text-2xl text-bordeaux/50">
								{getCollaboratorInitials(collaborator.name)}
							</span>
						</div>
					)}
				</div>
				<p className="text-sm uppercase tracking-[0.2em] text-bordeaux">
					{collaborator.role}
				</p>
				<p className="font-serif italic text-2xl text-charcoal">
					{collaborator.name}
				</p>
				{showContact && hasContact && (
					<div className="border-t border-sand pt-3 mt-1 flex flex-col gap-1 w-full">
						{collaborator.email && (
							<a
								href={`mailto:${collaborator.email}`}
								className="text-sm text-muted hover:text-bordeaux transition-colors"
							>
								{collaborator.email}
							</a>
						)}
						{collaborator.phone && (
							<a
								href={`tel:${collaborator.phone.replace(/\s/g, "")}`}
								className="text-sm text-muted hover:text-bordeaux transition-colors"
							>
								{collaborator.phone}
							</a>
						)}
					</div>
				)}
			</div>
		);
	}

	// card (default) – about page style
	return (
		<li className="flex flex-col items-center text-center">
			{src ? (
				<div className="relative aspect-square w-40 overflow-hidden border border-sand bg-sand/20">
					<Image
						src={src}
						alt={collaborator.name}
						width={160}
						height={160}
						className="object-cover"
					/>
				</div>
			) : (
				<div className="flex aspect-square w-40 items-center justify-center border border-sand bg-sand/20 text-muted">
					<span className="text-4xl font-serif italic">
						{getCollaboratorInitials(collaborator.name)}
					</span>
				</div>
			)}
			<p className="mt-4 font-serif text-xl italic text-charcoal">
				{collaborator.name}
			</p>
			<p className="mt-1 text-sm uppercase tracking-widest text-muted">
				{collaborator.role}
			</p>
			{showContact && hasContact && (
				<div className="mt-2 space-y-1 text-sm text-muted">
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
		</li>
	);
};
