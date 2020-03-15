/*!
* Start Bootstrap - Creative Bootstrap Theme (http://startbootstrap.com)
* Code licensed under the Apache License v2.0.
* For details, see http://www.apache.org/licenses/LICENSE-2.0.
*/

(function($) {
  "use strict"; // Start of use strict

  // jQuery for page scrolling feature - requires jQuery Easing plugin
  $('a.page-scroll').bind('click', function(event) {
    var $anchor = $(this);
    $('html, body').stop().animate({
      scrollTop: ($($anchor.attr('href')).offset().top - 50)
    }, 1250, 'easeInOutExpo');
    event.preventDefault();
  });

  // Highlight the top nav as scrolling occurs
  $('body').scrollspy({
    target: '.navbar-fixed-top',
    offset: 51
  })

  // Closes the Responsive Menu on Menu Item Click
  $('.navbar-collapse ul li a').click(function() {
    $('.navbar-toggle:visible').click();
  });

  // Fit Text Plugin for Main Header
  $("h1").fitText(
    1.2, {
      minFontSize: '35px',
      maxFontSize: '65px'
    }
  );

  // Offset for Main Navigation
  $('#mainNav').affix({
    offset: {
      top: 100
    }
  })

  // Initialize WOW.js Scrolling Animations
  new WOW().init();

})(jQuery); // End of use strict

