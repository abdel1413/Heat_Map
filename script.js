const width = 1200;
const height = 600;
const padding = 60;

let canvas, tooltip;
let dataset = [],
  xScale,
  yScale,
  xAxis,
  yAxis;

let temperature,
  monthlyVariance = [],
  years = [];

let minYear, maxYear;

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

months.reverse();
let legend,
  legXScale,
  legYScale,
  legXAxis,
  legYAxis,
  legHeight = "100",
  legWidth = "1000",
  legPadding = "20";

const legendData = [28, 39, 50, 61, 72, 83, 95, 106, 117, 128];

const jsonData = [
  { x_axis: "330", y_axis: "30", color: "#4575B4" },
  { x_axis: "420", y_axis: "30", color: "#74ADD1" },
  { x_axis: "520", y_axis: "30", color: "blue" },
  { x_axis: "615", y_axis: "30", color: "#D83932" },
];

const drawcanvas = () => {
  canvas = d3
    .select("body")
    .append("svg")
    .attr("id", "canvas")
    .attr("width", width)
    .attr("height", height);

  //   const lagend = canvas
  //     .append("g")
  //     .attr("id", "legend")
  //     .attr("transform ", "translate(400, 300)");
  //   lagend
  //     .append("g")
  //     .attr("id", "legend-rect")
  //     .append("rect")
  //     .attr("width", "50")
  //     .attr("height", "50")
  //     .attr("x", "300")
  //     .attr("y", "400")
  //     .style("fill", "orange");

  //const legendData = [2, 3, 5, 6, 7, 8, 9, 10, 11, 12];

  legend = d3.select("body");
  legend
    .append("svg")
    .attr("id", "legend")
    .attr("width", legWidth)
    .attr("height", legHeight)

    .selectAll("rect")
    .data(jsonData)
    .enter()
    .append("rect")
    .attr("width", "100")
    .attr("height", "50")
    .attr("x", (d, i) => {
      return d.x_axis;
    })
    .attr("y", (d) => d.y_axis)

    .style("fill", (d) => {
      console.log("d", d);
      return d.color;
    });
};

const generateScales = () => {
  legXScale = d3
    .scaleLinear()
    .range([legPadding, legWidth - legPadding])
    .domain([d3.min(legendData), d3.max(legendData)]);

  //min and max year
  minYear = d3.min(monthlyVariance, (d) => d.year);
  maxYear = d3.max(monthlyVariance, (d) => d.year);

  xScale = d3
    .scaleLinear()
    .domain([minYear, maxYear + 1])
    .range([padding, width - padding]);

  yScale = d3
    .scaleTime()

    .domain([new Date(0, 0, 0, 0, 0, 0, 0), new Date(0, 12, 0, 0, 0, 0, 0)])
    .range([padding, height - padding]);
};
const generateAxis = () => {
  legXAxis = d3
    .axisBottom(legXScale)
    .tickFormat((d) => d3.format(".1f")(d / 10));

  let legSvg = d3.select("#legend");
  legSvg
    .append("g")
    .call(legXAxis)
    .attr("transform", "translate(0," + (legHeight - legPadding) + ")");

  //d3.format("d") // => print as integer/ digits
  xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
  canvas
    .append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr("transform", "translate(0," + (height - padding) + ")");

  // timeFormat("%b") for print 3first char of months in string  // Jan, Feb...
  // timeFormat("%B") for print full months in string   // January, Febuary...
  yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%B"));

  canvas
    .append("g")
    .call(yAxis)
    .attr("id", "y-axis")
    .attr("transform", "translate(" + padding + ",0)");
};

//mouse handler
const mouseOverHandler = (e, d) => {
  const yearMonth = `${d.year} - ${months[d.month]}`;
  const temp = (baseTemperature + d.variance).toFixed(2);
  const variance = `${d.variance}`;
  tooltip
    .style("visibility", "visible")
    .style("opacity", "0.9")
    .attr("data-year", () => d.year)
    .style("top", e.pageY + 5 + "px")
    .style("left", e.pageX + 10 + "px")
    .html(
      () =>
        `<span>${yearMonth}</span><br> 
        <span>${temp}\xB0C</span><br>
        <span>${variance}\xB0C</span>`
    );
};
const mouseOutHandler = () => {
  tooltip.style("visibility", "hidden");
};

const drawCells = (monthlyVariance) => {
  canvas
    .selectAll("rect")
    .data(monthlyVariance)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .style("fill", (d, i) => {
      let variance = d.variance;

      if (variance <= -1) {
        return "#4575B4";
      } else if (variance <= 0) {
        return "#74ADD1";
      } else if (variance <= 1) {
        return "blue";
      } else {
        return "#D83932";
      }
    })
    .attr("data-temp", (d) => {
      return baseTemperature + d.variance;
    })
    .attr("data-month", (d) => {
      return d.month - 1;
    })
    .attr("data-year", (d) => d.year)
    .attr("height", (height - 2 * padding) / 12)
    .attr("y", (d, i) => {
      return yScale(new Date(0, d.month - 1, 0, 0, 0, 0, 0));
    })

    .attr("width", (d) => {
      let numYears = maxYear - minYear;

      return (width - 2 * padding) / numYears;
    })
    .attr("x", (d, i) => {
      return xScale(d.year);
    })

    .on("mouseover", mouseOverHandler)
    .on("mouseout", mouseOutHandler);

  // let legend = d3.select("body").append("g").attr("id", "legend");

  // legend
  //   .selectAll("rect")
  //   .data([10, 20, 30, 40, 50])
  //   .enter()
  //   .append("rect")
  //   .attr("width", "100")
  //   .attr("height", "20")
  //   .attr("margin", "10")
  //   .attr("x", "100")
  //   .attr("y", "580")
  //   .style("fill", (d, i) => {
  //     const variance = d.variance;
  //     if (variance <= -1) {
  //       return "#4575B4";
  //     } else if (variance <= 0) {
  //       return "#74ADD1";
  //     } else if (variance <= 1) {
  //       return "#000";
  //     } else {
  //       return "#D83932";
  //     }
  //   });

  tooltip = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("visibility", "hidden")
    .style("position", "absolute")
    .style("opacity", "0");
};

const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

const req = new XMLHttpRequest();

req.open("GET", url, true);

req.onload = () => {
  dataset = JSON.parse(req.responseText);

  baseTemperature = dataset["baseTemperature"];
  monthlyVariance = dataset["monthlyVariance"];

  drawcanvas();
  generateScales();
  generateAxis();
  drawCells(monthlyVariance);
};
req.send();
