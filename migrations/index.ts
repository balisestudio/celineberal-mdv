import * as migration_20260227_182633 from "./20260227_182633";

export const migrations = [
	{
		up: migration_20260227_182633.up,
		down: migration_20260227_182633.down,
		name: "20260227_182633",
	},
];
