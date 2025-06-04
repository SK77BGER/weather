import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
	TextInput,
	StyleSheet,
	View,
	Text,
	ScrollView,
	TouchableOpacity,
} from "react-native";
import ContentContainer from "@/components/ContentContainer";
import { SavedLocation, getSavedLocations } from "@/utils/savedLocations";
import { StyledButton } from "@/components/StyledButton";
import { useInvertColors } from "@/contexts/InvertColorsContext";
import CustomScrollView from "@/components/CustomScrollView";
import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { HapticPressable } from "@/components/HapticPressable";

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
			<View
				style={[
					styles.inputContainer,
					{ borderBottomColor: invertColors ? "black" : "white" },
				]}
			>
				<TextInput
					style={[
						styles.input,
						{ color: invertColors ? "black" : "white" },
					]}
					placeholderTextColor="#888"
					value={searchQuery}
					placeholder="Search for a location"
					onChangeText={setSearchQuery}
					cursorColor={invertColors ? "black" : "white"}
					selectionColor={invertColors ? "black" : "white"}
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
				{searchQuery.length > 0 && (
					<HapticPressable
						style={styles.clearButton}
						onPress={() => {
							setSearchQuery("");
							Haptics.impactAsync(
								Haptics.ImpactFeedbackStyle.Medium
							);
						}}
					>
						<MaterialIcons
							name="clear"
							size={24}
							color={invertColors ? "black" : "white"}
						/>
					</HapticPressable>
				)}
			</View>
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
									text={`${location.name}${
										location.admin1 &&
										location.admin1 !== location.name
											? `, ${location.admin1}`
											: ""
									}, ${location.country}`}
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
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		width: "100%",
		borderBottomWidth: 1,
	},
	input: {
		flex: 1,
		fontSize: 24,
		fontFamily: "PublicSans-Regular",
		paddingVertical: 2,
		textAlign: "left",
		paddingBottom: 6,
	},
	clearButton: {
		padding: 5,
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
