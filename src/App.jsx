import React from "react";
import { Toaster } from "react-hot-toast";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import Layout from "./layout/Layout";
import Dashboard from "./Pages/Dashborad/Dashboard";
import BannerList from "./Pages/Banner/BannerList";
import Login from "./loginpage/Login";
import ProtectedRoute from "./auth/ProtectedRoute";
import PageNotFound from "./Pages/PageNotFound";
import CreateBanner from "./Pages/Banner/CreateBanner";
import UpdateBanner from "./Pages/Banner/UpdateBanner";
import CategoryList from "./Pages/Category/CategoryList";
import CreateCategory from "./Pages/Category/CreateCategory";
import UpdateCategory from "./Pages/Category/UpdateCategory";
import SubCategoryList from "./Pages/SubCategory/SubCategoryList";
import CreateSubCatgeory from "./Pages/SubCategory/CreateSubCatgeory";
import UpdateSubCatgegory from "./Pages/SubCategory/UpdateSubCatgegory";
import DailyTipsList from "./Pages/dailyTips/DailyTipsList";
import CreateDailyTips from "./Pages/dailyTips/CreateDailyTips";
import UpdateDailyTips from "./Pages/dailyTips/UpdateDailyTips";
import PlatformSettingList from "./Pages/PlatformSetting/PlatformSettingList";
import UpdatePlatformSetting from "./Pages/PlatformSetting/UpdatePlatformSetting";
import RequestPickupList from "./Pages/RequestPickup/RequestPickupList";
import ViewRequestPickup from "./Pages/RequestPickup/ViewRequestPickup";
import LatestPickupList from "./Pages/LatestPickup/LatestPickupList";
import ViewLatestPickup from "./Pages/LatestPickup/ViewLatestPickup";
import DeliveryBoyList from "./Pages/DeliveryBoy/DeliveryBoyList";
import CreateDeliveryBoy from "./Pages/DeliveryBoy/CreateDeliveryBoy";
import UpdateDeliveyBoy from "./Pages/DeliveryBoy/UpdateDeliveyBoy";
import ViewDeliveyBoy from "./Pages/DeliveryBoy/ViewDeliveyBoy";
import LocalityList from "./Pages/Locality/LocalityList";
import CreateLocality from "./Pages/Locality/CreateLocality";
import UpdateLocality from "./Pages/Locality/UpdateLocality";
import TermConditionList from "./Pages/TermCondition/TermConditionList";
import PrivacyPolicy from "./Pages/privacyPolicy/PrivacyPolicy";
import BannerLogs from "./Pages/Banner/BannerLogs";
import ViewBannerLog from "./Pages/Banner/ViewBannerLog";
import CategoryLog from "./Pages/Category/CategoryLog";
import ViewCategoryLog from "./Pages/Category/ViewCategoryLog";
import SubCategoryLog from "./Pages/SubCategory/SubCategoryLog";
import ViewSubCategoryLog from "./Pages/SubCategory/ViewSubCategoryLog";
import DailyLog from "./Pages/dailyTips/DailyLog";
import ViewDailyLog from "./Pages/dailyTips/ViewDailyLog";
import PlatformLog from "./Pages/PlatformSetting/PlatformLog";
import ViewPlatFormLog from "./Pages/PlatformSetting/ViewPlatFormLog";
import LocalityLog from "./Pages/Locality/LocalityLog";
import ViewLocalityLog from "./Pages/Locality/ViewLocalityLog";
import PickupBoyLog from "./Pages/DeliveryBoy/PickupBoyLog";
import ViewPickupBoyLog from "./Pages/DeliveryBoy/ViewPickupBoyLog";
import UserList from "./Pages/User/UserList";
import CreateUser from "./Pages/User/CreateUser";
import UpdateUser from "./Pages/User/UpdateUser";
import UserLog from "./Pages/User/UserLog";
import ViewUserLog from "./Pages/User/ViewUserLog";
// import UserList from "./Pages/User/UserList";

