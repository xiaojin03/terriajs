import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { reaction } from "mobx";
import { observer } from "mobx-react";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Credits } from "./Credits";
import { CreditsContainer } from "./CreditsContainer";
import { DataAttributionModal } from "./DataAttribution/DataAttributionModal";
import { Spacer } from "./Spacer";
import { TerriaLogo } from "./TerriaLogo";
import { MapCreditLogo } from "./MapCreditLogo";
export const MapCredits = observer(({ currentViewer, hideTerriaLogo, credits }) => {
    const { t } = useTranslation();
    const [dataAttributionVisible, setDataAttributionVisible] = useState(false);
    const showDataAttribution = useCallback(() => {
        setDataAttributionVisible(true);
    }, [setDataAttributionVisible]);
    const hideDataAttribution = useCallback(() => {
        setDataAttributionVisible(false);
    }, [setDataAttributionVisible]);
    useEffect(() => {
        return reaction(() => currentViewer.attributions.length, () => {
            if (currentViewer.attributions &&
                currentViewer.attributions.length === 0) {
                hideDataAttribution();
            }
        });
    }, [currentViewer]);
    if (currentViewer.type === "none") {
        return _jsx(CreditsContainer, {});
    }
    return (_jsxs(CreditsContainer, { children: [!hideTerriaLogo ? _jsx(TerriaLogo, {}) : null, _jsx(MapCreditLogo, { currentViewer: currentViewer }), _jsx(Credits, { credits: credits }), _jsx(Spacer, {}), currentViewer.attributions && currentViewer.attributions.length > 0 ? (_jsx("a", { onClick: showDataAttribution, children: t("map.extraCreditLinks.basemap") })) : null, dataAttributionVisible ? (_jsx(DataAttributionModal, { closeModal: hideDataAttribution, attributions: currentViewer.attributions })) : null] }));
});
//# sourceMappingURL=MapCredits.js.map