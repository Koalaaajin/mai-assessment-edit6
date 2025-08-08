/**
 * Mapping of each metacognitive dimension to the corresponding question
 * indices (1‑based). These indices reference the questions defined in
 * `questions.js`. See the MAI instrument for a complete
 * description of each dimension.
 */
export const dimensionMap = {
  'Knowledge about Cognition': [5, 15, 20, 26, 33],
  'Procedural Knowledge': [13, 17, 27, 31, 39],
  'Conditional Knowledge': [3, 18, 30, 34, 36],
  Planning: [4, 8, 16, 44, 49],
  'Information Management': [10, 12, 28, 40, 41, 47],
  'Comprehension Monitoring': [9, 14, 23, 32, 35, 46],
  Debugging: [6, 21, 25, 38, 42, 43],
  Evaluation: [1, 2, 7, 11, 19, 22, 24, 29, 37, 45, 48, 50, 51, 52],
};

/**
 * Basic description and Chinese translation for each dimension. Used in the
 * results page to provide context for the scores and to generate
 * personalized feedback. Feel free to adjust the wording to better suit
 * your audience.
 */
export const dimensionInfo = {
  'Knowledge about Cognition': {
    zh: '认知的知识',
    desc: '是否了解自己的学习风格与偏好',
  },
  'Procedural Knowledge': {
    zh: '程序性知识',
    desc: '是否掌握具体的学习方法',
  },
  'Conditional Knowledge': {
    zh: '条件性知识',
    desc: '是否知道在什么情境下使用哪些策略',
  },
  Planning: {
    zh: '计划能力',
    desc: '是否能提前设定学习目标并合理安排时间',
  },
  'Information Management': {
    zh: '信息管理策略',
    desc: '是否能筛选、分类、整理学习内容',
  },
  'Comprehension Monitoring': {
    zh: '理解监控',
    desc: '是否会检查自己有没有听懂',
  },
  Debugging: {
    zh: '调试策略',
    desc: '遇到问题时是否会调整学习方式',
  },
  Evaluation: {
    zh: '评估能力',
    desc: '是否会在学习后反思效果',
  },
};

/**
 * Grade descriptions based on the standardized score. These ranges are
 * referenced to produce color coding or textual descriptions of a
 * student’s performance. The keys correspond to named levels in
 * ascending order.
 */
export const scoreLevels = [
  { min: 8.0, max: 10.0, label: '高水平', remark: '已具备成熟的元认知意识，能灵活运用策略。' },
  { min: 6.0, max: 7.9, label: '中高水平', remark: '基础扎实，建议持续练习提升使用频率和情境灵活度。' },
  { min: 4.0, max: 5.9, label: '中等水平', remark: '具备意识但使用不够稳定，建议结合实际任务刻意练习。' },
  { min: 2.0, max: 3.9, label: '较低水平', remark: '意识不强，可能较少主动使用该类策略，建议引导提升。' },
  { min: 0.0, max: 1.9, label: '低水平', remark: '几乎未表现出该能力，建议重点干预与持续跟踪提升。' },
];