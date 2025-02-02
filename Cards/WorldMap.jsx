import React, { useState, useEffect, useRef } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";

const WorldMap = () => {
  const chartRef = useRef(null);
  const [option, setOption] = useState(null);

  useEffect(() => {
    const fetchGeoJson = async () => {
      try {
        const response = await fetch("/countries.geo.json"); // Assuming it's in public folder
        const geoJson = await response.json();

        echarts.registerMap("World", geoJson);

        function randomPieSeries(center, radius) {
          const data = ["A", "B", "C", "D"].map((t) => ({
            value: Math.round(Math.random() * 100),
            name: "Category " + t,
          }));

          return {
            type: "pie",
            coordinateSystem: "geo",
            tooltip: { formatter: "{b}: {c} ({d}%)" },
            label: { show: false },
            labelLine: { show: false },
            animationDuration: 0,
            radius,
            center,
            data,
          };
        }

        const newOption = {
          geo: {
            map: "World",
            roam: true,
            itemStyle: { areaColor: "#e7e8ea" },
          },
          tooltip: {},
          legend: {},
          series: [
            randomPieSeries([-86.75, 33.01], 15),
            randomPieSeries([-116.85, 39.8], 25),
            randomPieSeries([-99, 31.5], 30),
            randomPieSeries([-69, 45.5], 12),
          ],
        };

        setOption(newOption);
      } catch (error) {
        console.error("Error loading GeoJSON:", error);
      }
    };

    fetchGeoJson();
  }, []);

  return option ? (
    <ReactECharts ref={chartRef} option={option} style={{ height: "600px" }} />
  ) : (
    <p>Loading map...</p>
  );
};

export default WorldMap;
