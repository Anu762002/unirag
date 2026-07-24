export const formatBytes = (bytes, decimals = 1) => {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const formatTimestamp = (timestamp) => {
  if (!timestamp) return '';
  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return timestamp;
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return timestamp;
  }
};

export const samplePrompts = [
  "What is the minimum attendance requirement for end-semester exams?",
  "What is the late fee penalty for semester tuition fees?",
  "What are the hostel curfew hours on weekdays vs weekends?",
  "How much is the answer script re-evaluation application fee?",
  "What is the eligibility for the 50% Merit Scholarship?"
];
