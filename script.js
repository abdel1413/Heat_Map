const width = 1200;
const height = 500;
const padding = 60;

let dataset = [],
  xScale,
  yScale,
  xAxis,
  yAxis;

let temperature,
  monthlyVariance,
  years = [],
  months = [];

const drawcanvas = () => {
  const canvas = d3
    .select("#canvas")
    .attr("width", width)
    .attr("height", height);
};
const generateScales = () => {};
const generateAxis = () => {};
const drawCells = () => {};

const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

const req = new XMLHttpRequest();

req.open("GET", url, true);

req.onload = () => {
  dataset = JSON.parse(req.responseText);

  baseTemperature = dataset["baseTemperature"];
  monthlyVariance = dataset["monthlyVariance"];

  monthlyVariance.map((i) => console.log(i["month"]));

  drawcanvas();
  generateScales();
  generateAxis();
  drawCells(dataset);
};
req.send();
