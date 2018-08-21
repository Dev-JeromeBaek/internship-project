import React, { Component, createContext } from 'react';
import axios from 'axios';

const Store = createContext();
const { Provider, Consumer: DashboardConsumer } = Store;

class DashboardProvider extends Component {
  state = {
    API_DOMAIN: '/dashboard/management',
    dashboardList: [],
    apiList: [],
    dashboardInfo: { dashboardName: '', dashboardDescription: '', apiId: '' },
    isLoading: false,
    usingApiId: '',
    baseTypeList: [],
    graphInfo: {},
    dataTypeList: [],
    graphTypeList: [],
    categories: [],
    graphLists: [],
    addedGraphLists: [],
    dashboardId: '',
  };

  actions = {
    setStateDashboardInfoByOriginData: originData => {
      this.setState({
        dashboardInfo: originData,
        usingApiId: originData.apiId,
      });
    },

    initStateDashboardInfo: () => {
      this.setState({
        dashboardInfo: {
          dashboardName: '',
          dashboardDescription: '',
          apiId: '',
        },
      });
    },

    setStateDashboardInfo: async (key, value) => {
      this.setState({
        dashboardInfo: { ...this.state.dashboardInfo, [key]: value },
      });
    },

    setStateGraphInfo: async (key, value) => {
      this.setState({
        graphInfo: { ...this.state.graphInfo, [key]: value },
      });
    },

    setStateGraphInfoBaseType: async value => {
      const { graphInfo } = this.state;
      this.setState({
        graphInfo: {
          ...graphInfo,
          baseType: {
            ...graphInfo.baseType,
            categories: value,
          },
        },
      });
    },

    getDashboardList: async () => {
      this.setState({
        isLoading: true,
      });

      try {
        const dashboardList = await axios.get('/proxy/dashboard');

        this.setState({
          dashboardList: dashboardList.data.data,
          isLoading: false,
        });
      } catch (err) {
        return err;
      }
    },

    getMockApiList: async useFlag => {
      const apiList = await axios.get(
        `/admin-dashboard/management?display=${useFlag}`,
      );
      await this.setState({
        apiList: apiList.data.data,
      });
    },

    getBaseTypeListByApiId: async apiId => {
      const baseTypeList = await axios.get(
        `/dashboard/management/graph/axis?type=&apiId=${apiId}`,
      );
      await this.setState({
        baseTypeList: baseTypeList.data.data,
      });
    },

    getDataTypeListByBaseTypeAndApiId: async (apiId, baseType) => {
      try {
        const dataTypeList = await axios.get(
          `/dashboard/management/graph/axis?type=${baseType}&apiId=${apiId}`,
        );

        await this.setState({
          dataTypeList: dataTypeList.data.data,
        });
      } catch (e) {
        alert(e.response.data.exceptionMessage);
      }
    },

    getGraphTypeListByBaseTypeAndDataType: async (baseType, dataType) => {
      try {
        const graphTypeList = (await axios.get(
          `/dashboard/management/graph/type?baseType=${baseType}&dataType=${dataType}`,
        )).data.data;

        let subGraphTypeList = [];

        graphTypeList.forEach(data => {
          data.categories.forEach(graph => {
            subGraphTypeList.push(graph);
          });
        });

        await this.setState({
          graphTypeList: subGraphTypeList,
        });
      } catch (e) {
        alert(e.response.data.exceptionMessage);
      }
    },

    getGraphListsByDashboardId: async dashboardId => {
      try {
        const graphCollectionList = (await axios.get(
          `/proxy/dashboard/${dashboardId}`,
        )).data.data.graphCollectionList;

        this.setState({
          dashboardId,
          graphLists: graphCollectionList,
        });
      } catch (e) {
        alert(e.response.data.exceptionMessage);
      }
    },

    getCategories: baseType => {
      let categories;

      this.state.baseTypeList.forEach(data => {
        if (data.code === baseType) {
          categories = data.categories;
        }
      });

      this.setState({
        categories,
      });
    },

    deleteDashboard: async id => {
      alert((await axios.delete(`${this.state.API_DOMAIN}/${id}`)).data.data);
      this.actions.getDashboardList();
    },

    deleteGraph: index => {
      this.state.graphLists.splice(index, 1);

      this.setState({
        graphLists: [...this.state.graphLists],
      });
    },

    deleteGraphByGraphId: async graphId => {
      if (window.confirm('그래프를 삭제하시겠습니까?')) {
        try {
          alert(
            (await axios.delete(`/dashboard/management/graph/${graphId}`)).data
              .data,
          );
          this.actions.getGraphListsByDashboardId(this.state.dashboardId);
        } catch (e) {
          alert(e.response.data.exceptionMessage);
        }
      }
    },

    createDashboard: async () => {
      const { dashboardInfo, API_DOMAIN, graphInfo } = this.state;
      const { apiId } = dashboardInfo;

      if (!this.checkEmptyField(dashboardInfo)) {
        return false;
      } else {
        try {
          const responseMsg = await axios.post(`${API_DOMAIN}`, dashboardInfo);
          const dashboardId = responseMsg.data.data.dashboardId;

          this.setState({
            usingApiId: apiId,
            dashboardId,
            graphInfo: {
              ...graphInfo,
              apiId: parseInt(apiId, 10),
              dashboardId: parseInt(dashboardId, 10),
            },
          });

          return true;
        } catch (e) {
          alert(e.response.data.exceptionMessage);
        }
      }
    },

    completeAddingDashboard: async () => {
      const { graphLists, API_DOMAIN, dashboardId } = this.state;

      if (graphLists.length === 0) {
        if (
          window.confirm(
            '추가된 그래프가 없습니다. 그래프를 추가하지 않고 종료하면 대시보드도 삭제됩니다. 계속 하시겠습니까?',
          )
        ) {
          await axios.delete(`${API_DOMAIN}/${dashboardId}`);
          this.actions.getDashboardList();
        } else {
        }
      } else {
        const removeIdx = [];
        await this.state.graphLists.forEach((data, i) => {
          if (data.dataType === undefined) {
            removeIdx.push(i);
          }
        });

        await this.state.graphLists.splice(0, removeIdx.length);

        if (removeIdx === []) {
          try {
            await axios.put(
              '/dashboard/management/graph',
              this.state.graphLists,
            );
          } catch (e) {
            alert(e.response.data.exceptionMessage);
          }
        } else {
          try {
            await axios.post(
              '/dashboard/management/graph',
              this.state.graphLists,
            );
          } catch (e) {
            alert(e.response.data.exceptionMessage);
          }
        }

        await this.setState({
          dashboardInfo: {
            dashboardName: '',
            dashboardDescription: '',
            apiId: '',
          },
          graphInfo: {},
          graphLists: [],
        });

        this.actions.getDashboardList();
      }
    },

    createGraph: () => {
      const { graphLists, graphInfo, usingApiId, dashboardId } = this.state;
      const { graphName, graphType, baseType, dataType } = this.state.graphInfo;

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
        alert('모든 값을 채워주세요.');
        return false;
      } else {
        if (this.checkCategoryValue(baseType.categories)) {
          this.setState({
            graphLists: [...graphLists, graphInfo],
            categories: [],
            dataTypeList: [],
            graphTypeList: [],
            graphInfo: {
              apiId: usingApiId,
              dashboardId,
            },
          });
          return true;
        } else {
          alert('category를 선택해주세요.');
          return false;
        }
      }
    },

