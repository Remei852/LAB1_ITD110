import React, { useMemo } from 'react';
import { 
  BarChart, Bar, PieChart, Pie, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
  Cell, ResponsiveContainer 
} from 'recharts';
import './StudentDashboard.css';

const StudentDashboard = ({ students }) => {
  // Compute statistics and chart data
  const dashboardData = useMemo(() => {
    if (!students?.length) return null;

    // Course distribution
    const courseDistribution = students.reduce((acc, student) => {
      acc[student.course] = (acc[student.course] || 0) + 1;
      return acc;
    }, {});

    const courseData = Object.entries(courseDistribution).map(([name, value]) => ({
      name,
      value
    }));

    // Age distribution
    const ageDistribution = students.reduce((acc, student) => {
      const ageGroup = `${Math.floor(student.age / 5) * 5}-${Math.floor(student.age / 5) * 5 + 4}`;
      acc[ageGroup] = (acc[ageGroup] || 0) + 1;
      return acc;
    }, {});

    const ageData = Object.entries(ageDistribution)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => parseInt(a.name) - parseInt(b.name));

    // Gender distribution
    const genderDistribution = students.reduce((acc, student) => {
      acc[student.gender] = (acc[student.gender] || 0) + 1;
      return acc;
    }, {});

    const genderData = Object.entries(genderDistribution).map(([name, value]) => ({
      name,
      value
    }));

    // Basic statistics
    const totalStudents = students.length;
    const averageAge = (students.reduce((sum, student) => sum + parseInt(student.age), 0) / totalStudents).toFixed(1);
    const coursesCount = Object.keys(courseDistribution).length;

    return {
      courseData,
      ageData,
      genderData,
      stats: {
        totalStudents,
        averageAge,
        coursesCount
      }
    };
  }, [students]);

  if (!dashboardData) return <div>No data available</div>;

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="dashboard-container">
      <div className="stats-grid">
        {Object.entries(dashboardData.stats).map(([key, value]) => (
          <div className="stat-card" key={key}>
            <h3>{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
            <p className="stat-value">{value}</p>
          </div>
        ))}
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Course Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboardData.courseData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8">
                {dashboardData.courseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Gender Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dashboardData.genderData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                dataKey="value"
              >
                {dashboardData.genderData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card wide">
          <h3>Age Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dashboardData.ageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;