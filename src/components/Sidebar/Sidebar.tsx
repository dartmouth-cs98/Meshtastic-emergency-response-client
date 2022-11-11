import React, { useEffect, useState } from "react";
import LogoWhiteSVG from "@app/assets/Mesh_Logo_White.svg";
import SidebarIcon from "@components/Sidebar/SidebarIcon";
import {
  ChatBubbleBottomCenterTextIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  Cog8ToothIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { selectAllDevices } from "@app/features/device/deviceSelectors";
import { createDeviceAction } from "@features/device/deviceActions";
import { invoke } from "@tauri-apps/api/tauri";
import { selectAllNodes } from "@app/features/device/deviceSelectors";
import type { INode } from "@features/device/deviceSlice";
import { getDemoData } from "./DemoData";
import type { Protobuf } from "@meshtastic/meshtasticjs/dist/";

export enum ActiveTab {
  MAP,
  CHAT,
  INFO,
  SETTINGS,
  NONE,
}

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.MAP);

  const dispatch = useDispatch();
  const devices = useSelector(selectAllDevices());
  const nodes = useSelector(selectAllNodes());

  // Logging only, no necessary functionality
  useEffect(() => {
    console.log(devices);
  }, [devices]);

  const requestDeviceConnection = () => {
    const id = 1;
    dispatch(createDeviceAction(id));
  };

  const requestTestCommand = () => {
    const nodeList: Protobuf.NodeInfo[] = getDemoData();
    console.log(nodeList);
    console.log("Sending test command...");
    const addr = new Uint8Array(6);
    const usr = {
      id: "node1",
      long_name: "Node 1",
      short_name: "N1",
      macaddr: addr,
      hw_model: 0,
      is_licensed: false,
    };
    invoke("test_command", {
      nodes: usr,
    })
      .then((res) => {
        console.log(res);
      })
      .catch(console.error);
  };

  return (
    <div className="h-screen flex flex-col justify-between shadow-lg">
      <div>
        <div className="flex bg-gray-800 w-14 h-14">
          <img src={LogoWhiteSVG} className="m-auto pl-2 pr-2 pt-3 pb-3"></img>{" "}
        </div>
        <div className="flex flex-col">
          <SidebarIcon
            isActive={activeTab == ActiveTab.MAP}
            setTabActive={() => setActiveTab(ActiveTab.MAP)}
            renderIcon={() => <MagnifyingGlassIcon className="" />}
          />
          <SidebarIcon
            isActive={activeTab == ActiveTab.CHAT}
            setTabActive={() => setActiveTab(ActiveTab.CHAT)}
            renderIcon={() => <ChatBubbleBottomCenterTextIcon className="" />}
          />
          <SidebarIcon
            isActive={activeTab == ActiveTab.INFO}
            setTabActive={() => setActiveTab(ActiveTab.INFO)}
            renderIcon={() => <DocumentTextIcon className="" />}
          />
          <SidebarIcon
            isActive={activeTab == ActiveTab.NONE}
            setTabActive={requestDeviceConnection}
            renderIcon={() => <LinkIcon className="" />}
          />
          <SidebarIcon
            isActive={activeTab == ActiveTab.NONE}
            setTabActive={requestTestCommand}
            renderIcon={() => <LinkIcon className="" />}
          />
        </div>
      </div>
      <SidebarIcon
        isActive={activeTab == ActiveTab.SETTINGS}
        setTabActive={() => setActiveTab(ActiveTab.SETTINGS)}
        renderIcon={() => <Cog8ToothIcon className="" />}
      />
    </div>
  );
};

export default Sidebar;
