import React, { useMemo } from 'react';
import {
  dimensionMap,
  dimensionInfo,
  scoreLevels,
} from '../data/dimensions';
import questions from '../data/questions';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

// Register necessary Chart.js components once
// Register only the components needed for the radar charts. The bar chart
// components (CategoryScale, LinearScale, BarElement) have been removed
// because the bar chart itself has been removed.
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

/**
 * Generate a textual description of performance based on the high and low
 * scoring dimensions. This function mirrors the example provided by
 * the user and produces a personalised, motivational narrative. The
 * returned string uses the Chinese names of the dimensions.
 */
function generateFeedback(standardScores) {
  const highDims = Object.keys(standardScores).filter(
    (dim) => standardScores[dim] >= 8
  );
  const lowDims = Object.keys(standardScores).filter(
    (dim) => standardScores[dim] <= 5
  );
  const highNames =
    highDims.length > 0
      ? highDims.map((d) => dimensionInfo[d].zh).join('、')
      : '部分维度';
  const lowNames =
    lowDims.length > 0
      ? lowDims.map((d) => dimensionInfo[d].zh).join('、')
      : '部分维度';

  return `你完成了这份 52 道题的元认知意识测评。这不仅是一份问卷，更像是一面镜子，让你看到自己在学习中的思考方式与自我调节能力。每一次选择，都反映出你对学习策略、专注程度、以及思考习惯的真实感受。迈出这一步，说明你已经在探索自我成长的路上，踏出了非常关键的一步。\n\n` +
    `本次测评显示，你在「${highNames}」方面表现突出，说明你已经具备良好的学习流程管理与策略运用能力。请继续保持这些优势，它们是你稳定学习和持久成长的基石。\n\n` +
    `同时，测评也提示你在「${lowNames}」方面还有提升空间。这些并不是弱点，而是可被激活的潜力。如果你愿意尝试新的策略、培养反思习惯，这些能力完全可以通过练习快速提升。\n\n` +
    `元认知就像我们内在的指南针，帮助我们看清方向、制定路径，并调整节奏。愿你在未来的每一次学习旅程中，都能带着觉察前行，温柔而坚定地陪伴自己。\n\n` +
    `📩 想了解你的具体成长路径和行动建议？欢迎联系【哈佛小金老师】，获取1对1报告解读与指导。`;
}

/**
 * Determine the textual level and remark for a given standard score.
 */
function getLevel(score) {
  for (const level of scoreLevels) {
    if (score >= level.min && score <= level.max) {
      return level;
    }
  }
  // Fallback level
  return scoreLevels[scoreLevels.length - 1];
}

/**
 * Results component. Receives the answer array and student info and
 * computes raw and standard scores for each dimension. It then
 * visualises the results using bar and radar charts and provides
 * personalised feedback. A CSV export is also available.
 */
