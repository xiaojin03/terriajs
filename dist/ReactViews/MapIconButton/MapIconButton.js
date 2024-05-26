"use strict";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState } from "react";
import styled, { useTheme } from "styled-components";
import Box from "../../Styled/Box";
import { RawButton } from "../../Styled/Button";
import { TextSpan } from "../../Styled/Text";
// only spans are valid html for buttons (even though divs work)
const ButtonWrapper = styled(Box).attrs({
    as: "span"
}) `
  display: flex;
  justify-content: center;
  align-items: center;
  transition: flex 0.3s ease-out;
`;
// styles half ripped from nav.scss
const StyledMapIconButton = styled(RawButton) `
  border-radius: 16px;
  ${(props) => props.roundLeft && `border-radius: 16px 0 0 16px;`}
  ${(props) => props.roundRight && `border-radius: 0 16px 16px 0;`}

  background: #fff;
  color: ${(props) => props.theme.textDarker};

  height: 32px;
  min-width: 32px;
  direction: rtl;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.15);
  svg {
    height: 20px;
    width: 20px;
    margin: 0 auto;
    vertical-align: middle;
    fill: ${(props) => props.theme.textDarker};
  }

  ${(props) => props.primary &&
    `
    background: ${props.theme.colorPrimary};
    color: ${props.theme.textLight};
    svg {
      fill: ${props.theme.textLight};
      stroke: ${props.theme.textLight};
    }
  `}
  ${(props) => props.splitter &&
    !props.disabled &&
    `
    background: ${props.theme.colorSecondary};
    color: ${props.theme.textLight};
    svg {
      fill: ${props.theme.textLight};
    }
  `}

  ${(props) => props.inverted &&
    `
    background: ${props.theme.charcoalGrey};
    color: ${props.theme.textLight};
    svg {
      fill: ${props.theme.textLight};
    }
  `}


  ${(props) => props.disabled &&
    `
    background-color: ${props.theme.grey};
    color: ${props.theme.grey};
    opacity: 0.7;
    svg {
      fill: ${props.theme.textLightDimmed};
    }
  `}
`;
function MapIconButton(props) {
    const [isExpanded, setExpanded] = useState(false);
    const { children, roundLeft, roundRight, title, expandInPlace, neverCollapse, primary, splitter, inverted, disabled, noExpand = false } = props;
    const expanded = !noExpand && (isExpanded || neverCollapse) && children;
    const buttonRef = useRef();
    const theme = useTheme();
    // const handleAway = () => setTimeout(() => setExpanded(false), 1000);
    const handleAway = () => setExpanded(false);
    const handleFocus = (expanded) => {
        if (!disabled) {
            setExpanded(expanded);
        }
    };
    const MapIconButtonRaw = (_jsx(StyledMapIconButton, { ref: props.buttonRef || buttonRef, className: props.className, primary: primary, splitter: splitter, inverted: inverted, roundLeft: roundLeft, roundRight: roundRight, disabled: disabled, type: "button", title: title, onMouseOver: () => handleFocus(true), onFocus: () => handleFocus(true), onMouseOut: handleAway, onBlur: handleAway, onClick: props.onClick, css: `
        svg {
          margin: 0px 6px;
        }
      `, children: _jsxs(ButtonWrapper, { children: [primary && props.closeIconElement && (_jsx("span", { css: `
              display: block;
            `, children: props.closeIconElement() })), children && (_jsx(TextSpan, { noWrap: true, medium: true, css: `
              display: block;
              transition: visibility 0.3s ease, max-width 0.3s ease,
                margin-right 0.3s ease, opacity 0.3s ease;
              visibility: ${expanded ? `visible` : `hidden`};
              max-width: ${expanded ? `150px` : `0px`};
              margin-right: ${expanded ? `10px` : `0px`};
              opacity: ${expanded ? `1.0` : `0`};
            `, children: children })), props.iconElement && (_jsx("span", { css: `
              display: block;
            `, children: props.iconElement() }))] }) }));
    // we need to add some positional wrapping elements if we need to expand the
    // button in place (`absolute`ly) instead of in the layout flow (`relative`).
    if (expandInPlace) {
        return (_jsx("div", { css: expandInPlace &&
                `
            position:relative;
            width: 32px;
            height: 32px;
            margin:auto;
            @media (max-width: ${theme.mobile}px) {
              width: ${primary && !!props.closeIconElement && !isExpanded
                    ? "64px"
                    : "32px"};
            }
          `, children: _jsx("div", { css: expandInPlace &&
                    `
              position:absolute;
              top:0;
              right:0;
              ${isExpanded && `z-index:10;`}
            `, children: MapIconButtonRaw }) }));
    }
    else
        return MapIconButtonRaw;
}
// const MapIconButtonWithRef = (props, ref) => (
//   <MapIconButton {...props} buttonRef={ref} />
// );
// export default React.forwardRef(MapIconButtonWithRef);
export default MapIconButton;
//# sourceMappingURL=MapIconButton.js.map