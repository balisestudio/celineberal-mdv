import { Mark } from "@/components/logos";

const Loading = () => {
	return (
		<div className="min-h-[50vh] flex items-center justify-center">
			<Mark variant="dark" size={48} className="animate-pulse" />
		</div>
	);
};

export default Loading;
