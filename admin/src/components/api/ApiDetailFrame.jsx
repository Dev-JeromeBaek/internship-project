import React, { Component } from 'react';
import ApiDetailInfo from './ApiDetailInfo';
import { apiContext } from '../../store/ApiStore';
import GlobalSpinner from '../global/GlobalSpinner';

class ApiDetailFrame extends Component {
  async componentDidMount() {
    const err = await this.props.value.actions.getApiDetail(
      this.props.match.params.id,
    );

    if (err && err.response.status !== 200) {
      this.props.checkErr(err.response.status);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.id !== nextProps.match.params.id) {
      this.props.value.actions.getApiDetail(nextProps.match.params.id);
    }
  }

  render() {
    const { actions } = this.props.value;

    return this.props.value.state.isApiDetailLoading ? (
      <GlobalSpinner />
    ) : (
      <ApiDetailInfo
        apiDetail={this.props.value.state.apiDetail}
        onRemove={actions.deleteApi}
        onUpdate={actions.updateApi}
        isResponsive={this.props.isResponsive}
        history={this.props.history}
      />
    );
  }
}

export default apiContext(ApiDetailFrame);
