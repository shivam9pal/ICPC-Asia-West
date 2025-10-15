"use client";

export default function Sidebar({ announcements = [] }) {
  return (
    <div className="w-full lg:w-80 lg:sticky lg:top-24 lg:self-start mt-6">
      <div className="bg-white border border-gray-300 shadow-sm">
        {announcements.length > 0 ? (
          announcements.map((announcement, index) => {
            const getColorClasses = (colorScheme) => {
              const colorMap = {
                red: {
                  bg: "bg-red-50",
                  text: "text-red-600",
                  textSecondary: "text-red-700",
                },
                green: {
                  bg: "bg-green-50",
                  text: "text-green-600",
                  textSecondary: "text-green-700",
                },
                orange: {
                  bg: "bg-orange-50",
                  text: "text-orange-600",
                  textSecondary: "text-orange-700",
                },
                blue: {
                  bg: "bg-blue-50",
                  text: "text-blue-600",
                  textSecondary: "text-blue-700",
                },
                gray: {
                  bg: "bg-gray-50",
                  text: "text-gray-600",
                  textSecondary: "text-gray-700",
                },
              };
              return colorMap[colorScheme] || colorMap.blue;
            };

            const colors = getColorClasses(announcement.color_scheme);
            const isLast = index === announcements.length - 1;

            const AnnouncementContent = () => (
              <>
                <h3
                  className={`font-bold ${colors.text} text-sm ${
                    announcement.content.includes("\n") ? "mb-2" : ""
                  }`}
                >
                  {announcement.title}
                </h3>
                {announcement.content !== announcement.title && (
                  <div
                    className={`${colors.textSecondary} text-sm whitespace-pre-line`}
                  >
                    {announcement.content}
                  </div>
                )}
              </>
            );

            if (announcement.url) {
              return (
                <a
                  key={announcement.id}
                  href={announcement.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${colors.bg} p-3 ${
                    !isLast ? "border-b border-gray-200" : ""
                  } block hover:opacity-80 transition-opacity cursor-pointer`}
                >
                  <AnnouncementContent />
                </a>
              );
            }

            return (
              <div
                key={announcement.id}
                className={`${colors.bg} p-3 ${
                  !isLast ? "border-b border-gray-200" : ""
                }`}
              >
                <AnnouncementContent />
              </div>
            );
          })
        ) : (
          // Fallback content
          <>
            <div className="bg-red-50 p-3 border-b border-gray-200">
              <h3 className="font-bold text-red-600 text-sm">
                🏆 AWC Problem Set (2024-25)
              </h3>
            </div>
            <div className="bg-green-50 p-3 border-b border-gray-200">
              <h3 className="font-bold text-green-600 text-sm">
                List of Selected Teams for Asia West Continent Championship
                2024-25
              </h3>
            </div>
            <div className="bg-orange-50 p-3 border-b border-gray-200">
              <h3 className="font-bold text-orange-600 text-sm">
                Asia West Continent Championship 2024-25 will be held at
                Mathura, Dhaka, Topi, and Tehran on March 7-8, 2025.
              </h3>
            </div>
            <div className="bg-gray-50 p-3 border-b border-gray-200">
              <h3 className="font-bold text-gray-700 text-sm mb-2">
                ICPC Global
              </h3>
              <p className="text-gray-600 text-sm">
                ICPC Asia Blog (Prof. C. J. Hwang, Executive Director, ICPC,
                Asia Region)
              </p>
            </div>
            <div className="bg-gray-50 p-3">
              <h3 className="font-bold text-gray-700 text-sm mb-2">
                Result (2023-24)
              </h3>
              <div className="text-gray-600 text-sm space-y-1">
                <div>AWC Problem Set (2023-24)</div>
                <div>Director&apos;s Report (2023-24)</div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Sponsors */}
      <div className="mt-4 lg:mt-6 space-y-3 lg:space-y-4">
        <div className="bg-white border border-gray-200 p-3 lg:p-4 flex items-center justify-center">
          <a href="https://www.jetbrains.com/" target="_black">
            <img
              src="/jetbrains.png"
              alt="JetBrains"
              className="max-w-full max-h-12 sm:max-h-14 lg:max-h-16 object-contain"
            />
          </a>
        </div>
        <div className="bg-white border border-gray-200 p-3 lg:p-4 flex items-center justify-center">
          <a href="https://www.janestreet.com/" target="_black">
            <img
              src="/jane-4.png"
              alt="Jane Street"
              className="max-w-full max-h-12 sm:max-h-14 lg:max-h-16 object-contain"
            />
          </a>
        </div>
      </div>
    </div>
  );
}