function Results({ answers, info, onRestart }) {
  // Compute raw and standardised scores
  const { rawScores, standardScores } = useMemo(() => {
    const raw = {};
    const standard = {};
    Object.keys(dimensionMap).forEach((dim) => {
      const indices = dimensionMap[dim];
      const total = indices.length;
      const sum = indices.reduce((acc, idx) => {
        const ans = answers[idx - 1];
        return acc + (ans === 1 ? 1 : 0);
      }, 0);
      raw[dim] = sum;
      standard[dim] = total > 0 ? parseFloat(((sum / total) * 10).toFixed(1)) : 0;
    });
    return { rawScores: raw, standardScores: standard };
  }, [answers]);

  // Chart data for the bar graph
  const barData = useMemo(() => {
    return {
      labels: Object.keys(dimensionMap).map((dim) => dimensionInfo[dim].zh),
      datasets: [
        {
          label: '标准化得分',
          data: Object.keys(dimensionMap).map((dim) => standardScores[dim]),
        },
      ],
    };
  }, [standardScores]);

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 0,
        max: 10,
        ticks: {
          stepSize: 2,
        },
      },
    },
  };

  // Radar chart data for knowledge dimensions
  const knowledgeDims = [
    'Knowledge about Cognition',
    'Procedural Knowledge',
    'Conditional Knowledge',
  ];
  const strategyDims = [
    'Planning',
    'Information Management',
    'Comprehension Monitoring',
    'Debugging',
    'Evaluation',
  ];

  const radarDataKnowledge = useMemo(() => {
    return {
      labels: knowledgeDims.map((d) => dimensionInfo[d].zh),
      datasets: [
        {
          label: '知识类维度',
          data: knowledgeDims.map((d) => standardScores[d]),
        },
      ],
    };
  }, [standardScores]);

  const radarDataStrategy = useMemo(() => {
    return {
      labels: strategyDims.map((d) => dimensionInfo[d].zh),
      datasets: [
        {
          label: '策略类维度',
          data: strategyDims.map((d) => standardScores[d]),
        },
      ],
    };
  }, [standardScores]);

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        min: 0,
        max: 10,
        ticks: {
          stepSize: 2,
        },
      },
    },
  };

  const feedbackText = useMemo(() => generateFeedback(standardScores), [standardScores]);

  // Prepare CSV download (basic info + answers + scores)
  const handleDownloadCSV = () => {
    const headers = [
      '姓名',
      '年龄',
      '学校',
      '年级',
      ...questions.map((q) => `Q${q.id}`),
      ...Object.keys(dimensionMap).map((dim) => `${dimensionInfo[dim].zh}原始得分`),
      ...Object.keys(dimensionMap).map((dim) => `${dimensionInfo[dim].zh}标准化得分`),
    ];
    const row = [
      info.name,
      info.age,
      info.school,
      info.grade,
      ...answers.map((ans) => (ans !== null ? ans : '')),
      ...Object.keys(dimensionMap).map((dim) => rawScores[dim]),
      ...Object.keys(dimensionMap).map((dim) => standardScores[dim]),
    ];
    const csvContent = `${headers.join(',')}` + '\n' + `${row.join(',')}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${info.name || 'mai-result'}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-2">{info.name} 的测评结果</h2>
        <p className="text-sm mb-1">年龄：{info.age}</p>
        <p className="text-sm mb-1">学校：{info.school}</p>
        <p className="text-sm">年级：{info.grade}</p>
      </div>

      {/* Scores Table */}
      <div className="bg-white p-6 rounded-lg shadow-sm overflow-x-auto">
        <h3 className="text-lg font-semibold mb-4">各维度得分</h3>
        <table className="min-w-full text-sm text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-3">维度</th>
              <th className="py-2 px-3">原始得分</th>
              <th className="py-2 px-3">标准化得分</th>
              <th className="py-2 px-3">等级</th>
              <th className="py-2 px-3">解释</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(dimensionMap).map((dim) => {
              const level = getLevel(standardScores[dim]);
              return (
                <tr key={dim} className="border-b">
                  <td className="py-2 px-3 whitespace-nowrap font-medium">{dimensionInfo[dim].zh}</td>
                  <td className="py-2 px-3 text-center">{rawScores[dim]}</td>
                  <td className="py-2 px-3 text-center">{standardScores[dim]}</td>
                  <td className="py-2 px-3 text-center">{level.label}</td>
                  <td className="py-2 px-3">{dimensionInfo[dim].desc}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Charts */}
      {/*
        The bar chart showing per‑dimension standardised scores has been removed at
        the user's request. Only the radar charts remain. Each radar chart
        container now takes up half of the viewport height and allows vertical
        scrolling (via ``overflow-y-auto``) so that the charts fit comfortably on
        smaller displays. Using ``h-[50vh]`` ensures the height is always
        roughly half of the visible screen. See Tailwind's arbitrary value
        syntax for details: https://tailwindcss.com/docs/height#arbitrary-values.
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm h-[50vh] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-3">雷达图：认知知识类</h3>
          <Radar data={radarDataKnowledge} options={radarOptions} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm h-[50vh] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-3">雷达图：自我调节策略类</h3>
          <Radar data={radarDataStrategy} options={radarOptions} />
        </div>
      </div>

      {/* Feedback */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-3">个性化评语</h3>
        {feedbackText.split('\n').map((line, idx) => (
          <p key={idx} className="mb-2 leading-relaxed">
            {line}
          </p>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap justify-end gap-4">
        <button
          type="button"
          onClick={handleDownloadCSV}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          导出 CSV
        </button>
        {onRestart && (
          <button
            type="button"
            onClick={onRestart}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            重新开始
          </button>
        )}
      </div>
    </div>
  );
}

export default Results;