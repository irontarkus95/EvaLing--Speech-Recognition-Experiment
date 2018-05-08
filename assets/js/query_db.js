var config = {
    apiKey: "AIzaSyAQVtLUDbwAhwSHVIC5g8_t1wgiI6agNfQ",
    authDomain: "vrexpr.firebaseapp.com",
    databaseURL: "https://vrexpr.firebaseio.com",
    projectId: "vrexpr",
    storageBucket: "vrexpr.appspot.com",
    messagingSenderId: "499258811526"
};
firebase.initializeApp(config);

var fireData = {};

var db_key = document.getElementById("container").getAttribute("data-key");
var db = firebase.database();
var ref = db.ref().child("Speech-To-Text").child(db_key);
ref.on("value", function(snap){
    fireData = snap.val();
    console.log(fireData);
    if (!Highcharts.theme) {
        Highcharts.setOptions({
            chart: {
                backgroundColor: 'black'
            },
            colors: ['#F62366', '#9DFF02', '#0CCDD6'],
            title: {
                style: {
                    color: 'silver'
                }
            },
            tooltip: {
                style: {
                    color: 'silver'
                }
            }
        });
    }

    /**
     * In the chart render event, add icons on top of the circular shapes
     */
    function renderIcons() {
        // Exercise icon
        if (!this.series[0].icon) {
            this.series[0].icon = this.renderer.path(
                ['M', -8, 0, 'L', 8, 0, 'M', 0, -8, 'L', 8, 0, 0, 8,
                    'M', 8, -8, 'L', 16, 0, 8, 8]
                )
                .attr({
                    'stroke': '#ffffff',
                    'stroke-linecap': 'round',
                    'stroke-linejoin': 'round',
                    'stroke-width': 2,
                    'zIndex': 10
                })
                .add(this.series[0].group);
        }

        this.series[0].icon.translate(
            this.chartWidth / 2 - 10,
            this.plotHeight / 2 - this.series[0].points[0].shapeArgs.innerR -
                (this.series[0].points[0].shapeArgs.r - this.series[0].points[0].shapeArgs.innerR) / 2
        );
    }

    if (!Highcharts.theme) {
        Highcharts.setOptions({
            chart: {
                backgroundColor: 'rgba(0, 0, 0, 0.64)'
            },
            title: {
                style: {
                    color: 'silver',
                    fontFamily: 'zekton'
                },
            },
            tooltip: {
                style: {
                    color: 'lightblue',
                },
            },
            subtitle: {
                style: {
                    fontFamily: 'zekton'
                },
            }
        });
    }

    Highcharts.chart('container', {

        chart: {
            type: 'solidgauge',
            height: '110%',
            events: {
                render: renderIcons
            }
        },

        title: {
            text: "Microsoft's Speech Heard: " + fireData.Azure.Response,
            style: {
                fontSize: '24px',
                fontFamily: 'Lato'
            }
        },

        tooltip: {
            borderWidth: 0,
            backgroundColor: 'none',
            shadow: false,
            style: {
                fontSize: '16px'
            },
            pointFormat: '{series.name}<br><span style="font-size:2em; color: {point.color}; font-weight: bold">{point.y}%</span>',
            positioner: function (labelWidth) {
                return {
                    x: (this.chart.chartWidth - labelWidth) / 2,
                    y: (this.chart.plotHeight / 2) + 50
                };
            }
        },

        pane: {
            startAngle: 0,
            endAngle: 360,
            background: [{ // Track for Exercise
                outerRadius: '87%',
                innerRadius: '63%',
                backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[1])
                    .setOpacity(0.3)
                    .get(),
                borderWidth: 0
            }]
        },

        yAxis: {
            min: 0,
            max: 100,
            lineWidth: 0,
            tickPositions: []
        },

        plotOptions: {
            solidgauge: {
                dataLabels: {
                    enabled: false
                },
                linecap: 'round',
                stickyTracking: false,
                rounded: true
            }
        },

        series: [{
            name: 'Accuracy',
            data: [{
                color: Highcharts.getOptions().colors[1],
                radius: '87%',
                innerRadius: '63%',
                y: Math.round(fireData.Azure.Similarity*100) //ACCURACY VALUE GOES HERE
            }]
        }]
    });

    Highcharts.chart('container1', {

        chart: {
            type: 'solidgauge',
            height: '110%',
            events: {
                render: renderIcons
            }
        },

        title: {
            text: "IBM's Watson Heard: " + fireData.Watson.Response,
            style: {
                fontSize: '24px',
                fontFamily: 'Lato'
            }
        },

        tooltip: {
            borderWidth: 0,
            backgroundColor: 'none',
            shadow: false,
            style: {
                fontSize: '16px'
            },
            pointFormat: '{series.name}<br><span style="font-size:2em; color: {point.color}; font-weight: bold">{point.y}%</span>',
            positioner: function (labelWidth) {
                return {
                    x: (this.chart.chartWidth - labelWidth) / 2,
                    y: (this.chart.plotHeight / 2) + 50
                };
            }
        },

        pane: {
            startAngle: 0,
            endAngle: 360,
            background: [{ // Track for Exercise
                outerRadius: '87%',
                innerRadius: '63%',
                backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[1])
                    .setOpacity(0.3)
                    .get(),
                borderWidth: 0
            }]
        },

        yAxis: {
            min: 0,
            max: 100,
            lineWidth: 0,
            tickPositions: []
        },

        plotOptions: {
            solidgauge: {
                dataLabels: {
                    enabled: false
                },
                linecap: 'round',
                stickyTracking: false,
                rounded: true
            }
        },

        series: [{
            name: 'Accuracy',
            data: [{
                color: Highcharts.getOptions().colors[1],
                radius: '87%',
                innerRadius: '63%',
                y: Math.round(fireData.Watson.Similarity*100) //ACCURACY VALUE GOES HERE
            }]
        }]
    });
});

// -------- DOCS -------------------
/*
    This file is attached to result.ejs and will query the firebase database 
    for the results of the speech recognition from IBM Watson and Microsoft Azure
*/