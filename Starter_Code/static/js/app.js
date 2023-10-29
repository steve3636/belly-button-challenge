const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

function init() {
  const dropDown = d3.select("#selDataset");

  d3.json(url).then(data => {
    const sampleNames = data.names;
    console.log(sampleNames)
    sampleNames.forEach(sample => {
      dropDown.append("option").text(sample).property("value", sample);
    });

    const initialSample = sampleNames[0];
    buildDemo(initialSample);
    buildCharts(initialSample);
  });
}

function buildCharts(sample) {
  d3.json(url).then(data => {
    const samplesComplete = data.samples.find(row => row.id == sample);
    const sampleValues = samplesComplete.sample_values.slice(0, 10).reverse();
    const otuIds = samplesComplete.otu_ids.slice(0, 10).reverse().map(id => `OTU ${id}`);
    const otuLabels = samplesComplete.otu_labels.slice(0, 10).reverse();
    const metaData = data.metadata.find(row => row.id == sample);
    const wash = metaData.wfreq;

    const barTrace = {
      x: sampleValues,
      y: otuIds,
      type: "bar",
      orientation: "h",
      text: otuLabels,
    };
    const barData = [barTrace];
    Plotly.newPlot("bar", barData);

    const bubbleTrace = {
      x: samplesComplete.otu_ids,
      y: samplesComplete.sample_values,
      mode: "markers",
      marker: {
        size: samplesComplete.sample_values,
        color: samplesComplete.otu_ids,
        colorscale: "Earth",
      },
      text: samplesComplete.otu_ids,
    };
    const bubbleData = [bubbleTrace];
    const bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: { title: "OTU ID" },
      showlegend: false,
    };
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    const gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: wash,
        title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week" },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: { range: [null, 9] },
          bar: { color: "red" },
          steps: [
            { range: [0, 1], color: "orange" },
            { range: [1, 2], color: "yellow" },
            { range: [2, 3], color: "beige" },
            { range: [3, 4], color: "lightyellow" },
            { range: [4, 5], color: "powderblue" },
            { range: [5, 6], color: "lightskyblue" },
            { range: [6, 7], color: "lightgreen" },
            { range: [7, 8], color: "green" },
          ],
          threshold: {
            line: { color: "black", width: 4 },
            thickness: 0.75,
            value: wash,
          },
        },
      },
    ];
    const gaugeLayout = { width: 800, height: 450, margin: { t: 0, b: 0 } };
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  });
}

function buildDemo(sample) {
  const demo = d3.select("#sample-metadata");
  d3.json(url).then(data => {
    const metaDataSample = data.metadata.find(row => row.id == sample);
    demo.selectAll("p").remove();
    for (const [key, value] of Object.entries(metaDataSample)) {
      demo.append("p").text(`${key}: ${value}`);
    }
  });
}

function optionChanged(sample) {
  buildDemo(sample);
  buildCharts(sample);
}

init();
