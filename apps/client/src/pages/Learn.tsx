import { useState, useEffect } from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import TabButton from '../components/common/TabButton';
import TabContent from '../components/common/TabContent';
import { tabs } from '../constance';

export default function Learn() {
    const navigate = useNavigate();
    const location = useLocation();

    const locationId = Number(location.hash.split("#std")[1]) || 0;
    console.log('locationId', locationId)
    const [activeTab, setActiveTab] = useState(locationId);

    const tabHandler = (tabId: number) => {
        navigate(`/learning#std${tabId}`);
    };
    
    useEffect(() => {
        setActiveTab(locationId);
        if (location?.hash === '') {
            navigate(`/learning#std${locationId}`);
        }
    }, [location.hash, navigate, locationId]);
    

    return (
        <section>
            <h2 className='list-title'>학습하기</h2>
            <div className='border-[var(--border-divide-color)] border-b-2'>
                {tabs.map((tab) => (
                        <TabButton
                            key={tab.id}
                            label={tab.label}
                            onClick={() => tabHandler(tab.id)}
                            isActive={activeTab === tab.id}
                        />
                ))}
            </div>
            <p className='text-[var(--sub-font-color)] pt-3 pb-8'>
                {tabs[activeTab].description}
            </p>
            <TabContent content={tabs[activeTab].content}/>
        </section>
    );
}