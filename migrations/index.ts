import * as migration_20260227_182633 from "./20260227_182633";
import * as migration_20260227_191606 from "./20260227_191606";
import * as migration_20260227_195702 from "./20260227_195702";
import * as migration_20260227_200515 from "./20260227_200515";
import * as migration_20260302_232830 from "./20260302_232830";
import * as migration_20260303_140733 from "./20260303_140733";

export const migrations = [
	{
		up: migration_20260227_182633.up,
		down: migration_20260227_182633.down,
		name: "20260227_182633",
	},
	{
		up: migration_20260227_191606.up,
		down: migration_20260227_191606.down,
		name: "20260227_191606",
	},
	{
		up: migration_20260227_195702.up,
		down: migration_20260227_195702.down,
		name: "20260227_195702",
	},
	{
		up: migration_20260227_200515.up,
		down: migration_20260227_200515.down,
		name: "20260227_200515",
	},
	{
		up: migration_20260302_232830.up,
		down: migration_20260302_232830.down,
		name: "20260302_232830",
	},
	{
		up: migration_20260303_140733.up,
		down: migration_20260303_140733.down,
		name: "20260303_140733",
	},
];