var myLineChart;
$(document).ready(function(){

  var dummyData = [];
  var pollingTimer = window.setInterval( getPKIData, 45000);
  var globalData = [];
  var initialized = false;
  var $lineChart;

  Highcharts.theme = {
    colors: ["#f05f40", "#2b908f", "#f45b5b", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee",
    "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
    chart: {
      backgroundColor: {
        linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
        stops: [
          [0, '#222222'],
          [1, '#222222']
        ]
      },
      style: {
        fontFamily: "'Unica One', sans-serif"
      },
      plotBorderColor: '#606063'
    },
    xAxis: {
      gridLineColor: '#707073',
      labels: {
        style: {
          color: '#E0E0E3'
        }
      },
      lineColor: '#707073',
      minorGridLineColor: '#505053',
      tickColor: '#707073',
      title: {
        style: {
          color: '#A0A0A3'

        }
      }
    },
    yAxis: {
      gridLineColor: '#707073',
      labels: {
        style: {
          color: '#E0E0E3'
        }
      },
      lineColor: '#707073',
      minorGridLineColor: '#505053',
      tickColor: '#707073',
      tickWidth: 1,
      title: {
        style: {
          color: '#f05f40'
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      style: {
        color: '#F0F0F0'
      }
    },
    plotOptions: {
      series: {
        dataLabels: {
          color: '#B0B0B3'
        },
        marker: {
          lineColor: '#333'
        }
      },
      boxplot: {
        fillColor: '#505053'
      },
      candlestick: {
        lineColor: 'white'
      },
      errorbar: {
        color: 'white'
      }
    },
    legend: {
      itemStyle: {
        color: '#E0E0E3'
      },
      itemHoverStyle: {
        color: '#FFF'
      },
      itemHiddenStyle: {
        color: '#606063'
      }
    },
    credits: {
      style: {
        color: '#666'
      }
    },
    labels: {
      style: {
        color: '#707073'
      }
    },

    drilldown: {
      activeAxisLabelStyle: {
        color: '#F0F0F3'
      },
      activeDataLabelStyle: {
        color: '#F0F0F3'
      }
    },

    navigation: {
      buttonOptions: {
        symbolStroke: '#DDDDDD',
        theme: {
          fill: '#505053'
        }
      }
    }
  };

  // Apply the theme
  Highcharts.setOptions(Highcharts.theme);

  function getPKIData() {
    $.ajax({
      url: "https://data.sparkfun.com/output/dZ4EVmE8yGCRGx5XRX1W.json",
      dataType: "jsonp",
      data: {page: 1},
      success: function( response ) {
        globalData.push.apply(globalData, response);
        console.log(globalData);
        if(!initialized) {
          renderData();
        }
      }
    });
  }

  var chartOptions = {};

  function renderData() {
    initialized = true;
    var humidData = [];
    var tempData =[];
    var labelsData =[];

    var len = globalData.length;

    if(!$lineChart) {
      for(var i=25; i>=0; i--) {
        var data = globalData[i];
        labelsData.push( data.measurementTime );
        tempData.push( parseFloat(data.tempf) );
        humidData.push( parseFloat(data.humidity) );
      }
      chartOptions = {
        title: {
          text: '',
          y: 20 //center
        },
        subtitle: {
          text: '',
          y: 40
        },
        xAxis: {
          categories: labelsData
        },
        yAxis:[{ //first axis
          title: {
            text: 'Temperature',
            style: {
              color: '#f05f40'
            }
          },
          plotLines: [{
            value: 0,
            width: 1,
            color: Highcharts.getOptions().colors[0]
          }],
          labels: {
            format: '{value}°C'
          },
        }, { //second axis
          title: {
            text: 'Humidity',
            style: {
              color: '#2b908f'
            }
          },
          labels: {
            format: '{value}%'
          },
          plotLines: [{
            value: 1,
            width: 1,
            color: Highcharts.getOptions().colors[1]
          }],
          opposite:true
        }],
        tooltip: {
          valueSuffix: '°C'
        },
        legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'middle',
          borderWidth: 0
        },
        series: [{
          name: 'Temperature',
          data: tempData
        }, {
          name: 'Humidity',
          data: humidData
        }]
      };

      $lineChart =  $('#cLevelChartContainer').highcharts(chartOptions);
      $lineChart2 =  $('#bLevelChartContainer').highcharts(chartOptions);
    }

    var offset = 2;
    var pointer = 2;

    window.setInterval( function(){
      for(var j=pointer-2; j>=pointer-offset; j--) {
        var nData = globalData[j];
        var $lineChart = $('#cLevelChartContainer').highcharts();

        $lineChart.series[0].addPoint({
          y: parseFloat(nData.tempf),
          name: nData.measurementTime}, true, true);

        $lineChart.series[1].addPoint({
          y: parseFloat(nData.humidity),
          name: nData.measurementTime}, true, true);

      var $lineChartB = $('#bLevelChartContainer').highcharts();
          $lineChartB.series[0].addPoint({
            y: parseFloat(nData.tempf),
            name: nData.measurementTime}, true, true);

          $lineChartB.series[1].addPoint({
            y: parseFloat(nData.humidity),
            name: nData.measurementTime}, true, true);
      }
              pointer += 2;
            }, 1000);
    }

          getPKIData();

          /* Rapheal JS rendering */
          var tClockR = Raphael("bLevelTempClock", 200, 200);
          var bClockR = Raphael("bLevelTempClock", 200, 200);
          renderClock(tClockR);
          renderClock(bClockR);

          function renderClock(r) {
            var R = 60,
            init = true,
            param = {stroke: "#fff", "stroke-width": 8},
            marksAttr = {fill: "#cccccc" || "#444", stroke: "none"};
            // Custom Attribute
            r.customAttributes.arc = function (value, total, R) {
              var alpha = 360 / total * value,
              a = (90 - alpha) * Math.PI / 180,
              x = 140 + R * Math.cos(a),
              y = 120 - R * Math.sin(a),
              color = "hsb(".concat(Math.round(R) / 160, ",", value / total, ", .75)"),
              path;
              if (total == value) {
                path = [["M", 100, 80 - R], ["A", R, R, 0, 1, 1, 99.99, 80 - R]];
              } else {
                path = [["M", 100, 100 - R], ["A", R, R, 0, +(alpha > 180), 1, x, y]];
              }
              return {path: path, stroke: color};
            };

            drawMarks(R, 60);
            var sec = r.path().attr(param).attr({arc: [0, 140, R]});
            R -= 20;

            drawMarks(R, 60);
            var min = r.path().attr(param).attr({arc: [0, 160, R]});
            R -= 20;

            drawMarks(R, 12);
            var hor = r.path().attr(param).attr({arc: [0, 180, R]});
            R -= 20;

            // drawMarks(R, 31);
            // var day = r.path().attr(param).attr({arc: [0, 31, R]});
            // R -= 20;
            //
            // drawMarks(R, 12);
            // var mon = r.path().attr(param).attr({arc: [0, 12, R]});
            var pm = r.circle(100, 100, 2).attr({stroke: "none", fill: "rgb(0,0,255)"});
            //var mon = r.path().attr(param).attr({arc: [0, 12, R]});
            //var pm = r.circle(100, 100, 5).attr({stroke: "none", fill: Raphael.hsb2rgb(15 / 200, 1, .75).hex});

            function drawMarks(R, total) {
              if (total == 31) { // month
                var d = new Date;
                d.setDate(1);
                d.setMonth(d.getMonth() + 1);
                d.setDate(-1);
                total = d.getDate();
              }
              var color = "hsb(".concat(Math.round(R) / 200, ", 1, .75)"),
              out = r.set();
              for (var value = 0; value < total; value++) {
                var alpha = 360 / total * value,
                a = (90 - alpha) * Math.PI / 180,
                x = 100 + R * Math.cos(a),
                y = 100 - R * Math.sin(a);
                out.push(r.circle(x, y, 1).attr(marksAttr));
              }
              return out;
            }
          }

          //html[5].style.color = Raphael.hsb2rgb(15 / 200, 1, .75).hex;

          function updateVal(value, total, R, hand, id) {
            if (total == 31) { // month
              var d = new Date;
              d.setDate(1);
              d.setMonth(d.getMonth() + 1);
              d.setDate(-1);
              total = d.getDate();
            }
            var color = "hsb(".concat(Math.round(R) / 200, ",", value / total, ", .75)");
            if (init) {
              hand.animate({arc: [value, total, R]}, 300, ">");
            } else {
              if (!value || value == total) {
                value = total;
                hand.animate({arc: [value, total, R]}, 250, "bounce", function () {
                  hand.attr({arc: [0, total, R]});
                });
              } else {
                hand.animate({arc: [value, total, R]}, 250, "elastic");
              }
            }
            //html[id].innerHTML = (value < 10 ? "0" : "") + value;
            //  html[id].style.color = Raphael.getRGB(color).hex;
          }

          (function () {
            var d = new Date,
            am = (d.getHours() < 12),
            h = d.getHours() % 12 || 12;
            updateVal(d.getSeconds(), 60, 66, sec, 2);
            updateVal(d.getMinutes(), 60, 53, min, 1);
            updateVal(h, 12, 120, hor, 0);
            updateVal(d.getDate(), 31, 80, day, 3);
            updateVal(d.getMonth() + 1, 12, 40, mon, 4);
            pm[(am ? "hide" : "show")]();
            //html[5].innerHTML = am ? "AM" : "PM";
            setTimeout(arguments.callee, 1000);
            init = false;
          })();

        });
