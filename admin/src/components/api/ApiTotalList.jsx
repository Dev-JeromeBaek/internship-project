import React, { Component } from 'react';
import ApiDetail from './ApiDetail';
import { apiContext } from '../../store/ApiStore';

import { UncontrolledCollapse, Badge } from 'reactstrap';
import GlobalConfirmModal from '../global/GlobalConfirmModal';

class ApiTotalList extends Component {
  state = {
    isActive: false,
    apiDetail: {},
    isApiActive: false,
  };

  async componentDidMount() {
    await this.props.value.actions.getApiDetail(this.props.api.apiId);

    this.setState({
      apiDetail: this.props.value.state.apiDetail,
      isApiActive:
        this.props.value.state.apiDetail.isUsedApi === 'T' ? true : false,
    });
  }

  handleBtnActive = async () => {
    this.setState({
      isActive: !this.state.isActive,
    });
  };

  addApi = () => {
    if (this.state.apiDetail.isUsedApi === 'T') {
      this.setState(
        {
          apiDetail: { ...this.state.apiDetail, isUsedApi: 'F' },
        },
        () => {
          this.props.value.actions.saveAvailableApi(this.state.apiDetail);
          this.setState({
            isApiActive: !this.state.isApiActive,
          });
        },
      );
    } else {
      this.setState(
        {
          apiDetail: { ...this.state.apiDetail, isUsedApi: 'T' },
        },
        () => {
          this.props.value.actions.saveAvailableApi(this.state.apiDetail);
          this.setState({
            isApiActive: !this.state.isApiActive,
          });
        },
      );
    }
  };

  render() {
    const { api } = this.props;
    return (
      <div className="mb-3">
        <div className="p-2 bg-light rounded cursor-pointer shadow d-flex align-items-center">
          <div
            onClick={this.handleBtnActive}
            id={'toggler' + this.props.api.apiId}
            color="light"
            className={
              this.state.isActive ? 'w-100 text-left active' : 'w-100 text-left'
            }
          >
            <div className="d-flex align-items-center">
              <div>
                <Badge color="info">GET</Badge>
              </div>
              <div
                className={
                  this.props.isApiList
                    ? 'w-55 ml-auto mr-auto word-break-all-white-space-normal'
                    : 'ml-auto mr-auto word-break-all-white-space-normal'
                }
              >
                {api.requestUrl}
              </div>
            </div>
          </div>
          <GlobalConfirmModal
            isApiActive={this.state.isApiActive}
            isToggle={true}
            addApi={this.addApi}
            info={this.state.apiDetail}
          />
        </div>
        <UncontrolledCollapse
          toggler={'#toggler' + this.props.api.apiId}
          className="shadow mt-1"
        >
          {this.state.apiDetail && (
            <ApiDetail apiDetail={this.state.apiDetail} />
          )}
        </UncontrolledCollapse>
      </div>
    );
  }
}
export default apiContext(ApiTotalList);
