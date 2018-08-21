import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import DashboardModalEditDashboard from './DashboardModalEditDashboard';
import DashboardModalEditGraph from './DashboardModalEditGraph';
import { dashboardContext } from '../../store/DashboardStore';
import updateIcon from '../../public/icons/update.svg';

class DashboardEditModal extends React.Component {
  state = {
    modal: false,
    title: '대시보드 수정',
    primaryBtn: '그래프 수정',
    secondaryBtn: '취소',
    isEditDashboard: true,
  };

  toggle = e => {
    if (this.state.title === '대시보드 수정') {
      e.stopPropagation();
    }

    this.setState({
      title: '대시보드 수정',
      isEditDashboard: true,
      primaryBtn: '그래프 수정',
      secondaryBtn: '취소',
      modal: !this.state.modal,
    });
  };

  nextStep = () => {
    if (this.state.primaryBtn === '그래프 수정') {
      this.props.value.actions.editDashboard();
      this.setState({
        isEditDashboard: false,
        primaryBtn: '저장',
        secondaryBtn: '대시보드 수정',
        title: '그래프 수정',
      });
    } else {
      this.props.value.actions.completeAddingDashboard();
      this.toggle();
    }
  };

  previous = () => {
    this.setState({
      isEditDashboard: true,
      primaryBtn: '그래프 수정',
      secondaryBtn: '취소',
      title: '대시보드 수정',
    });
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
      <div
        className=""
        onClick={e => {
          e.stopPropagation();
        }}
      >
        <img
          src={updateIcon}
          width="15"
          height="15"
          alt="Update icon."
          onClick={this.toggle}
        />
        <Modal
          isOpen={modal}
          toggle={this.toggle}
          className={this.props.className}
          onClick={e => {
            e.stopPropagation();
          }}
        >
          <ModalHeader toggle={this.toggle}>{title}</ModalHeader>
          <ModalBody>
            {editPossibleToggling(
              isEditDashboard,
              <DashboardModalEditDashboard
                dashboardData={this.props.dashboardData}
              />,
              <DashboardModalEditGraph
                dashboardId={this.props.dashboardData.dashboardId}
              />,
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
      </div>
    );
  }
}

export default dashboardContext(DashboardEditModal);
