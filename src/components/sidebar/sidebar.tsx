"use client";

import React from 'react';
import { IcoFolder, IcoSettings } from '../Icons';
import { AvailableTabs, setSelectedTab } from '@/redux/slices/windowProperties';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';  // Adjust if necessary
import { redirect } from 'next/navigation'

interface SideBarItemProps {
    icon: React.ReactNode;
    url: string;
    tab: AvailableTabs;
}


const SideBarItems: SideBarItemProps[] = [
    {
        icon: <IcoFolder />,
        url: '/client/explorer',
        tab: 'explorer',
    },
    {
        icon: <IcoSettings />,
        url: '/client/settings',
        tab: 'settings',
    }
]

function SideBarItem(props: SideBarItemProps) {
    const reduxState = useSelector((state: RootState) => state.windowProperties);
    const selectedTab = reduxState.selectedTab;
    
    const dispatch = useDispatch();

    return (
        <div
            className={`flex items-center justify-center w-full h-[48px] ${selectedTab == props.tab ? 'border-l-2 border-clientColors-accentColor' : ''}`}
            onClick={() => {
                dispatch(setSelectedTab(props.tab));
                redirect(props.url);
            }}
>
            {props.icon}
        </div>
    );
}

export default function SideBar() {
    return (
        <div className='h-full min-w-[48px]'>
            {SideBarItems.map((item, index) => (
                <SideBarItem
                    key={index}
                    icon={item.icon}
                    url={item.url}
                    tab={item.tab}
                />
            ))}
        </div>
    );
}
