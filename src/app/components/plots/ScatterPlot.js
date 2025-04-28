"use client"

import dynamic from 'next/dynamic';
import college_statistics from "../../statistics/stats"
import { selectUser } from '@/app/features/userSlice';
import { useSelector } from 'react-redux';
import { memo, useEffect, useState } from 'react';
import axios from 'axios';
import { symbol } from 'prop-types';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const ScatterPlot = memo(({ college_name }) => {
  const user = useSelector(selectUser);
  const [currentUserDetails, selectCurrentUserDetails] = useState({})

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_NERDNEST_SERVER_URL}/api/users/${user.uid}`)
    .then((res) => {
      console.log("In ScatterPlot (res): ", res)
      selectCurrentUserDetails(res.data)
    })
  }, [user])

  let college_statistics_data;

  if(Object.keys(college_statistics).includes(college_name)) {
    console.log("Entering this if loop")
    college_statistics_data = college_statistics[college_name]
  } else {
    console.log("Keys:", Object.keys(college_statistics))
    console.log("College name: ", college_name)
    console.log("Entering into this else loop")
    const keys = Object.keys(college_statistics);
    const randomIndex = Math.floor(Math.random() * keys.length);
    const randomKey = keys[randomIndex];
    college_statistics_data = college_statistics[randomKey]
    console.log("college_statistics_data: ", college_statistics_data)

  }
  
  // Group data by result type
  const acceptedIndices = [];
  const waitIndices = [];
  const rejectedIndices = [];
  
  college_statistics_data.result.forEach((result, index) => {
    if (result === "Accepted") {
      acceptedIndices.push(index);
    } else if (result === "Wait") {
      waitIndices.push(index);
    } else {
      rejectedIndices.push(index);
    }
  });

  const acceptedTrace = {
    x: acceptedIndices.map(i => college_statistics_data.total_gre[i]),
    y: acceptedIndices.map(i => college_statistics_data.gpa[i]),
    mode: 'markers',
    type: 'scatter',
    text: acceptedIndices.map(i => 
      `Result: ${college_statistics_data.result[i]}<br>GPA: ${college_statistics_data.gpa[i]}<br>Total GRE: ${college_statistics_data.total_gre[i]}`
    ),
    marker: {
      size: 10,
      color: 'green',
      opacity: 0.8,
    },
    name: 'Accepted'
  };

  const waitTrace = {
    x: waitIndices.map(i => college_statistics_data.total_gre[i]),
    y: waitIndices.map(i => college_statistics_data.gpa[i]),
    mode: 'markers',
    type: 'scatter',
    text: waitIndices.map(i => 
      `Result: ${college_statistics_data.result[i]}<br>GPA: ${college_statistics_data.gpa[i]}<br>Total GRE: ${college_statistics_data.total_gre[i]}`
    ),
    marker: {
      size: 10,
      color: 'orange',
      opacity: 0.8,
    },
    name: 'Wait-listed'
  };

  const rejectedTrace = {
    x: rejectedIndices.map(i => college_statistics_data.total_gre[i]),
    y: rejectedIndices.map(i => college_statistics_data.gpa[i]),
    mode: 'markers',
    type: 'scatter',
    text: rejectedIndices.map(i => 
      `Result: ${college_statistics_data.result[i]}<br>GPA: ${college_statistics_data.gpa[i]}<br>Total GRE: ${college_statistics_data.total_gre[i]}`
    ),
    marker: {
      size: 10,
      color: 'red',
      opacity: 0.8,
    },
    name: 'Rejected'
  };

  // Create trace for current user
  const userTrace = {
    x: [currentUserDetails.quant_score + currentUserDetails.verbal_score],
    y: [currentUserDetails.gpa],
    mode: 'markers',
    type: 'scatter',
    marker: {
      symbol: 'star',
      size: 12,
      color: 'blue',
      opacity: 1,
      line: { width: 2, color: 'black' },
    },
    name: 'Your Score'
  };

  return (
    <Plot
    className="shadow-lg border-[1px] border-black-100"
      data={[acceptedTrace, waitTrace, rejectedTrace, userTrace]}
      layout={{
        paper_bgcolor: "#fafafa",
        plot_bgcolor: "#fafafa", 
        title: {
          text: "Where do you stand",
          font: {
            size: 24,
          },
        },
        xaxis: { title: 'Total GRE Score' },
        yaxis: { title: 'GPA' },
        hovermode: 'closest',
        width: 800,
        height: 600,
        showlegend: true,
        legend: {
          x: 1,
          y: 1,
          xanchor: 'right',
          yanchor: 'top'
        }
      }}
    />
  );
})

export default ScatterPlot;