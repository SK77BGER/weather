import React from "react";
import { Tabs } from "expo-router";
import { Navbar, TabConfigItem } from "@/components/Navbar";

export const TABS_CONFIG: ReadonlyArray<TabConfigItem> = [
	{
		name: "Current Location",
		screenName: "current-location",
		iconName: "location-pin",
	},
	{ name: "Search", screenName: "search", iconName: "search" },
	{ name: "Settings", screenName: "settings", iconName: "settings" },
] as const;

export default function TabLayout() {
	return (
		<Tabs
			initialRouteName="current-location"
			screenOptions={() => ({
				animation: "none",
				headerShown: false,
			})}
			tabBar={(props) => {
				const activeScreenName =
					props.state.routes[props.state.index].name;
				return (
					<Navbar
						tabsConfig={TABS_CONFIG}
						currentScreenName={activeScreenName}
						navigation={props.navigation}
					/>
				);
			}}
		/>
	);
}
