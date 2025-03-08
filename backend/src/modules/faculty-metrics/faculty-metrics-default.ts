/**
 * Job: Hold all the default metrics on the backend as static content to be sent to the users
 */
export const defaultMetrics = [
  {
    metric_name: 'Recommendation',
    description: 'Quality of recommendation letters',
    default_weight: 0.2,
  },
  {
    metric_name: 'GPA (University Modifier)',
    description: 'GPA weight should change by university prestige',
    default_weight: 0.25,
  },
  {
    metric_name: 'Work/Research Relevancy',
    description: 'Work or research background in relevant field',
    default_weight: 0.15,
  },
  {
    metric_name: 'Academic Awards',
    description: 'Honors, awards, or notable achievements',
    default_weight: 0.1,
  },
  {
    metric_name: 'Publications',
    description: 'Number and quality of publications',
    default_weight: 0.1,
  },
  {
    metric_name: 'Extra-Curricular Activities',
    description: 'Clubs, volunteer work, leadership roles',
    default_weight: 0.05,
  },
  {
    metric_name: 'Personal Statement',
    description: 'Quality and clarity of personal statement',
    default_weight: 0.1,
  },
  {
    metric_name: 'Education Relevancy',
    description: 'Match between previous coursework and intended program',
    default_weight: 0.05,
  },
];
