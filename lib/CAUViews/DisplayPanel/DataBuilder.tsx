import React, { FC, useState } from "react";
import { useTranslation } from "react-i18next";

import styled, { DefaultTheme, withTheme } from "styled-components";

import ViewState from "terriajs/lib/ReactViewModels/ViewState";

import Box from "terriajs/lib/Styled/Box";
import Button, { RawButton } from "terriajs/lib/Styled/Button";
import Icon, { StyledIcon } from "terriajs/lib/Styled/Icon";
import Spacing from "terriajs/lib/Styled/Spacing";
import Text, { TextSpan } from "terriajs/lib/Styled/Text";
import { DataInfo } from "terriajs/lib/CAUViews/DisplayPanel/DataInfo";
import { DisDataInfo } from "terriajs/lib/CAUViews/DisplayPanel/DisDataInfo";

interface IProps {
  viewState: ViewState;
  isVisible?: boolean;
  theme: DefaultTheme;
}

export const DataBuilder: FC<IProps> = ({ viewState, isVisible, theme }) => {
  const { t } = useTranslation();

  const hideDataBuilder = () => {
    viewState.toggleDataBuilder();

    viewState.terria.overlays.removeAll();
  }

  return (
    <Panel
        isVisible={isVisible}
        isHidden={!isVisible}
        styledWidth={"320px"}
        styledMinWidth={"320px"}
        charcoalGreyBg
        column
      >
        <Box right>
          <RawButton
            css={`
              padding: 15px;
            `}
            onClick={hideDataBuilder}
          >
            <StyledIcon
              styledWidth={"16px"}
              fillColor={theme.textLightDimmed}
              opacity={0.5}
              glyph={Icon.GLYPHS.closeLight}
            />
          </RawButton>
        </Box>
        <Box
          centered={true}
          paddedHorizontally={2}
          displayInlineBlock
        >
          <Text bold extraExtraLarge textLight>
            {t("数据显示")}
          </Text>
          {/* <Spacing bottom={2} />
          <Text medium color={theme.textLightDimmed} highlightLinks>
            {t("develop.dataBuilderExplanation")}
          </Text> */}
          {/* <Spacing bottom={3} />
          <DataInfo
            viewState={viewState}
            terria={viewState.terria}
          /> */}
          <Spacing bottom={3} />

          {/* {if(viewState.ArrDisData .} */}
          <DisDataInfo
            viewState={viewState}
            terria={viewState.terria}
          />
        </Box>
      </Panel>
  );
}

type PanelProps = React.ComponentPropsWithoutRef<typeof Box> & {
  isVisible?: boolean;
  isHidden?: boolean;
};

const Panel = styled(Box)<PanelProps>`
  transition: all 0.25s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  ${(props) =>
    props.isVisible &&
    `
    visibility: visible;
    margin-right: 0;
  `}
  ${(props) =>
    props.isHidden &&
    `
    visibility: hidden;
    margin-right: -${props.styledWidth ? props.styledWidth : "320px"};
  `}
`;