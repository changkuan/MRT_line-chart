var format = d3.time.format("%m");

var margin = {top: 25, right: 200, bottom: 30, left: 20},
    width = 680 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
      .rangeRound([height,0]);
/*
var z = d3.scale.category20b()
      .domain(["4","3","2","1","0"])
      .range(["#393b79","#5254a3","#6b6ecf","#9c9ede","#c6dbef"]);
*/
var z = d3.scale.category20b()
      .domain(["4","3","2","1","0"])
      .range(["#31a354","#fdae6b","#e6550d","#9ecae1","#3182bd"]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    //.ticks(d3.time.days);
    .tickFormat(d3.time.format("%b"));


var yAxis = d3.svg.axis()
    .scale(y)
    .orient("right")
    .tickFormat(d3.format(".2s"));

var stack = d3.layout.stack()
    .offset("zero")
    .values(function(d) { return d.values; })
    .x(function(d) { return d.month; })
    .y(function(d) { return d.value; });

var nest = d3.nest()
    .key(function(d) { return d.type; });

var area = d3.svg.area()
    //.interpolate("cardinal")
    .interpolate("monotone")
    //.interpolate("linear")
    .x(function(d) { return x(d.month); })
    .y0(function(d) { return y(d.y0); })
    .y1(function(d) { return y(d.y0 + d.y); });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var legendClassArray = [];

var year = 102;
var yMaxValue=5784850;  //use python to generate this value

var btn = d3.select('#next')
                  .on('click',function(){
                    if(year < 105)
                      year=year+1;
                    document.getElementById("nRadius").value = year+1911;
                    updateData(year);
                  });

var btn = d3.select('#last')
                  .on('click',function(){
                    if(year > 97)
                      year=year-1;
                    document.getElementById("nRadius").value = year+1911;
                    updateData(year);
                  });

// time slider bar
d3.select("#nRadius").on("input", function() {
            year=+this.value-1911;
            updateData(+this.value-1911);
         });

// function for the x grid lines
function make_x_axis() {
    return d3.svg.axis()
        .scale(x)
        .orient("bottom");
}

// function for the y grid lines
function make_y_axis() {
  return d3.svg.axis()
      .scale(y)
      .orient("left");
}

d3.csv("data/"+year+".csv", function(error, data) {
  if (error) throw error;

  data.forEach(function(d) {
    d.month = format.parse(d.month);
    d.value = +d.value;
  });

  var layers = stack(nest.entries(data));

  x.domain(d3.extent(data, function(d) { return d.month; }));
  y.domain([0, yMaxValue]).nice();

      // Draw the x Grid lines
  svg.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + height + ")")
        .call(make_x_axis()
            .tickSize(-height, 0, 0)
            .tickFormat("")
        )

  svg.append("text")
        .attr("transform", "translate("+ width +",-20)")
        .attr("dy", ".71em")
        .text("流量 (次)");

    // Draw the y Grid lines
  svg.append("g")
        .attr("class", "grid")
        .call(make_y_axis()
            .tickSize(-width, 0, 0)
            .tickFormat("")
        )

  svg.selectAll(".layer")
      .data(layers)
      .enter().append("path")
      .attr("class", "layer")
      .attr("d", function(d) { return area(d.values); })
      .style("fill-opacity", 0.5)
      .style("fill", function(d, i) { return z(i); });

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + width + ",0)")
      .call(yAxis);

    //vetical line through focus point
  var focusLine =  svg.append("g")
      .attr("class", "fl")
  focusLine.append("line")
      .style("stroke", "grey")
      .style("stroke-width", 1.5)
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 0)
      .attr("y2", height);

    //focus point
  var focus = svg.append("g")
      .attr("class", "cirs")
      .style("display", "none");

    //five focus circles
  for(i=0;i<5;i++)
  {
     focus.append("circle")
      .attr("class", "y"+i)
      .style("fill",z(i))
      .style("opacity", 0.85)
      //.style("stroke", z(i))
      .attr("r", 3.5);
  }

    //the data block
  var tooltip = svg.append("g")
                   .attr("class", "tooltip")
                   .style("display", "none");

  tooltip.append("rect")
        .attr("class", "toolrect")
        .attr("width", 144)
        .attr("height",144)
        .attr("fill", "white")
        .attr("rx",10)
        .attr("ry",10)
        .style("opacity", 0.9);

    //five circle in the tooltip
  for(k=0;k<5;k++)
  {
    tooltip.append("circle")
        .attr("transform", function() { return "translate(5,"  + k * 22 + ")"; })
        .attr("cy", 42)
        .attr("cx", 5)
        .attr("r", 4.5)
        .style("fill-opacity", 0.5)
        .style("fill", z(k))
  }

    //the name of the data
  var  tooltext = tooltip.append("text")
                .attr("class", "tooltext")
                .attr("x", 25)
                .attr("dy", "1.2em")
                .attr("font-size", "15px")
                .attr("font-weight", "bold");

    //data number
  var  tooltext2 = tooltip.append("text")
                .attr("class", "tooltext2")
                .attr("x", 140)
                .attr("y",22)
                .attr("dy", "1.2em")
                .attr("font-size", "15px")
                .attr("font-weight", "bold");

    // append the rectangle to capture mouse
  svg.append("rect")
      .attr("class", "mouseContorl")
      .attr("width", width)
      .attr("height", height)
      .style("fill", "none")
      .style("pointer-events", "all")
      .on("mouseover", function() { focus.style("display", null);
                                    focusLine.style("display", null);
                                    tooltip.style("display", null);})
      .on("mouseout", function() { focus.style("display", "none");
                                   focusLine.style("display", "none");
                                   tooltip.style("display", "none");})
      .on("mousemove", function(d) {
         var x0 = x.invert(d3.mouse(this)[0]),
              i = x0.getMonth()+1;
              d0 = new Array();
              d1 = new Array();
              d = new Array();
              sum=0;

              for(j=0;j<5;j++)
              {
                d0[j] = data[i - 1 + 12*j],
                d1[j] = data[i+ 12*j],
                d[j] = x0 - d0[j].month > d1[j].month - x0 ? d1[j] : d0[j];
                sum=sum+d[j].value;

                focus.select("circle.y"+j)
                .attr("transform", "translate(" + x(d[j].month) + "," + y(sum) + ")");

                focusLine.attr("transform", "translate(" + x(d[j].month) + "," + 0 + ")");

                if(j===4)
                {
                  var header=[year+1911+"/"+(d[j].month.getMonth()+1),"票卡","單程票","一日卡","團體票","其他"]
                  var texts=[d[0].value, d[1].value,d[2].value,d[3].value,d[4].value];
                  tooltip.attr("transform", "translate(" +  (x(d[j].month)+50) + "," + d3.mouse(this)[1] + ")");
                  tooltext.selectAll("tspan") //add header in mouse block
                      .data(header)
                      .enter()
                      .append("tspan")
                      .attr("class", "tool")

                  tooltext.selectAll(".tool")
                      .data(header)
                      .attr("x",function(d,i){
                        if(i===0)
                          return 48;
                        else
                          return tooltext.attr("x");})
                      .attr("dy","1.5em")
                      .text(function(d,i){
                          return d;
                      });

                  tooltext2.selectAll("tspan") //add number in mouse block(right align)
                      .data(texts)
                      .enter()
                      .append("tspan")
                      .attr("class", "tool2")

                  tooltext2.selectAll(".tool2")
                      .data(texts)
                      .attr("x",function(d,i){ return tooltext2.attr("x");})
                      .attr("dy","1.5em")
                      .style("text-anchor","end")
                      .text(function(d,i){
                          return d;
                      });

                }
              }
      });

    var legend = svg.selectAll(".legend")
      .data(z.domain().slice().reverse())
      .enter().append("g")
      .attr("class", function (d) {
        legendClassArray.push(d);
        return "legend";
      })
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  //reverse order to match order in which bars are stacked
  legendClassArray = legendClassArray.reverse();

  legend.append("rect")
      .attr("x", width + 65)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill-opacity", 0.5)
      .style("fill", z)
      .attr("id", function (d, i) {
        return "id" + d;
      })

  legend.append("text")
      .attr("x", width + 86)
      .attr("y", 9)
      .attr("dy", ".35em")
      .text(function(d) {
        switch(d)
        {
          case "0":
            return "票卡"
          case "1":
            return "單程票"
          case "2":
            return "一日卡"
          case "3":
            return "團體票"
          case "4":
            return "其他"
          default:
        }
      });
});

