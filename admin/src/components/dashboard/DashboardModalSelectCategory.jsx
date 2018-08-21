import React from 'react';
import DashboardModalCheckbox from '../dashboard/DashboardModalCheckbox';
import DashboardModalRadioButton from './DashboardModalRadioButton';

export default class DashboardModalSelectCategory extends React.Component {
  state = { cSelected: [] };

  onRadioBtnClick = ({ target }) => {
    const { value } = target;
    this.setState({ rSelected: value });
  };

  getSelectedValue(value) {
    return this.state.rSelected === value;
  }

  renderCheckbox(dataList) {
    return (
      <div className="pl-2 fontSize">
        {dataList.map((data, i) => {
          return (
            <DashboardModalCheckbox
              title={data.title}
              key={i}
              handleCheckbox={this.props.handleCheckbox}
              code={data.code}
            />
          );
        })}
      </div>
    );
  }

  renderRadioBtn(dataList) {
    return (
      <div className="pl-2 fontSize">
        {dataList.map((data, i) => {
          return (
            <DashboardModalRadioButton
              title={data.title}
              key={i}
              handleCheckbox={this.props.handleCheckbox}
              code={data.code}
            />
          );
        })}
      </div>
    );
  }

  render() {
    const { dataList } = this.props;

    return dataList[0].code === 'ONE_DAY'
      ? this.renderRadioBtn(dataList)
      : this.renderCheckbox(dataList);
  }
}
