export function updateChart(percent, requestId) {
  const circle = document.querySelector('.progress-ring-circle-'+requestId);
  const radius = circle.r.baseVal.value;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - percent / 100 * circumference;
  circle.style.strokeDasharray = `${circumference} ${circumference}`;
  circle.style.strokeDashoffset = offset;
  const percentage = document.getElementById('percentage-'+requestId);
  percentage.textContent = `${percent}%`;
}
 