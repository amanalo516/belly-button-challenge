console.log("app.js")

const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

data = {}


d3.json(url).then(({names}) => {

    dropdown = d3.select("#selDataset")

    for (let i = 0; i < names.length; i++) {
        dropdown
            .append("option")
            .text(names[i])
            .property("value", names[i]);

    };

    optionChanged(names[0]);
});

function optionChanged(id) {

    d3.json(url).then(({metadata, samples}) => {

        //filter array
        resultArray = metadata.find(sampleObj => sampleObj.id == id);

        // clear panel
        panel = d3.select("#sample-metadata").html("");

        Object.entries(resultArray).forEach(([key,val]) => {
            panel.append("h6").text(`${key.toUpperCase()}: ${val}`);
        });

        // Bar Chart

        //filter based on id
        value = samples.find(result => result.id == id)

        let { otu_ids, otu_labels, sample_values} = value;

        console.log(otu_ids, otu_labels, sample_values)

        // select data for bars
        yticks = otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
        xticks = sample_values.slice(0, 10).reverse();
        labels = otu_labels.slice(0, 10).reverse();

        let trace = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h"
        };

        let layout = {
            title: "Top 10 OTUs Present"


        };
        Plotly.newPlot("bar", [trace], layout)

        //Bubble Chart
        var trace1 = {
            x: otu_ids,
            y: sample_values,
            mode: 'markers',
            marker: {
              size: sample_values,
              color: otu_ids,
              colorscale: "Earth"
            }
          };
          
          var data = [trace1];
          
          
          Plotly.newPlot('bubble', data);

          // Bonus
          var data = [
            {
              domain: { x: [0, 1], y: [0, 1] },
              value: resultArray.wfreq,
              title: { text: "<b>Belly Button Washing Frequency</b><br> Scrubs per Week" },
              type: "indicator",
              mode: "gauge+number",
              delta: { reference: 400 },
              gauge: { axis: { range: [null, 9] } }
            }
          ];
          
          layout = { width: 600, height: 400 };
          Plotly.newPlot('gauge', data, layout);

    })
}

