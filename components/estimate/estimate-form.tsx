"use client";

import { useTranslations } from "next-intl";
import { Fragment, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@/i18n/navigation";
import type {
	EstimateCoords,
	EstimateDetails,
	PhotoRef,
} from "@/lib/schemas/estimate";
import {
	estimateConsentsSchema,
	estimateCoordsSchema,
	MAX_PHOTOS,
	MIN_PHOTOS,
} from "@/lib/schemas/estimate";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ACCEPT = "image/jpeg,image/png,image/webp";

type Step = 0 | 1 | 2;

export const EstimateForm = ({ siteName }: { siteName: string }) => {
	const t = useTranslations("estimate");
	const tErrors = useTranslations("estimate.errors");

	const [step, setStep] = useState<Step>(0);
	const [submitted, setSubmitted] = useState(false);
	const [globalError, setGlobalError] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState(false);

	const [coords, setCoords] = useState<EstimateCoords>({
		civility: "man",
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		address: "",
		postalCode: "",
		city: "",
	});
	const [coordsErrors, setCoordsErrors] = useState<
		Partial<Record<keyof EstimateCoords, string>>
	>({});
	const [details, setDetails] = useState<EstimateDetails>({
		dimensions: "",
		descriptions: "",
	});
	const [photos, setPhotos] = useState<File[]>([]);
	const [photoError, setPhotoError] = useState<string | null>(null);
	const [consentsAccepted, setConsentsAccepted] = useState(false);
	const [consentsReuse, setConsentsReuse] = useState(false);
	const [consentsError, setConsentsError] = useState<string | null>(null);

	const progressPercent = step === 0 ? 0 : step === 1 ? 50 : 100;

	const handleCoordsNext = useCallback(() => {
		const result = estimateCoordsSchema.safeParse(coords);
		if (!result.success) {
			const fieldErrors: Partial<Record<keyof EstimateCoords, string>> = {};
			for (const issue of result.error.issues) {
				const key = issue.path[0] as keyof EstimateCoords;
				fieldErrors[key] = tErrors(
					issue.message as "required" | "invalidEmail",
				);
			}
			setCoordsErrors(fieldErrors);
			return;
		}
		setCoordsErrors({});
		setStep(1);
	}, [coords, tErrors]);

	const handleDetailsBack = useCallback(() => setStep(0), []);
	const handleDetailsNext = useCallback(() => {
		if (photos.length < MIN_PHOTOS) {
			setPhotoError(tErrors("minPhotos"));
			return;
		}
		setPhotoError(null);
		setStep(2);
	}, [photos.length, tErrors]);

	const handleConsentsBack = useCallback(() => setStep(1), []);
	const handleConsentsSubmit = useCallback(async () => {
		const result = estimateConsentsSchema.safeParse({
			acceptedTerms: consentsAccepted,
			allowsPhotoReuse: consentsReuse,
		});
		if (!result.success) {
			setConsentsError(tErrors("cguRequired"));
			return;
		}
		setConsentsError(null);
		setGlobalError(null);
		setSubmitting(true);

		try {
			const presignRes = await fetch("/api/estimates/presign", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					files: photos.map((f) => ({
						filename: f.name,
						mimeType: f.type,
						size: f.size,
					})),
				}),
			});
			const presignData = await presignRes.json();
			if (!presignRes.ok) {
				setGlobalError(tErrors(presignData.error ?? "uploadFailed"));
				setSubmitting(false);
				return;
			}

			const refs: PhotoRef[] = [];
			for (let i = 0; i < presignData.urls.length; i++) {
				const { url, key } = presignData.urls[i];
				const file = photos[i];
				const putRes = await fetch(url, {
					method: "PUT",
					body: file,
					headers: { "Content-Type": file.type },
				});
				if (!putRes.ok) {
					setGlobalError(tErrors("uploadFailed"));
					setSubmitting(false);
					return;
				}
				refs.push({
					key,
					filename: file.name,
					mimeType: file.type,
					size: file.size,
				});
			}

			const submitRes = await fetch("/api/estimates/submit", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...coords,
					...details,
					acceptedTerms: true,
					allowsPhotoReuse: consentsReuse,
					photos: refs,
				}),
			});
			const submitData = await submitRes.json();
			if (!submitRes.ok) {
				setGlobalError(tErrors(submitData.error ?? "submitFailed"));
				setSubmitting(false);
				return;
			}
			setSubmitted(true);
		} catch {
			setGlobalError(tErrors("submitFailed"));
		}
		setSubmitting(false);
	}, [consentsAccepted, consentsReuse, photos, coords, details, tErrors]);

	const addPhotos = useCallback(
		(files: FileList | null) => {
			if (!files?.length) return;
			const next: File[] = [];
			for (let i = 0; i < files.length; i++) {
				const f = files[i];
				if (
					ALLOWED_TYPES.includes(f.type) &&
					photos.length + next.length < MAX_PHOTOS
				) {
					next.push(f);
				}
			}
			setPhotos((prev) => {
				const combined = [...prev, ...next].slice(0, MAX_PHOTOS);
				return combined;
			});
			setPhotoError(null);
		},
		[photos.length],
	);

	const removePhoto = useCallback((index: number) => {
		setPhotos((prev) => prev.filter((_, i) => i !== index));
	}, []);

	if (submitted) {
		return (
			<Container size="hero" className="py-12">
				<div className="flex flex-col items-center text-center">
					<div
						className="flex h-16 w-16 items-center justify-center border border-sand bg-sand text-bordeaux"
						aria-hidden
					>
						{/* Decorative checkmark, parent has aria-hidden */}
						{/* biome-ignore lint/a11y/noSvgWithoutTitle: decorative icon */}
						<svg
							className="h-8 w-8"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M5 13l4 4L19 7"
							/>
						</svg>
					</div>
					<h2 className="mt-6 font-serif text-3xl italic text-charcoal">
						{t("confirmation.title")}
					</h2>
					<p className="mt-3 max-w-[448px] text-base leading-relaxed text-muted">
						{t("confirmation.message", { siteName })}
					</p>
					<Button href="/" variant="outline" size="lg" className="mt-8">
						{t("confirmation.backHome")}
					</Button>
				</div>
			</Container>
		);
	}

	return (
		<Container size="hero" className="pt-8 pb-16">
			{/* Stepper: squares row with bars aligned to their center, labels below */}
			<div className="mx-3.5 mb-10 flex items-start">
				{([0, 1, 2] as const).map((s) => {
					const isPast = step > s;
					const isCurrent = step === s;
					const label =
						s === 0
							? t("stepper.coords")
							: s === 1
								? t("stepper.object")
								: t("stepper.consents");
					return (
						<Fragment key={s}>
							<div className="flex flex-1 flex-col items-center">
								<button
									type="button"
									onClick={isPast ? () => setStep(s) : undefined}
									disabled={!isPast}
									className={`flex h-8 w-8 shrink-0 items-center justify-center border text-base font-sans transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bordeaux disabled:cursor-not-allowed disabled:opacity-60 ${
										isPast
											? "border-bordeaux bg-bordeaux text-blanc-casse"
											: isCurrent
												? "border-bordeaux bg-white text-bordeaux"
												: "border-sand bg-white text-muted"
									}`}
								>
									{isPast ? <span aria-hidden>✓</span> : s + 1}
								</button>
								<span
									className={`mt-1.5 text-center text-sm uppercase tracking-wider ${
										isCurrent ? "text-bordeaux" : "text-muted"
									}`}
								>
									{label}
								</span>
							</div>
							{s < 2 && (
								<div
									className="flex h-8 flex-1 min-w-[20px] items-center px-2"
									aria-hidden
								>
									<div className="relative h-px w-full bg-sand">
										<div
											className="absolute inset-y-0 left-0 bg-bordeaux transition-all duration-300"
											style={{
												width: step > s ? "100%" : "0%",
											}}
										/>
									</div>
								</div>
							)}
						</Fragment>
					);
				})}
			</div>

			{/* Coords */}
			{step === 0 && (
				<div>
					<h2 className="mb-6 font-serif text-2xl italic text-charcoal">
						{t("coords.title")}
					</h2>
					<div className="space-y-4">
						<div>
							<Label className="mb-1">{t("coords.civility")} *</Label>
							<div className="flex gap-4">
								<label className="flex cursor-pointer items-center gap-2">
									<input
										type="radio"
										name="civility"
										value="man"
										checked={coords.civility === "man"}
										onChange={() =>
											setCoords((p) => ({ ...p, civility: "man" }))
										}
										className="accent-bordeaux"
									/>
									<span className="text-base text-charcoal">
										{t("coords.civilityMr")}
									</span>
								</label>
								<label className="flex cursor-pointer items-center gap-2">
									<input
										type="radio"
										name="civility"
										value="woman"
										checked={coords.civility === "woman"}
										onChange={() =>
											setCoords((p) => ({ ...p, civility: "woman" }))
										}
										className="accent-bordeaux"
									/>
									<span className="text-base text-charcoal">
										{t("coords.civilityMrs")}
									</span>
								</label>
							</div>
							{coordsErrors.civility && (
								<p className="mt-1 text-base text-red-600">
									{coordsErrors.civility}
								</p>
							)}
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label htmlFor="firstName" className="mb-1">
									{t("coords.firstName")} *
								</Label>
								<Input
									id="firstName"
									value={coords.firstName}
									onChange={(e) =>
										setCoords((p) => ({ ...p, firstName: e.target.value }))
									}
								/>
								{coordsErrors.firstName && (
									<p className="mt-1 text-base text-red-600">
										{coordsErrors.firstName}
									</p>
								)}
							</div>
							<div>
								<Label htmlFor="lastName" className="mb-1">
									{t("coords.lastName")} *
								</Label>
								<Input
									id="lastName"
									value={coords.lastName}
									onChange={(e) =>
										setCoords((p) => ({ ...p, lastName: e.target.value }))
									}
								/>
								{coordsErrors.lastName && (
									<p className="mt-1 text-base text-red-600">
										{coordsErrors.lastName}
									</p>
								)}
							</div>
						</div>
						<div>
							<Label htmlFor="email" className="mb-1">
								{t("coords.email")} *
							</Label>
							<Input
								id="email"
								type="email"
								value={coords.email}
								onChange={(e) =>
									setCoords((p) => ({ ...p, email: e.target.value }))
								}
							/>
							{coordsErrors.email && (
								<p className="mt-1 text-base text-red-600">
									{coordsErrors.email}
								</p>
							)}
						</div>
						<div>
							<Label htmlFor="phone" className="mb-1">
								{t("coords.phone")} *
							</Label>
							<Input
								id="phone"
								type="tel"
								value={coords.phone}
								onChange={(e) =>
									setCoords((p) => ({ ...p, phone: e.target.value }))
								}
							/>
							{coordsErrors.phone && (
								<p className="mt-1 text-base text-red-600">
									{coordsErrors.phone}
								</p>
							)}
						</div>
						<div>
							<Label htmlFor="address" className="mb-1">
								{t("coords.address")}
							</Label>
							<Input
								id="address"
								value={coords.address ?? ""}
								onChange={(e) =>
									setCoords((p) => ({ ...p, address: e.target.value }))
								}
							/>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label htmlFor="postalCode" className="mb-1">
									{t("coords.postalCode")}
								</Label>
								<Input
									id="postalCode"
									value={coords.postalCode ?? ""}
									onChange={(e) =>
										setCoords((p) => ({ ...p, postalCode: e.target.value }))
									}
								/>
							</div>
							<div>
								<Label htmlFor="city" className="mb-1">
									{t("coords.city")}
								</Label>
								<Input
									id="city"
									value={coords.city ?? ""}
									onChange={(e) =>
										setCoords((p) => ({ ...p, city: e.target.value }))
									}
								/>
							</div>
						</div>
					</div>
					<Button
						type="button"
						variant="primary"
						size="lg"
						className="mt-8 w-full"
						onClick={handleCoordsNext}
					>
						{t("coords.continue")}
					</Button>
				</div>
			)}

			{/* Details */}
			{step === 1 && (
				<div>
					<h2 className="mb-6 font-serif text-2xl italic text-charcoal">
						{t("details.title")}
					</h2>
					<div className="space-y-4">
						<div>
							<Label className="mb-2 block">{t("details.photosLabel")} *</Label>
							<input
								type="file"
								accept={ACCEPT}
								multiple
								className="sr-only"
								id="photos-input"
								disabled={photos.length >= MAX_PHOTOS}
								onChange={(e) => addPhotos(e.target.files)}
							/>
							<label
								htmlFor="photos-input"
								className={`flex min-h-[120px] cursor-pointer flex-col items-center justify-center border-2 border-dashed p-8 transition-colors ${
									photoError
										? "border-bordeaux bg-bordeaux/5"
										: photos.length >= MAX_PHOTOS
											? "cursor-not-allowed border-sand bg-sand/10 opacity-50"
											: "border-sand bg-blanc-casse hover:border-bordeaux/40 hover:bg-sand/20"
								}`}
							>
								<span className="text-center text-base text-muted">
									{photos.length > 0
										? t("details.photosCount", {
												current: photos.length,
												count: photos.length,
											})
										: t("details.photosDrop")}
								</span>
								<span className="mt-1 text-sm text-muted">
									{t("details.photosHint")}
								</span>
							</label>
							{photoError && (
								<p className="mt-1 text-base text-red-600">{photoError}</p>
							)}
							{photos.length > 0 && (
								<div className="mt-3 flex gap-2 overflow-x-auto pb-2">
									{photos.map((file, i) => (
										<div
											key={`${file.name}-${file.size}-${i}`}
											className="relative h-16 w-16 shrink-0 overflow-hidden border border-sand bg-sand/10"
										>
											{/* Blob URL preview, next/image does not support createObjectURL */}
											{/* biome-ignore lint/performance/noImgElement: in-memory file preview */}
											<img
												src={URL.createObjectURL(file)}
												alt=""
												className="h-full w-full object-cover"
											/>
											<button
												type="button"
												onClick={() => removePhoto(i)}
												className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center border border-bordeaux bg-bordeaux text-blanc-casse hover:bg-bordeaux/90"
											>
												×
											</button>
										</div>
									))}
								</div>
							)}
						</div>
						<div>
							<Label htmlFor="dimensions" className="mb-1">
								{t("details.dimensions")}
							</Label>
							<Input
								id="dimensions"
								placeholder={t("details.dimensionsPlaceholder")}
								value={details.dimensions ?? ""}
								onChange={(e) =>
									setDetails((p) => ({ ...p, dimensions: e.target.value }))
								}
							/>
						</div>
						<div>
							<Label htmlFor="descriptions" className="mb-1">
								{t("details.comment")}
							</Label>
							<Textarea
								id="descriptions"
								placeholder={t("details.commentPlaceholder")}
								rows={4}
								value={details.descriptions ?? ""}
								onChange={(e) =>
									setDetails((p) => ({ ...p, descriptions: e.target.value }))
								}
							/>
						</div>
					</div>
					<div className="mt-8 flex gap-4">
						<Button type="button" variant="ghost" onClick={handleDetailsBack}>
							{t("details.back")}
						</Button>
						<Button
							type="button"
							variant="primary"
							size="lg"
							className="flex-1"
							onClick={handleDetailsNext}
						>
							{t("details.continue")}
						</Button>
					</div>
				</div>
			)}

			{/* Consents */}
			{step === 2 && (
				<div>
					<h2 className="mb-6 font-serif text-2xl italic text-charcoal">
						{t("consents.title")}
					</h2>
					<div className="space-y-4">
						<div>
							<Checkbox
								checked={consentsAccepted}
								onChange={(e) => setConsentsAccepted(e.target.checked)}
							>
								<span>
									{t.rich("consents.cguLabel", {
										terms: (chunks) => (
											<Link href="/about" className="text-bordeaux underline">
												{chunks}
											</Link>
										),
										privacy: (chunks) => (
											<Link href="/about" className="text-bordeaux underline">
												{chunks}
											</Link>
										),
									})}{" "}
									<span className="text-bordeaux" aria-hidden>
										*
									</span>
								</span>
							</Checkbox>
							{consentsError && (
								<p className="mt-1 text-base text-red-600">{consentsError}</p>
							)}
						</div>
						<div>
							<Checkbox
								checked={consentsReuse}
								onChange={(e) => setConsentsReuse(e.target.checked)}
							>
								{t("consents.photoReuseLabel", { siteName })}
							</Checkbox>
						</div>
						<div className="border border-sand bg-sand/10 px-4 py-3 text-base text-muted">
							{t("consents.reminder")}
						</div>
						{globalError && (
							<div className="border-2 border-bordeaux/30 bg-bordeaux/10 px-4 py-3 text-base text-bordeaux">
								{globalError}
							</div>
						)}
					</div>
					<div className="mt-8 flex gap-4">
						<Button
							type="button"
							variant="ghost"
							onClick={handleConsentsBack}
							disabled={submitting}
						>
							{t("consents.back")}
						</Button>
						<Button
							type="button"
							variant="primary"
							size="lg"
							className="flex-1"
							onClick={handleConsentsSubmit}
							disabled={submitting}
						>
							{submitting ? t("consents.submitting") : t("consents.submit")}
						</Button>
					</div>
				</div>
			)}
		</Container>
	);
};
