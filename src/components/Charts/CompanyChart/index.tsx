"use client";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

interface CompanyData {
  id: number;
  companyName: string;
  numberOfProducts: number;
  totalSaleAmount: number;
  totalPurchaseAmount: number;
  totalStock: number;
}

interface CompanyChartProps {
  companies: CompanyData[];
}

const CompanyChart: React.FC<CompanyChartProps> = ({ companies }) => {
  const [chartData, setChartData] = useState<{
    series: { data: number[] }[];
    options: any;
  }>({
    series: [
      {
        data: [],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "bar",
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: [],
      },
      colors: ["#171717"],
      title: {
        text: "Total Sales by Company",
        align: "left",
      },
      legend: {
        position: "bottom",
      },
    },
  });

  useEffect(() => {
    const aggregateSalesData = () => {
      const seriesData = companies.map((company) => company.totalSaleAmount);
      const labels = companies.map((company) => company.companyName);

      setChartData({
        series: [
          {
            data: seriesData,
          },
        ],
        options: {
          ...chartData.options,
          xaxis: {
            categories: labels,
          },
        },
      });
    };

    aggregateSalesData();
  }, [companies]);

  return (
    <div className="bg-white border rounded-lg shadow p-5 flex-1 w-3/5">
      <div id="chart">
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="bar"
          height={320}
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default CompanyChart;
