"use client";

import { clearTokenData } from "@/utils/tokenManager";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";

const LayoutComponents = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const LayoutWrapper: React.FC<P> = (props) => {
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const [isMobile, setIsMobile] = useState(false);
    const [userData, setUserData] = useState<string | null>(null);

    useEffect(() => {
      const storedUserData = localStorage.getItem("authUser");
      setUserData(storedUserData);

      if (!storedUserData) {
        setTimeout(() => {
          clearTokenData();
          router.push("/");
        }, 1000);
      }
    }, [router]);

    useLayoutEffect(() => {
      const checkIsMobile = () => {
        const isNowMobile = window.innerWidth < 768;
        setIsMobile(isNowMobile);

        setSidebarOpen((prev: any) => {
          if (!isNowMobile) return true;

          return prev;
        });
      };

      // Run only once initially
      checkIsMobile();

      // Throttle resize to avoid rapid toggles
      let resizeTimer: NodeJS.Timeout;
      const handleResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(checkIsMobile, 150);
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    const toggleSidebar = () => {
      setSidebarOpen(!sidebarOpen);
    };

    const handleLogout = () => {
      clearTokenData();
      window.location.reload();
      window.location.href = "/";
    };

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-30 print:hidden">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex w-64 items-start">
                {/* Hamburger menu for mobile */}
                {isMobile && (
                  <button
                    onClick={toggleSidebar}
                    className="p-1 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </button>
                )}
                {!isMobile && (
                  <img src="/file.svg" alt="Logo" className="h-8" />
                )}
              </div>

              <div className="flex items-center space-x-4 gap-4">
                {!isMobile && (
                  <>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 text-sm font-medium cursor-pointer text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Logout
                    </button>
                  </>
                )}
                <div className="relative group">
                  <button className="flex items-center space-x-1 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none">
                    <div
                      className={`text-left leading-tight ${
                        isMobile && "cursor-pointer"
                      }`}
                      onClick={() => {
                        isMobile ? router.replace("/user-profile") : null;
                      }}
                    >
                      <p className="truncate max-w-auto sm:max-w-none">
                        <span className="font-semibold">User:</span>{" "}
                        {userData || "Guest"}
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>
        {/* Main Content Layout: Sidebar fixed, main scrollable */}
        <div className="relative flex">
          {/* Main Content - offset by sidebar width on desktop */}
          <main
            className={`flex-1 h-[calc(100vh-70px)] overflow-y-auto bg-gray-50`}
          >
            <WrappedComponent {...props} />
          </main>
        </div>

        <footer className="fixed bottom-0 left-0 w-full bg-blue-400 text-center p-3 border-t">
          © 2025 My Website. All rights reserved.
        </footer>
      </div>
    );
  };

  // Set display name for debugging
  LayoutWrapper.displayName = `LayoutComponents(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return LayoutWrapper;
};

export default LayoutComponents;
