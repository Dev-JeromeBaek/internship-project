import React, { Component, Fragment } from 'react';
import ApiTotalList from './ApiTotalList';
import { apiContext } from '../../store/ApiStore';
import GlobalSpinner from '../global/GlobalSpinner';

class ApiTotalFrame extends Component {
  state = {
    apiList: [],
    isAscending: true,
  };

  async componentDidMount() {
    await this.props.value.actions.getApiList();
    this.setState({
      apiList: this.props.value.state.apiList,
    });
  }

  async shouldComponentUpdate() {
    if (this.props.value.state.apiList !== this.state.apiList) {
      this.setState({
        apiList: await this.props.value.state.apiList,
      });
      return true;
    }

    return false;
  }
  sortApiList = () => {
    if (this.state.isAscending) {
      this.setState({
        isAscending: !this.state.isAscending,
        apiList: this.state.apiList.sort(function(a, b) {
          return a.isUsedApi > b.isUsedApi
            ? -1
            : a.isUsedApi < b.isUsedApi
              ? 1
              : 0;
        }),
      });
    } else {
      this.setState({
        isAscending: !this.state.isAscending,
        apiList: this.state.apiList.sort(function(a, b) {
          return a.isUsedApi < b.isUsedApi
            ? -1
            : a.isUsedApi > b.isUsedApi
              ? 1
              : 0;
        }),
      });
    }
  };

  render() {
    return (
      <Fragment>
        <div className="d-flex justify-content-end mb-2">
          <div
            className="btn btn-sm btn-outline-secondary cursor-pointer"
            onClick={() => this.sortApiList()}
          >
            정렬
          </div>
        </div>
        {this.props.value.state.isApiListLoading ? (
          <GlobalSpinner />
        ) : (
          <Fragment>
            {this.state.apiList.map(api => (
              <ApiTotalList
                api={api}
                key={api.apiId}
                isApiList={this.props.isApiList}
              />
            ))}
          </Fragment>
        )}
      </Fragment>
    );
  }
}

export default apiContext(ApiTotalFrame);
