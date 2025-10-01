import { createContext, useContext, ReactNode, useMemo } from "react";
import * as Haptics from "expo-haptics";

const HapticContext = createContext<{
	triggerHaptic: () => void;
}>({
	triggerHaptic: () => {},
});

export const useHaptic = () => useContext(HapticContext);

export const HapticProvider = ({ children }: { children: ReactNode }) => {
	const triggerHaptic = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
	};

	const value = useMemo(() => ({ triggerHaptic }), []);

	return (
		<HapticContext.Provider value={value}>
			{children}
		</HapticContext.Provider>
	);
};
