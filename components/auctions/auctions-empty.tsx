import { Mark } from "@/components/logos";

export const AuctionsEmpty = ({ message }: { message: string }) => {
	return (
		<div className="py-24 flex flex-col items-center gap-4 text-center">
			<Mark variant="dark" size={48} />
			<p className="text-muted text-base">{message}</p>
		</div>
	);
};
