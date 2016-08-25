    var dom = document.getElementById('main_map');
    dom.style.height = (screen.height-100) + "px";
    var myChart = echarts.init(dom);
    var ratio = 60 / 600;
    var app = {};
    var manual = false;
    var identifier=0;
    var limitOfCars = 50;
    option = null;

    var scripts = document.getElementsByTagName('script');
    var lastScript = scripts[scripts.length-1];

    myChart.showLoading();

    $.get('http://222.85.139.245:64154/'+lastScript.getAttribute('res'), function(data) {
        myChart.hideLoading();
        var schema = [{
            index: 0,
            text: '通过车辆',
            unit: '辆'
        }, {
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

        option = {
            baseOption: {
                bmap: {
                    center: [106.646914, 26.635041],
                    zoom: 14,
                    roam: false,
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

        fillOptions(0);

        myChart.setOption(option);

        if (!app.inNode) {
            // 添加百度地图插件
            var bmap = myChart.getModel().getComponent('bmap').getBMap();
            bmap.addControl(new BMap.MapTypeControl());
            bmap.addControl(new BMap.NavigationControl({
                anchor: BMAP_ANCHOR_TOP_RIGHT,
                type: BMAP_NAVIGATION_CONTROL_ZOOM
            }));
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
                                        var name = schema[0].text + '：' + data.series[n][i][0] + schema[0].unit + '<br>' + schema[1].text + '：' + data.series[n][i][1] + schema[1].unit;
                                        var lineStyle = {
                                            normal: {
                                                opacity: 0.3,
                                                width: 1.5,
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
                                                constantSpeed: Math.round(data.series[n][i][1]*118/1000) + Math.random() * 10,
                                                show: true,
                                                trailLength: 0,
                                                symbolSize: 3,
                                                animation: false
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


        myChart.on('timelinechanged', function(param) {
            identifier = param.currentIndex;
            fillOptions(identifier);
            myChart.setOption(option);
        });

    });