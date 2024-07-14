"use client";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { SaleAllType } from "@/lib/type";
import { format, subDays } from "date-fns";

interface SaleChartProps {
  sales: SaleAllType[];
}

const SaleChart: React.FC<SaleChartProps> = ({ sales }) => {
  const [chartData, setChartData] = useState<{
    series: { name: string; data: number[] }[];
    options: any;
  }>({
    series: [
      {
        name: "Sales",
        data: [],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false,
        },
      },
      colors: ["#171717"],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "straight",
      },
      title: {
        text: "Sales for Last 7 Days",
        align: "left",
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: [],
      },
      tooltip: {
        y: {
          formatter: (value: number) => {
            return value.toLocaleString();
          },
        },
      },
    },
  });

  useEffect(() => {
    const aggregateSalesData = () => {
      const today = new Date();
      const last7Days = Array.from({ length: 7 }, (_, i) =>
        format(subDays(today, i), "dd-MM-yyyy")
      ).reverse();
      const dailySales = Array(7).fill(0);

      sales.forEach((sale) => {
        const saleDate = format(new Date(sale.createdAt), "dd-MM-yyyy");
        const index = last7Days.indexOf(saleDate);
        if (index !== -1) {
          const totalSaleAmount = sale.productSales.reduce(
            (sum, productSale) =>
              sum + productSale.price * productSale.quantity,
            0
          );
          dailySales[index] += totalSaleAmount;
        }
      });

      setChartData((prevData) => ({
        ...prevData,
        series: [
          {
            ...prevData.series[0],
            data: dailySales,
          },
        ],
        options: {
          ...prevData.options,
          xaxis: {
            categories: last7Days,
          },
        },
      }));
    };

    aggregateSalesData();
  }, [sales]);

  return (
    <div className="bg-white border rounded-lg shadow p-5 w-full">
      <div id="chart">
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="line"
          height={300}
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default SaleChart;
