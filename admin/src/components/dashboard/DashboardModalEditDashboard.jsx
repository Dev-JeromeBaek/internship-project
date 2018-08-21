import React from 'react';
import GlobalModalInput from '../global/GlobalModalInput';
import GlobalSelectBar from '../global/GlobalSelectBar';
import { dashboardContext } from '../../store/DashboardStore';

class DashboardModalEditDashboard extends React.Component {
  state = {
    selectedApi: 'Api를 선택하세요.',
    dashboardName: '',
    dashboardDescription: '',
    useApiList: [],
    isOverMaxLengthName: false,
    isOverMaxLengthDesc: false,
  };

  getDashboardData = dashboardData => {
    const { dashboardName, dashboardDescription } = dashboardData;

    this.setState({
      dashboardName: dashboardName,
      dashboardDescription: dashboardDescription,
    });
  };

  componentDidMount() {
    const { value, dashboardData } = this.props;
    const { actions } = value;

    actions.getMockApiList('use');

    if (dashboardData !== undefined) {
      this.getDashboardData(dashboardData);
      actions.setStateDashboardInfoByOriginData(dashboardData);
    } else {
      actions.initStateDashboardInfo();
    }
  }

  handleInputChange = async ({ target }) => {
    const { name, type, checked, value } = target;
    const inputData = type === 'checkbox' ? checked : value;

    this.setState({
      [name]: value,
    });

    if (name === 'dashboardName') {
      if (inputData.length >= 20) {
        this.setState({
          isOverMaxLengthName: true,
        });
      } else {
        this.setState({
          isOverMaxLengthName: false,
        });
      }
    } else {
      if (inputData.length >= 40) {
        this.setState({
          isOverMaxLengthDesc: true,
        });
      } else {
        this.setState({
          isOverMaxLengthDesc: false,
        });
      }
    }
    await this.changeStoreData(name, inputData);
  };

  handleSelectChange = async ({ target }) => {
    const { innerText, id } = target;

    await this.setState({
      selectedApi: innerText,
    });

    await this.changeStoreData('apiId', id);
  };

  changeStoreData = async (key, value) => {
    const { actions } = this.props.value;
    await actions.setStateDashboardInfo(key, value);
  };

  render() {
    const { dashboardData } = this.props;
    const { apiList } = this.props.value.state;
    const {
      dashboardName,
      dashboardDescription,
      selectedApi,
      isOverMaxLengthName,
      isOverMaxLengthDesc,
    } = this.state;

    return dashboardData === undefined ? (
      <div>
        <GlobalModalInput
          inputTitle="대시보드 이름"
          inputPlaceholder={'사용할 대시보드 이름을 입력하세요.'}
          name="dashboardName"
          handleInputChange={this.handleInputChange}
          value={dashboardName}
          isOverMaxLength={isOverMaxLengthName}
          maxLength="20"
        />
        <GlobalModalInput
          inputTitle="대시보드 설명"
          inputPlaceholder={'대시보드의 간단한 설명을 작성해주세요.'}
          name="dashboardDescription"
          handleInputChange={this.handleInputChange}
          value={dashboardDescription}
          isOverMaxLength={isOverMaxLengthDesc}
          maxLength="40"
        />
        <GlobalSelectBar
          title="API 리스트"
          listTitle="API List"
          dataList={apiList}
          handleSelectChange={this.handleSelectChange}
          selectedData={selectedApi}
        />
      </div>
    ) : (
      <div>
        <GlobalModalInput
          inputTitle="대시보드 이름"
          value={dashboardName}
          name="dashboardName"
          handleInputChange={this.handleInputChange}
          isOverMaxLength={isOverMaxLengthName}
          maxLength="20"
        />
        <GlobalModalInput
          inputTitle="대시보드 설명"
          value={dashboardDescription}
          name="dashboardDescription"
          handleInputChange={this.handleInputChange}
          isOverMaxLength={isOverMaxLengthDesc}
          maxLength="40"
        />
        <div className="p-2">
          <div className="text-muted font-weight-bold font-size w-100">
            사용중인 API
            <div className="font-size w-100">{dashboardData.apiId}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default dashboardContext(DashboardModalEditDashboard);
