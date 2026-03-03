import Image from "next/image";

export const AuctionsEmpty = ({
	iconSrc,
	iconAlt,
	message,
}: {
	iconSrc: string;
	iconAlt: string;
	message: string;
}) => {
	return (
		<div className="py-24 flex flex-col items-center gap-4 text-center">
			{iconSrc && <Image src={iconSrc} alt={iconAlt} width={48} height={48} />}
			<p className="text-muted text-sm">{message}</p>
		</div>
	);
};
