"use client";

import {
	Button,
	CheckboxInput,
	Drawer,
	Pill,
	toast,
	useDocumentInfo,
	useModal,
	XIcon,
} from "@payloadcms/ui";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Auction } from "@/payload-types";
import type { ImportLotsOptions } from "./action";
import { importLots, isAllowedToImportLots } from "./action";

/**
 * Constants
 */

const MAX_FILE_SIZE_BYTES = 4 * 1024 * 1024; // 4 Mo

const MESSAGES = {
	FILE_TOO_LARGE: "Le fichier dépasse la taille maximale autorisée (4 Mo).",
	IMPORT_SUCCESS:
		"Fichier analysé avec succès. La génération des lots a démarré en arrière-plan et l'édition de la vente est temporairement verrouillée.",
	IMPORT_ERROR:
		"Une erreur inattendue est survenue lors de la lecture du fichier.",
} as const;

/**
 * Component
 */

export const ImportsLots = () => {
	const router = useRouter();
	const { openModal, closeModal } = useModal();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [file, setFile] = useState<File | null>(null);
	const [isAllowed, setIsAllowed] = useState(false);
	const [options, setOptions] = useState<ImportLotsOptions>({
		translateContent: false,
		optimizeContent: false,
	});
	const auctionId = useDocumentInfo().id as Auction["id"];

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = event.target.files?.[0];
		if (!selectedFile) return;

		if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
			toast.error(MESSAGES.FILE_TOO_LARGE);
			event.target.value = "";
			return;
		}

		setFile(selectedFile);
	};

	const handleImport = async () => {
		if (!file || !auctionId) return;

		const xml = await file.text();
		try {
			const result = await importLots(xml, auctionId, options);
			if (result.success) {
				toast.success(MESSAGES.IMPORT_SUCCESS);
				setIsAllowed(false);
				closeModal("imports-lots");
				router.refresh();
			} else {
				toast.error(result.error);
			}
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : MESSAGES.IMPORT_ERROR,
			);
		}
	};

	const handleRemoveFile = () => {
		setFile(null);
		if (fileInputRef.current) fileInputRef.current.value = "";
	};

	useEffect(() => {
		if (!auctionId) return;
		isAllowedToImportLots(auctionId).then(setIsAllowed);
	}, [auctionId]);

	return (
		<>
			<Button
				buttonStyle="secondary"
				icon="plus"
				onClick={() => openModal("imports-lots")}
				disabled={!isAllowed}
			>
				Import Interencheres
			</Button>
			<Drawer
				slug="imports-lots"
				title="Importation d'un fichier Interencheres"
			>
				<div className="flex justify-between items-center flex-wrap border-b border-(--theme-elevation-100)">
					<p className="w-3/5">
						Téléversez un fichier d'export Interencheres pour procéder à
						l'intégration automatique des lots liés à cette vente. Les lots
						existants seront écrasés. Une fois le fichier validé, le traitement
						s'exécutera en arrière-plan. L'édition de la vente sera
						temporairement indisponible durant cette opération.
					</p>
					<Button disabled={!file} onClick={handleImport}>
						Valider le fichier et lancer le traitement
					</Button>
				</div>
				<div className="flex flex-wrap items-center mt-4">
					<Button
						className="mr-2"
						onClick={() => fileInputRef.current?.click()}
					>
						Sélectionner un fichier Interencheres
					</Button>
					{file && (
						<Pill
							icon={<XIcon />}
							className="cursor-pointer hover:bg-red-100 hover:text-red-800"
							onClick={handleRemoveFile}
						>
							{file.name} ({(file.size / 1024).toFixed(1)} ko)
						</Pill>
					)}
					<input
						type="file"
						className="hidden"
						ref={fileInputRef}
						multiple={false}
						onChange={handleFileChange}
						accept=".xml"
					/>
				</div>
				<div className="flex flex-col gap-4">
					<h3>Options d'intelligence artificielle générative</h3>
					<div className="flex flex-col gap-2">
						<CheckboxInput
							label="Traduction du contenu"
							onToggle={(e) =>
								setOptions((prev) => ({
									...prev,
									translateContent: e.target.checked,
								}))
							}
							checked={options.translateContent}
						/>
						<CheckboxInput
							label="Optimisation du contenu"
							onToggle={(e) =>
								setOptions((prev) => ({
									...prev,
									optimizeContent: e.target.checked,
								}))
							}
							checked={options.optimizeContent}
						/>
					</div>
				</div>
			</Drawer>
		</>
	);
};
