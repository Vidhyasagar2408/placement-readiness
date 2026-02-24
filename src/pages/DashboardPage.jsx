import { useEffect, useMemo, useState } from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

const readinessScore = 72;
const readinessMax = 100;
const readinessRadius = 78;
const readinessStroke = 12;

const skillData = [
  { skill: "DSA", score: 75 },
  { skill: "System Design", score: 60 },
  { skill: "Communication", score: 80 },
  { skill: "Resume", score: 85 },
  { skill: "Aptitude", score: 70 },
];

const activityDays = [
  { label: "Mon", active: true },
  { label: "Tue", active: true },
  { label: "Wed", active: true },
  { label: "Thu", active: false },
  { label: "Fri", active: true },
  { label: "Sat", active: false },
  { label: "Sun", active: true },
];

const assessments = [
  { title: "DSA Mock Test", time: "Tomorrow, 10:00 AM" },
  { title: "System Design Review", time: "Wed, 2:00 PM" },
  { title: "HR Interview Prep", time: "Friday, 11:00 AM" },
];

function OverallReadiness() {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const id = window.setTimeout(() => setAnimatedScore(readinessScore), 120);
    return () => window.clearTimeout(id);
  }, []);

  const circumference = useMemo(() => 2 * Math.PI * readinessRadius, []);
  const offset = circumference - (animatedScore / readinessMax) * circumference;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Overall Readiness</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="readiness-wrap" role="img" aria-label={`Overall readiness ${readinessScore} out of ${readinessMax}`}>
          <svg className="readiness-ring" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r={readinessRadius} className="readiness-ring-track" strokeWidth={readinessStroke} />
            <circle
              cx="100"
              cy="100"
              r={readinessRadius}
              className="readiness-ring-progress"
              strokeWidth={readinessStroke}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          <div className="readiness-center">
            <div className="readiness-score">{readinessScore}/100</div>
            <div className="readiness-label">Readiness Score</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SkillBreakdown() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Skill Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="radar-wrap">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={skillData} outerRadius="72%">
              <PolarGrid stroke="rgba(17, 17, 17, 0.18)" />
              <PolarAngleAxis dataKey="skill" tick={{ fill: "#334155", fontSize: 12 }} />
              <Radar
                name="Score"
                dataKey="score"
                stroke="hsl(245 58% 51%)"
                fill="hsl(245 58% 51%)"
                fillOpacity={0.28}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function ContinuePractice() {
  const completed = 3;
  const total = 10;
  const progress = (completed / total) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Continue Practice</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="muted-text">Last topic</p>
        <h4 className="topic-heading">Dynamic Programming</h4>
        <div className="progress-meta">{completed}/{total} completed</div>
        <div className="progress-track" aria-hidden="true">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <button type="button" className="btn btn-primary">Continue</button>
      </CardContent>
    </Card>
  );
}

function WeeklyGoals() {
  const solved = 12;
  const target = 20;
  const progress = (solved / target) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Goals</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="progress-meta">Problems Solved: {solved}/{target} this week</div>
        <div className="progress-track" aria-hidden="true">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="day-row" aria-label="Weekly activity">
          {activityDays.map((day) => (
            <div key={day.label} className="day-item">
              <span className={`day-dot${day.active ? " active" : ""}`} />
              <span>{day.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function UpcomingAssessments() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Assessments</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="assessment-list">
          {assessments.map((item) => (
            <li key={item.title} className="assessment-item">
              <div className="assessment-title">{item.title}</div>
              <div className="assessment-time">{item.time}</div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function DashboardPage() {
  return (
    <section className="dashboard-grid" aria-label="Dashboard widgets">
      <OverallReadiness />
      <SkillBreakdown />
      <ContinuePractice />
      <WeeklyGoals />
      <UpcomingAssessments />
    </section>
  );
}

export default DashboardPage;
