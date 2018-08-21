import React from 'react';
import GlobalSelectBar from '../global/GlobalSelectBar';
import DashboardModalSelectCategory from './DashboardModalSelectCategory';
import DashboardModalGraphLists from './DashboardModalGraphLists';
import GlobalModalInput from '../global/GlobalModalInput';
import { dashboardContext } from '../../store/DashboardStore';
import DashboardDateInput from './DashboardDateInput';
import { Button } from 'reactstrap';

class DashboardModalEditGraph extends React.Component {
  state = {
    baseType: '분류 데이터를 선택하세요.',
    dataType: '수치 데이터를 선택하세요.',
    graphType: '그래프 종류를 선택하세요.',
    categories: [],
    value: '',
    isOverMaxLength: false,
    showingCategories: [],
  };

  initState = () => {
    this.setState({
      baseType: '분류 데이터를 선택하세요.',
      dataType: '수치 데이터를 선택하세요.',
      graphType: '그래프 종류를 선택하세요.',
      categories: [],
      value: '',
      isOverMaxLength: false,
      showingCategories: [],
    });
  };

  checkGraphInfo = () => {
    const {
      graphName,
      graphType,
      baseType,
      dataType,
    } = this.props.value.state.graphInfo;

    if (
      graphName === undefined ||
      graphType === undefined ||
      dataType === undefined ||
      baseType.code === undefined ||
      graphName === '' ||
      graphType === '' ||
      dataType === '' ||
      baseType.code === ''
    ) {
      this.props.value.actions.setStateGraphModalFlag(false);
    } else {
      this.props.value.actions.setStateGraphModalFlag(true);
    }
  };

  handleInputChange = async ({ target }) => {
    const { name, type, checked, value } = target;
    const inputData = type === 'checkbox' ? checked : value;

    this.setState({
      value,
    });

    if (inputData.length >= 20) {
      this.setState({
        isOverMaxLength: true,
      });
    } else {
      this.setState({
        isOverMaxLength: false,
      });
      await this.changeStoreData(name, inputData);
    }
  };

  handleDateChange = async ({ target }) => {
    const { dataset, value } = target;
    const { categories } = this.state;
    const { actions } = this.props.value;

    let tempCategories = categories;

    await tempCategories.forEach(data => {
      if (data.categoryKey === dataset.code) {
        if (dataset.code === 'SPLIT_TIME') {
          data.categoryValue = value * 3600;
        } else {
          // min, max로직
          if (dataset.code === 'START_DATE') {
            const endDate = categories[1].categoryValue;
            if (endDate !== 'false') {
              if (new Date(endDate) <= new Date(`${value} 00:00:00`)) {
                alert(
                  '시작날짜가 끝날짜보다 같거나 느릴 수 없습니다. 다시 선택하세요.',
                );
                target.value = '';
                data.categoryValue = 'false';
              } else {
                data.categoryValue = `${value} 00:00:00`;
              }
            } else {
              data.categoryValue = `${value} 00:00:00`;
            }
          } else {
            const startDate = categories[0].categoryValue;
            if (startDate !== 'false') {
              if (new Date(startDate) >= new Date(`${value} 00:00:00`)) {
                alert(
                  '끝날짜가 시작날짜보다 같거나 빠를 수 없습니다. 다시 선택하세요.',
                );
                target.value = '';
                data.categoryValue = 'false';
              } else {
                data.categoryValue = `${value} 00:00:00`;
              }
            } else {
              data.categoryValue = `${value} 00:00:00`;
            }
          }
        }
      }
    });
    await this.setState({
      categories: tempCategories,
    });

    await actions.setStateGraphInfoBaseType(categories);
  };

  handleCheckbox = async ({ target }) => {
    const { dataset } = target;
    const { categories } = this.state;
    const { actions } = this.props.value;

    let tempCategories = categories;
    tempCategories.forEach(data => {
      if (data.categoryKey === dataset.code) {
        if (data.categoryValue === 'false') {
          data.categoryValue = 'true';
        } else data.categoryValue = 'false';
      }
    });
    this.setState({
      categories: tempCategories,
    });
    await actions.setStateGraphInfoBaseType(categories);
  };

