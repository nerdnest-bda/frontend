import Plot from "react-plotly.js";

export default function GreGpaPlot({
  collegeData,
  acceptedData,
  applicantGre,
  applicantGpa,
  collegeName,
}) {
  const greScores = collegeData.map(d => d.Total_GRE);
  const gpas = collegeData.map(d => d.gpa);
  const decisions = collegeData.map(d => d.decision);

  const decisionColors = {
    Accepted: "green",
    Rejected: "red",
    Waitlisted: "orange",
  };

  const colors = decisions.map(dec => decisionColors[dec] || "gray");

  const acceptedGre = acceptedData.map(d => d.Total_GRE);
  const acceptedGpa = acceptedData.map(d => d.gpa);
  const avgGre =
    acceptedGre.reduce((a, b) => a + b, 0) / acceptedGre.length || 0;
  const avgGpa =
    acceptedGpa.reduce((a, b) => a + b, 0) / acceptedGpa.length || 0;

  return (
    <Plot
      data={[
        {
          x: greScores,
          y: gpas,
          mode: "markers",
          type: "scatter",
          marker: {
            color: colors,
            size: 12,
            opacity: 0.7,
          },
          text: decisions,
          name: "Applicants",
        },
        {
          x: [applicantGre],
          y: [applicantGpa],
          mode: "markers+text",
          type: "scatter",
          marker: {
            color: "blue",
            size: 18,
            symbol: "diamond",
            line: {
              width: 1,
              color: "black",
            },
          },
          name: "Your Profile",
          text: [`Your GPA: ${applicantGpa}, GRE: ${applicantGre}`],
          textposition: "top center",
        },
        {
          x: [Math.min(...greScores), Math.max(...greScores)],
          y: [avgGpa, avgGpa],
          mode: "lines",
          line: {
            dash: "dash",
            color: "gray",
            width: 1.5,
          },
          name: `Avg. Accepted GPA (${avgGpa.toFixed(2)})`,
        },
        {
          x: [avgGre, avgGre],
          y: [Math.min(...gpas), Math.max(...gpas)],
          mode: "lines",
          line: {
            dash: "dash",
            color: "blue",
            width: 1.5,
          },
          name: `Avg. Accepted GRE (${avgGre.toFixed(0)})`,
        },
      ]}
      layout={{
        title: `GPA vs. GRE Score at ${collegeName} - Where Do You Stand?`,
        xaxis: { title: "Total GRE Score" },
        yaxis: { title: "GPA" },
        showlegend: true,
        height: 600,
      }}
    />
  );
}
