// src/components/Sidebar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

import { HiMenuAlt3 } from "react-icons/hi";
import { MdOutlineDashboard } from "react-icons/md";
import { RiArrowDropDownLine } from "react-icons/ri";
import { IoMdHome } from "react-icons/io";
import { FaBlog } from "react-icons/fa6";
import { TbZodiacTaurus } from "react-icons/tb";
import { LiaStreetViewSolid } from "react-icons/lia";
import { FaUserShield } from "react-icons/fa6";
import { ImUserPlus } from "react-icons/im";
import { BiRupee } from "react-icons/bi";
import { TbTransactionRupee } from "react-icons/tb";
import { FaImage } from "react-icons/fa";
import { FaHandshakeSimple } from "react-icons/fa6";
import { RiAdminLine } from "react-icons/ri";
import { FaThumbsUp } from "react-icons/fa";
import { PiFlagBannerFill } from "react-icons/pi";
import { MdOutlineCategory } from "react-icons/md";
import { BiSolidCategory } from "react-icons/bi";
import { GiCardPickup } from "react-icons/gi";
import { FaTruckPickup } from "react-icons/fa6";
import { LuAlarmClockCheck } from "react-icons/lu";
import { MdDeliveryDining } from "react-icons/md";
import { IoDocumentTextOutline } from "react-icons/io5";
import { RiGitRepositoryPrivateLine } from "react-icons/ri";
import { MdOutlinePersonPinCircle } from "react-icons/md";
import { IoDocumentLockOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
const Sidebar = () => {
  const { hasPermission } = useAuth();
  const [open, setOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeSubMenu, setActiveSubMenu] = useState(null);

  const menus = [
    { name: "Dashboard", link: "/home", icon: MdOutlineDashboard },

    // {
    //   name: "CMS",
    //   icon: IoMdHome,
    //   dropdownIcon: RiArrowDropDownLine,
    //   subMenus: [{ name: "Banner", link: "/home/banner" }],
    // },

    // {
    //   name: "Master Services",
    //   icon: TbZodiacTaurus,
    //   dropdownIcon: RiArrowDropDownLine,
    //   subMenus: [
    //     {
    //       name: "Skill",
    //       link: "/home/skill",
    //     },
    //     {
    //       name: "Language",
    //       link: "/home/Language",
    //     },
    //   ],
    // },
    // { name: "Customer", link: "/home/Customer", icon: FaBlog },
    // {
    //   name: "Astrologer",
    //   link: "/home/astrologer",
    //   icon: LiaStreetViewSolid,
    // },
    // { name: "Role", link: "/home/role", icon: FaUserShield, sectionName: "Role" },
    // { name: "Member", link: "/home/member", icon: ImUserPlus, sectionName: "Member" },
    // { name: "Recharge Plans", link: "/home/recharge", icon: BiRupee, sectionName: "Recharge Plans" },
    // { name: "Transaction", link: "/home/transaction", icon: TbTransactionRupee, sectionName: "Transaction" },
    // { name: "ImageUploader", link: "/home/imageuploader", icon: FaImage, sectionName: "ImageUploader" },
    // { name: "Settlement", link: "/home/settlement", icon: FaHandshakeSimple, sectionName: "Settlement" },
    // {
    //   name: "User",
    //   link: "/home/user",
    //   icon: RiAdminLine,
    // },

    {
      name: "Banner",
      icon: PiFlagBannerFill,
      dropdownIcon: RiArrowDropDownLine,
      subMenus: [
        {
          name: "Banner",
          link: "/home/Banner",
          // sectionName: "Banner"
        },
        {
          name: "Banner Logs",
          link: "/home/BannerLogs",
          // sectionName: "Banner Logs",
        },
      ],
    },
    {
      name: "Category",
      icon: MdOutlineCategory,
      dropdownIcon: RiArrowDropDownLine,
      subMenus: [
        {
          name: "Category",
          link: "/home/Category",
          // sectionName: "Category"
        },
        {
          name: "Category Logs",
          link: "/home/CategoryLogs",
          // sectionName: "Category Logs",
        },
      ],
    },
    {
      name: "Sub Category",
      icon: BiSolidCategory,
      dropdownIcon: RiArrowDropDownLine,
      subMenus: [
        {
          name: "Sub Category",
          link: "/home/SubCategory",
          // sectionName: "Sub Category",
        },
        {
          name: "Sub Category Logs",
          link: "/home/SubCategoryLogs",
          // sectionName: "Sub Category Logs",
        },
      ],
    },
    {
      name: "Daily",
      icon: GiCardPickup,
      dropdownIcon: RiArrowDropDownLine,
      subMenus: [
        {
          name: "Daily Tips",
          link: "/home/dailyTips",
          // sectionName: "Daily Tips",
        },
        {
          name: "Daily Tips Logs",
          link: "/home/dailyTipsLogs",
          // sectionName: "Daily Tips Logs",
        },
      ],
    },
    {
      name: "Platform Setting",
      icon: RiAdminLine,
      dropdownIcon: RiArrowDropDownLine,
      subMenus: [
        {
          name: "Platform Setting",
          link: "/home/PlatformSetting",
          // sectionName: "Platform Setting",
        },
        {
          name: "Platform Setting Logs",
          link: "/home/PlatformSettingLogs",
          // sectionName: "Platform Setting Logs",
        },
      ],
    },
    // {
    //   name: "Request Pickup",
    //   icon: FaTruckPickup,
    //   dropdownIcon: RiArrowDropDownLine,
    //   subMenus: [
    //     {
    //       name: "Request Pickup",
    //       link: "/home/RequestPickup",
    //       // sectionName: "Request Pickup",
    //     },
    //     {
    //       name: "Request Pickup Logs",
    //       link: "/home/RequestPickupLogs",
    //       // sectionName: "Request Pickup Logs",
    //     },
    //   ],
    // },
    // {
    //   name: "Latest Pickup",
    //   icon: LuAlarmClockCheck,
    //   dropdownIcon: RiArrowDropDownLine,
    //   subMenus: [
    //     {
    //       name: "Latest Pickup",
    //       link: "/home/LatestPickup",
    //       // sectionName: "Latest Pickup",
    //     },
    //     {
    //       name: "Latest Pickup Logs",
    //       link: "/home/LatestPickupLogs",
    //       // sectionName: "Latest Pickup Logs",
    //     },
    //   ],
    // },
    {
      name: "Pickup Boy",
      icon: MdDeliveryDining,
      dropdownIcon: RiArrowDropDownLine,
      subMenus: [
        {
          name: "Pickup Boy",
          link: "/home/DeliveryBoy",
          // sectionName: "Pickup Boy",
        },
        {
          name: "Pickup Boy Logs",
          link: "/home/DeliveryBoyLogs",
          // sectionName: "Pickup Boy Logs",
        },
      ],
    },
    {
      name: "User",
      icon: FaUser,
      dropdownIcon: RiArrowDropDownLine,
      subMenus: [
        {
          name: "User",
          link: "/home/User",
          // sectionName: "Locality"
        },
        {
          name: "User Logs",
          link: "/home/UserLogs",
          // sectionName: "Locality Logs",
        },
      ],
    },
    {
      name: "Request Pickup",
      link: "/home/RequestPickup",
      icon: FaTruckPickup,
    },
    {
      name: "Latest Pickup ",
      link: "/home/LatestPickup",
      icon: LuAlarmClockCheck,
    },
    {
      name: "Locality",
      icon: MdOutlinePersonPinCircle,
      dropdownIcon: RiArrowDropDownLine,
      subMenus: [
        {
          name: "Locality",
          link: "/home/Locality",
          // sectionName: "Locality"
        },
        {
          name: "Locality Logs",
          link: "/home/LocalityLogs",
          // sectionName: "Locality Logs",
        },
      ],
    },
    // {
    //   name: "Term Condition",
    //   icon: IoDocumentTextOutline,
    //   dropdownIcon: RiArrowDropDownLine,
    //   subMenus: [
    //     {
    //       name: "Term Condition",
    //       link: "/home/termCondition",
    //       // sectionName: "Term Condition",
    //     },
    //     {
    //       name: "Term Condition Logs",
    //       link: "/home/termConditionLogs",
    //       // sectionName: "Term Condition Logs",
    //     },
    //   ],
    // },
    // {
    //   name: "Privacy Policy",
    //   icon: IoDocumentLockOutline,
    //   dropdownIcon: RiArrowDropDownLine,
    //   subMenus: [
    //     {
    //       name: "Privacy Policy",
    //       link: "/home/privacyPolicy",
    //       // sectionName: "Privacy Policy",
    //     },
    //     {
    //       name: "Privacy Policy Logs",
    //       link: "/home/privacyPolicyLogs",
    //       // sectionName: "Privacy Policy Logs",
    //     },
    //   ],
    // },
    {
      name: "Term Condition ",
      link: "/home/termCondition",
      icon: IoDocumentTextOutline,
    },
    {
      name: "Privacy Policy ",
      link: "/home/privacyPolicy",
      icon: IoDocumentLockOutline,
    },
    //  { name: "Rating", link: "/home/rating", icon: FaThumbsUp, sectionName: "Rating" },
  ];

  // Filter menus and submenus by read permission
  const filteredMenus = menus
    .map((menu) => {
      if (menu.subMenus) {
        const visibleSubs = menu.subMenus.filter(
          (sub) => !sub.sectionName || hasPermission(sub.sectionName, "read")
        );
        if (visibleSubs.length === 0) return null; // hide menu if no visible submenu
        return { ...menu, subMenus: visibleSubs };
      } else {
        // If main menu has sectionName, check permission
        if (menu.sectionName && !hasPermission(menu.sectionName, "read"))
          return null;
        return menu;
      }
    })
    .filter(Boolean); // Remove nulls

  const handleMenuClick = (index) => {
    setActiveMenu(activeMenu === index ? null : index);
    setActiveSubMenu(null);
  };

  const handleSubMenuClick = (index, subIndex) => {
    setActiveSubMenu(subIndex === activeSubMenu ? null : subIndex);
    setActiveMenu(index);
  };

  return (
    <div>
      <section className="flex ">
        <div className="relative">
          {/* Sidebar */}
          <div
            className={`bg-gradient-to-t from-[#45d85e] to-[#1F4926] h-screen ${
              open ? "w-[260px]" : "w-16"
            } duration-500 text-white px-4 flex flex-col`}
          >
            {/* Logo */}
            <div className="flex flex-col items-center justify-center py-1 mt-2 overflow-hidden">
              <img
                src="/images/wedding-logo.png"
                alt="Logo"
                className={`rounded-full object-contain transition-all duration-500 ${
                  open ? "w-34" : "w-10"
                }`}
              />
              <h1
                className={`mt-3 text-center font-bold text-lg bg-opacity-20 backdrop-blur-md px-4 py-1 rounded-lg shadow-md text-white  transform transition-all duration-900 ${
                  open
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-40 opacity-0"
                }`}
              >
                Waste Collection
              </h1>
            </div>

            {/* Menu */}
            <div className="flex-1 overflow-y-scroll sidebar-scroll pr-2">
              <div className="mt-3 flex flex-col gap-2.5 mb-4 relative">
                {filteredMenus.map((menu, index) => (
                  <div key={index}>
                    {menu.subMenus ? (
                      <div
                        className={`group flex items-center justify-between text-sm gap-3.5 font-medium p-2 rounded-md cursor-pointer ${
                          activeMenu === index
                            ? "bg-[#1F4926]"
                            : "hover:bg-[#1F4926]"
                        }`}
                        onClick={() => handleMenuClick(index)}
                      >
                        <div className="flex items-center gap-3">
                          <div>
                            {React.createElement(menu.icon, { size: "20" })}
                          </div>
                          <h2
                            style={{ transitionDelay: `${index + 3}00ms` }}
                            className={`whitespace-pre duration-500 ${
                              !open &&
                              "opacity-0 translate-x-28 overflow-hidden"
                            }`}
                          >
                            {menu.name}
                          </h2>
                        </div>

                        {open && menu.dropdownIcon && (
                          <menu.dropdownIcon
                            size={24}
                            className={`text-white transition-transform duration-300 ${
                              activeMenu === index ? "rotate-180" : "rotate-0"
                            }`}
                          />
                        )}

                        <h2
                          className={`${
                            open && "hidden"
                          } absolute left-48 bg-white font-semibold whitespace-pre text-white rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit`}
                        >
                          {menu.name}
                        </h2>
                      </div>
                    ) : (
                      <Link
                        to={menu.link}
                        className={`group flex items-center text-sm gap-3.5 font-medium p-2 rounded-md ${
                          activeMenu === index
                            ? "bg-[#1F4926]"
                            : "hover:bg-[#ffff]"
                        }`}
                        onClick={() => setActiveMenu(index)}
                      >
                        <div>
                          {React.createElement(menu.icon, { size: "20" })}
                        </div>
                        <h2
                          style={{ transitionDelay: `${index + 3}00ms` }}
                          className={`whitespace-pre duration-500 ${
                            !open && "opacity-0 translate-x-28 overflow-hidden"
                          }`}
                        >
                          {menu.name}
                        </h2>

                        <h2
                          className={`${
                            open && "hidden"
                          } absolute left-48 bg-[#1F4926] font-semibold whitespace-pre text-blaxk rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit`}
                        >
                          {menu.name}
                        </h2>
                      </Link>
                    )}

                    {/* Submenus */}
                    {menu.subMenus && (
                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          activeMenu === index ? "max-h-[500px]" : "max-h-0"
                        }`}
                      >
                        {menu.subMenus.map((subMenu, subIndex) => (
                          <Link
                            to={subMenu.link}
                            key={subIndex}
                            className={`flex items-center gap-4 text-white text-sm py-2 pl-12 pr-4 cursor-pointer hover:text-lg rounded-md ${
                              activeSubMenu === subIndex
                            }`}
                            onClick={() => handleSubMenuClick(index, subIndex)}
                          >
                            {subMenu.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Toggle Button */}
            <HiMenuAlt3
              size={26}
              className="absolute top-15 right-4 hover:bg-[#1F4926] size-8 text-white rounded-full p-1 cursor-pointer"
              onClick={() => {
                setOpen(!open);
                setActiveMenu(null); // Close the menu when toggling the sidebar
              }}
            />
          </div>
        </div>

        {/* Main Content placeholder */}
        <section className="w-full">{/* children or main content */}</section>
      </section>
    </div>
  );
};

export default Sidebar;