  handleBaseTypeSelector = async ({ target }) => {
    const { innerText, name, dataset } = target;

    this.setState(
      {
        categories: [],
      },
      await this.changeStoreData(name, { code: dataset.code, categories: [] }),
    );

    const { usingApiId, dataTypeList } = this.props.value.state;
    const { actions } = await this.props.value;

    await actions.getDataTypeListByBaseTypeAndApiId(usingApiId, dataset.code);
    await actions.getCategories(dataset.code);

    const tempCategory = await this.makeCategoryDataSet(
      this.props.value.state.categories,
    );

    await this.changeStoreData('graphType', '');
    await this.changeStoreData('dataType', '');

    this.setState({
      dataTypeList,
      categories: tempCategory,
      graphType: '그래프 종류를 선택하세요.',
      dataType: '수치 데이터를 선택하세요.',
      baseType: innerText,
      showingCategories: this.props.value.state.categories,
    });
  };

  makeCategoryDataSet = receivedData => {
    let makeData = [];

    receivedData.forEach(data => {
      makeData.push({ categoryKey: data.code, categoryValue: 'false' });
    });

    return makeData;
  };

  handleTypeSelector = async ({ target }) => {
    const { innerText, name, dataset } = target;
    const { actions } = this.props.value;
    const { graphInfo, graphTypeList } = this.props.value.state;
    const { baseType } = graphInfo;

    this.setState({
      [name]: innerText,
    });

    await this.changeStoreData(name, dataset.code);

    if (name === 'dataType') {
      await actions.getGraphTypeListByBaseTypeAndDataType(
        baseType.code,
        this.props.value.state.graphInfo.dataType,
      );

      this.setState({
        graphTypeList,
      });
    }
  };

  changeStoreData = async (key, value) => {
    if (key === undefined || value === undefined) {
      alert('잘못 선택하셨습니다.');
      return;
    }

    await this.props.value.actions.setStateGraphInfo(key, value);
  };

  componentDidMount() {
    const { dashboardId, value } = this.props;
    const { actions, state } = value;
    const { usingApiId, baseTypeList } = state;
    const apiId = usingApiId;

    actions.getBaseTypeListByApiId(apiId);
    this.setState({
      baseTypeList: baseTypeList,
    });

    if (dashboardId !== undefined) {
      actions.getGraphListsByDashboardId(dashboardId);
    }
  }

  renderDateInput(dataList) {
    if (dataList[0] === undefined) {
      return;
    } else {
      return (
        <div>
          <DashboardDateInput
            title={dataList[0].title}
            code={dataList[0].code}
            handleInputChange={this.handleDateChange}
          />
          <DashboardDateInput
            title={dataList[1].title}
            code={dataList[1].code}
            handleInputChange={this.handleDateChange}
          />
          <form className="px-2">
            <label className="text-muted font-weight-bold font-size">
              {dataList[2].title}
              <input
                type="number"
                className="input-description text-center"
                onChange={this.handleDateChange}
                autoComplete="off"
                data-code={dataList[2].code}
                min="1"
              />{' '}
              시간
            </label>
          </form>
        </div>
      );
    }
  }

