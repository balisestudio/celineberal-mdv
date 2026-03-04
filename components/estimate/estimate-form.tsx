"use client";

import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@/i18n/navigation";
import type {
	EstimateStep0,
	EstimateStep1,
	PhotoRef,
} from "@/lib/schemas/estimate";
import {
	estimateStep0Schema,
	estimateStep2Schema,
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

	const [step0, setStep0] = useState<EstimateStep0>({
		civility: "man",
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		address: "",
		postalCode: "",
		city: "",
	});
	const [step0Errors, setStep0Errors] = useState<
		Partial<Record<keyof EstimateStep0, string>>
	>({});
	const [step1, setStep1] = useState<EstimateStep1>({
		dimensions: "",
		descriptions: "",
	});
	const [photos, setPhotos] = useState<File[]>([]);
	const [photoError, setPhotoError] = useState<string | null>(null);
	const [step2Accepted, setStep2Accepted] = useState(false);
	const [step2Reuse, setStep2Reuse] = useState(false);
	const [step2Error, setStep2Error] = useState<string | null>(null);

	const progressPercent = step === 0 ? 0 : step === 1 ? 50 : 100;

	const handleStep0Continue = useCallback(() => {
		const result = estimateStep0Schema.safeParse(step0);
		if (!result.success) {
			const fieldErrors: Partial<Record<keyof EstimateStep0, string>> = {};
			for (const issue of result.error.issues) {
				const key = issue.path[0] as keyof EstimateStep0;
				fieldErrors[key] = tErrors(
					issue.message as "required" | "invalidEmail",
				);
			}
			setStep0Errors(fieldErrors);
			return;
		}
		setStep0Errors({});
		setStep(1);
	}, [step0, tErrors]);

	const handleStep1Back = useCallback(() => setStep(0), []);
	const handleStep1Continue = useCallback(() => {
		if (photos.length < MIN_PHOTOS) {
			setPhotoError(tErrors("minPhotos"));
			return;
		}
		setPhotoError(null);
		setStep(2);
	}, [photos.length, tErrors]);

	const handleStep2Back = useCallback(() => setStep(1), []);
	const handleStep2Submit = useCallback(async () => {
		const result = estimateStep2Schema.safeParse({
			acceptedTerms: step2Accepted,
			allowsPhotoReuse: step2Reuse,
		});
		if (!result.success) {
			setStep2Error(tErrors("cguRequired"));
			return;
		}
		setStep2Error(null);
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
					...step0,
					...step1,
					acceptedTerms: true,
					allowsPhotoReuse: step2Reuse,
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
	}, [step2Accepted, step2Reuse, photos, step0, step1, tErrors]);

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
		<Container size="hero" className="pb-16">
			{/* Stepper */}
			<div className="mx-3.5 mb-10">
				<div className="relative h-0.5 w-full bg-sand">
					<div
						className="absolute left-0 top-0 h-full bg-bordeaux transition-all duration-300"
						style={{ width: `${progressPercent}%` }}
					/>
				</div>
				<div className="mt-4 flex justify-between">
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
							<button
								key={s}
								type="button"
								onClick={isPast ? () => setStep(s) : undefined}
								disabled={!isPast}
								className="flex flex-col items-center gap-1"
							>
								<span
									className={`flex h-8 w-8 shrink-0 items-center justify-center border text-base font-sans ${
										isPast
											? "border-bordeaux bg-bordeaux text-blanc-casse"
											: isCurrent
												? "border-bordeaux bg-white text-bordeaux"
												: "border-sand bg-white text-muted"
									}`}
								>
									{isPast ? <span aria-hidden>✓</span> : s + 1}
								</span>
								<span
									className={`text-sm uppercase tracking-wider ${
										isCurrent ? "text-bordeaux" : "text-muted"
									}`}
								>
									{label}
								</span>
							</button>
						);
					})}
				</div>
			</div>

			{/* Step 0 */}
			{step === 0 && (
				<div>
					<h2 className="mb-6 font-serif text-2xl italic text-charcoal">
						{t("step0.title")}
					</h2>
					<div className="space-y-4">
						<div>
							<Label className="mb-1">{t("step0.civility")} *</Label>
							<div className="flex gap-4">
								<label className="flex cursor-pointer items-center gap-2">
									<input
										type="radio"
										name="civility"
										value="man"
										checked={step0.civility === "man"}
										onChange={() =>
											setStep0((p) => ({ ...p, civility: "man" }))
										}
										className="accent-bordeaux"
									/>
									<span className="text-base text-charcoal">
										{t("step0.civilityMr")}
									</span>
								</label>
								<label className="flex cursor-pointer items-center gap-2">
									<input
										type="radio"
										name="civility"
										value="woman"
										checked={step0.civility === "woman"}
										onChange={() =>
											setStep0((p) => ({ ...p, civility: "woman" }))
										}
										className="accent-bordeaux"
									/>
									<span className="text-base text-charcoal">
										{t("step0.civilityMrs")}
									</span>
								</label>
							</div>
							{step0Errors.civility && (
								<p className="mt-1 text-base text-red-600">
									{step0Errors.civility}
								</p>
							)}
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label htmlFor="firstName" className="mb-1">
									{t("step0.firstName")} *
								</Label>
								<Input
									id="firstName"
									value={step0.firstName}
									onChange={(e) =>
										setStep0((p) => ({ ...p, firstName: e.target.value }))
									}
								/>
								{step0Errors.firstName && (
									<p className="mt-1 text-base text-red-600">
										{step0Errors.firstName}
									</p>
								)}
							</div>
							<div>
								<Label htmlFor="lastName" className="mb-1">
									{t("step0.lastName")} *
								</Label>
								<Input
									id="lastName"
									value={step0.lastName}
									onChange={(e) =>
										setStep0((p) => ({ ...p, lastName: e.target.value }))
									}
								/>
								{step0Errors.lastName && (
									<p className="mt-1 text-base text-red-600">
										{step0Errors.lastName}
									</p>
								)}
							</div>
						</div>
						<div>
							<Label htmlFor="email" className="mb-1">
								{t("step0.email")} *
							</Label>
							<Input
								id="email"
								type="email"
								value={step0.email}
								onChange={(e) =>
									setStep0((p) => ({ ...p, email: e.target.value }))
								}
							/>
							{step0Errors.email && (
								<p className="mt-1 text-base text-red-600">
									{step0Errors.email}
								</p>
							)}
						</div>
						<div>
							<Label htmlFor="phone" className="mb-1">
								{t("step0.phone")} *
							</Label>
							<Input
								id="phone"
								type="tel"
								value={step0.phone}
								onChange={(e) =>
									setStep0((p) => ({ ...p, phone: e.target.value }))
								}
							/>
							{step0Errors.phone && (
								<p className="mt-1 text-base text-red-600">
									{step0Errors.phone}
								</p>
							)}
						</div>
						<div>
							<Label htmlFor="address" className="mb-1">
								{t("step0.address")}
							</Label>
							<Input
								id="address"
								value={step0.address ?? ""}
								onChange={(e) =>
									setStep0((p) => ({ ...p, address: e.target.value }))
								}
							/>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label htmlFor="postalCode" className="mb-1">
									{t("step0.postalCode")}
								</Label>
								<Input
									id="postalCode"
									value={step0.postalCode ?? ""}
									onChange={(e) =>
										setStep0((p) => ({ ...p, postalCode: e.target.value }))
									}
								/>
							</div>
							<div>
								<Label htmlFor="city" className="mb-1">
									{t("step0.city")}
								</Label>
								<Input
									id="city"
									value={step0.city ?? ""}
									onChange={(e) =>
										setStep0((p) => ({ ...p, city: e.target.value }))
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
						onClick={handleStep0Continue}
					>
						{t("step0.continue")}
					</Button>
				</div>
			)}

			{/* Step 1 */}
			{step === 1 && (
				<div>
					<h2 className="mb-6 font-serif text-2xl italic text-charcoal">
						{t("step1.title")}
					</h2>
					<div className="space-y-4">
						<div>
							<Label className="mb-2 block">{t("step1.photosLabel")} *</Label>
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
										? t("step1.photosCount", {
												current: photos.length,
												count: photos.length,
											})
										: t("step1.photosDrop")}
								</span>
								<span className="mt-1 text-sm text-muted">
									{t("step1.photosHint")}
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
												aria-label={t("step1.removePhoto")}
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
								{t("step1.dimensions")}
							</Label>
							<Input
								id="dimensions"
								placeholder={t("step1.dimensionsPlaceholder")}
								value={step1.dimensions ?? ""}
								onChange={(e) =>
									setStep1((p) => ({ ...p, dimensions: e.target.value }))
								}
							/>
						</div>
						<div>
							<Label htmlFor="descriptions" className="mb-1">
								{t("step1.comment")}
							</Label>
							<Textarea
								id="descriptions"
								placeholder={t("step1.commentPlaceholder")}
								rows={4}
								value={step1.descriptions ?? ""}
								onChange={(e) =>
									setStep1((p) => ({ ...p, descriptions: e.target.value }))
								}
							/>
						</div>
					</div>
					<div className="mt-8 flex gap-4">
						<Button type="button" variant="ghost" onClick={handleStep1Back}>
							{t("step1.back")}
						</Button>
						<Button
							type="button"
							variant="primary"
							size="lg"
							className="flex-1"
							onClick={handleStep1Continue}
						>
							{t("step1.continue")}
						</Button>
					</div>
				</div>
			)}

			{/* Step 2 */}
			{step === 2 && (
				<div>
					<h2 className="mb-6 font-serif text-2xl italic text-charcoal">
						{t("step2.title")}
					</h2>
					<div className="space-y-4">
						<div>
							<Checkbox
								checked={step2Accepted}
								onChange={(e) => setStep2Accepted(e.target.checked)}
							>
								<span>
									{t.rich("step2.cguLabel", {
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
							{step2Error && (
								<p className="mt-1 text-base text-red-600">{step2Error}</p>
							)}
						</div>
						<div>
							<Checkbox
								checked={step2Reuse}
								onChange={(e) => setStep2Reuse(e.target.checked)}
							>
								{t("step2.photoReuseLabel", { siteName })}
							</Checkbox>
						</div>
						<div className="border border-sand bg-sand/10 px-4 py-3 text-base text-muted">
							{t("step2.reminder")}
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
							onClick={handleStep2Back}
							disabled={submitting}
						>
							{t("step2.back")}
						</Button>
						<Button
							type="button"
							variant="primary"
							size="lg"
							className="flex-1"
							onClick={handleStep2Submit}
							disabled={submitting}
						>
							{submitting ? t("step2.submitting") : t("step2.submit")}
						</Button>
					</div>
				</div>
			)}
		</Container>
	);
};
