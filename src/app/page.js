"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  const [announcements, setAnnouncements] = useState([]);
  const [directors, setDirectors] = useState([]);
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [announcementsRes, directorsRes, datesRes] = await Promise.all([
          fetch("/api/announcements"),
          fetch("/api/home/directors"),
          fetch("/api/home/dates"),
        ]);

        if (announcementsRes.ok) {
          const data = await announcementsRes.json();
          setAnnouncements(data || []);
        }

        if (directorsRes.ok) {
          const data = await directorsRes.json();
          setDirectors(data || []);
        }

        if (datesRes.ok) {
          const data = await datesRes.json();
          setDates(data || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Full Width */}
      <div className="bg-white py-4 sm:py-6 lg:py-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          {/* Location Headers */}
          <div className="flex justify-center items-center space-x-4 sm:space-x-8 lg:space-x-16 mb-4 sm:mb-6 lg:mb-8">
            <div className="text-center">
              <div className="text-blue-600 text-sm sm:text-lg lg:text-xl font-bold">
                Mathura
              </div>
              <div className="text-red-600 text-xs sm:text-sm italic">
                India
              </div>
            </div>
            <div className="w-px h-8 sm:h-10 lg:h-12 bg-yellow-500"></div>
            <div className="text-center">
              <div className="text-blue-600 text-sm sm:text-lg lg:text-xl font-bold">
                Dhaka
              </div>
              <div className="text-red-600 text-xs sm:text-sm italic">
                Bangladesh
              </div>
            </div>
            <div className="w-px h-8 sm:h-10 lg:h-12 bg-yellow-500"></div>
            <div className="text-center">
              <div className="text-blue-600 text-sm sm:text-lg lg:text-xl font-bold">
                Topi
              </div>
              <div className="text-red-600 text-xs sm:text-sm italic">
                Pakistan
              </div>
            </div>
            <div className="w-px h-8 sm:h-10 lg:h-12 bg-yellow-500"></div>
            <div className="text-center">
              <div className="text-blue-600 text-sm sm:text-lg lg:text-xl font-bold">
                Tehran
              </div>
              <div className="text-red-600 text-xs sm:text-sm italic">Iran</div>
            </div>
          </div>

          {/* Main Hero Content - 2 Sections */}
          <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-12">
            {/* Left Side - ICPC Foundation Section */}
            <div className="w-full sm:w-80 lg:w-96 flex-shrink-0">
              {/* ICPC Foundation Logo Area */}
              <div className="flex items-center justify-center lg:justify-start mb-4 sm:mb-6">
                {/* Single Image with background styling */}
                <div className="w-full h-64 bg-none object:fit-cover">
                  <img
                    src="/icpc-logo.png"
                    alt="Championship"
                    className="w-full h-100  rounded-lg"
                  />
                </div>
              </div>

              {/* ICPC Foundation Text */}
              <div className="mb-4 sm:mb-6 text-center lg:text-left">
                
                <div className="text-gray-900 text-xs sm:text-sm font-bold mt-2 ">
                  INTERNATIONAL COLLEGIATE PROGRAMMING CONTEST
                  {/*<br />*/}
                   
                </div>
              </div>

              {/* Sponsors */}
              <div className="flex items-center justify-center lg:justify-start space-x-4 sm:space-x-6">
                <div className="flex items-center space-x-2">
                  <img
                    src="/jetbrains.png"
                    alt="JetBrains"
                    className="max-h-6 sm:max-h-8 object-contain"
                  />
                </div>
                <div className="w-px h-6 sm:h-8 bg-yellow-500"></div>
                <div className="flex items-center space-x-2">
                  <img
                    src="/jane-4.png"
                    alt="Jane Street"
                    className="max-h-6 sm:max-h-8 object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Red Vertical Separator Line with Blinking Dots */}
            <div className="hidden lg:flex flex-col items-center h-64">
              {/* Top Blinking Dot */}
              <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse mb-4"></div>

              {/* Vertical Line with Rounded Edges */}
              <div className="w-1 flex-1 bg-red-600 rounded-full"></div>

              {/* Bottom Blinking Dot */}
              <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse mt-4"></div>
            </div>

            {/* Right Side - Main Title (Full Width) */}
            <div className="flex-1 text-center min-w-0">
              <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                ASIA WEST CHAMPIONSHIP
               
                
              </h1>

              {/* Date Badge */}
              <div className="inline-flex items-center bg-blue-600 rounded-lg overflow-hidden">
                <div className="bg-blue-600 text-white px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-yellow-400">
                    10&18
                  </div>
                </div>
                <div className="bg-white text-red-600 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold">
                    March
                  </div>
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold">
                    2025
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content with Sidebar Layout */}
          <div className="mt-6 sm:mt-8 lg:mt-12 flex flex-col lg:flex-row gap-4 lg:gap-8">
            {/* Left Content Area */}
            <div className="flex-1 max-w-4xl min-w-0">
              {/* Description Text */}
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4 sm:mb-6 lg:mb-8 text-justify">
                <span className="text-red-700 font-semibold ">
                  The International Collegiate Programming Contest
                </span>{" "}
                (ICPC) is the largest computer programming contest in the world.
                The ICPC is an activity that provides college students with an
                opportunity to demonstrate and sharpen their problem-solving and
                computing skills. The contest is considered to be the
                &quot;Olympics of Computer Programming&quot;. The ICPC Asia
                Regional Contests invite Asian students to meet, establish
                friendships and promote fair competition in programming.{" "}
                <span className="font-semibold italic">ICPC Foundation</span> is
                the Global Sponsor of this event whereas{" "}
                <span className="font-semibold italic">JetBrains</span> is the
                ICPC Global Programming Tools Sponsor.
              </p>

              {/* A Little About Us */}
              <div className="mb-4 sm:mb-6 lg:mb-8">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
                  A Little About Us
                </h2>
                <div className="text-sm sm:text-base text-gray-700 space-y-3 text-justify">
                  <p>
                    It is a two tier contest. The world is divided into six
                    regions and Asia is a region. In Asia there are many host
                    sites and{" "}
                    <span className="font-semibold">Asia West Championship</span>{" "}
                    is one of them. Each site selects one team as winner of the
                    site and will be eligible to participate in the world
                    finals. The winning team of each site is eligible to
                    participate to the world finals.
                  </p>
                  <p className="text-justify">
                    Teams for{" "}
                    <span className="font-semibold">
                      Asia West Championship
                    </span>{" "}
                    will be selected on the basis of their performance in the
                    Regional Rounds of all the sites in Asia West Region. Top
                    few teams from all the regional sites of Asia West 
                    region (i.e.{" "}
                    <span className="italic">
                      Amritapuri, Chennai, Dhaka, Kabul, Kanpur, Tehran
                    </span>{" "}
                    and <span className="italic">Topi</span>) are eligible to
                    participate in this contest. This contest will be held on{" "}
                    <span className="font-semibold">7-8 March 2025</span>. This
                    year Asia West Championship will be a multi-site
                    contest and will be held at Mathura (for Indian regional
                    teams), Dhaka (for Dhaka regional teams), Topi (for Topi and
                    Kabul regional teams) and Tehran (for Tehran regional
                    teams).
                  </p>
                </div>
              </div>

              {/* ICPC Asia West Regional Contest Directors */}
              <div className="mb-4 sm:mb-6 lg:mb-8">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
                  ICPC Asia West Regional Contest Directors
                </h2>
                <div className="border border-gray-300 overflow-x-auto">
                  <table className="w-full min-w-[800px]">
                    <thead>
                      <tr className="bg-blue-200">
                        <th className="border border-gray-400 px-2 sm:px-3 py-2 text-xs sm:text-sm font-semibold text-blue-900 text-left whitespace-nowrap min-w-[80px]">
                          Country
                        </th>
                        <th className="border border-gray-400 px-2 sm:px-3 py-2 text-xs sm:text-sm font-semibold text-blue-900 text-left whitespace-nowrap min-w-[100px]">
                          Site
                        </th>
                        <th className="border border-gray-400 px-2 sm:px-3 py-2 text-xs sm:text-sm font-semibold text-blue-900 text-left min-w-[200px]">
                          Regional Contest Director
                        </th>
                        <th className="border border-gray-400 px-2 sm:px-3 py-2 text-xs sm:text-sm font-semibold text-blue-900 text-left min-w-[150px]">
                          Email
                        </th>
                        <th className="border border-gray-400 px-2 sm:px-3 py-2 text-xs sm:text-sm font-semibold text-blue-900 text-left whitespace-nowrap min-w-[100px]">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td
                            colSpan="5"
                            className="border border-gray-400 px-2 sm:px-3 py-8 text-xs sm:text-sm text-center"
                          >
                            <div className="flex items-center justify-center">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                              <span className="ml-2 text-gray-900 font-medium">
                                Loading directors...
                              </span>
                            </div>
                          </td>
                        </tr>
                      ) : directors.length === 0 ? (
                        <tr>
                          <td
                            colSpan="5"
                            className="border border-gray-400 px-2 sm:px-3 py-8 text-xs sm:text-sm text-center text-gray-900 font-medium"
                          >
                            No directors found
                          </td>
                        </tr>
                      ) : (
                        directors.map((director, index) => (
                          <tr
                            key={director.id}
                            className={
                              index % 2 === 0 ? "bg-white" : "bg-blue-50"
                            }
                          >
                            <td className="border border-gray-400 px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-900 font-medium">
                              {director.country}
                            </td>
                            <td className="border border-gray-400 px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-900 font-medium">
                              {director.site}
                            </td>
                            <td className="border border-gray-400 px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-900 font-medium">
                              {director.director_name}
                            </td>
                            <td className="border border-gray-400 px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-900 font-medium">
                              {director.email || "N/A"}
                            </td>
                            <td className="border border-gray-400 px-2 sm:px-3 py-2 text-xs sm:text-sm">
                              {director.website_url ? (
                                <a
                                  href={director.website_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="bg-blue-600 text-white px-2 sm:px-3 py-1 rounded text-xs hover:bg-blue-700"
                                >
                                  Visit Website
                                </a>
                              ) : (
                                <span className="text-gray-400 text-xs">
                                  No website
                                </span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Important Dates */}
              <div className="mb-4 sm:mb-6 lg:mb-8">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
                  Important Dates (Tentative)
                </h2>
                <div className="border border-gray-300 overflow-x-auto">
                  <table className="w-full min-w-[900px]">
                    <thead>
                      <tr className="bg-blue-200">
                        <th className="border border-gray-400 px-2 sm:px-3 py-2 text-xs sm:text-sm font-semibold text-blue-900 text-left whitespace-nowrap min-w-[100px]">
                          Tentative
                        </th>
                        <th className="border border-gray-400 px-2 sm:px-3 py-2 text-xs sm:text-sm font-semibold text-blue-900 text-left whitespace-nowrap min-w-[100px]">
                          Site
                        </th>
                        <th className="border border-gray-400 px-2 sm:px-3 py-2 text-xs sm:text-sm font-semibold text-blue-900 text-left min-w-[200px]">
                          Date related to Regional Contest
                        </th>
                        <th className="border border-gray-400 px-2 sm:px-3 py-2 text-xs sm:text-sm font-semibold text-blue-900 text-left min-w-[150px]">
                          Contest Committee
                        </th>
                        <th className="border border-gray-400 px-2 sm:px-3 py-2 text-xs sm:text-sm font-semibold text-blue-900 text-left min-w-[150px]">
                          Contest Committee
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td
                            colSpan="5"
                            className="border border-gray-400 px-2 sm:px-3 py-8 text-xs sm:text-sm text-center"
                          >
                            <div className="flex items-center justify-center">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                              <span className="ml-2 text-gray-900 font-medium">
                                Loading dates...
                              </span>
                            </div>
                          </td>
                        </tr>
                      ) : dates.length === 0 ? (
                        <tr>
                          <td
                            colSpan="5"
                            className="border border-gray-400 px-2 sm:px-3 py-8 text-xs sm:text-sm text-center text-gray-900 font-medium"
                          >
                            No important dates found
                          </td>
                        </tr>
                      ) : (
                        dates.map((date, index) => (
                          <tr
                            key={date.id}
                            className={
                              index % 2 === 0 ? "bg-white" : "bg-blue-50"
                            }
                          >
                            <td className="border border-gray-400 px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-900 font-medium">
                              {date.tentative}
                            </td>
                            <td className="border border-gray-400 px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-900 font-medium">
                              {date.site}
                            </td>
                            <td className="border border-gray-400 px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-900 font-medium">
                              {date.date_related}
                            </td>
                            <td className="border border-gray-400 px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-900 font-medium">
                              {date.committee1}
                            </td>
                            <td className="border border-gray-400 px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-900 font-medium">
                              {date.committee2}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Note for Indian Regional Sites */}
              <div className="mb-4 sm:mb-6">
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed text-justify">
                  <span className="font-semibold">
                    Note (for teams participating in Indian Regional Sites):
                  </span>{" "}
                  There will be a single Preliminary Online Contest for all
                  three Regional Sites Of India (i.e., Kanpur,{" "}
                  <span className="italic">Amritapuri</span>, and{" "}
                  <span className="italic">Chennai</span>). Each regional site
                  will prepare its own rank list based on the teams registered
                  for that site from the Preliminary Online Contest rankings.
                  Teams participating in multiple regional sites are requested
                  to keep the same team members for each Regional Site.
                </p>
              </div>

              {/* Asia West Championship Information */}
              <div className="mb-4 sm:mb-6 lg:mb-8 text-justify">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-red-800 mb-4 sm:mb-6">
                  Asia West Championship: 7-8 March 2025
                </h2>

                <div className="mb-4">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                    Team Selection Process:
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 mb-4">
                    Yet to be decided <br/> To be uploaded soon
                  </p>
                  {/*<p className="text-sm sm:text-base text-gray-700 mb-4">
                    This is considered to be similar to any regional contest,
                    with the following exceptions:
                  </p>*/}
                </div>

                <div className="text-sm sm:text-base text-gray-700 space-y-3">
                  {/*<p>
                    1. Teams are invited to participate in the contest based on
                    their performance in their respective regional contest
                    sites.
                  </p>

                  <p>
                    2. Only the top few teams from each site will be selected
                    for the contest.
                  </p>

                  <p>
                    3. Even though the Champion Team of each regional site [the{" "}
                    <span className="text-red-600 font-medium">
                      WINNER of the site
                    </span>
                    ] gets a slot in the World Finals, all the winning teams of
                    all regional sites of Asia West Continent must participate
                    in the AWC Championship trophy.
                  </p>

                  <p>
                    4. Any team of the Champion Institute [i.e., an institute
                    that has at least one Champion Team] is not eligible to
                    participate.
                  </p>

                  <p>
                    5. Team composition, under no circumstances, can be changed.
                  </p>

                  <p>
                    6. The number of teams to be selected from each site is
                    based on the total number of teams that participated in the
                    On-line contest and the On-site contest. The higher the
                    value of the metric, the larger the number.
                  </p>

                  <p>
                    7. However, the minimum number of teams from each site that
                    will be eligible is 3.
                  </p>

                  <p>
                    8. The RCD of each site will select the top few Teams to the
                    AWC Finals based on the ranking of their respective Regional
                    Contest. There is no restriction on the number teams from
                    one institution (with the exception of item 4 above.)
                  </p>

                  <p>
                    9. Contests of all sites are assumed to have the same degree
                    of difficulty. In case of tie, World Finals Rules will be
                    followed [number of problems solved, penalty time, time of
                    last problem solved, time of 2<sup>nd</sup> last problem
                    solved, and so on.]
                  </p>*/}
                </div>
              </div>
            </div>

            {/* Sidebar - Sticky */}
            <Sidebar announcements={announcements} />
          </div>
        </div>
      </div>
    </div>
  );
}
