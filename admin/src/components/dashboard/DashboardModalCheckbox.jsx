import React from 'react';

export default class DashboardModalCheckbox extends React.Component {
  state = {
    isChecked: false,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.title !== this.props.title) {
      this.setState({
        isChecked: false,
      });
    }
  }

  toggleCheckboxChange = () => {
    this.setState({
      isChecked: !this.state.isChecked,
    });
  };

  render() {
    const { title, handleCheckbox, code } = this.props;
    return (
      <form className="px-2">
        <label className="text-muted font-weight-bold font-size">
          <input
            type="checkbox"
            className={'input-description mr-2'}
            value={title}
            onChange={e => {
              handleCheckbox(e);
              this.toggleCheckboxChange();
            }}
            data-code={code}
            checked={this.state.isChecked}
          />
          {title}
        </label>
      </form>
    );
  }
}
