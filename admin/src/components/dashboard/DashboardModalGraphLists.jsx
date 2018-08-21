import React from 'react';
import DashboardModalAddedGraph from './DashboardModalAddedGraph';

const DashboardModalGraphLists = ({ dataList }) => {
  return (
    <div className="bg-light w-100 py-2">
      <div className="px-3 font-size font-weight-bold">
        추가된 그래프 리스트
      </div>
      {dataList.map((data, i) => {
        return (
          <DashboardModalAddedGraph
            graphName={data.graphName}
            index={i}
            key={i}
            graphId={data.graphId}
            graphData={data}
          />
        );
      })}
      {dataList.length === 0 ? (
        <div className="text-center font-size"> 추가된 그래프가 없습니다. </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default DashboardModalGraphLists;
