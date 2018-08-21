const chartDataSet = (graphDataInfo, setCycle, cycleTitle) => {
  const { graphDataList, graphType, baseType, dataType } = graphDataInfo;
  if (graphDataList.length === 0) {
    return 'non Data';
  } else {
    let largeNum = 'small';
    for (let i = graphDataList.length - 1; i > 0; i--) {
      if (graphDataList[i].dataY > 10000000) {
        largeNum = 'large';
        break;
      }
    }
    const names =
      graphType.graphSubType.code === 'PIE_GRAPH'
        ? graphDataList.map(info => {
            if (info.pieName === '남') {
              return '남성';
            } else if (info.pieName === '녀') {
              return '여성';
            } else {
              return info.pieName;
            }
          })
        : largeNum === 'large'
          ? [
              ['X: ' + baseType.title],
              [`Y: ${dataType.title} (단위: 10,000,000)`],
            ]
          : [['X: ' + baseType.title], [`Y: ${dataType.title} (단위: 1,000)`]];

    const types = ['info', 'danger', 'warning', 'grape', 'grass', 'sea'];

    let tempArr = [];
    let pieLabelArr = [].concat(graphDataList);
    let labelArr = [].concat(graphDataList);

    let newArr = [];
    if (graphDataList.length < 6) {
      for (let i = 0; i < graphDataList.length; i++) {
        newArr.push(labelArr.shift());
      }
    } else {
      for (let i = graphDataList.length - 7; i < graphDataList.length; i++) {
        newArr.unshift(labelArr.pop());
      }
    }

    const labels =
      graphType.graphSubType.code !== 'PIE_GRAPH'
        ? newArr.map((info, index) => {
            tempArr.push({
              meta: info.dataX,
              value: info.dataY,
            });
            if (info.dataX === '남') {
              return '남성';
            } else if (info.dataX === '녀') {
              return '여성';
            } else {
              return info.dataX;
            }
          })
        : pieLabelArr.map(info => {
            var newPieName = info.pieName;
            if (info.pieName === '남') {
              newPieName = '남성';
            } else if (info.pieName === '녀') {
              newPieName = '여성';
            }
            tempArr.push({ meta: newPieName, value: info.count });
            return '';
          });

    const series =
      graphType.graphSubType.code === 'BAR_GRAPH'
        ? tempArr.map((arr, index) => {
            let newArr = [];
            for (let j = 0; j < tempArr.length; j++) {
              newArr.push(index === j ? arr : undefined);
            }
            return newArr;
          })
        : tempArr;
    return {
      cycleTime: setCycle,
      minutes: 0,
      data: {
        labels: labels,
        series: series,
      },
      legend: {
        names: names,
        types: types,
      },
      cycleTitle: cycleTitle,
    };
  }
};

module.exports = {
  chartDataSet,
};
