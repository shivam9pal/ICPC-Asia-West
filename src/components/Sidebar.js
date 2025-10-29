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
                  text: "text-red-600 ",
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
                yellow: {
                  bg: "bg-yellow-50",
                  text: "text-yellow-600",
                  textSecondary: "text-yellow-700",
                },
              };
              return colorMap[colorScheme] || colorMap.blue;
            };

            const colors = getColorClasses(announcement.color_scheme);
            const isLast = index === announcements.length - 1;

            // 👇 Updated section: GIF appears when red is chosen
            const AnnouncementContent = () => (
              <>
                <div className="flex items-center gap-2">
                  <h3
                    className={`font-bold ${colors.text} text-sm ${
                      announcement.content.includes("\n") ? "mb-2" : ""
                    }`}
                  >
                    {announcement.title}
                  </h3>

                  {announcement.color_scheme === "red" && (
                    <img
                      src="/new.gif"
                      alt="New!"
                      className="w-8 h-8 animate-bounce"
                    />
                  )}
                </div>

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
          <>
            <div className="bg-red-50 p-3 border-b border-gray-200">
              <h3 className="font-bold text-red-600 text-sm">
                Updates yet to come
              </h3>
            </div>
          </>
        )}
      </div>

      {/* Sponsors */}
      <div className="mt-4 lg:mt-6 space-y-3 lg:space-y-4">
        <div className="bg-white border border-gray-200 p-3 lg:p-4 flex items-center justify-center">
          <a
            href="https://www.jetbrains.com/"
            target="_blank"
            className="group relative rounded-2xl border border-white/10 bg-white text-slate-900 p-5 flex flex-col items-center justify-center
                    transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]"
          >
            <img
              src="/jetbrains.png"
              alt="JetBrains"
              className="h-14 sm:h-16 object-contain mx-auto mb-3"
            />
            <div className="text-center text-sm">
              <div>ICPC Global Programming Tools Sponsor</div>
            </div>
            <span className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-cyan-50/20 to-transparent"></span>
          </a>
        </div>
        <div className="bg-white border border-gray-200 p-3 lg:p-4 flex items-center justify-center">
          <a
            href="https://www.janestreet.com/"
            target="_blank"
            className="group relative rounded-2xl border border-white/10 bg-white text-slate-900 p-5 flex flex-col items-center justify-center
                    transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]"
          >
            <img
              src="/jane-4.png"
              alt="Jane Street"
              className="h-14 sm:h-16 object-contain mx-auto mb-3"
            />
            <div className="text-center text-sm">
              <div>ICPC Titanium Multi-Regional Sponsor</div>
            </div>
            <span className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-cyan-50/20 to-transparent"></span>
          </a>
        </div>
      </div>
    </div>
  );
}
