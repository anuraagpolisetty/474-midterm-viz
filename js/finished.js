(function() {

    let data = "no data";
    let svgContainer = "";
    window.onload = function() {

      d3.csv("data/SimpsonsSeasonsData.csv")
      .then((data) => makeHistogram(data));
    }
  
    function makeHistogram(csvData) {
      data = csvData
      
      let margin = { top: 25, right: 100, bottom: 50, left: 70 };
      width = 900 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

      svgContainer = d3.select("body")
        .append("svg")
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append("g")
        .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');


    // Scale x Axis
      minYear = d3.min(data, function(d) {
        return +d["Year"];
      });
      maxYear = d3.max(data, function(d) {
        return +d["Year"];
      });

      let xScale = d3.scaleLinear()
        .domain([minYear, maxYear])
        .range([0, width + 50]);

    // Scale y axis    
      minViewers = d3.min(data, function(d) {
        return +d["Avg. Viewers (mil)"];
      });
      maxViewers = d3.max(data, function(d) {
        return +d["Avg. Viewers (mil)"];
      })

      let yScale = d3.scaleLinear()
        .domain([minViewers, maxViewers])
        .range([height - 25, 0]);

      drawAxes(xScale, yScale)

      
      let div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

      svgContainer.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .on("mouseover", d => {
          div.transition()
            .duration(20)
            .style("opacity", .9);
          div.html('<h3>' + 
              'Season #' + d["Year"] + '<h3><h4>' + 
              'Year:                  ' + d["Year"] + '<br/>' + 
              'Episodes:              ' + d["Episodes"] + '<br/>' + 
              'Avg. Viewers (mil):    ' + d["Avg. Viewers (mil)"] + '<br/>' + 
              'Most Watched Episode:  ' + d["Most watched episode"] + '<br/' +
              'Viewers (mil):         ' + d["Viewers (mil)"] +
              '<br></br><h4>'
            )
            // .style("fill", "red")
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY) + "px");
        })
        .on("mouseout", d => {
          div.transition()
            .duration(100)
            .style("opacity", 0);
        })
        .attr("x", function(d) {
          return xScale(d["Year"]) + 25;
        })
        .attr("width", 25)
        .attr("y", function(d) {
          return yScale(d["Avg. Viewers (mil)"]);
        })
        .attr("height", function(d) {
          return height - yScale(d["Avg. Viewers (mil)"])
        })
        .style("fill", "cornflowerblue")
        .filter(function(d) {
          return d["Data"] == "Estimated";
        })
        .style("fill", "#777777")

        // Add values over bars
        svgContainer.selectAll("text.bar")
          .data(data)
          .enter()
          .append("text")
          .attr("class", "bar")
          .attr("x", function(d) {
            return xScale(d["Year"]) + 28;
          })
          .attr("y", function(d) {
            return yScale(d["Avg. Viewers (mil)"]) - 5;
          })
          .text(function(d) {
            return d["Avg. Viewers (mil)"];
          });
        
        // draw trendline

        let avg = d3.mean(data, function(d) {
          return +d["Avg. Viewers (mil)"];
        })
        
        svgContainer.append("line")
          .attr("x1", 24)
          .attr("y1", yScale(avg))
          .attr("x2", 870)
          .attr("y2", yScale(avg))
          .style("stroke", "gray")
          .attr("stroke-width", 2)
          .attr("stroke-dasharray", "5")

        svgContainer
          .append("rect")
          .attr("x", 25)
          .attr("y", yScale(avg) - 15)
          .attr("width", 25)
          .attr("height", 15)
          .attr("opacity", 0.8)
          .style("fill", "lightblue");

        svgContainer
          .append("text")
          .attr("x", 27)
          .attr("y", yScale(avg) - 4)
          .style("font-size", "8pt")
          .text(Math.round(avg * 10) / 10);

        
      
      // legend 
      drawLegend()
    }
      
    
    
    function drawLegend() {
      svgContainer
        .append("text")
        .attr("x", 600)
        .attr("y", 75)
        .text("Viewership Data")
        .style("font-size", "15px")
        .style("font-weight", "bold")
        .attr("alignment-baseline", "middle");

      svgContainer
        .append("rect")
        .attr("x", 600)
        .attr("y", 95)
        .attr("width", 12)
        .attr("height", 12)
        .style("fill", "steelblue");

      svgContainer
        .append("rect")
        .attr("x", 600)
        .attr("y", 115)
        .attr("width", 12)
        .attr("height", 12)
        .style("fill", "gray");

      svgContainer
        .append("text")
        .attr("x", 620)
        .attr("y", 103)
        .text("Actual")
        .style("font-size", "13px");

      svgContainer
        .append("text")
        .attr("x", 620)
        .attr("y", 123)
        .text("Estimated")
        .style("font-size", "13px");
    }
  
    function drawAxes(xScale, yScale) {
      // Draw x axis
      svgContainer.append("g")
      .attr('transform', 'translate(40, ' + height + ')')
      .call(d3.axisBottom()
            .scale(xScale)
            .tickFormat(d3.format("d"))
            .ticks(20)
      );
      
      // X axis label
      svgContainer.append("text")
        .attr("x", width/1.75)
        .attr("y", height + 35)
        .text("Year")
      
      
      // draw y axis
      svgContainer.append("g")
      .attr('transform', 'translate(25, 0)')
      .call(d3.axisLeft(yScale));
      
      // y axis label
      svgContainer.append("text")
        .attr("x", -300)
        .attr("y", -10)//height / 2)
        .attr("transform", "rotate(-90)")
        .text("Average Number of Viewers (millions)")

    }
  
    function plotData(mapFunctions) {
      let xMap = map.x;
      let yMap = map.y;

      svgContainer.selectAll('.dot')
        .data(data)
        .enter()
        .append('circle')
          .attr('cx', xMap)
          .attr('cy', yMap)
          .attr('r', 3)
          .attr('fill', "#4286f4");

      svgContainer.selectAll('.dot')
        .data(data)
        .enter()
        .append('rect')
          .attr("x",(dataPoint) => xMap(dataPoint)-2)
          .attr("y",yMap)
          .attr("width",9)
          .attr("height", (dataPoint) => 450-yMap(dataPoint))
          .attr("fill", "#4286f4")
    }
  })();
  