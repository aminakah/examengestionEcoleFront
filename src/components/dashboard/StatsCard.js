import React from 'react';

const StatsCard = ({ title, value, icon: Icon, color, bgColor, trend, trendValue }) => {
  return (
    <div className={`${bgColor} rounded-xl p-6 text-white relative overflow-hidden`}>
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
        <div className="w-full h-full bg-white rounded-full transform translate-x-8 -translate-y-8"></div>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 bg-white/20 rounded-lg backdrop-blur-sm`}>
            <Icon className="w-6 h-6" />
          </div>
          {trend && (
            <div className={`text-xs px-2 py-1 rounded-full ${
              trend === 'up' ? 'bg-green-500/20 text-green-100' : 'bg-red-500/20 text-red-100'
            }`}>
              {trend === 'up' ? '↗' : '↘'} {trendValue}
            </div>
          )}
        </div>
        
        <div>
          <p className="text-white/80 text-sm mb-1">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
