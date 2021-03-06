import React, { Component } from 'react';
import { ListGroup, Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';

import { withContext } from '../../Store';
import DashboardItem from './DashboardItem';
import GlobalSpinner from '../global/GlobalSpinner';

class Sidebar extends Component {
  state = {
    activeDashboard: this.props.dashboardId,
    activeDashboardName: '',
    isDropdownOpened: false,
    dashboardList: [],
    isError: false,
  };

  dashboardClick = (id, name) => () => {
    this.setState({
      activeDashboard: id,
      activeDashboardName: name,
    });
    this.props.changeDashBoard(id);
  };

  async componentDidMount() {
    try {
      window.addEventListener('resize', this.resize.bind(this));
      this.resize();

      this.setState({
        isLoading: true,
      });

      const dashboardList = await this.props.value.actions.getDashboardList();

      this.setState({
        isError: false,
        dashboardList: dashboardList.data.data,
        isLoading: false,
      });
    } catch (error) {
      this.setState({
        isError: true,
      });
    }
  }

  resize() {
    this.setState({ hideSidebar: window.innerWidth < 576 });
  }

  dropdownToggle = () => {
    this.setState(prevState => ({
      isDropdownOpened: !prevState.isDropdownOpened,
    }));
  };

  render() {
    const { hideSidebar, isError } = this.state;
    return isError ? (
      <div style={{ display: 'none' }} />
    ) : hideSidebar ? (
      <div
        className={
          this.props.isSidebarHidden
            ? 'overflow-y bg-light sidebar col-sm-5 col-md-4 col-lg-3 col-xl-2'
            : 'overflow-y bg-light sidebar mt-56px col-sm-5 col-md-4 col-lg-3 col-xl-2'
        }
      >
        <Dropdown
          className="w-100 my-3"
          isOpen={this.state.isDropdownOpened}
          toggle={this.dropdownToggle}
        >
          <DropdownToggle className="btn-outline-secondary w-100" caret>
            {this.state.activeDashboardName
              ? this.state.activeDashboardName
              : '원하시는 대시보드를 선택하세요.'}
          </DropdownToggle>
          <DropdownMenu className="w-100 white-space-normal">
            {this.state.dashboardList.map(dashboard => {
              return (
                <DashboardItem
                  toggle={this.dropdownToggle}
                  key={dashboard.dashboardId}
                  dashboard={dashboard}
                  dashboardClick={this.dashboardClick(
                    dashboard.dashboardId,
                    dashboard.dashboardName,
                  )}
                  isActive={
                    dashboard.dashboardId === this.state.activeDashboard
                  }
                  isDropdown={true}
                />
              );
            })}
          </DropdownMenu>
        </Dropdown>
      </div>
    ) : this.state.isLoading ? (
      <div
        className={
          this.props.isSidebarHidden
            ? 'overflow-y bg-light sidebar col-sm-5 col-md-4 col-lg-3 col-xl-2'
            : 'overflow-y bg-light sidebar mt-56px col-sm-5 col-md-4 col-lg-3 col-xl-2'
        }
      >
        <GlobalSpinner />
      </div>
    ) : (
      <div
        className={
          this.props.isSidebarHidden
            ? 'overflow-y bg-light sidebar col-sm-5 col-md-4 col-lg-3 col-xl-2'
            : 'overflow-y bg-light sidebar mt-56px col-sm-5 col-md-4 col-lg-3 col-xl-2'
        }
      >
        <ListGroup className="mt-3 shadow-sm">
          {this.state.dashboardList.map(dashboard => {
            return (
              <DashboardItem
                key={dashboard.dashboardId}
                dashboard={dashboard}
                dashboardClick={this.dashboardClick(
                  dashboard.dashboardId,
                  dashboard.dashboardName,
                )}
                isActive={dashboard.dashboardId === this.state.activeDashboard}
              />
            );
          })}
        </ListGroup>
      </div>
    );
  }
}

export default withContext(Sidebar);
