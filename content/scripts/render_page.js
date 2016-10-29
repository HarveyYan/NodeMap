    var dom = document.getElementById('main_map');
    var speedAndNumber = document.getElementById('speedAndNumber_chart');
    //dom.style.height = (screen.height-100) + "px";
    var myChart = echarts.init(dom);
    var spdAndNumChart = echarts.init(speedAndNumber);
    var roadColorChart=echarts.init(document.getElementById('roadColor_chart'));
    var carsColorChart=echarts.init(document.getElementById('carsColor_chart'));
    // document.getElementById('carsColor_chart').style.height = (screen.height/2) + "px";
    // document.getElementById('roadColor_chart').style.height = (screen.height/2) + "px";
    var eachSpeedAndNumber = document.getElementById('eachSpeedAndNumber_chart');
    var eachSpdAndNumChart = echarts.init(eachSpeedAndNumber);

    //一些参数
    var ratio = 60 / 600;
    var app = {};
    var manual = false;
    var identifier=0;
    var limitOfCars = 20;
    option = null;

    //获取到html内最后一个script标签
    var scripts = document.getElementsByTagName('script');
    var lastScript = scripts[scripts.length-1];

    spdAndNumChart.showLoading();
    eachSpdAndNumChart.showLoading();
    myChart.showLoading('default', {
        text: '加载中..'
    });
    //获取到html中最后一个script标签内的res属性值，也就是选择的日期
    $.get('http://222.85.139.245:64154/'+lastScript.getAttribute('res'), function(data) {
        //仅调用一次，设置并初始化车辆车速折线柱状图
        (function setSpdAndNum(data) {
            spdAndNumChart.hideLoading();
            option = {
                toolbox: {
                    feature: {
                        dataZoom: {
                            yAxisIndex: 'none'
                        },
                        restore: {},
                        saveAsImage: {}
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        animation: false
                    }
                },
                dataZoom: [{
                    show: true,
                    realtime: true,
                    start: 65,
                    end: 85
                }, {
                    type: 'inside',
                    realtime: true,
                    start: 65,
                    end: 85
                }],
                xAxis: [{
                    type: 'category',
                    data: data.timelines.map(function(timelines) {
                        var list = [];
                        var value = timelines.toString();
                        var texts = [value.slice(-4, -2), value.slice(-2)];
                        return texts.join(':');
                    })
                }],
                yAxis: [{
                    type: 'value',
                    name: '总通过车辆',
                    axisLabel: {
                        formatter: '{value} 辆'
                    }
                }, {
                    type: 'value',
                    name: '平均速度',
                    min: 25,
                    axisLabel: {
                        formatter: '{value} km/h'
                    }
                }],
                legend: {
                    data: ['平均车速', '总通过车辆']
                },
                series: [{
                    name: '总通过车辆',
                    type: 'bar',
                    animation: false,
                    data: data.totalNumber,
                }, {
                    name: '平均车速',
                    type: 'line',
                    animation: false,
                    lineStyle: {
                        normal: {
                            width: 2
                        }
                    },
                    yAxisIndex: 1,
                    data: data.averageSpeed,
                }]
            }
            spdAndNumChart.setOption(option);
        }(data));
        //仅调用一次，设置并初始化"分道路"的车辆车速折线柱状图
        (function setEachSpdAndNum(data) {
            eachSpdAndNumChart.hideLoading();
            var eachOption = {

                tooltip: {
                    trigger: 'axis',
                },
                dataZoom: [{
                    show: true,
                    realtime: true,
                    start: 65,
                    end: 85
                }, {
                    type: 'inside',
                    realtime: true,
                    start: 65,
                    end: 85
                }],
                xAxis: {
                    type: 'category',
                    data: data.timelines.map(function(timelines) {
                        var value = timelines.toString();
                        var texts = [value.slice(-4, -2), value.slice(-2)];
                        return texts.join(':');
                    })
                },
                yAxis: {
                    type: 'value',
                    name: '通过车辆',
                    axisLabel: {
                        formatter: '{value} 辆'
                    }
                },
                legend: {
                    data: (function() {
                        var arr = [];
                        for (var i = 0; i < data.lines.length; i++) {
                            arr.push('line' + i);
                        }
                        return arr;
                    }())
                },
                series: (function(data) {
                    var series = [];
                    for (var i = 0; i < data.lines.length; i++) {
                        series.push({
                            name: 'line' + i,
                            type: 'bar',
                            stack: '车辆数',
                            data: (function() {
                                var arr = [];
                                for (var j = 0; j < data.timelines.length; j++) {
                                    arr.push(data.series[j][i][0]);
                                }
                                return arr;
                            }())
                        });
                    }
                    return series;
                }(data))
            }
            eachSpdAndNumChart.setOption(eachOption);
        }(data));

        myChart.hideLoading();
        //地图中会用的tooltips显示内容
        var schema = [{
            index: 1,
            text: '平均车速',
            unit: 'km/h'
        }];
        //道路点集转换为道路集
        var busLines = [].concat.apply([], data.lines.map(function(busLine) {
            var prevPt;
            var points = [];
            for (var i = 0; i < busLine.length; i += 2) {
                var pt = [busLine[i], busLine[i + 1]];
                points.push([pt[1], pt[0]]);
            }
            return {
                coords: points
            };
        }));
        //地图的option，这里先初始化；相关字段的含义可参考ECharts API
        option = {
            baseOption: {
                bmap: {
                    center: [106.646914, 26.635041],
                    zoom: 14,
                    roam: 'move',
                    mapStyle: {
                        'styleJson': [{
                            'featureType': 'water',
                            'elementType': 'all',
                            'stylers': {
                                'color': '#031628'
                            }
                        }, {
                            'featureType': 'land',
                            'elementType': 'geometry',
                            'stylers': {
                                'color': '#000102'
                            }
                        }, {
                            'featureType': 'highway',
                            'elementType': 'geometry.fill',
                            'stylers': {
                                'color': '#000000'
                            }
                        }, {
                            'featureType': 'highway',
                            'elementType': 'geometry.stroke',
                            'stylers': {
                                'color': '#0b3d51'
                            }
                        }, {
                            'featureType': 'highway',
                            'elementType': 'labels',
                            'stylers': {
                                'visibility': 'off'
                            }
                        }, {
                            'featureType': 'arterial',
                            'elementType': 'geometry.fill',
                            'stylers': {
                                'color': '#000000'
                            }
                        }, {
                            'featureType': 'arterial',
                            'elementType': 'geometry.stroke',
                            'stylers': {
                                'color': '#0b3d51'
                            }
                        }, {
                            'featureType': 'local',
                            'elementType': 'geometry',
                            'stylers': {
                                'color': '#000000'
                            }
                        }, {
                            'featureType': 'railway',
                            'elementType': 'geometry.fill',
                            'stylers': {
                                'color': '#000000'
                            }
                        }, {
                            'featureType': 'railway',
                            'elementType': 'geometry.stroke',
                            'stylers': {
                                'color': '#08304b'
                            }
                        }, {
                            'featureType': 'subway',
                            'elementType': 'geometry',
                            'stylers': {
                                'lightness': -70
                            }
                        }, {
                            'featureType': 'building',
                            'elementType': 'geometry.fill',
                            'stylers': {
                                'color': '#000000'
                            }
                        }, {
                            'featureType': 'all',
                            'elementType': 'labels.text.fill',
                            'stylers': {
                                'color': '#857f7f'
                            }
                        }, {
                            'featureType': 'all',
                            'elementType': 'labels.text.stroke',
                            'stylers': {
                                'color': '#000000'
                            }
                        }, {
                            'featureType': 'building',
                            'elementType': 'geometry',
                            'stylers': {
                                'color': '#022338'
                            }
                        }, {
                            'featureType': 'green',
                            'elementType': 'geometry',
                            'stylers': {
                                'color': '#062032'
                            }
                        }, {
                            'featureType': 'boundary',
                            'elementType': 'all',
                            'stylers': {
                                'color': '#465b6c'
                            }
                        }, {
                            'featureType': 'manmade',
                            'elementType': 'all',
                            'stylers': {
                                'color': '#022338'
                            }
                        }, {
                            'featureType': 'label',
                            'elementType': 'all',
                            'stylers': {
                                'visibility': 'off'
                            }
                        }]
                    }
                },
                timeline: {
                    axisType: 'category',
                    orient: 'horizontal',
                    autoPlay: true,
                    inverse: true,
                    playInterval: Math.round(1000 * 600 * ratio),
                    left: 20,
                    right: 20,
                    top: null,
                    bottom: 0,
                    width: null,
                    height: 55,
                    inverse: false,
                    label: {
                        position: 10,
                        normal: {
                            //interval: 1,
                            textStyle: {
                                color: '#999'
                            },
                            //rotate: 60,
                            formatter: function(value, index) {
                                var texts = [value.slice(-4, -2), value.slice(-2)];
                                if (index % 3 == 1 || index % 3 == 2) {
                                    texts.shift();
                                    texts.shift();
                                }
                                return texts.join(':');
                            }
                        },
                        emphasis: {
                            textStyle: {
                                color: '#fff'
                            }
                        }
                    },
                    symbol: 'diamond',
                    symbolSize: 10,
                    lineStyle: {
                        color: '#555'
                    },
                    checkpointStyle: {
                        color: '#bbb',
                        borderColor: '#777',
                        borderWidth: 2
                    },
                    controlStyle: {
                        showNextBtn: true,
                        showPrevBtn: true,
                        normal: {
                            color: '#666',
                            borderColor: '#666'
                        },
                        emphasis: {
                            color: '#aaa',
                            borderColor: '#aaa'
                        }
                    },
                    data: []
                },
                backgroundColor: '#404a59',
                series: [{
                    type: 'lines',
                    coordinateSystem: 'bmap',
                    polyline: true,
                    data: null,
                    zlevel: 2,
                    silent: false,
                }, {
                    type: 'lines',
                    coordinateSystem: 'bmap',
                    polyline: true,
                    data: null,
                    zlevel: 1,
                    silent: true
                }],
                animationDurationUpdate: 0,
                animation: false
            },
            options: []
        };

        //timeline美化
        for (var n = 0; n < data.timelines.length; n++) {
            if (n % 6 === 0) {
                var time = {
                    value: data.timelines[n],
                    symbol: "emptyDiamond"
                }
                option.baseOption.timeline.data.push(time);
            } else {
                option.baseOption.timeline.data.push(data.timelines[n]);
            }
        }
        //道路饼状图option初始化，相关字段含义可参考官方API
        var roadPieOption={
            title : {
                text: '道路拥堵状况',
                x:'center'
            },

            legend: {
                x : 'center',
                y : 'bottom',
                data:['rose1','rose2','rose3','rose4','rose5']
            },
            calculable : true,
            series: [{
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            formatter: "{b}:" + "\n" + "{c}条({d}%)"
                        },
                        labelLine: { show: true }
                    }
                },
                type:'pie',
                radius : [40, 110],
                center : ['50%', '50%'],
                roseType : 'radius',
                data:[]
            }]
        }
        //车辆饼状图option初始化，相关字段含义可参考官方API
        var carsPieOption={
            title : {
                text: '车辆拥堵状况',
                x:'center'
            },
            legend: {
                x : 'center',
                y : 'bottom',
                data:['rose1','rose2','rose3','rose4','rose5']
            },

            calculable : true,
            series: [{
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            formatter: "{b}:" + "\n" + "{c}辆({d}%)"
                        },
                        labelLine: { show: true }
                    }
                },
                type:'pie',
                radius : [40, 110],
                center : ['50%', '50%'],
                roseType : 'radius',
                data:[]
            }]
        }

        /*此处含义是饼图和地图从index = 0处开始加载；index相对于timeline 中的时刻而言，
          e.g. index=0时对应00:00, index=48时对应08:00*/
        fillOptions(0);
        fillPieOption(0);
        roadColorChart.setOption(roadPieOption);
        carsColorChart.setOption(carsPieOption);
        myChart.setOption(option);

        // 添加百度地图插件
        if (!app.inNode) {
            var bmap = myChart.getModel().getComponent('bmap').getBMap();
            bmap.addControl(new BMap.NavigationControl({
                anchor: BMAP_ANCHOR_TOP_RIGHT,
                type: BMAP_NAVIGATION_CONTROL_ZOOM
            }));
        }

        //设置地图的option, 使其成功加载在网页上面(当然，还得等到setoption之后); 随着时间更新会重复调用此函数。
        function fillOptions(identifier) {
            option.options.length = 0;
            for (var n = 0; n < data.timelines.length; n++) {
                var timelineString = data.timelines[n].toString();
                //往地图的option中循环添加对应timeline中各个时刻的数据
                option.options.push({
                    title: {
                        show: true,
                        left: 20,
                        right: null,
                        top: 20,
                        bottom: null,
                        text: ('   ' + timelineString.slice(-4, -2) + ' : ' + timelineString.slice(-2)),
                        textStyle: {
                            color: '#fff'
                        },
                        subtext: (timelineString.slice(0, 4) + '年' + timelineString.slice(4, 6) + '月' + timelineString.slice(6, 8) + '日')
                    },
                    tooltip: {
                        padding: 5,
                        backgroundColor: '#222',
                        borderColor: '#777',
                        borderWidth: 1,
                        formatter: function(obj) {
                            if (obj.componentType === "timeline") {
                                var value = obj.name;
                                var texts = [value.slice(-4, -2), value.slice(-2)];
                                return texts.join(':');
                            } else if (obj.componentSubType === "lines") {
                                return obj.name;
                            }
                        }
                    },
                    series: (function(busLines) {
                        //判断是否当前时间
                        if (n == identifier) {
                            var series = [{
                                type: 'lines',
                                coordinateSystem: 'bmap',
                                polyline: true,
                                data: (function(busLines) { //添加道路

                                    var busLines_new = [];

                                    for (var i = 0; i < busLines.length; i++) {
                                        var name = schema[0].text + '：' + data.series[n][i][1] + schema[0].unit;
                                        var lineStyle = {
                                            normal: {
                                                opacity: 0.3,
                                                width: 5,
                                                curvness: 1
                                            }
                                        };

                                        switch (data.series[n][i][2]) {
                                            case 1: //绿色
                                                lineStyle.normal.color = 'green';
                                                break;
                                            case 2: //黄色
                                                lineStyle.normal.color = 'yellow';
                                                break;
                                            case 3: //红色
                                                lineStyle.normal.color = 'red';
                                                break;
                                            case 4: //灰色
                                                lineStyle.normal.color = 'gray';
                                                break;
                                        }

                                        busLines_new[i] = {};
                                        busLines_new[i].name = name;
                                        busLines_new[i].coords = busLines[i].coords; //0~xxx
                                        busLines_new[i].lineStyle = lineStyle;
                                    }

                                    return busLines_new;
                                })(busLines),
                                zlevel: 2,
                                silent: false,
                                progressiveThreshold: 50,
                                progressive: 20
                            }];
                            //下面是加添加道路上点移动的effect，Note: 每条道路的effect多次添加等同于车辆的数目的次数
                            for (var i = 0; i < busLines.length; i++) {

                                //每条道路速度不同
                                var line = [];
                                line.push(busLines[i]);
                                var numberOfCars = (data.series[n][i][0] < limitOfCars ? data.series[n][i][0] : limitOfCars);
                                //每条道路插入多次,代表多辆汽车
                                for (var j = 0; j < limitOfCars; j++) {
                                    if (j < numberOfCars) {
                                        series.push({
                                            type: 'lines',
                                            coordinateSystem: 'bmap',
                                            polyline: true,
                                            data: line,
                                            effect: {
                                                constantSpeed: Math.round(data.series[n][i][1]*118/1000) + Math.random() * 10,
                                                show: true,
                                                trailLength: 0,
                                                symbolSize: 3,
                                                animation: false,
                                                color: (data.series[n][i][2] == 1)? 'green': (data.series[n][i][2] == 2) ? 'yellow' : (data.series[n][i][2] == 3)? 'red': 'gray'
                                            },
                                            zlevel: 1,
                                            silent: true
                                        });
                                    } else {
                                        //清除多余的点，降低浏览器前段资源占用
                                        series.push({
                                            type: 'lines',
                                            coordinateSystem: 'bmap',
                                            polyline: true,
                                            data: line,
                                            effect: {
                                                constantSpeed: 0,
                                                show: true,
                                                trailLength: 0,
                                                symbolSize: 0,
                                                animation: false,
                                            },
                                            zlevel: 1
                                        });
                                    }
                                }
                            }
                        } else {
                            //当前timeline显示的时间不是正在添加的时间，于是将series置成空，避免消耗资源
                            var series = [];
                        }
                        return series;
                    })(busLines)
                });
            }
        }
        //设置两个饼状图的option, 使其成功加载在网页上面（当然，还得等到setoption之后）; 随着时间更新会重复调用此函数。
        function fillPieOption(identifier){
            roadPieOption.series[0].data.length = 0;
            carsPieOption.series[0].data.length = 0;
            roadPieOption.series[0].data.push(
                {value:data.roadColor[identifier][0],name:"速度>36km/h",itemStyle:{normal: {color: '#00CC33'}}},
                { value: data.roadColor[identifier][1], name: "30~36km/h", itemStyle: { normal: { color: '#FF9900' } } },
                { value: data.roadColor[identifier][2], name: "速度<30km/h", itemStyle: { normal: { color: '#FF0000' } } },
                {value:data.roadColor[identifier][3],name:"无数据",itemStyle:{normal: {color: '#CCCCCC '}}}
            );
            carsPieOption.series[0].data.push(
                { value: data.carsColor[identifier][0], name: "速度>36km/h", itemStyle: { normal: { color: '#00CC33' } } },
                { value: data.carsColor[identifier][1], name: "30~36km/h", itemStyle: { normal: { color: '#FF9900' } } },
                { value: data.carsColor[identifier][2], name: "速度<30km/h", itemStyle: { normal: { color: '#FF0000' } } }
            );
        }
        //时间监听。当timeline时刻发生变化时，调用更新函数fillOptions和fillPieOption
        myChart.on('timelinechanged', function(param) {
            identifier = param.currentIndex;
            fillOptions(identifier);
            fillPieOption(identifier);
            myChart.setOption(option);
            roadColorChart.setOption(roadPieOption);
            carsColorChart.setOption(carsPieOption);
        });

        //特殊情况：应展示的需要，初始化时将时间设置为08：00。
        myChart.dispatchAction({
            type: 'timelineChange',
            // 时间点的 index
            currentIndex: 48
        });
        fillOptions(48);
        fillPieOption(48);
        myChart.setOption(option);
        roadColorChart.setOption(roadPieOption);
        carsColorChart.setOption(carsPieOption);



    });
