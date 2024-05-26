import { jsx as _jsx } from "react/jsx-runtime";
import { useTranslation } from "react-i18next";
import Box from "../../../../Styled/Box";
import { RawButton } from "../../../../Styled/Button";
import Icon from "../../../../Styled/Icon";
import Ul, { Li } from "../../../../Styled/List";
import MenuPanel from "../../../StandardUserInterface/customizable/MenuPanel";
import Styles from "../../MenuBar/menu-bar.scss";
const stripLangLocale = (lang = "") => lang.split("-")[0];
const LangPanel = (props) => {
    var _a;
    const { t, i18n } = useTranslation();
    if (!((_a = props.terria.configParameters.languageConfiguration) === null || _a === void 0 ? void 0 : _a.languages)) {
        return null;
    }
    return (
    //@ts-ignore - not yet ready to tackle tsfying MenuPanel
    _jsx(MenuPanel, { theme: {
            btn: Styles.langBtn,
            icon: Icon.GLYPHS.globe
        }, btnText: props.smallScreen
            ? t("languagePanel.changeLanguage")
            : stripLangLocale(i18n.language), mobileIcon: Icon.GLYPHS.globe, smallScreen: props.smallScreen, children: _jsx(Box, { styledPadding: "20px 10px 10px 10px", children: _jsx(Ul, { spaced: true, lined: true, fullWidth: true, column: true, css: `
            padding-left: 0;
          `, children: Object.entries(props.terria.configParameters.languageConfiguration.languages).map(([key, value]) => (_jsx(Li, { children: _jsx(RawButton, { onClick: () => i18n.changeLanguage(key), children: value }) }, key))) }) }) }));
};
export default LangPanel;
//# sourceMappingURL=LangPanel.js.map