import {
  type Component,
  createSignal,
  createEffect,
  on,
  onMount,
  createMemo,
} from "solid-js";
import Chart, { type ChartItem, type ChartType } from "chart.js/auto";

const App: Component = () => {
  const [chart, setChart] = createSignal<Chart>();
  const [type, setType] = createSignal<ChartType>("pie");
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
      type: type(),
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

  createEffect(
    on(type, () => {
      chart()?.destroy();
      init();
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

  const changeType = () => {
    setType((type) => (type === "pie" ? "bar" : "pie"));
  };

  return (
    <div style={{ width: "500px" }}>
      <button onClick={increaseData}>more data</button>
      <button onClick={changeType}>change type</button>

      <canvas id="acquisitions" ref={canvasRef!} />
    </div>
  );
};

export default App;
