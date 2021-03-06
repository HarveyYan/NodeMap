    /**
     * @last_update_time: 2016-09-26
     * @Author: tmc
     * @TODO: 
     * √ 去掉多道路柱状图
     * √ 排版更改
     * √ 添加新地图
     * √ 添加新饼图
     * √ 更改道路宽度
     * √ 更改tooltip
     *
     * @note: 注释请参考render_page.js，因为原理完全相同。
     */

    var myChart_before = echarts.init(document.getElementById('main_map_before'));
    var roadColorChart_before = echarts.init(document.getElementById('roadColor_chart_before'));
    var carsColorChart_before = echarts.init(document.getElementById('carsColor_chart_before'));

    var myChart_after = echarts.init(document.getElementById('main_map_after'));
    var roadColorChart_after = echarts.init(document.getElementById('roadColor_chart_after'));
    var carsColorChart_after = echarts.init(document.getElementById('carsColor_chart_after'));

    var ratio = 60 / 600;
    var app = {};
    var identifier = 0;
    var limitOfCars = 20;
    var schema = [{
        index: 1,
        text: '平均车速',
        unit: 'km/h'
    }];
    option_before = null;
    option = null;

    var scripts = document.getElementsByTagName('script');
    var lastScript = scripts[scripts.length - 1];

    myChart_before.showLoading('default', {
        text: '加载中..'
    });

    myChart_after.showLoading('default', {
        text: '加载中..'
    });

    $.get('http://222.85.139.245:64154/' + lastScript.getAttribute('res_after'), function(data) {
        $.get('http://222.85.139.245:64154/' + lastScript.getAttribute('res_before'), function(data_before) {

            //道路点集转换为道路集
            var busLines_before = [].concat.apply([], data_before.lines.map(function(busLine) {
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

            //map before option init
            option_before = {
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
            //map after option init
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

            //timeline美化, data_before和data的timeline会不会不一样长？所以这里两个暂时不写到一块
            for (var n = 0; n < data_before.timelines.length; n++) {
                if (n % 6 === 0) {
                    var time = {
                        value: data_before.timelines[n],
                        symbol: "emptyDiamond"
                    }
                    option_before.baseOption.timeline.data.push(time);
                } else {
                    option_before.baseOption.timeline.data.push(data_before.timelines[n]);
                }
            }

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

            var roadPieOption_before = {
                title: {
                    text: '道路拥堵状况',
                    x: 'center'
                },

                legend: {
                    x: 'center',
                    y: 'bottom',
                    data: ['rose1', 'rose2', 'rose3', 'rose4', 'rose5']
                },
                calculable: true,
                series: [{
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                formatter: "{b}的道路:" + "\n" + "{c}条({d}%)"
                            },
                            labelLine: { show: true }
                        }
                    },
                    type: 'pie',
                    radius: [40, 110],
                    center: ['50%', '50%'],
                    roseType: 'radius',
                    data: []
                }]
            }
            var carsPieOption_before = {
                title: {
                    text: '车辆拥堵状况',
                    x: 'center'
                },
                legend: {
                    x: 'center',
                    y: 'bottom',
                    data: ['rose1', 'rose2', 'rose3', 'rose4', 'rose5']
                },

                calculable: true,
                series: [{
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                formatter: "{b}的车辆总数:" + "\n" + "{c}辆({d}%)"
                            },
                            labelLine: { show: true }
                        }
                    },
                    type: 'pie',
                    radius: [40, 110],
                    center: ['50%', '50%'],
                    roseType: 'radius',
                    data: []
                }]
            }
            var roadPieOption = {
                title: {
                    text: '道路拥堵状况',
                    x: 'center'
                },

                legend: {
                    x: 'center',
                    y: 'bottom',
                    data: ['rose1', 'rose2', 'rose3', 'rose4', 'rose5']
                },
                calculable: true,
                series: [{
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                formatter: "{b}的道路:"+"\n"+"{c}条({d}%)"
                            },
                            labelLine: { show: true }
                        }
                    },
                    type: 'pie',
                    radius: [40, 110],
                    center: ['50%', '50%'],
                    roseType: 'radius',
                    data: []
                }]
            }
            var carsPieOption = {
                title: {
                    text: '车辆拥堵状况',
                    x: 'center'
                },
                legend: {
                    x: 'center',
                    y: 'bottom',
                    data: ['rose1', 'rose2', 'rose3', 'rose4', 'rose5']
                },

                calculable: true,
                series: [{
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                formatter: "{b}的车辆总数:"+"\n"+"{c}辆({d}%)"
                            },
                            labelLine: { show: true }
                        }
                    },
                    type: 'pie',
                    radius: [40, 110],
                    center: ['50%', '50%'],
                    roseType: 'radius',
                    data: []
                }]
            }

            function fillPieOption_before(identifier) {
                roadPieOption_before.series[0].data.length = 0;
                carsPieOption_before.series[0].data.length = 0;
                roadPieOption_before.series[0].data.push(
                    { value: data_before.roadColor[identifier][0], name: "速度大于36km/h", itemStyle: { normal: { color: '#00CC33' } } },
                    { value: data_before.roadColor[identifier][1], name: "速度在30和36km/h之间", itemStyle: { normal: { color: '#FF9900' } } },
                    { value: data_before.roadColor[identifier][2], name: "速度小于30km/h", itemStyle: { normal: { color: '#FF0000' } } },
                    { value: data_before.roadColor[identifier][3], name: "无数据", itemStyle: { normal: { color: '#CCCCCC ' } } }
                );
                carsPieOption_before.series[0].data.push(
                    { value: data_before.carsColor[identifier][0], name: "速度大于36km/h", itemStyle: { normal: { color: '#00CC33' } } },
                    { value: data_before.carsColor[identifier][1], name: "速度在30和36km/h之间", itemStyle: { normal: { color: '#FF9900' } } },
                    { value: data_before.carsColor[identifier][2], name: "速度小于30km/h", itemStyle: { normal: { color: '#FF0000' } } }
                );
            }
            function fillOptions_before(identifier) {
                option_before.options.length = 0;
                for (var n = 0; n < data_before.timelines.length; n++) {
                    var timelineString = data_before.timelines[n].toString();
                    option_before.options.push({
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
                                    data: (function(busLines) { //busLines路分段

                                        var busLines_new = [];

                                        for (var i = 0; i < busLines.length; i++) {
                                            var name = schema[0].text + '：' + data_before.series[n][i][1] + schema[0].unit;
                                            var lineStyle = {
                                                normal: {
                                                    opacity: 0.3,
                                                    width: 5,
                                                    curvness: 1
                                                }
                                            };

                                            switch (data_before.series[n][i][2]) {
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
                                    })(busLines_before),
                                    zlevel: 2,
                                    silent: false,
                                    progressiveThreshold: 50,
                                    progressive: 20
                                }];
                                //下面是加effect
                                for (var i = 0; i < busLines.length; i++) {

                                    //每条道路速度不同
                                    var line = [];
                                    line.push(busLines[i]);
                                    var numberOfCars = (data_before.series[n][i][0] < limitOfCars ? data_before.series[n][i][0] : limitOfCars);
                                    //每条道路插入多次,代表多辆汽车
                                    for (var j = 0; j < limitOfCars; j++) {
                                        if (j < numberOfCars) {
                                            series.push({
                                                type: 'lines',
                                                coordinateSystem: 'bmap',
                                                polyline: true,
                                                data: line,
                                                effect: {
                                                    constantSpeed: Math.round(data_before.series[n][i][1] * 118 / 1000) + Math.random() * 10,
                                                    show: true,
                                                    trailLength: 0,
                                                    symbolSize: 3,
                                                    animation: false,
                                                    color: (data_before.series[n][i][2] == 1)? 'green': (data_before.series[n][i][2] == 2) ? 'yellow' : (data_before.series[n][i][2] == 3)? 'red': 'gray'
                                                },
                                                zlevel: 1,
                                                silent: true
                                            });
                                        } else {
                                            //清除多余的点
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
                                                    animation: false
                                                },
                                                zlevel: 1
                                            });
                                        }
                                    }
                                }
                            } else {
                                var series = [];
                            }
                            return series;
                        })(busLines_before)
                    });
                }
            }
            function fillPieOption(identifier) {
                roadPieOption.series[0].data.length = 0;
                carsPieOption.series[0].data.length = 0;
                roadPieOption.series[0].data.push(
                    { value: data.roadColor[identifier][0], name: "畅通", itemStyle: { normal: { color: '#00CC33' } } },
                    { value: data.roadColor[identifier][1], name: "缓行", itemStyle: { normal: { color: '#FF9900' } } },
                    { value: data.roadColor[identifier][2], name: "拥挤", itemStyle: { normal: { color: '#FF0000' } } },
                    { value: data.roadColor[identifier][3], name: "无数据", itemStyle: { normal: { color: '#CCCCCC ' } } }
                );
                carsPieOption.series[0].data.push(
                    { value: data.carsColor[identifier][0], name: "畅通", itemStyle: { normal: { color: '#00CC33' } } },
                    { value: data.carsColor[identifier][1], name: "缓行", itemStyle: { normal: { color: '#FF9900' } } },
                    { value: data.carsColor[identifier][2], name: "拥挤", itemStyle: { normal: { color: '#FF0000' } } }
                );
            }
            function fillOptions(identifier) {
                option.options.length = 0;
                for (var n = 0; n < data.timelines.length; n++) {
                    var timelineString = data.timelines[n].toString();
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
                                    data: (function(busLines) { //busLines路分段

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
                                //下面是加effect
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
                                                    constantSpeed: Math.round(data.series[n][i][1] * 118 / 1000) + Math.random() * 10,
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
                                            //清除多余的点
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
                                                    animation: false
                                                },
                                                zlevel: 1
                                            });
                                        }
                                    }
                                }
                            } else {
                                var series = [];
                            }
                            return series;
                        })(busLines)
                    });
                }
            }

            fillOptions_before(0);
            fillPieOption_before(0);
            fillOptions(0);
            fillPieOption(0);

            myChart_before.hideLoading();
            myChart_before.setOption(option_before);
            myChart_after.hideLoading();
            myChart_after.setOption(option);

            roadColorChart_before.setOption(roadPieOption_before);
            carsColorChart_before.setOption(carsPieOption_before);
            roadColorChart_after.setOption(roadPieOption);
            carsColorChart_after.setOption(carsPieOption);


            if (!app.inNode) {
                // 添加百度地图插件
                var bmap = myChart_before.getModel().getComponent('bmap').getBMap();
                bmap.addControl(new BMap.NavigationControl({
                    anchor: BMAP_ANCHOR_TOP_RIGHT,
                    type: BMAP_NAVIGATION_CONTROL_ZOOM
                }));

                bmap = myChart_after.getModel().getComponent('bmap').getBMap();
                bmap.addControl(new BMap.NavigationControl({
                    anchor: BMAP_ANCHOR_TOP_RIGHT,
                    type: BMAP_NAVIGATION_CONTROL_ZOOM
                }));
            }

            myChart_before.dispatchAction({
                type: 'timelineChange',
                // 时间点的 index
                currentIndex: 48
            });
            myChart_after.dispatchAction({
                type: 'timelineChange',
                // 时间点的 index
                currentIndex: 48
            });
            fillOptions_before(48);
            fillOptions(48);
            myChart_before.setOption(option_before);
            myChart_after.setOption(option);

            fillPieOption_before(48);
            fillPieOption(48);

            roadColorChart_before.setOption(roadPieOption_before);
            carsColorChart_before.setOption(carsPieOption_before);
            roadColorChart_after.setOption(roadPieOption);
            carsColorChart_after.setOption(carsPieOption);


            myChart_before.on('timelinechanged', function(param) {
                identifier = param.currentIndex;
                fillOptions_before(identifier);
                fillPieOption_before(identifier);
                myChart_before.setOption(option_before);
                roadColorChart_before.setOption(roadPieOption_before);
                carsColorChart_before.setOption(carsPieOption_before);
            });

            myChart_after.on('timelinechanged', function(param) {
                identifier = param.currentIndex;
                fillOptions(identifier);
                fillPieOption(identifier);
                myChart_after.setOption(option);
                roadColorChart_after.setOption(roadPieOption);
                carsColorChart_after.setOption(carsPieOption);
            });

        });


    });