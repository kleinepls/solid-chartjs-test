import {
  type Component,
  createSignal,
  createEffect,
  on,
  onMount,
  createMemo,
} from "solid-js";
import Chart, { ChartItem } from "chart.js/auto";

const App: Component = () => {
  const [chart, setChart] = createSignal<Chart<"pie">>();
  let canvasRef: HTMLCanvasElement;

  const [data, setData] = createSignal([
    { year: 2010, count: 10 },
    { year: 2011, count: 20 },
    { year: 2012, count: 15 },
    { year: 2013, count: 25 },
    { year: 2014, count: 22 },
    { year: 2015, count: 30 },
    { year: 2016, count: 28 },
  ]);

  const init = () => {
    const ctx = canvasRef?.getContext("2d") as ChartItem;

    const chart = new Chart(ctx, {
      type: "pie",
      data: chartData(),
    });

    setChart(chart);
  };

  const chartData = createMemo(() => {
    return {
      labels: data().map((row) => row.year),
      datasets: [
        {
          label: "Acquisitions by year",
          data: data().map((row) => row.count),
        },
      ],
    };
  });

  onMount(() => {
    init();
  });

  createEffect(
    on(chartData, () => {
      chart()!.data = chartData();
      chart()!.update();
    }),
  );

  const increaseData = () => {
    setData((data) =>
      data.concat([
        { year: 2023, count: 4 },
        { year: 2024, count: 4 },
        { year: 2025, count: 4 },
        { year: 2026, count: 4 },
      ]),
    );
  };

  return (
    <div style={{ width: "500px" }}>
      <button
        style={{
          border: "none",
          padding: "1rem",
          "background-color": "lime",
          "border-radius": "0.5rem",
          "margin-block": "4rem",
          "margin-inline": "auto",
        }}
        onClick={increaseData}
      >
        more data
      </button>

      <canvas id="acquisitions" ref={canvasRef!} />
    </div>
  );
};

export default App;
