// src/pages/Dashboard.jsx

import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  BellIcon,
  CalendarIcon,
  ChartPieIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
  BuildingOfficeIcon,
  CubeIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../slices/authSlice";
import logo from "../assets/logo.png";
import Dashheader from "../components/Dashheader";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "Team", href: "/dashboard/team", icon: UsersIcon },
  { name: "Firms", href: "/dashboard/firms", icon: BuildingOfficeIcon },
  { name: "Brands", href: "/dashboard/brands", icon: TagIcon },
  { name: "Products", href: "/dashboard/products", icon: CubeIcon },
  { name: "Purchases", href: "/dashboard/purchases", icon: ShoppingCartIcon },
  { name: "Sales", href: "/dashboard/sales", icon: CurrencyDollarIcon },
  { name: "Calendar", href: "/dashboard/calendar", icon: CalendarIcon },
  { name: "Reports", href: "/dashboard/reports", icon: ChartPieIcon },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const logoutHandler = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  return (
    <>
      <div>
        {/* Mobile Sidebar */}
        <Transition.Root show={sidebarOpen} as={React.Fragment}>
          <Dialog
            as="div"
            className="relative z-50 lg:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={React.Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={React.Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex flex-col w-full max-w-xs px-6 pb-4 overflow-y-auto bg-gray-900">
                  <div className="flex items-center h-16 shrink-0">
                    <img
                      alt="Your Company"
                      src={logo}
                      className="w-auto h-8 rounded-full"
                    />
                  </div>
                  <nav className="flex flex-col flex-1 mt-5">
                    <ul role="list" className="flex flex-col flex-1 gap-y-7">
                      {navigation.map((item) => (
                        <li key={item.name}>
                          <NavLink
                            to={item.href}
                            className={({ isActive }) =>
                              classNames(
                                isActive
                                  ? "bg-gray-800 text-white"
                                  : "text-gray-400 hover:bg-gray-800 hover:text-white",
                                "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                              )
                            }
                          >
                            <item.icon
                              aria-hidden="true"
                              className="w-6 h-6 shrink-0"
                            />
                            {item.name}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </nav>
                  <div className="absolute top-0 right-0 pt-5 pr-5">
                    <button
                      type="button"
                      onClick={() => setSidebarOpen(false)}
                      className="-m-2.5 p-2.5 text-white"
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon aria-hidden="true" className="w-6 h-6" />
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Desktop Sidebar */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          <div className="flex flex-col px-6 pb-4 overflow-y-auto bg-gray-900 grow gap-y-5">
            <div className="flex items-center h-16 shrink-0">
              <img
                alt="Your Company"
                src={logo}
                className="w-auto h-8 rounded-full"
              />
            </div>
            <nav className="flex flex-col flex-1 mt-5">
              <ul role="list" className="flex flex-col flex-1 gap-y-7">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <NavLink
                      to={item.href}
                      className={({ isActive }) =>
                        classNames(
                          isActive
                            ? "bg-gray-800 text-white"
                            : "text-gray-400 hover:bg-gray-800 hover:text-white",
                          "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                        )
                      }
                    >
                      <item.icon
                        aria-hidden="true"
                        className="w-6 h-6 shrink-0"
                      />
                      {item.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:pl-72">
          <div className="sticky top-0 z-40 flex items-center h-16 px-4 bg-white border-b border-gray-200 shadow-sm shrink-0 gap-x-4 sm:gap-x-6 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon aria-hidden="true" className="w-6 h-6" />
            </button>

            <div
              aria-hidden="true"
              className="w-px h-6 bg-gray-900/10 lg:hidden"
            />

            <div className="flex self-stretch flex-1 gap-x-4 lg:gap-x-6">
              <form action="#" method="GET" className="relative flex flex-1">
                <label htmlFor="search-field" className="sr-only">
                  Search
                </label>
                <MagnifyingGlassIcon
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-5 h-full text-gray-400 pointer-events-none"
                />
                <input
                  id="search-field"
                  name="search"
                  type="search"
                  placeholder="Search..."
                  className="block w-full h-full py-0 pl-8 pr-0 text-gray-900 border-0 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                />
              </form>
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                <button
                  type="button"
                  className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon aria-hidden="true" className="w-6 h-6" />
                </button>

                {/* Profile dropdown */}
                <Menu as="div" className="relative">
                  <Menu.Button className="-m-1.5 flex items-center p-1.5">
                    <span className="sr-only">Open user menu</span>
                    <img
                      alt="User"
                      src="https://firebasestorage.googleapis.com/v0/b/musco-store.appspot.com/o/avatar%20any.jpg?alt=media&token=a532f755-f98d-4f0a-9eca-fe9d6af3acba"
                      className="w-8 h-8 rounded-full bg-gray-50"
                    />
                    <span className="hidden lg:flex lg:items-center">
                      <span className="ml-4 text-sm font-semibold leading-6 text-gray-900">
                        {userInfo ? userInfo.username : "Guest"}
                      </span>
                      <ChevronDownIcon
                        aria-hidden="true"
                        className="w-5 h-5 ml-2 text-gray-400"
                      />
                    </span>
                  </Menu.Button>
                  <Transition
                    as={React.Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <NavLink
                            to="/dashboard/profile"
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-3 py-1 text-sm leading-6 text-gray-900"
                            )}
                          >
                            Your profile
                          </NavLink>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={logoutHandler}
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-3 py-1 text-sm leading-6 text-gray-900 w-full text-left"
                            )}
                          >
                            Logout
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <main className="py-10 mx-1 large:w-[80vw] w-[90vw]">
            {/* Dashheader component */}
            <Dashheader />
            <div className="px-4 sm:px-6 lg:px-8">
              {/* Render nested routes here */}
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
