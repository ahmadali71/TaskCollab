// AI-related endpoints - returns mock data for development
// In production, these would integrate with actual AI services

// @desc    Parse natural language to task
// @route   POST /api/ai/parse-task
// @access  Private
export const parseNaturalLanguage = async (req, res) => {
  const { input } = req.body;

  // Simple mock parsing - in production this would use NLP
  const parsed = {
    title: input,
    description: '',
    priority: 'medium',
    dueDate: null,
    assignees: [],
    labels: [],
  };

  // Extract date keywords
  if (input.toLowerCase().includes('urgent') || input.toLowerCase().includes('asap')) {
    parsed.priority = 'urgent';
  } else if (input.toLowerCase().includes('soon') || input.toLowerCase().includes('today')) {
    parsed.priority = 'high';
  }

  res.json(parsed);
};

// @desc    Get task suggestions
// @route   POST /api/ai/suggestions
// @access  Private
export const getSuggestions = async (req, res) => {
  const { input } = req.body;

  // Mock suggestions
  const suggestions = [
    'Break this down into smaller tasks',
    'Set a deadline for completion',
    'Add relevant labels for better organization',
    'Consider assigning to a team member',
  ];

  res.json({
    suggestions,
    confidence: 0.85,
  });
};

// @desc    Decompose task into subtasks
// @route   POST /api/ai/decompose-task/:id
// @access  Private
export const decomposeTask = async (req, res) => {
  const { id } = req.params;

  // Mock subtask decomposition
  const subtasks = [
    { title: 'Research and planning', completed: false },
    { title: 'Implementation', completed: false },
    { title: 'Testing and review', completed: false },
    { title: 'Documentation', completed: false },
  ];

  res.json({
    taskId: id,
    subtasks,
  });
};

// @desc    Get priority suggestion
// @route   GET /api/ai/priority-suggestion/:id
// @access  Private
export const getPrioritySuggestion = async (req, res) => {
  const { id } = req.params;

  res.json({
    taskId: id,
    suggestedPriority: 'high',
    reason: 'Similar tasks have been assigned high priority based on deadlines',
  });
};

// @desc    Get sentiment analysis
// @route   GET /api/ai/sentiment/:id
// @access  Private
export const getSentimentAnalysis = async (req, res) => {
  const { id } = req.params;

  res.json({
    taskId: id,
    sentiment: 'neutral',
    score: 0.5,
  });
};

// @desc    Get productivity insights
// @route   GET /api/ai/insights
// @access  Private
export const getProductivityInsights = async (req, res) => {
  const { timeRange } = req.query;

  res.json({
    insights: [
      {
        type: 'productivity',
        value: 85,
        trend: 'up',
        message: 'Your productivity is trending upward',
      },
      {
        type: 'completion_rate',
        value: 78,
        trend: 'stable',
        message: 'Completion rate is stable',
      },
    ],
  });
};