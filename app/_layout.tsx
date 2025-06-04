import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { HapticProvider } from "../contexts/HapticContext";
import {
	InvertColorsProvider,
	useInvertColors,
} from "../contexts/InvertColorsContext";
import { UnitsProvider } from "../contexts/UnitsContext";
import { useFonts } from "expo-font";
import { setStatusBarHidden } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";

function RootNavigation() {
	useFonts({
		"PublicSans-Regular": require("../assets/fonts/PublicSans-Regular.ttf"),
	});

	useEffect(() => {
		setStatusBarHidden(true, "none");
	}, []);

	const { invertColors } = useInvertColors();

	useEffect(() => {
		const newColor = invertColors ? "#FFFFFF" : "#000000";
		SystemUI.setBackgroundColorAsync(newColor);
	}, [invertColors]);

	return (
		<Stack
			screenOptions={{
				headerShown: false,
				animation: "none",
			}}
		></Stack>
	);
}

export default function RootLayout() {
	return (
		<HapticProvider>
			<InvertColorsProvider>
				<UnitsProvider>
					<RootNavigation />
				</UnitsProvider>
			</InvertColorsProvider>
		</HapticProvider>
	);
}
