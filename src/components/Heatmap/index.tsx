import { useState, useEffect } from 'react';
import { Spin } from "antd";
import { questionDefaultApi } from '../../api';
import type { SubmitHeatmapVO, DailySubmitCount } from '../../../generated_new/question';
import './index.css';

interface HeatmapProps {
    range?: 'month' | 'year';
}

const Heatmap = ({ range = 'year' }: HeatmapProps) => {
    const [data, setData] = useState<SubmitHeatmapVO | null>(null);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Calculate startDate based on range
                const today = new Date();
                const startDate = new Date(today);
                if (range === 'month') {
                    startDate.setDate(today.getDate() - 30);
                } else {
                    startDate.setDate(today.getDate() - 365);
                }
                const startDateStr = startDate.toISOString().split('T')[0];

                const res = await questionDefaultApi.getSubmitHeatmap(startDateStr);
                if (res.data.code === 0) {
                    setData(res.data.data || null);
                }
            } catch (error) {
                console.error("Failed to fetch heatmap data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [range]);

    // Generate days for grid
    const today = new Date();
    const daysCount = range === 'month' ? 30 : 365;
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - daysCount);
    
    const startDayOfWeek = startDate.getDay(); // 0 = Sunday
    
    const days = [];
    
    // Add placeholders
    for (let i = 0; i < startDayOfWeek; i++) {
        days.push({ date: '', placeholder: true });
    }
    
    // Add actual days
    for (let i = 0; i <= daysCount; i++) {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + i);
        const dateStr = d.toISOString().split('T')[0];
        days.push({
            date: dateStr,
            placeholder: false
        });
    }

    const getCount = (date: string) => {
        return data?.heatmapData?.find((d: DailySubmitCount) => d.date === date)?.count || 0;
    };

    const getLevel = (count: number) => {
        if (count === 0) return '';
        if (count <= 2) return 'active-low';
        if (count <= 5) return 'active-medium'; 
        return 'active-high';
    };

    return (
        <div className="heatmap-section">
             <div className="heatmap-stats">
                 <div className="heatmap-stat">
                     <div className="stat-value">{data?.currentStreak || 0}</div>
                     <div className="stat-label">连续提交</div>
                 </div>
                 <div className="heatmap-stat">
                     <div className="stat-value">{data?.totalSubmissions || 0}</div>
                     <div className="stat-label">{range === 'month' ? '近30天' : '年度'}提交</div>
                 </div>
                 <div className="heatmap-stat">
                     <div className="stat-value">{data?.maxStreak || 0}</div>
                     <div className="stat-label">最长连续</div>
                 </div>
             </div>
             <Spin spinning={loading}>
                 <div className="heatmap-grid" style={{ 
                     display: 'grid', 
                     gridTemplateRows: 'repeat(7, 1fr)',
                     gridAutoFlow: 'column',
                     gap: '2px',
                     overflowX: 'auto',
                     height: '100px'
                 }}>
                     {days.map((d, i) => {
                         if (d.placeholder) {
                             return <div key={`placeholder-${i}`} className="heatmap-cell" style={{ background: 'transparent' }} />;
                         }
                         const count = getCount(d.date);
                         return (
                             <div 
                                 key={d.date} 
                                 title={`${d.date}: ${count} submissions`}
                                 className={`heatmap-cell ${getLevel(count)}`} 
                             />
                         );
                     })}
                 </div>
             </Spin>
        </div>
    );
};

export default Heatmap;
