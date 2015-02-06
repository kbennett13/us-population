var data;
var svg;
var sunburst;
var totals = [];
var margin = {top: 10, right: 10, bottom: 10, left: 10};
var width = window.innerWidth - margin.left - margin.right;
var height = window.innerHeight - margin.top - margin.bottom;
var radius = Math.min(width, height) / 2;

function alpha(a, b) {
  return b["Name"] - a["Name"];
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getPopulation(d) {
  return d.population;
}

function sumPopulation(d) {
  var sum = 0;

  for (county in d.children) {
    sum += d.children[county].population;
  }
  
  return sum;
}

function getText(d) {
  if (d.parent.name != "states") {
    return d.name + ", " + d.parent.name + ": " + numberWithCommas(d.population);
  } else {
    return d.name + ": " + numberWithCommas(sumPopulation(d));
  }
}

d3.json("data/Gaz_counties_national.json", function(error, root) {
  svg = d3.select("#sunburst")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
  
  sunburst = d3.layout.partition()
                      .sort(alpha)
                      .size([2 * Math.PI, radius * radius])
                      .value(getPopulation);
        
  var color = d3.scale.category20b();
  
  var arc = d3.svg.arc()
        .startAngle(function(d) { return d.x; })
        .endAngle(function(d) { return d.x + d.dx; })
        .innerRadius(function(d) { return Math.sqrt(d.y); })
        .outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });
    
  var path = svg.datum(root).selectAll("path")
      .data(sunburst.nodes)
      .enter().append("path")
      .attr("display", function(d) { return d.depth ? null : "none"; }) // hide inner ring
      .attr("d", arc)
      .style("stroke", "#fff")
      .style("fill", function(d) { return color((d.children ? d : d.parent).name); })
      .on("mouseenter", function(d) {
          svg.append("text")
          .attr("id", "tooltip")
          .attr("x", 0)
          .attr("y", 0)
          .attr("text-anchor", "middle")
          .attr("font-family", "sans-serif")
          .attr("font-size", "20px")
          .attr("font-weight", "bold")
          .attr("fill", "black")
          .text(getText(d));
          })
        .on("mouseleave", function(d) {
            d3.select("#tooltip").remove();
        });
});