function updateData(year) {
  d3.csv("data/"+year+".csv", function(error, data) {
    if (error) throw error;

    data.forEach(function(d) {
        d.month = format.parse(d.month);
        d.value = +d.value;
    });

    var layers = stack(nest.entries(data));

    x.domain(d3.extent(data, function(d) { return d.month; }));
    y.domain([0, yMaxValue]).nice();

    document.getElementById("header").innerHTML = 1911+year+"年 高雄捷運票種分析";

    var svg = d3.select("body");

    svg.selectAll(".layer")
        .data(layers)
        .transition()
        .duration(1000)
        .attr("d", function(d) { return area(d.values); })

    svg.select(".x.axis") // change the x axis
        .transition()
        .duration(750)
        .call(xAxis);
    svg.select(".y.axis") // change the y axis
        .transition()
        .duration(750)
        .call(yAxis);

    var focusLine =  svg.select(".fl")

    var focus = svg.selectAll(".cirs")
      .style("display", "none");

    var tooltip = svg.select(".tooltip")
                   .style("display", "none");
    var  tooltext = tooltip.select(".tooltext")
    var  tooltext2 = tooltip.select(".tooltext2")

    svg.selectAll(".mouseContorl")
      .attr("width", width)
      .attr("height", height)
      .style("fill", "none")
      .style("pointer-events", "all")
      .on("mouseover", function() { focus.style("display", null);
                                    focusLine.style("display", null);
                                    tooltip.style("display", null);})
      .on("mouseout", function() { focus.style("display", "none");
                                   focusLine.style("display", "none");
                                   tooltip.style("display", "none");})
      .on("mousemove", function(d) {
         var x0 = x.invert(d3.mouse(this)[0]),
              i = x0.getMonth()+1;
              d0 = new Array();
              d1 = new Array();
              d = new Array();
              sum=0;

              for(j=0;j<5;j++)
              {
                d0[j] = data[i - 1 + 12*j],
                d1[j] = data[i+ 12*j],
                d[j] = x0 - d0[j].month > d1[j].month - x0 ? d1[j] : d0[j];
                sum=sum+d[j].value;

                focus.select("circle.y"+j)
                .attr("transform", "translate(" + x(d[j].month) + "," + y(sum) + ")");

                focusLine.attr("transform", "translate(" + x(d[j].month) + "," + 0 + ")");

                if(j===4)
                {
                   var header=[year+1911+"/"+(d[j].month.getMonth()+1),"票卡","單程票","一日卡","團體票","其他"]
                  var texts=[d[0].value, d[1].value,d[2].value,d[3].value,d[4].value];
                  tooltip.attr("transform", "translate(" +  (x(d[j].month)+50) + "," + d3.mouse(this)[1] + ")");
                   tooltext.selectAll("tspan")
                      .data(header)
                      .enter()
                      .append("tspan")
                      .attr("class", "tool")

                  tooltext.selectAll(".tool")
                      .data(header)
                      .attr("x",function(d,i){
                        if(i===0)
                          return 48;
                        else
                          return tooltext.attr("x");})
                      .attr("dy","1.5em")
                      .text(function(d,i){
                          return d;
                      });

                  tooltext2.selectAll("tspan")
                      .data(texts)
                      .enter()
                      .append("tspan")
                      .attr("class", "tool2")

                  tooltext2.selectAll(".tool2")
                      .data(texts)
                      .attr("x",function(d,i){ return tooltext2.attr("x");})
                      .attr("dy","1.5em")
                      .style("text-anchor","end")
                      .text(function(d,i){
                          return d;
                      });
                }
              }
      });
  });
}
