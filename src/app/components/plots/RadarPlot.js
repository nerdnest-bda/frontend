
import dynamic from 'next/dynamic';
import college_statistics from "../../statistics/stats"
import { useSelector } from 'react-redux';
import { selectUser } from '@/app/features/userSlice';
import { memo, useEffect, useState } from 'react';
import axios from 'axios';


// Dynamically import Plotly so it works well with Next.js SSR
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const RadarComparisonPlot = memo(({college_name}) => {

    const user = useSelector(selectUser);
    const [currentUserDetails, selectCurrentUserDetails] = useState({})

    useEffect(() => {
        axios.get(`${process.env.NEXT_PUBLIC_NERDNEST_SERVER_URL}/api/users/${user.uid}`)
        .then((res) => {
        console.log("In ScatterPlot (res): ", res)
        selectCurrentUserDetails(res.data)
        })
    }, [user])

  const categories = ['GRE_Q', 'GRE_V', 'GPA', 'AWA'];

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

  const averageScores = Object.fromEntries(
    Object.entries(college_statistics_data).map(([key, values]) => {
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      return [key, avg];
    })
  );

  const averageValues = [
    averageScores.gre_q/100,
    averageScores.gre_v/100,
    averageScores.gpa,
    averageScores.awa,
  ];

  const yourValues = [
    currentUserDetails.quant_score/100,
    currentUserDetails.verbal_score/100,
    currentUserDetails.gpa,
    currentUserDetails.awa_score,
  ];

  const allValues = [...averageValues, ...yourValues];
  const maxValue = Math.max(...allValues);
  const radialRange = [0, Math.ceil(maxValue * 1.1)];

  return (
    <div className="flex justify-center items-center shadow-lg border-[1px] border-black-100">
      <Plot
        data={[
          {
            type: "scatterpolar",
            r: averageValues,
            theta: categories,
            fill: "toself",
            name: "Average",
          },
          {
            type: "scatterpolar",
            r: yourValues,
            theta: categories,
            fill: "toself",
            name: "You",
          },
        ]}
        layout={{
            paper_bgcolor: "#fafafa",
            plot_bgcolor: "#fafafa", 
            polar: {
                radialaxis: {
                visible: true,
                range: radialRange,
                },
            },
            showlegend: true,
            title: {
                text: "Your Scores vs Average Scores",
                font: {
                size: 24,
                },
            },
        }}
        style={{ width: 600, height: 600 }}
      />
    </div>
  );
});

export default RadarComparisonPlot;
