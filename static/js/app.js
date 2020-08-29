//***Must run from local host 8000***
//First run "python -m http.server" from the terminal then go to "http://0.0.0.0:8000/" in Google Chrome

//Write a Function to Pull the Data for the Default "[0]th" Test Subject ID per the Dropdown Menu
function StartDash(){
    var dropdownMenu = d3.select("#selDataset");	  
	  	  
    d3.json("data/samples.json").then(function(data){				
        data.samples.forEach(function(subjectID) {							
            dropdownMenu.append("option").text(subjectID.id).property("value");				
        });
    //Run Each Subsequent Function for Default "[0]th" Test Subject ID
    metaData(data.samples[0].id);
    barPlot(data.samples[0].id);
    gaugePlot(data.samples[0].id);
    bubblePlot(data.samples[0].id);
    });
}

//Fill the Demographic Info Box with Metadata for Default "[0]th" Test Subject ID
function metaData(subjectID){
    var demographicInfo = d3.select("#sample-metadata");
    demographicInfo.selectAll("p").remove();

    d3.json("data/samples.json").then(function(data){
        var subjectMeta = data.metadata.filter(meta => meta.id == subjectID);

        demographicInfo.append("p").text(`ID: ${subjectMeta[0].id}`)
        demographicInfo.append("p").text(`Ethnicity: ${subjectMeta[0].ethnicity}`)
        demographicInfo.append("p").text(`Gender: ${subjectMeta[0].gender}`)
        demographicInfo.append("p").text(`Age: ${subjectMeta[0].age}`)
        demographicInfo.append("p").text(`Location: ${subjectMeta[0].location}`)
        demographicInfo.append("p").text(`Bellybutton Type: ${subjectMeta[0].bbtype}`)
        demographicInfo.append("p").text(`Wash Frequency: ${subjectMeta[0].wfreq}`)
    });
}

//Design Plots

//Horizontal Bar Plot - Easy Enough.
function barPlot(subjectID){    		
    d3.json("data/samples.json").then(function(data){
        var subjectSampleData = data.samples.filter(sample => sample.id == subjectID);

        var plotValues = subjectSampleData[0].sample_values.slice(0,10).reverse();

        var plotLabels_raw = subjectSampleData[0].otu_ids.slice(0,10).reverse();
        var plotLabels = plotLabels_raw.map(label => `OTU ${label.toString()}`);

        var plotHovertext = subjectSampleData[0].otu_labels.slice(0,10).reverse();

        var trace = [{
            x: plotValues,
            y: plotLabels,
            text: plotHovertext,
            type: "bar",
            orientation: "h"
        }];

        Plotly.newPlot("bar", trace);
    });
}

//Gauge Plot - I read into it and it seems like its just a Plotly pie plot with some bits missing.
//The Needle seems waaaaay to much trouble than its worth, needing trigonometry, etc. 
//So I just went with the numerical counter.
function gaugePlot(subjectID){
    d3.json("data/samples.json").then(function(data){
        var subjectMeta = data.metadata.filter(meta => meta.id == subjectID);

        var washFreq = parseInt(subjectMeta[0].wfreq);
		
		var trace = [{
        domain: {x: [0, 1], y: [0, 1] },
        type: "indicator",
		mode: "gauge+number",
        value: washFreq,
        font: {color:"black", family:"Arial"},
        title: {text: "Belly Button Weekly Washing Frequency <br><sub>Scrubs per Week</sub>", font: {size: 15}},
		gauge: {
			bar: {color: "black"},
			axis: {range: [null, 9], tickwidth: 1, tickcolor: "black"},
			steps:[
			{range: [0, 1], color: "saddlebrown"},
			{range: [1, 2], color: "sienna" },
			{range: [2, 3], color: "peru" },
			{range: [3, 4], color: "burlywood" },
			{range: [4, 5], color: "tan" },
			{range: [5, 6], color: "wheat" },
			{range: [6, 7], color: "bisque" },
			{range: [7, 8], color: "blanchedalmond" },
			{range: [8, 9], color: "cornsilk" },
		]},
		}];
	
        Plotly.newPlot('gauge', trace);
    });
}

function bubblePlot(subjectID){
    d3.json("data/samples.json").then(function(data){
        var subjectSampleData = data.samples.filter(sample => sample.id == subjectID);

        var plotValues = subjectSampleData[0].sample_values;

        var plotLabels_raw = subjectSampleData[0].otu_ids;
        var plotLabels = plotLabels_raw.map(label => label.toString());

        var plotHovertext = subjectSampleData[0].otu_labels;

        var trace = [{
            x: plotLabels,
            y: plotValues,
            text: plotHovertext,
            mode: "markers",
            marker: {
				color: plotLabels,
				size: plotValues,
				colorscale:"Greens"
			},
        }];

        var layout = {
            xaxis: {title: 'OTU ID'},
            showlegend: false
          };

        Plotly.newPlot("bubble", trace, layout);
    });
}

function optionChanged(subjectID){
    metaData(subjectID);
	barPlot(subjectID);
    gaugePlot(subjectID);
    bubblePlot(subjectID);
}

StartDash()