    editDashboard: async () => {
      const { dashboardInfo, API_DOMAIN, graphInfo } = this.state;
      const {
        dashboardName,
        dashboardDescription,
        dashboardId,
      } = dashboardInfo;

      if (dashboardName === '' || dashboardDescription === '') {
        return false;
      } else {
        const usingApiId = dashboardInfo.apiId;
        const tempDashboardInfo = { ...dashboardInfo };
        await delete tempDashboardInfo.graphCollectionList;

        try {
          await axios.put(`${API_DOMAIN}`, tempDashboardInfo);

          await this.setState({
            dashboardId,
            graphInfo: {
              ...graphInfo,
              apiId: parseInt(usingApiId, 10),
              dashboardId: parseInt(dashboardId, 10),
            },
          });

          return true;
        } catch (e) {
          alert(e.response.data.exceptionMessage);
        }
      }
    },
  };

  checkCategoryValue(categories) {
    let checkedNum = 0;
    if (categories.length === 0) return false;

    if (categories[0].categoryKey === 'START_DATE') {
      /* 날짜 baseType 일때 */
      categories.forEach(category => {
        if (category.categoryValue !== 'false') checkedNum++;
      });
      if (checkedNum === 3) return true;
      else return false;
    } else {
      /* baseType이 날짜가 아닐때 */
      categories.forEach(category => {
        if (category.categoryValue === 'true') checkedNum++;
      });

      if (checkedNum === 0) return false;
      else return true;
    }
  }

  render() {
    const { state, actions } = this;
    const value = { state, actions };
    return <Provider value={value}>{this.props.children}</Provider>;
  }

  checkEmptyField(fields) {
    let isEmpty = true;
    Object.keys(fields).forEach(key => {
      if (fields[key] === '') {
        isEmpty = false;
      }
    });

    return isEmpty;
  }
}

const dashboardContext = Component => {
  return props => {
    return (
      <DashboardConsumer>
        {value => {
          return <Component {...props} value={value} />;
        }}
      </DashboardConsumer>
    );
  };
};

export { DashboardProvider, DashboardConsumer, dashboardContext };
