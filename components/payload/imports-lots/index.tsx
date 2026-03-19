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

const MAX_XML_FILE_SIZE_BYTES = 4 * 1024 * 1024;
const MAX_CSV_FILE_SIZE_BYTES = 16 * 1024 * 1024;

const MESSAGES = {
	XML_FILE_TOO_LARGE:
		"Le fichier XML dépasse la taille maximale autorisée (4 Mo).",
	CSV_FILE_TOO_LARGE:
		"Le fichier CSV dépasse la taille maximale autorisée (16 Mo).",
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
	const xmlInputRef = useRef<HTMLInputElement>(null);
	const csvInputRef = useRef<HTMLInputElement>(null);
	const [xmlFile, setXmlFile] = useState<File | null>(null);
	const [csvFile, setCsvFile] = useState<File | null>(null);
	const [isAllowed, setIsAllowed] = useState(false);
	const [options, setOptions] = useState<ImportLotsOptions>({
		translateContent: false,
		optimizeContent: false,
	});
	const auctionId = useDocumentInfo().id as Auction["id"];

	const handleXmlFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = event.target.files?.[0];
		if (!selectedFile) return;

		if (selectedFile.size > MAX_XML_FILE_SIZE_BYTES) {
			toast.error(MESSAGES.XML_FILE_TOO_LARGE);
			event.target.value = "";
			return;
		}

		setXmlFile(selectedFile);
	};

	const handleCsvFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = event.target.files?.[0];
		if (!selectedFile) return;

		if (selectedFile.size > MAX_CSV_FILE_SIZE_BYTES) {
			toast.error(MESSAGES.CSV_FILE_TOO_LARGE);
			event.target.value = "";
			return;
		}

		setCsvFile(selectedFile);
	};

	const handleImport = async () => {
		if (!xmlFile || !csvFile || !auctionId) return;

		const [xml, csv] = await Promise.all([xmlFile.text(), csvFile.text()]);
		try {
			const result = await importLots(xml, csv, auctionId, options);
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

	const handleRemoveXmlFile = () => {
		setXmlFile(null);
		if (xmlInputRef.current) xmlInputRef.current.value = "";
	};

	const handleRemoveCsvFile = () => {
		setCsvFile(null);
		if (csvInputRef.current) csvInputRef.current.value = "";
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
				title="Importation Interencheres et export des ventes"
			>
				<div className="flex justify-between items-center flex-wrap border-b border-(--theme-elevation-100)">
					<p className="w-3/5">
						Téléversez le fichier XML Interencheres et l&apos;export CSV des
						ventes (colonnes « N° du lot » et « Adjudication »). Les prix de
						vente affichés proviennent du CSV. Les lots existants seront
						écrasés. Une fois les fichiers validés, le traitement
						s&apos;exécutera en arrière-plan. L&apos;édition de la vente sera
						temporairement indisponible durant cette opération.
					</p>
					<Button disabled={!xmlFile || !csvFile} onClick={handleImport}>
						Valider les fichiers et lancer le traitement
					</Button>
				</div>
				<div className="flex flex-col gap-4 mt-4">
					<div className="flex flex-wrap items-center">
						<Button
							className="mr-2"
							onClick={() => xmlInputRef.current?.click()}
						>
							Sélectionner le fichier XML Interencheres
						</Button>
						{xmlFile && (
							<Pill
								icon={<XIcon />}
								className="cursor-pointer hover:bg-red-100 hover:text-red-800"
								onClick={handleRemoveXmlFile}
							>
								{xmlFile.name} ({(xmlFile.size / 1024).toFixed(1)} ko)
							</Pill>
						)}
						<input
							type="file"
							className="hidden"
							ref={xmlInputRef}
							multiple={false}
							onChange={handleXmlFileChange}
							accept=".xml"
						/>
					</div>
					<div className="flex flex-wrap items-center">
						<Button
							className="mr-2"
							onClick={() => csvInputRef.current?.click()}
						>
							Sélectionner l&apos;export CSV des ventes
						</Button>
						{csvFile && (
							<Pill
								icon={<XIcon />}
								className="cursor-pointer hover:bg-red-100 hover:text-red-800"
								onClick={handleRemoveCsvFile}
							>
								{csvFile.name} ({(csvFile.size / 1024).toFixed(1)} ko)
							</Pill>
						)}
						<input
							type="file"
							className="hidden"
							ref={csvInputRef}
							multiple={false}
							onChange={handleCsvFileChange}
							accept=".csv"
						/>
					</div>
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
