
import dynamic from 'next/dynamic';
import college_statistics from "../../statistics/stats"
import { memo } from 'react';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const OriginBarChart = memo(({college_name}) => {

    let college_statistics_data;

    if(college_name in college_statistics) {
        college_statistics_data = college_statistics[college_name]
    } else {
        const keys = Object.keys(college_statistics);
        const randomIndex = Math.floor(Math.random() * keys.length);
        const randomKey = keys[randomIndex];
        college_statistics_data = college_statistics[randomKey]
        console.log("college_statistics_data: ", college_statistics_data)

    }


  const counts = college_statistics_data.origin.reduce((acc, origin) => {
    if (origin === "American") {
        acc["local"] = (acc["local"] || 0) + 1;
    } else {
        acc[origin] = (acc[origin] || 0) + 1;
    }
    return acc;
  }, {});

  const labels = Object.keys(counts);
  const values = Object.values(counts);

  return (
    <div className="flex justify-center items-center shadow-lg border-[1px] border-black-100">
      <Plot
        data={[
          {
            type: "bar",
            x: labels,
            y: values,
            marker: {
              color: ["#1f77b4", "#ff7f0e"], // different colors
            },
          },
        ]}
        layout={{
            paper_bgcolor: "#fafafa",
            plot_bgcolor: "#fafafa", 
          title: {
            text: "Student Origin Distribution",
            font: { size: 24 },
          },
          xaxis: {
            title: "Origin",
          },
          yaxis: {
            title: "Number of Students",
          },
          bargap: 0.5,
        }}
        style={{ width: 500, height: 400 }}
      />
    </div>
  );
});

export default OriginBarChart;
