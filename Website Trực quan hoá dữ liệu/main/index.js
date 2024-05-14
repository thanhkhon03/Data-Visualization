const margin = { left: 120, right: 30, top: 60, bottom: 70 };
const width = document.querySelector("body").clientWidth;
const height = 500;

const svg = d3.select("svg").attr("viewBox", [0, 0, width, height]);

const x_scale = d3.scaleTime().range([margin.left, width - margin.right]);
const y_scale = d3.scaleLinear().range([height - margin.bottom, margin.top]);

// Labels
const x_label = "Time";
const y_label = "Rainfall Probability";
const location_name = "Hanoi Vietnam";

// Thêm title
const titleX = (width - margin.right + margin.left) / 2;
const titleY = margin.top / 2;

const titleText = svg
  .append("text")
  .attr("class", "svg_title")
  .attr("x", titleX)
  .attr("y", titleY)
  .attr("text-anchor", "middle")
  .style("font-size", "22px")
  .text(`${y_label} of ${location_name}`);

// Thêm dòng ngang phía trên tiêu đề
const titleBBox = titleText.node().getBBox();
svg
  .append("line")
  .attr("x1", margin.left)
  .attr("x2", width - margin.right)
  .attr("y1", titleBBox.y - 10) // Điều chỉnh vị trí phía trên tiêu đề
  .attr("y2", titleBBox.y - 10) // Đảm bảo đường nằm ngang
  .attr("stroke", "black")
  .attr("stroke-width", 1);

// Thêm y label
const yLabelX = margin.left - 70;
const yLabelY = (height - margin.top + margin.bottom) / 2;

svg
  .append("text")
  .attr("text-anchor", "middle")
  .attr(
    "transform",
    `translate(${yLabelX}, ${yLabelY}) rotate(-90)`
  )
  .style("font-size", "26px")
  .text(y_label);

// Thêm x label
svg
  .append("text")
  .attr("class", "svg_title")
  .attr("x", (width - margin.right + margin.left) / 2)
  .attr("y", height - margin.bottom / 2)
  .attr("text-anchor", "middle")
  .style("font-size", "22px")
  .text(x_label);

// Xác định chức năng xử lý dữ liệu
const start_time = (d) => new Date(d.time);
const precipitationProbability = (d) => +d.relative_humidity_2m;

// Xác định bộ tạo dòng
const line_generator = d3.line()
  .x((d) => x_scale(start_time(d)))
  .y((d) => y_scale(precipitationProbability(d)))
  .curve(d3.curveBasis);

// Xác định trục
const ticks = 10;
const x_axis = d3.axisBottom()
  .scale(x_scale)
  .tickPadding(10)
  .ticks(ticks)
  .tickSize(-height + margin.top * 2 + margin.bottom);
const y_axis = d3.axisLeft()
  .scale(y_scale)
  .tickPadding(5)
  .ticks(ticks, ".1")
  .tickSize(-width + margin.left + margin.right);

// Điều chỉnh định dạng cho dấu trục y
const decimalFormatter = d3.format(".1f");

// Điều chỉnh các dấu trục y theo tỷ lệ phần trăm
y_axis.tickFormat((d) => {
  if (!Number.isInteger(d)) {
    d = decimalFormatter(d);
  }
  return d + "%";
});

// Tọa độ 
const backup_lat = 21.0285;
const backup_long = 105.8542;

// Cập nhật theo toạ độ
const backup_url = `https://api.open-meteo.com/v1/forecast?latitude=${backup_lat}&longitude=${backup_long}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`;

// Lấy dữ liệu và vẽ đường dự phòng
d3.json(backup_url).then((data) => {
  const hourlyData = data.hourly.time.map((time, index) => ({
    time,
    relative_humidity_2m: data.hourly.relative_humidity_2m[index],
  }));

  console.log(hourlyData);

  // Đặt miền cho thang đo
  x_scale.domain(d3.extent(hourlyData, start_time)).nice(ticks);
  y_scale.domain(d3.extent(hourlyData, precipitationProbability)).nice(ticks);

  // Thêm đường dẫn dòng
  svg
    .append("path")
    .datum(hourlyData)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 4)
    .attr("d", line_generator(hourlyData)); // Generate the path

  // Nối trục x
  svg
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom - margin.top})`)
    .call(x_axis);

  // Nối trục y
  svg
    .append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(y_axis);
});

// Chỉnh màu
const colors = {
    primary: "steelblue",
    secondary: "#444",
    background: "#f7f7f7",
  };
  
  // Cập nhật màu nền SVG
  svg.style("background-color", colors.background);
  
  // Cập nhật phông tiêu đề
  titleText.style("font-family", "Arial, sans-serif").style("fill", colors.secondary);
  
  // Cập nhật kiểu trục
  svg.selectAll(".tick line").attr("stroke", colors.secondary);
  svg.selectAll(".tick text").style("font-family", "Arial, sans-serif").style("fill", colors.secondary);
  
  // Cập nhật kiểu dòng
  svg.selectAll(".line").attr("stroke", colors.primary).attr("stroke-width", 3);
  
  // Cập nhật phông nhãn trục
  svg.selectAll(".axis-label").style("font-family", "Arial, sans-serif").style("fill", colors.secondary);
  
  // Cập nhật các đường lưới
  svg.selectAll(".grid line").attr("stroke", colors.secondary).attr("stroke-opacity", 0.1);
  
  // Cập nhật miền trục
  x_scale.domain(d3.extent(hourlyData, start_time)).nice();
  y_scale.domain(d3.extent(hourlyData, precipitationProbability)).nice();
  
  // Cập nhật dấu tích trục
  svg.selectAll(".axis").call(x_axis);
  svg.selectAll(".axis").call(y_axis);
  
  // Cập nhật đường dẫn dòng
  svg
    .append("path")
    .datum(hourlyData)
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke", colors.primary)
    .attr("stroke-width", 3)
    .attr("d", line_generator(hourlyData));
  
  // Thêm nhãn trục
  svg
    .append("text")
    .attr("class", "axis-label")
    .attr("x", width / 2)
    .attr("y", height - margin.bottom / 2)
    .style("text-anchor", "middle")
    .text(x_label);
  
  svg
    .append("text")
    .attr("class", "axis-label")
    .attr("transform", `translate(${margin.left / 2}, ${height / 2}) rotate(-90)`)
    .style("text-anchor", "middle")
    .text(y_label);
  