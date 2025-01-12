"use client";

import React from 'react';
import { IcoFolder, IcoRefresh, IcoSettings } from '../Icons';
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
            className={`flex items-center justify-center w-full h-[48px] cursor-pointer ${selectedTab == props.tab ? 'border-l-2 border-clientColors-accentColor' : ''}`}
            onClick={() => {
                dispatch(setSelectedTab(props.tab));
                redirect(props.url);
            }}>
            {props.icon}
        </div>
    );
}

function UpdateAvailableItem() {
    const reduxState = useSelector((state: RootState) => state.windowProperties);
    const hideUpdateNotifications = reduxState.clientSettings?.hideUpdateNotifications ?? false;
    
    if (reduxState.updateInfo !== null && hideUpdateNotifications) {
        return (
            <div className='relative flex items-center justify-center w-full h-[48px] bg-clientColors-button-background hover:bg-clientColors-button-hover cursor-pointer' onClick={() => {
                window.open(reduxState.updateInfo?.html_url, '_blank'); // Move this to open in the default browser @TODO
            }}>
                {/* Icon */}
                <div className="relative">
                    <IcoRefresh />
                    {/* Notification Bubble */}
                    <span className="absolute bottom-0 right-0 flex h-[10px] w-[10px]">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-full w-full bg-sky-500"></span>
                    </span>
                </div>
            </div>
        );
    }
}


export default function SideBar() {
    return (
        <div className='h-full flex flex-col justify-between min-w-[48px]'>
            <div>
                {SideBarItems.map((item, index) => (
                    <SideBarItem
                        key={index}
                        icon={item.icon}
                        url={item.url}
                        tab={item.tab}
                    />
                ))}
            </div>
            <UpdateAvailableItem />
        </div>
    );
}
