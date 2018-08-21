import React from 'react';
import { Tooltip } from 'reactstrap';
import deleteIcon from '../../public/icons/grayDelete.svg';
import { DashboardConsumer } from '../../store/DashboardStore';

export default class DashboardModalAddedGraph extends React.Component {
  state = {
    tooltipOpen: false,
  };

  transferCode = code => {
    const title = {
      BAR_GRAPH: '막대 그래프',
      PIE_GRAPH: '파이 그래프',
      LINEAR_GRAPH: '선형 그래프',
      DATE: '날짜',
      REAL_TIME: '실시간',
      GENDER: '성별',
      AGE: '나이',
      REGION: '지역',
      PLATFORM: '플랫폼',
      SOLD_COUNT: '판매수',
      DEAL_PRICE: '판매가격',
      INQUIRY_COUNT: '문의수',
      VISITED_COUNT: '방문수',
    };

    return title[code];
  };

  toggle = () => {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen,
    });
  };

  render() {
    const { props } = this;
    return (
      <DashboardConsumer>
        {value => {
          return (
            <div
              className="w-100 px-3 py-1"
              index={props.index}
              id={props.graphId}
            >
              <img
                src={deleteIcon}
                width="8"
                height="8"
                alt="Delete icon."
                className="d-inline cursor-pointer"
                onClick={() =>
                  props.graphId === undefined
                    ? value.actions.deleteGraph(props.index)
                    : value.actions.deleteGraphByGraphId(props.graphId)
                }
              />
              <div
                className="d-inline px-2 font-size font-weight-bold"
                href="#"
                id={'tooltip' + props.graphId}
              >
                {props.graphName}
              </div>
              <Tooltip
                className="font-size"
                placement="right"
                isOpen={this.state.tooltipOpen}
                target={'tooltip' + props.graphId}
                toggle={this.toggle}
                delay={0.2}
              >
                {props.graphData.updateDate === undefined ? (
                  <div className="text-left">
                    <div>
                      그래프 타입 :{' '}
                      {this.transferCode(props.graphData.graphType)}
                    </div>
                    <div>
                      분류 기준 :{' '}
                      {this.transferCode(props.graphData.baseType.code)}
                    </div>
                    <div>
                      수치 데이터 :{' '}
                      {this.transferCode(props.graphData.dataType)}
                    </div>
                  </div>
                ) : (
                  <div className="text-left">
                    <div>
                      그래프 타입 :{' '}
                      {this.transferCode(props.graphData.graphSubType.code)}
                    </div>
                    <div>
                      분류 기준 :{' '}
                      {this.transferCode(props.graphData.graph.baseType.code)}
                    </div>
                    <div>
                      수치 데이터 :{' '}
                      {this.transferCode(props.graphData.graph.dataType.code)}
                    </div>
                  </div>
                )}
              </Tooltip>
            </div>
          );
        }}
      </DashboardConsumer>
    );
  }
}
