const dataUrl =  'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json';

fetch(dataUrl)
  .then((response) => response.json())
  .then((data) => {
   barChart(data);
});

let barChart = (data) => {
  const width = 800;
  const height = 600;
  const padding = 50;
  const barWidth = (width - 2 * padding) / data.data.length;
   
  let yearDate = data.data.map((item) => {
    return item[0].substring(0, 4);
  })
  
  let date = data.data.map((item) => {
    let month = item[0].substring(5, 7);
    let quarter = 0;
    
    switch(month) {
      case '01':
        quarter = 'Q1';
        break;
      case '04':
        quarter = 'Q2';
        break;
      case '07':
        quarter = 'Q3';
        break;
      case '10':
        quarter = 'Q4';
        break;
      default:
        break;
    }
    
    return quarter;
  })
  
  let totalMoney = data.data.map((item) => {
    return item[1];
  })
  
  //generate svg
  let svg = d3
     .select('.main-container')
     .append("svg")
     .attr('width', width)
     .attr('height', height)
  
  //generate scale
  const xScale = d3
    .scaleBand()
    .domain(yearDate)
    .range([padding, width - padding])
  
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(totalMoney)])
    .range([height - padding, padding])
  
  //generate axis
  const xAxis = d3.axisBottom(xScale)
  .tickValues(['1950', '1955', '1960', '1965', '1970', '1975', '1980', '1985', '1990', '1995', '2000', '2005', '2010', '2015'])
  const yAxis = d3.axisLeft(yScale);
  
  svg
    .append("g")
    .attr('id', 'x-axis')
    .attr("transform", `translate(0, ${height - padding})`)
    .call(xAxis);
  
  svg
    .append("g")
    .attr('id', 'y-axis')
    .attr("transform", `translate( ${padding}, 0)`)
    .call(yAxis);
  
  //generate tooltip
  let tooltip = d3
    .select('.main-container')
    .append('div')
    .attr('id', 'tooltip')
    .style('opacity', 0)
  
  //generate bars 
  svg
    .selectAll('rect')
    .data(data.data)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', (d, i) => i * barWidth + padding)
    .attr('y', (d, i) => yScale(d[1]))
    .attr('width', barWidth)
    .attr('height', (d, i) => height - yScale(d[1]) - padding)
    .attr("data-date", (d) => d[0])
    .attr("data-gdp", (d)=> d[1])
    .attr('index', (d, i) => i)
    .attr("fill", "#6D9886")
    .on("mouseover", function(d) {
      let i = this.getAttribute('index');
    
      tooltip.transition()
               .duration(100)
               .style("opacity", 0.9);
      tooltip.style("left", d3.event.pageX + 20 + "px")
               .style("top", d3.event.pageY + 20 + "px")
               .attr("data-date", d[0]);
      tooltip.html(yearDate[i] + ' ' + date[i] + '<br>' + '$' + totalMoney[i] + ' Billion')
     })
     .on("mouseout", function(){
        tooltip.transition()
          .duration(100)
          .style("opacity", 0);
      });
  }      
