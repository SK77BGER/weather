import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { TextInput, StyleSheet, View, Text, ScrollView } from "react-native";
import ContentContainer from "@/components/ContentContainer";
import { SavedLocation, getSavedLocations } from "@/utils/savedLocations";
import { StyledButton } from "@/components/StyledButton";
import { useInvertColors } from "@/contexts/InvertColorsContext";
import CustomScrollView from "@/components/CustomScrollView";

export default function SearchScreen() {
	const [searchQuery, setSearchQuery] = useState("");
	const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);
	const { invertColors } = useInvertColors();

	useFocusEffect(
		useCallback(() => {
			const loadSavedLocations = async () => {
				const locations = await getSavedLocations();
				setSavedLocations(locations);
			};
			loadSavedLocations();
		}, [])
	);

	const handlePressSavedLocation = (location: SavedLocation) => {
		router.push({
			pathname: "/search/location-weather",
			params: {
				latitude: location.latitude.toString(),
				longitude: location.longitude.toString(),
				name: location.name,
				admin1: location.admin1 ?? "",
				country: location.country,
				id: location.id.toString(),
			},
		} as any);
	};

	return (
		<ContentContainer
			headerTitle="Search"
			hideBackButton={true}
			headerIcon="search"
			headerIconShowLength={searchQuery.length}
			headerIconPress={() => {
				if (searchQuery.length > 0) {
					router.push(
						`/search/search-results?query=${encodeURIComponent(
							searchQuery
						)}` as any
					);
				}
			}}
			style={{ gap: 32 }}
		>
			<TextInput
				style={[
					styles.input,
					{ color: invertColors ? "black" : "white" },
					{ borderBottomColor: invertColors ? "black" : "white" },
				]}
				placeholderTextColor="#888"
				value={searchQuery}
				placeholder="Search for a location"
				onChangeText={setSearchQuery}
				cursorColor="white"
				selectionColor="white"
				onSubmitEditing={() => {
					if (searchQuery.length > 0) {
						router.push(
							`/search/search-results?query=${encodeURIComponent(
								searchQuery
							)}` as any
						);
					}
				}}
			/>
			{savedLocations.length > 0 && (
				<View style={styles.savedLocationsContainer}>
					<Text
						style={[
							styles.savedLocationsTitle,
							{ color: invertColors ? "black" : "white" },
						]}
					>
						Saved Locations
					</Text>
					<CustomScrollView>
						{savedLocations.map((location) => (
							<View
								key={location.id}
								style={{ marginBottom: 15 }}
							>
								<StyledButton
									text={`${location.name}, ${
										location.admin1
											? `${location.admin1}, `
											: ""
									}${location.country}`}
									onPress={() =>
										handlePressSavedLocation(location)
									}
									fontSize={28}
								/>
							</View>
						))}
					</CustomScrollView>
				</View>
			)}
		</ContentContainer>
	);
}

const styles = StyleSheet.create({
	input: {
		width: "100%",
		borderBottomWidth: 1,
		fontSize: 24,
		fontFamily: "PublicSans-Regular",
		paddingVertical: 2,
		textAlign: "left",
	},
	savedLocationsContainer: {
		flex: 1,
	},
	savedLocationsTitle: {
		fontSize: 20,
		fontFamily: "PublicSans-Bold",
		marginBottom: 4,
	},
});
