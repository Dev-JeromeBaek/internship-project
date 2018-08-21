import React, { Fragment } from 'react';
import {
  Card,
  CardBody,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import DashboardModalEditDashboard from './DashboardModalEditDashboard';
import DashboardModalEditGraph from './DashboardModalEditGraph';
import { dashboardContext } from '../../store/DashboardStore';
import createIcon from '../../public/icons/create.svg';

class DashboardModal extends React.Component {
  state = {
    modal: false,
    title: '대시보드 추가',
    primaryBtn: '다음',
    secondaryBtn: '취소',
    isEditDashboard: true,
  };

  toggle = () => {
    const { isEditDashboard, modal } = this.state;
    const { actions } = this.props.value;

    if (isEditDashboard && modal) {
      if (
        window.confirm('대시보드가 생성되지 않았습니다. 계속 하시겠습니까?')
      ) {
        this.initState();
      }
    } else if (!isEditDashboard && modal) {
      actions.completeAddingDashboard();
    } else {
      this.initState();
    }
  };

  initState = () => {
    this.setState({
      title: '대시보드 추가',
      isEditDashboard: true,
      primaryBtn: '다음',
      secondaryBtn: '취소',
      modal: !this.state.modal,
    });
    this.props.value.actions.setStateDashboardInfo('dashboardName', '');
    this.props.value.actions.setStateDashboardInfo('dashboardDescription', '');
    this.props.value.actions.setStateDashboardInfo('apiId', '');
  };

  nextStep = async () => {
    const { primaryBtn } = this.state;
    const { actions } = this.props.value;

    if (primaryBtn === '다음') {
      const statusFlag = await actions.createDashboard();
      if (statusFlag === true) {
        this.setState({
          isEditDashboard: false,
          primaryBtn: '완료',
          secondaryBtn: '이전',
          title: '그래프 추가',
        });
      } else if (statusFlag === false) {
        alert('모든 값을 채워주세요.');
      }
    } else {
      actions.completeAddingDashboard();
    }
  };

  render() {
    const editPossibleToggling = (condition, a, b) => {
      if (condition) {
        return a;
      }
      return b;
    };

    const {
      isEditDashboard,
      modal,
      title,
      primaryBtn,
      secondaryBtn,
    } = this.state;

    return (
      <Fragment>
        <Card
          style={{ height: '182px' }}
          className="card-hover cursor-pointer shadow"
          onClick={this.toggle}
        >
          <CardBody className="d-flex justify-content-center align-items-center">
            <div>
              <div className="text-center">
                <img
                  src={createIcon}
                  width="50"
                  height="50"
                  alt="Create icon."
                />
              </div>
              <div className="d-inline text-center font-size pt-5">
                대시보드 추가하기
              </div>
            </div>
          </CardBody>
        </Card>
        <Modal
          keyboard={false}
          isOpen={modal}
          toggle={this.toggle}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggle}>{title}</ModalHeader>
          <ModalBody>
            {editPossibleToggling(
              isEditDashboard,
              <DashboardModalEditDashboard />,
              <DashboardModalEditGraph />,
            )}
          </ModalBody>
          <ModalFooter>
            {this.state.isEditDashboard ? (
              <Button color="secondary" onClick={this.toggle}>
                {secondaryBtn}
              </Button>
            ) : (
              ''
            )}
            <Button color="warning" onClick={this.nextStep}>
              {primaryBtn}
            </Button>
          </ModalFooter>
        </Modal>
      </Fragment>
    );
  }
}

export default dashboardContext(DashboardModal);
