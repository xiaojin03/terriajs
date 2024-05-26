import { jsx as _jsx } from "react/jsx-runtime";
import styled from "styled-components";
/**
 * A toast component that positions its children bottom center of the map
 */
const Toast = ({ children }) => {
    return _jsx(Container, { children: children });
};
const Container = styled.div `
  position: fixed;
  z-index: 99999;
  bottom: 80px; //on mobile make it appear above play story button
  left: 35%;
  @media (min-width: ${(props) => props.theme.sm}px) {
    position: absolute;
    left: 45%; // on larger screens
    bottom: 40px;
  }

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 0 7px;

  border-radius: 16px;
  min-height: 32px;
  background: ${(p) => p.theme.textLight};
`;
export default Toast;
//# sourceMappingURL=Toast.js.map