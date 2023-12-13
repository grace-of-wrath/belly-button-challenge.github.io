// Place URL  
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Use D3 library to read in samples.json from URL 

d3.json(url).then(function(data) {
    console.log(data);});

// Initializes the page with a default plot
function init() {
    let dropdownMenu = d3.select("#selDataset");
    
    // Build dropdown with ID numbers
    d3.json(url).then(function(data) {
        let idName = data.names;
        idName.forEach((id) => {
            dropdownMenu.append("option")
            .text(id)
            .property("value", id);
        });

    // Set default plot data
        let firstId = idName[0];
    
    buildBarChart(firstId);
    buildBubbleChart(firstId);
    buildMetadata(firstId);
    });
  }

// Bar Chart
function buildBarChart(select) {
    d3.json(url).then((data) => {

        // Assign data to a variable and filter based on user input
        let samples = data.samples;
        let selectedSample = samples.filter(result => result.id == select);
        let sampleData = selectedSample[0];

        // Determine plot parameters
        let trace = [{
            // Only top 10 in descending order
            x: sampleData.sample_values.slice(0,10).reverse(),
            y: sampleData.otu_ids.slice(0,10).map((otu_id) => `OTU ${otu_id}`).reverse(),
            text: sampleData.otu_labels.slice(0,10).reverse(),
            type: "bar",
            orientation: "h",
            marker: {
                color: 'rgba(178, 6, 202, 1)',
                width: 1
              },
        }];
        
        // Use Plotly to plot the data in a bar chart
        Plotly.newPlot("bar", trace);
    });
};

// Build Bubble Chart
function buildBubbleChart(select) {
    d3.json(url).then((data) => {

        // Assign data to a variable and filter based on user input
        let samples = data.samples;
        let selectedSample = samples.filter(result => result.id == select);
        let sampleData = selectedSample[0];
        
        // Determine plot parameters
        let trace = [{
            x: sampleData.otu_ids,
            y: sampleData.sample_values,
            text: sampleData.otu_labels,
            mode: "markers",
            marker: {
                size: sampleData.sample_values,
                color: sampleData.otu_ids,
                colorscale: "Bluered"}
        }];

        // Add x axis label
        let layout = {
            xaxis: {title: "OTU ID"}
        };
    
        // Use Plotly to plot the data in a bubble chart
        Plotly.newPlot("bubble", trace, layout);
    });
};

// Build Demographics panel
function buildMetadata(select) {
    d3.json(url).then((data) => {

        // Assign data to a variable and filter based on user input
        let metadata = data.metadata;
        let selectedSample = metadata.filter(result => result.id == select);
        let sampleData = selectedSample[0];

        // Clear previous
        d3.select("#sample-metadata").html("");

        // Populate panel
        Object.entries(sampleData).forEach(([key,value]) => {
            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });
};

// Update charts upon user input
function optionChanged(select) { 

    // Log the new value
    console.log(select); 

    // Call all functions 
    buildMetadata(select);
    buildBarChart(select);
    buildBubbleChart(select);
};

// Call the initialize function
init();
  