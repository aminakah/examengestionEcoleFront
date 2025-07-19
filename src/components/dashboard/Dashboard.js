import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import StatsCard from './StatsCard';
import RecentActivities from './RecentActivities';
import QuickActions from './QuickActions';
import StudentOverview from './StudentOverview';
import ClassSchedule from './ClassSchedule';
import { 
  Users, 
  BookOpen, 
  Calendar, 
  Award
} from 'lucide-react';

const Dashboard = () => {
  const [activeItem, setActiveItem] = useState('dashboard');

  const statsData = [
    {
      title: "Total Étudiants",
      value: "1,247",
      icon: Users,
      bgColor: "bg-gradient-to-r from-blue-500 to-blue-600",
      trend: "up",
      trendValue: "+12%"
    },
    {
      title: "Cours Actifs", 
      value: "156",
      icon: BookOpen,
      bgColor: "bg-gradient-to-r from-green-500 to-green-600",
      trend: "up",
      trendValue: "+5%"
    },
    {
      title: "Présence Moyenne",
      value: "92.5%",
      icon: Calendar,
      bgColor: "bg-gradient-to-r from-purple-500 to-purple-600",
      trend: "up", 
      trendValue: "+2.1%"
    },
    {
      title: "Moyenne Générale",
      value: "14.2/20",
      icon: Award,
      bgColor: "bg-gradient-to-r from-orange-500 to-orange-600",
      trend: "up",
      trendValue: "+0.8"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
      
      <div className="flex-1">
        <Header />
        
        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {statsData.map((stat, index) => (
              <StatsCard
                key={index}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                bgColor={stat.bgColor}
                trend={stat.trend}
                trendValue={stat.trendValue}
              />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - Large */}
            <div className="lg:col-span-8 space-y-6">
              <ClassSchedule />
              <RecentActivities />
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <StudentOverview />
              <QuickActions />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
