import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from "react";
import { Splitter } from "./Splitter/Splitter";
import { useViewState } from "../../Context";
import styled from "styled-components";
export const TerriaViewerWrapper = () => {
    const viewState = useViewState();
    const containerRef = useRef(null);
    useEffect(() => {
        if (viewState.terria.mainViewer.attached) {
            viewState.terria.mainViewer.detach();
        }
        if (containerRef.current) {
            viewState.terria.mainViewer.attach(containerRef.current);
        }
        return () => {
            viewState.terria.mainViewer.detach();
        };
    }, [viewState]);
    return (_jsxs(TerrriaViewerContainer, { children: [_jsx(StyledMapPlaceholder, { children: "Loading the map, please wait..." }), _jsx(Splitter, {}), _jsx("div", { id: "cesiumContainer", css: `
          cursor: auto;
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          :global {
            .selection-indicator {
              pointer-events: none;
              position: absolute;
              width: 50px;
              height: 50px;
            }

            .cesium-widget,
            .cesium-widget canvas {
              position: absolute;
              width: 100%;
              height: 100%;
              touch-action: none;
            }
          }
        `, ref: containerRef })] }));
};
const TerrriaViewerContainer = styled.aside `
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
`;
const StyledMapPlaceholder = styled.div `
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  color: black;
  text-align: center;
  width: 100%;
  height: 25%;
  margin: auto;
  @media (min-width: ${(p) => p.theme.sm}px) {
    color: white;
  }
`;
//# sourceMappingURL=TerriaViewerWrapper.js.map