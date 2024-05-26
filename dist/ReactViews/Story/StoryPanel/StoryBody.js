import { jsx as _jsx } from "react/jsx-runtime";
import parseCustomHtmlToReact from "../../Custom/parseCustomHtmlToReact";
import styled from "styled-components";
import Box from "../../../Styled/Box";
import Text from "../../../Styled/Text";
const StoryContainer = styled(Box).attrs((props) => ({
    paddedVertically: props.isCollapsed ? 0 : 2,
    scroll: true
})) `
  padding-top: 0;
  max-height: ${(props) => (props.isCollapsed ? 0 : "100px")};
  @media (min-height: 700px) {
    max-height: ${(props) => (props.isCollapsed ? 0 : "200px")};
  }
  @media (min-height: 900px) {
    max-height: ${(props) => (props.isCollapsed ? 0 : "400px")};
  }

  overflow-y: auto;

  transition: max-height 0.2s, padding 0.2s;

  img {
    max-width: 100%;
  }
  * {
    max-width: 100%;
    //These are technically the same, but use both
    overflow-wrap: break-word;
    word-wrap: break-word;

    -ms-word-break: break-all;
    // This is the dangerous one in WebKit, as it breaks things wherever
    word-break: break-all;
    // Instead use this non-standard one:
    word-break: break-word;

    // Adds a hyphen where the word breaks, if supported (No Blink)
    -ms-hyphens: auto;
    -moz-hyphens: auto;
    -webkit-hyphens: auto;
    hyphens: auto;
  }
`;
function shouldAddIframeTag(story) {
    var _a, _b, _c;
    const parser = new DOMParser();
    const parsedDocument = parser.parseFromString(story.text, "text/html");
    const iframes = parsedDocument.getElementsByTagName("iframe");
    if (iframes.length < 1)
        return false;
    let result = true;
    for (const iframe of iframes) {
        if (!(((_a = iframe.src) === null || _a === void 0 ? void 0 : _a.startsWith("https://www.youtube.com/embed/")) ||
            ((_b = iframe.src) === null || _b === void 0 ? void 0 : _b.startsWith("https://www.youtube-nocookie.com/embed/")) ||
            ((_c = iframe.src) === null || _c === void 0 ? void 0 : _c.startsWith("https://player.vimeo.com/video/")))) {
            result = false;
            break;
        }
    }
    return result;
}
function sourceBasedParse(story) {
    if (shouldAddIframeTag(story)) {
        return parseCustomHtmlToReact(story.text, { showExternalLinkWarning: true }, false, {
            ADD_TAGS: ["iframe"]
        });
    }
    else {
        return parseCustomHtmlToReact(story.text, { showExternalLinkWarning: true }, false, {});
    }
}
const StoryBody = ({ isCollapsed, story }) => story.text && story.text !== "" ? (_jsx(StoryContainer, { isCollapsed: isCollapsed, column: true, children: _jsx(Text, { css: `
          display: flex;
          flex-direction: column;
          gap: 5px;
        `, medium: true, children: sourceBasedParse(story) }) })) : null;
export default StoryBody;
//# sourceMappingURL=StoryBody.js.map