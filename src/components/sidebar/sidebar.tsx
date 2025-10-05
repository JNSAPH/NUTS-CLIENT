"use client";

import React from 'react';
import { IcoFolder, IcoRefresh, IcoSettings } from '../Icons';
import { AvailableTabs, setSelectedTab } from '@/redux/slices/windowProperties';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';  // Adjust if necessary
import { redirect } from 'next/navigation'
import { openPath } from '@tauri-apps/plugin-opener';

interface SideBarItemProps {
    icon: React.ReactNode;
    url: string;
    tab: AvailableTabs;
}


const SideBarItems: SideBarItemProps[] = [
    {
        icon: <IcoFolder size={22} />,
        url: '/client/explorer',
        tab: 'explorer',
    },
    {
        icon: <IcoSettings size={24} />,
        url: '/client/settings',
        tab: 'settings',
    }
]

function SideBarItem(props: SideBarItemProps) {
  const reduxState = useSelector((state: RootState) => state.windowProperties);
  const selectedTab = reduxState.selectedTab;
  const dispatch = useDispatch();

  const isActive = selectedTab === props.tab;

  return (
    <div
      className="flex items-center justify-center p-2 cursor-pointer group"
      onClick={() => {
        dispatch(setSelectedTab(props.tab));
        redirect(props.url);
      }}
    >
      <div
        className={`flex items-center justify-center w-[42px] h-[42px] rounded-lg transition-all duration-200 
          ${isActive ? 'bg-orbit-marine text-white' : 'bg-transparent group-hover:bg-clientColors-button-hover'}`}
      >
        {props.icon}
      </div>
    </div>
  );
}


function UpdateAvailableItem() {
    const reduxState = useSelector((state: RootState) => state.windowProperties);
    const hideUpdateNotifications = reduxState.clientSettings?.hideUpdateNotifications ?? false;
    
    if (reduxState.updateInfo !== null && !hideUpdateNotifications) {
        return (
<div
      className="flex items-center justify-center p-2 cursor-pointer group"
      onClick={() => {
        const url = reduxState.updateInfo?.html_url;
        if (url) window.open(url, "_blank");
      }}
      aria-label="Open latest release notes"
    >
      <div
        className={`flex items-center justify-center w-[42px] h-[42px] rounded-lg transition-all duration-200 bg-transparent group-hover:bg-orbit-mint/20`}
      >
        <div className="relative">
          <IcoRefresh />
          <span className="absolute bottom-0 right-0 flex h-[10px] w-[10px]">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orbit-mint opacity-75"></span>
            <span className="relative inline-flex rounded-full h-full w-full bg-orbit-mint"></span>
          </span>
        </div>
      </div>
    </div>
        );
    }
}


export default function SideBar() {

    const notRoundedPaths: AvailableTabs[] = ['settings'];
    const selectedTab = useSelector((state: RootState) => state.windowProperties.selectedTab);

    return (
        <div className={`h-full flex flex-col justify-between bg-orbit-carbon ${notRoundedPaths.includes(selectedTab) ? 'rounded-t-xl' : 'rounded-tl-xl'}`}>
            <div>
                {SideBarItems.filter(item => item.tab !== 'settings').map((item, index) => (
                    <SideBarItem
                        key={index}
                        icon={item.icon}
                        url={item.url}
                        tab={item.tab}
                    />
                ))}
            </div>
            <div>
                {SideBarItems.filter(item => item.tab === 'settings').map((item, index) => (
                    <SideBarItem
                        key={index}
                        icon={item.icon}
                        url={item.url}
                        tab={item.tab}
                    />
                ))}
                <UpdateAvailableItem />
            </div>
        </div>
    );
}
