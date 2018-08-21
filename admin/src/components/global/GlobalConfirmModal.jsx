import React, { Component, Fragment } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { apiContext } from '../../store/ApiStore';
import deleteIcon from '../../public/icons/delete.svg';

class ConfirmModal extends Component {
  state = {
    modal: false,
    dashboardCount: 0,
    graphCount: 0,
  };

  getSoonDeletingInformationApi = async info => {
    const soonDeletingInformationApi = await this.props.value.actions.getSoonDeletingInformationApi(
      info.apiId,
    );

    const { dashboardCount, graphCount } = soonDeletingInformationApi.data.data;

    this.setState({
      dashboardCount,
      graphCount,
      modal: !this.state.modal,
    });
  };

  toggle = info => {
    if (info) {
      this.getSoonDeletingInformationApi(info);
    } else {
      this.setState({
        modal: !this.state.modal,
      });
    }
  };

  handleOnKeyPress = (dashboard, goApi) => {
    if (dashboard) {
      this.props.deleteDashboard();
    } else if (goApi) {
      this.props.addApi();
      this.props.goApi();
    } else {
      this.props.addApi();
    }
    this.toggle();
  };

  render() {
    const { addApi, goApi, deleteDashboard, info } = this.props;

    return (
      <div
        style={this.props.isToggle && { height: '25.5px' }}
        onKeyPress={() => {
          this.handleOnKeyPress(deleteDashboard, goApi);
        }}
        onClick={e => {
          e.stopPropagation();
        }}
      >
        {this.props.isNavLink && (
          <div
            style={{ borderTopLeftRadius: '0', borderBottomLeftRadius: '0' }}
            className="btn btn-sm btn-warning"
            onClick={() => {
              this.toggle(info);
            }}
          >
            비활성화
          </div>
        )}

        {this.props.isToggle && (
          <label style={{ marginBottom: 0 }} className="switch">
            <input
              type="checkbox"
              checked={this.props.isApiActive}
              onClick={() => {
                this.props.isApiActive ? this.toggle(info) : addApi();
              }}
            />
            <span className="slider round" />
          </label>
        )}

        {this.props.isCard && (
          <img
            src={deleteIcon}
            width="15"
            height="15"
            alt="Delete icon."
            onClick={e => {
              this.toggle();
              e.stopPropagation();
            }}
          />
        )}
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
          className={this.props.className}
          onClick={e => {
            e.stopPropagation();
          }}
        >
          <ModalHeader>Warning!</ModalHeader>
          <ModalBody>
            {(this.props.isNavLink || this.props.isToggle) &&
              'API를 비활성화하면, 해당 API를 사용하는 모든 대시보드에서 데이터 적재가 이루어지지 않습니다. 그래도 삭제하시겠습니까?'}

            {(this.props.isNavLink || this.props.isToggle) && (
              <Fragment>
                <hr />
                <p className="mb-0">
                  {`대시보드: ${this.state.dashboardCount}개`}
                  <br />
                  {`그래프: ${this.state.graphCount}개`}
                </p>
              </Fragment>
            )}

            {this.props.isCard &&
              '사용 중인 대시보드를 삭제하면, 추가했던 API와 그래프들이 모두 삭제됩니다. 그래도 삭제하시겠습니까?'}
          </ModalBody>
          <ModalFooter>
            <Button
              color="secondary"
              onClick={e => {
                this.toggle();
                e.stopPropagation();
              }}
            >
              취소
            </Button>{' '}
            {this.props.isNavLink && (
              <Button
                color="warning"
                onClick={e => {
                  this.toggle();
                  goApi();
                  addApi();
                  e.stopPropagation();
                }}
              >
                비활성화
              </Button>
            )}
            {this.props.isToggle && (
              <Button
                color="warning"
                onClick={e => {
                  this.toggle();
                  addApi();
                  e.stopPropagation();
                }}
              >
                비활성화
              </Button>
            )}
            {this.props.isCard && (
              <Button
                color="danger"
                onClick={e => {
                  this.toggle();
                  deleteDashboard();
                  e.stopPropagation();
                }}
              >
                삭제
              </Button>
            )}
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default apiContext(ConfirmModal);
