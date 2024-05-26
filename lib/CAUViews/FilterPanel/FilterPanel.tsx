import { TFunction } from "i18next";
import { observer } from "mobx-react";
import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import Terria from "terriajs/lib/Models/Terria";
import ViewState from "terriajs/lib/ReactViewModels/ViewState";
import Styles from "./filter-panel.scss";
import { FilterPanelContent } from "./FilterPanelContent";

const MenuPanel = 
  require("terriajs/lib/ReactViews/StandardUserInterface/customizable/MenuPanel").default;

interface PropTypes extends WithTranslation {
  terria: Terria;
  modalWidth: number;
  viewState: ViewState;
  onUserClick: () => void;
  btnDisabled: boolean;
  t: TFunction;
}

interface FilterPanelState {
  isOpen: boolean;
}

@observer
class FilterPanel extends React.Component<PropTypes, FilterPanelState> {
  static displayName = "FilterPanel";

  constructor(props: PropTypes) {
    super(props);
    this.changeOpenState = this.changeOpenState.bind(this);
    this.closePanel = this.closePanel.bind(this);

    this.state = {
      isOpen: false
    }
  }

  changeOpenState(open: boolean) {
    this.setState({
      isOpen: open
    });
  }

  closePanel() {
    this.setState({
      isOpen: false
    });
  }

  renderContent() {
    const { terria, viewState, t } = this.props;

    return (
      <FilterPanelContent
        terria={terria}
        viewState={viewState}
        closePanel={this.closePanel}
      />
    );
  }

  render() {
    const { t, modalWidth } = this.props;
    const dropdownTheme = {
      outer: Styles.filterPanel,
      inner: Styles.dropdownInner,
      icon: "search"
    };
    
    // const btnText = t("develop.btnMapFilterText");
    const btnText = t("数据检索");
    const btnTitle = t("develop.btnMapFilterTitle");

    return (
      <MenuPanel
        theme={dropdownTheme}
        btnText={btnText}
        viewState={this.props.viewState}
        btnTitle={btnTitle}
        isOpen={this.state.isOpen}
        onOpenChanged={this.changeOpenState}
        showDropdownAsModal={false}
        modalWidth={350}
        smallScreen={this.props.viewState.useSmallScreenInterface}
        onDismissed={() => {}}
        onUserClick={this.props.onUserClick}
        disableCloseOnFocusLoss={this.props.viewState.retainFilterPanel}
      >
        {this.state.isOpen && this.renderContent()}
      </MenuPanel>
    );
  }
}

export default withTranslation()(FilterPanel);