  render() {
    const {
      value,
      baseType,
      dataType,
      graphType,
      isOverMaxLength,
      showingCategories,
    } = this.state;
    const { dashboardId } = this.props;
    const {
      graphLists,
      baseTypeList,
      dataTypeList,
      graphTypeList,
    } = this.props.value.state;
    return dashboardId !== undefined ? (
      /**
       * 수정할때
       */
      <div>
        <DashboardModalGraphLists
          dataList={graphLists}
          handleInputChange={this.handleInputChange}
          clearPlaceholder={this.initState}
          value={value}
        />
        <GlobalModalInput
          inputTitle="그래프 이름"
          inputPlaceholder={'그래프 이름을 입력하세요.'}
          name="graphName"
          handleInputChange={this.handleInputChange}
          value={value}
          isOverMaxLength={isOverMaxLength}
          maxLength="20"
        />
        <GlobalSelectBar
          title="분류 데이터 (분류 기준)"
          listTitle="Base type"
          dataList={baseTypeList}
          handleSelectChange={this.handleBaseTypeSelector}
          selectedData={baseType}
          name="baseType"
        />
        {baseType !== '분류 데이터를 선택하세요.' ? (
          <div>
            {baseType !== '날짜' ? (
              <DashboardModalSelectCategory
                handleCheckbox={this.handleCheckbox}
                dataList={showingCategories}
                handleInput={this.handleDateInput}
              />
            ) : (
              this.renderDateInput(showingCategories)
            )}
            <GlobalSelectBar
              title="수치 데이터"
              listTitle="Data type"
              dataList={dataTypeList}
              handleSelectChange={this.handleTypeSelector}
              selectedData={dataType}
              name="dataType"
            />
          </div>
        ) : (
          ''
        )}
        {this.state.dataType !== '수치 데이터를 선택하세요.' ? (
          <GlobalSelectBar
            title="그래프 종류"
            listTitle="사용 가능한 그래프 종류"
            dataList={graphTypeList}
            handleSelectChange={this.handleTypeSelector}
            selectedData={graphType}
            name="graphType"
          />
        ) : (
          ''
        )}
        <div className="text-right">
          <Button
            className="d-inline cursor-pointer btn-sm btn btn-outline-danger mr-2"
            onClick={() => {
              if (this.props.value.actions.createGraph()) {
                this.initState();
              }
            }}
          >
            그래프 추가
          </Button>
        </div>
      </div>
    ) : (
      /**
       * 신규생성할때
       */
      <div>
        <DashboardModalGraphLists
          dataList={graphLists}
          handleInputChange={this.handleInputChange}
          clearPlaceholder={this.initState}
          value={value}
        />
        <GlobalModalInput
          inputTitle="그래프 이름"
          inputPlaceholder={'그래프 이름을 입력하세요.'}
          name="graphName"
          handleInputChange={this.handleInputChange}
          value={value}
          isOverMaxLength={isOverMaxLength}
          maxLength="20"
        />
        <GlobalSelectBar
          title="분류 데이터 (분류 기준)"
          listTitle="Base type"
          dataList={baseTypeList}
          handleSelectChange={this.handleBaseTypeSelector}
          selectedData={baseType}
          name="baseType"
        />
        {this.state.baseType !== '분류 데이터를 선택하세요.' ? (
          <div>
            {this.state.baseType !== '날짜' ? (
              <DashboardModalSelectCategory
                handleCheckbox={this.handleCheckbox}
                dataList={showingCategories}
                handleInput={this.handleDateInput}
              />
            ) : (
              this.renderDateInput(showingCategories)
            )}
            <GlobalSelectBar
              title="수치 데이터"
              listTitle="Data type"
              dataList={dataTypeList}
              handleSelectChange={this.handleTypeSelector}
              selectedData={dataType}
              name="dataType"
            />
          </div>
        ) : (
          ''
        )}
        {this.state.dataType !== '수치 데이터를 선택하세요.' ? (
          <GlobalSelectBar
            title="그래프 종류"
            listTitle="사용 가능한 그래프 종류"
            dataList={graphTypeList}
            handleSelectChange={this.handleTypeSelector}
            selectedData={graphType}
            name="graphType"
          />
        ) : (
          ''
        )}
        <div className="text-right">
          <Button
            className="d-inline cursor-pointer btn-sm btn btn-outline-danger mr-2"
            onClick={() => {
              if (this.props.value.actions.createGraph()) {
                this.initState();
              }
            }}
          >
            그래프 추가
          </Button>
        </div>
      </div>
    );
  }
}

export default dashboardContext(DashboardModalEditGraph);
