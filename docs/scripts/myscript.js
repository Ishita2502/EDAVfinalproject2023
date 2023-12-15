
// add your JavaScript/D3 to this file
document.addEventListener("DOMContentLoaded", function() {
            d3.csv("https://raw.githubusercontent.com/Ishita2502/EDAVfinalproject2023/main/data/cleaned_df.csv").then(function(allData) {
                var data = allData.filter(function(d) { return d['Area'] === 'Total'; });

                // Original feature names and their short names
                var featureNameMapping = {

                    "tobacco smokers who wanted to quit smoking now ": "Tobacco users who want to Quit",
                    "Anti Tobacco messages: Health Warnings": "Health Warnings",
                    "Anti Tobacco messages: Mass media": "Warnings in Mass Media",
                    "Anti Tobacco messages: Community events": "Warnings at Community Events",
                    "Advertisments: Mass Media": "Tobacco Advertisments",
                    "Advertisments: Promotions": "Promotions"

                };

                var featureNames = Object.keys(featureNameMapping);


                var margin = {top: 30, right: 30, bottom: 200, left: 60},
                    width = 800 - margin.left - margin.right,
                    height = 800 - margin.top - margin.bottom;

                var svg = d3.select("div#plot")
                  .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                    .attr("transform", `translate(${margin.left},${margin.top})`);

                var x = d3.scaleBand()
                  .range([0, width])
                  .padding(0.2);
                var xAxis = svg.append("g")
                  .attr("transform", `translate(0,${height})`);

                var y = d3.scaleLinear()
                  .range([height, 0]);
                svg.append("g")
                  .attr("class", "myYaxis");

                function update(selectedState) {
                    var dataFilter = data.filter(function(d){ return d['State/UT'] == selectedState })[0];

                    var dataArray = featureNames.map(function(key) {
                        return { Feature: featureNameMapping[key], Value: parseFloat(dataFilter[key]) };
                    });

                    x.domain(dataArray.map(d => d.Feature));
                    xAxis.transition().duration(1000).call(d3.axisBottom(x))
                        .selectAll("text")
                        .attr("transform", "rotate(-45)")
                        .style("text-anchor", "end")
                        .attr("dx", "-.8em")
                        .attr("dy", ".15em");

                    y.domain([0, d3.max(dataArray, d => d.Value)]);
                    svg.selectAll(".myYaxis").transition().duration(1000).call(d3.axisLeft(y));

                    var u = svg.selectAll("rect")
                        .data(dataArray);
                    svg.append("text")
                       .attr("transform", "rotate(-90)")
                       .attr("y", 0 - margin.left + 20)
                       .attr("x", 0 - (height / 2))
                       .style("text-anchor", "middle")
                       .text("Percentage Value (%)");

                    svg.append("text")
                       .attr("x", (width / 2))
                       .attr("y", 0 - (margin.top / 2))
                       .attr("text-anchor", "middle")
                       .style("font-size", "16px")
                       .style("text-decoration", "underline")
                       .text("Statewise Influence of Anti/ Pro Tobacco stratergies on Quitting");

                    var u = svg.selectAll("rect")
                        .data(dataArray);
                    u.join("rect")
                        .transition()
                        .duration(1000)
                        .attr("x", d => x(d.Feature))
                        .attr("y", d => y(d.Value))
                        .attr("width", x.bandwidth())
                        .attr("height", d => height - y(d.Value))
                        .attr("fill", "#69b3a2");
                }

                update(data[1]['State/UT']);

                var dropdown = d3.select("#selectButton")
                  .append("select");

                dropdown
                  .selectAll("option")
                  .data([...new Set(data.map(d => d['State/UT']))])
                  .enter()
                  .append("option")
                  .text(function (d) { return d; })
                  .attr("value", function (d) { return d; });

                dropdown.on("change", function(event) {
                    var selectedOption = d3.select(this).property("value");
                    update(selectedOption);
                });
            });
        });