// import PageNotFond from "./Pages/notFound/PageNotFond";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      //Banner
      { path: "Banner", element: <BannerList /> }, //BannerLogs
      { path: "BannerLogs/", element: <BannerLogs /> },
      { path: "BannerLogs/bannerLogView/:id", element: <ViewBannerLog /> },
      { path: "Banner/createbanner", element: <CreateBanner /> },
      { path: "Banner/updateBanner/:id", element: <UpdateBanner /> },

      //Category
      { path: "Category", element: <CategoryList /> },
      { path: "CategoryLogs", element: <CategoryLog /> },
      {
        path: "CategoryLogs/category-log-view/:id",
        element: <ViewCategoryLog />,
      },
      { path: "Category/createcategory", element: <CreateCategory /> },
      { path: "Category/updateCategory/:id", element: <UpdateCategory /> },
      //SubCategory
      { path: "SubCategory", element: <SubCategoryList /> },
      { path: "SubCategoryLogs", element: <SubCategoryLog /> },
      {
        path: "SubCategoryLogs/SubCategoryLogView/:id",
        element: <ViewSubCategoryLog />,
      },
      { path: "SubCategory/createsubcategory", element: <CreateSubCatgeory /> },
      {
        path: "SubCategory/updateSubcategory/:id",
        element: <UpdateSubCatgegory />,
      },

      //dailyTips
      { path: "dailyTips", element: <DailyTipsList /> },

      { path: "dailyTipsLogs", element: <DailyLog /> },
      { path: "dailyTipsLogs/DailyLogView/:id", element: <ViewDailyLog /> },
      { path: "dailyTips/createdailytip", element: <CreateDailyTips /> },
      { path: "dailyTips/updateDailyTip/:id", element: <UpdateDailyTips /> },
      //PlatformSetting
      { path: "PlatformSetting", element: <PlatformSettingList /> },
      { path: "PlatformSettingLogs", element: <PlatformLog /> },
      {
        path: "PlatformSettingLogs/PlatformSettingLogView/:id",
        element: <ViewPlatFormLog />,
      },
      {
        path: "PlatformSetting/updatePlatformSetting/:id",
        element: <UpdatePlatformSetting />,
      },

      //RequestPickup
      { path: "RequestPickup", element: <RequestPickupList /> },
      {
        path: "RequestPickup/requestPickupView/:id",
        element: <ViewRequestPickup />,
      },
      //LatestPickup
      { path: "LatestPickup", element: <LatestPickupList /> },
      {
        path: "LatestPickup/requestPickupView/:id",
        element: <ViewLatestPickup />,
      },

      //DeliveryBoy
      { path: "DeliveryBoy", element: <DeliveryBoyList /> },
      { path: "DeliveryBoyLogs", element: <PickupBoyLog /> },
      {
        path: "DeliveryBoyLogs/PickupBoyLogView/:id",
        element: <ViewPickupBoyLog />,
      },
      { path: "DeliveryBoy/createdeliveryboy", element: <CreateDeliveryBoy /> },
      {
        path: "DeliveryBoy/updateDeliveryBoy/:id",
        element: <UpdateDeliveyBoy />,
      },
      { path: "DeliveryBoy/deliveryboyView/:id", element: <ViewDeliveyBoy /> },

      //Locality
      { path: "Locality", element: <LocalityList /> },
      { path: "LocalityLogs", element: <LocalityLog /> },
      {
        path: "LocalityLogs/LocalityLogView/:id",
        element: <ViewLocalityLog />,
      },
      { path: "Locality/createLocality", element: <CreateLocality /> },
      { path: "Locality/updateLocality/:id", element: <UpdateLocality /> },

      //termCondition
      { path: "termCondition", element: <TermConditionList /> },
      { path: "privacyPolicy", element: <PrivacyPolicy /> },
      { path: "*", element: <PageNotFound /> },
      { path: "User", element: <UserList /> },
      { path: "UserLogs", element: <UserLog /> },
      { path: "UserLogs/UserLogView/:id", element: <ViewUserLog /> },
      { path: "User/createUser", element: <CreateUser /> },
      { path: "User/updateUser/:id", element: <UpdateUser /> },
    ],
  },

  // ✅ 404 for any top-level unmatched route like /abc
  // {
  //   path: "*",
  //   element: <PageNotFound />,
  // },
]);

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
};

export default App;
