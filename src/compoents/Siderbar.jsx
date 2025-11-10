// src/components/Sidebar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

import { HiMenuAlt3 } from "react-icons/hi";
import {
  MdOutlineDashboard,
  MdOutlineCategory,
  MdOutlinePersonPinCircle,
  MdDeliveryDining,
} from "react-icons/md";
import { RiArrowDropDownLine, RiAdminLine } from "react-icons/ri";
import { BiSolidCategory } from "react-icons/bi";
import { GiCardPickup } from "react-icons/gi";
import { PiFlagBannerFill } from "react-icons/pi";
import { LuAlarmClockCheck } from "react-icons/lu";
import { FaTruckPickup, FaUser } from "react-icons/fa6";
import { IoDocumentTextOutline, IoDocumentLockOutline } from "react-icons/io5";

const Sidebar = () => {
  const { hasPermission } = useAuth();
  const [open, setOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeSubMenu, setActiveSubMenu] = useState(null);

  const navigate = useNavigate();

  const menus = [
    { name: "Dashboard", link: "/home", icon: MdOutlineDashboard },

    {
      name: "Banner",
      icon: PiFlagBannerFill,
      dropdownIcon: RiArrowDropDownLine,
      subMenus: [
        { name: "Banner", link: "/home/Banner" },
        { name: "Banner Logs", link: "/home/BannerLogs" },
      ],
    },

    {
      name: "Category",
      icon: MdOutlineCategory,
      dropdownIcon: RiArrowDropDownLine,
      subMenus: [
        { name: "Category", link: "/home/Category" },
        { name: "Category Logs", link: "/home/CategoryLogs" },
      ],
    },

    {
      name: "Sub Category",
      icon: BiSolidCategory,
      dropdownIcon: RiArrowDropDownLine,
      subMenus: [
        { name: "Sub Category", link: "/home/SubCategory" },
        { name: "Sub Category Logs", link: "/home/SubCategoryLogs" },
      ],
    },

    {
      name: "Daily",
      icon: GiCardPickup,
      dropdownIcon: RiArrowDropDownLine,
      subMenus: [
        { name: "Daily Tips", link: "/home/dailyTips" },
        { name: "Daily Tips Logs", link: "/home/dailyTipsLogs" },
      ],
    },

    {
      name: "Platform Setting",
      icon: RiAdminLine,
      dropdownIcon: RiArrowDropDownLine,
      subMenus: [
        { name: "Platform Setting", link: "/home/PlatformSetting" },
        { name: "Platform Setting Logs", link: "/home/PlatformSettingLogs" },
      ],
    },

    {
      name: "Pickup Boy",
      icon: MdDeliveryDining,
      dropdownIcon: RiArrowDropDownLine,
      subMenus: [
        { name: "Pickup Boy", link: "/home/DeliveryBoy" },
        { name: "Pickup Boy Logs", link: "/home/DeliveryBoyLogs" },
      ],
    },

    {
      name: "User",
      icon: FaUser,
      dropdownIcon: RiArrowDropDownLine,
      subMenus: [
        { name: "User", link: "/home/User" },
        { name: "User Logs", link: "/home/UserLogs" },
      ],
    },

    {
      name: "Request Pickup",
      link: "/home/RequestPickup",
      icon: FaTruckPickup,
    },
    {
      name: "Latest Pickup",
      link: "/home/LatestPickup",
      icon: LuAlarmClockCheck,
    },

    {
      name: "Locality",
      icon: MdOutlinePersonPinCircle,
      dropdownIcon: RiArrowDropDownLine,
      subMenus: [
        { name: "Locality", link: "/home/Locality" },
        { name: "Locality Logs", link: "/home/LocalityLogs" },
      ],
    },

    {
      name: "Term Condition",
      link: "/home/termCondition",
      icon: IoDocumentTextOutline,
    },
    {
      name: "Privacy Policy",
      link: "/home/privacyPolicy",
      icon: IoDocumentLockOutline,
    },
    {
      name: "AboutUs",
      link: "/home/aboutUs",
      icon: IoDocumentLockOutline,
    },
  ];

  const filteredMenus = menus
    .map((menu) => {
      if (!menu.subMenus) return menu;
      const visible = menu.subMenus.filter(
        (s) => !s.sectionName || hasPermission(s.sectionName, "read")
      );
      return visible.length ? { ...menu, subMenus: visible } : null;
    })
    .filter(Boolean);

  const handleMenuClick = (index) => {
    setActiveMenu(activeMenu === index ? null : index);
    setActiveSubMenu(null);
  };

  const handleSubMenuClick = (index, subIndex) => {
    setActiveSubMenu(activeSubMenu === subIndex ? null : subIndex);
    setActiveMenu(index);
  };

  return (
    <section className="flex">
      <div className="relative">
        {/* Sidebar */}
        <aside
          className={`sidebar-gradient h-screen shadow-lg
          ${
            open ? "w-[260px]" : "w-16"
          } duration-500 text-white flex flex-col px-4`}
        >
          {/* Logo */}
          <div className="flex flex-col items-center justify-center mt-4 mb-4">
            <img
              src="/images/wedding-logo.png"
              className={`rounded-full transition-all duration-500 ${
                open ? "w-28" : "w-10"
              }`}
            />

            <h1
              className={`mt-3 text-center font-bold text-lg transition-all duration-700
                ${
                  open
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-10 hidden"
                }
              `}
            >
              Waste Collection
            </h1>

            {/* Toggle Button */}
            <HiMenuAlt3
              size={28}
              className="mt-4 p-1 rounded-full bg-[#1F4926] bg-opacity-80 cursor-pointer hover:scale-110 hover:bg-opacity-100 transition-all duration-200 shadow-lg"
              onClick={() => {
                setOpen(!open);
                setActiveMenu(null);
              }}
            />
          </div>

          {/* Menu */}
          <div className="flex-1 sidebar-scroll overflow-y-auto mt-4 pr-1 pb-4">
            {filteredMenus.map((menu, index) => (
              <div key={index}>
                {/* Dropdown Menus */}
                {menu.subMenus ? (
                  <>
                    {/* Menu Row */}
                    <div
                      onClick={() => {
                        if (!open) {
                          if (menu.subMenus && menu.subMenus.length > 0) {
                            navigate(menu.subMenus[0].link);
                          }
                        } else {
                          handleMenuClick(index);
                        }
                      }}
                      className={`group flex items-center rounded-md cursor-pointer menu-item mb-1
                        ${
                          activeMenu === index
                            ? "bg-[#1F4926] bg-opacity-80 shadow-md"
                            : "hover:bg-[#1F4926] hover:bg-opacity-60"
                        }
                        ${
                          open
                            ? "p-3 w-full justify-between"
                            : "w-full h-12 justify-center"
                        }
                      `}
                    >
                      {/* ICON + TEXT */}
                      <div
                        className={`flex items-center gap-3 ${
                          !open ? "justify-center" : ""
                        }`}
                      >
                        <menu.icon size={20} />

                        <span
                          className={`whitespace-pre duration-300
                            ${
                              open
                                ? "opacity-100 translate-x-0"
                                : "opacity-0 -translate-x-6 hidden"
                            }
                          `}
                        >
                          {menu.name}
                        </span>
                      </div>

                      {/* Dropdown Arrow */}
                      {open && menu.dropdownIcon && (
                        <menu.dropdownIcon
                          size={22}
                          className={`transition-transform duration-300 
                            ${activeMenu === index ? "rotate-180" : ""}
                          `}
                        />
                      )}

                      {/* Tooltip */}
                      {!open && (
                        <span className="absolute left-16 bg-gray-800 text-white px-3 py-2 text-sm rounded-lg opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 shadow-lg transition-opacity duration-200">
                          {menu.name}
                        </span>
                      )}
                    </div>

                    {/* Submenus */}
                    <div
                      className={`overflow-hidden transition-all duration-300 
                        ${
                          activeMenu === index && open
                            ? "max-h-[500px] mt-1"
                            : "max-h-0"
                        }
                      `}
                    >
                      {menu.subMenus.map((sub, si) => (
                        <Link
                          key={si}
                          to={sub.link}
                          onClick={() => handleSubMenuClick(index, si)}
                          className="block text-sm py-3 pl-12 pr-3 hover:bg-[#1F4926] hover:bg-opacity-60 rounded-md mb-1 menu-item transition-all duration-200"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  /* Normal menu (Dashboard, Privacy, etc.) */
                  <Link
                    to={menu.link}
                    onClick={() => setActiveMenu(index)}
                    className={`group flex items-center rounded-md cursor-pointer menu-item mb-1
                      ${
                        activeMenu === index
                          ? "bg-[#1F4926] bg-opacity-80 shadow-md"
                          : "hover:bg-[#1F4926] hover:bg-opacity-60"
                      }
                      ${
                        open
                          ? "p-3 w-full gap-3 justify-start"
                          : "w-full h-12 justify-center"
                      }
                    `}
                  >
                    <menu.icon size={20} />

                    <span
                      className={`whitespace-pre duration-300
                        ${
                          open
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 -translate-x-6 hidden"
                        }
                      `}
                    >
                      {menu.name}
                    </span>

                    {/* Tooltip */}
                    {!open && (
                      <span className="absolute left-16 bg-gray-800 text-white px-3 py-2 text-sm rounded-lg opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 shadow-lg transition-opacity duration-200">
                        {menu.name}
                      </span>
                    )}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </aside>
      </div>

      <section className="w-full"></section>
    </section>
  );
};

export default Sidebar;
