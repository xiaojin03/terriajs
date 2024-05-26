import { jsx as _jsx } from "react/jsx-runtime";
import { observer } from "mobx-react";
import Box from "../../../../Styled/Box";
import Icon from "../../../../Styled/Icon";
import MapIconButton from "../../../MapIconButton/MapIconButton";
const ToolButton = observer((props) => {
    const { controller } = props;
    return (_jsx(Box, { displayInlineBlock: true, children: _jsx(MapIconButton, { primary: controller.active, expandInPlace: true, title: controller.title, onClick: () => controller.handleClick(), iconElement: () => _jsx(Icon, { glyph: controller.glyph }), closeIconElement: () => _jsx(Icon, { glyph: Icon.GLYPHS.closeTool }), children: controller.title }) }));
});
export default ToolButton;
//# sourceMappingURL=ToolButton.js.map