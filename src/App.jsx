
import React, { useState, useEffect } from "react";
import {
  Link2,
  Copy,
  Trash2,
  Search,
  Plus,
  LayoutDashboard,
  Link,
  Settings,
  Menu,
  X,
  ExternalLink,
  MousePointerClick,
  BarChart3,
  Globe,
  Check,
  ChevronDown,
  Zap,
  ShieldCheck,
  QrCode,
  MoreHorizontal,
  LogOut,
  ArrowUpRight,
} from "lucide-react";

const BASE_URL = "https://tinyurl.com";

export default function App() {
  const [links, setLinks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("tinyurl-links")) || [
        {
          id: 1,
          original: "https://www.google.com",
          short: "google-home",
          clicks: 125,
          created: new Date().toLocaleDateString(),
        },
        {
          id: 2,
          original: "https://www.youtube.com",
          short: "my-youtube",
          clicks: 89,
          created: new Date().toLocaleDateString(),
        },
        {
          id: 3,
          original: "https://www.github.com",
          short: "github-link",
          clicks: 54,
          created: new Date().toLocaleDateString(),
        },
      ];
    } catch {
      return [];
    }
  });

  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [search, setSearch] = useState("");
  const [activePage, setActivePage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copied, setCopied] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("tinyurl-links", JSON.stringify(links));
  }, [links]);

  const totalClicks = links.reduce(
    (total, link) => total + link.clicks,
    0
  );

  const generateAlias = () =>
    Math.random().toString(36).substring(2, 9);

  const createShortUrl = (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!url.trim()) {
      setError("Please enter a destination URL.");
      return;
    }

    let formattedUrl = url.trim();

    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = "https://" + formattedUrl;
    }

    try {
      new URL(formattedUrl);
    } catch {
      setError("Please enter a valid URL.");
      return;
    }

    const customAlias = alias.trim() || generateAlias();

    if (!/^[a-zA-Z0-9_-]+$/.test(customAlias)) {
      setError("Alias can only contain letters, numbers, _ and -.");
      return;
    }

    if (links.some((item) => item.short === customAlias)) {
      setError("This custom alias already exists.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const newLink = {
        id: Date.now(),
        original: formattedUrl,
        short: customAlias,
        clicks: 0,
        created: new Date().toLocaleDateString(),
      };

      setLinks((previous) => [newLink, ...previous]);
      setUrl("");
      setAlias("");
      setSuccess("Your short link has been created!");
      setLoading(false);
    }, 400);
  };

  const copyLink = async (short) => {
    const shortUrl = `${BASE_URL}/${short}`;

    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(short);

      setTimeout(() => setCopied(null), 2000);
    } catch {
      setError("Unable to copy. Please copy the link manually.");
    }
  };

  const deleteLink = (id) => {
    if (window.confirm("Are you sure you want to delete this link?")) {
      setLinks((previous) =>
        previous.filter((item) => item.id !== id)
      );
    }
  };

  const filteredLinks = links.filter(
    (item) =>
      item.original.toLowerCase().includes(search.toLowerCase()) ||
      item.short.toLowerCase().includes(search.toLowerCase())
  );

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "My URLs", icon: Link },
    { name: "Analytics", icon: BarChart3 },
    { name: "Settings", icon: Settings },
  ];

  const stats = [
    {
      title: "Total Links",
      value: links.length,
      icon: Link2,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Total Clicks",
      value: totalClicks.toLocaleString(),
      icon: MousePointerClick,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Active Links",
      value: links.length,
      icon: Globe,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Avg. Clicks",
      value: links.length
        ? Math.round(totalClicks / links.length)
        : 0,
      icon: BarChart3,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fc] text-gray-800">

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex h-20 items-center justify-between border-b border-gray-100 px-6">
          <a href="#" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0068ff] text-white">
              <Link2 size={25} />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-gray-900">
              tiny<span className="text-[#0068ff]">url</span>
            </span>
          </a>

          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 hover:bg-gray-100 lg:hidden"
          >
            <X size={21} />
          </button>
        </div>

        <div className="px-5 py-7">
          <p className="mb-4 px-3 text-xs font-bold uppercase tracking-wider text-gray-400">
            Workspace
          </p>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setActivePage(item.name);
                    setSidebarOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    activePage === item.name
                      ? "bg-blue-50 text-[#0068ff]"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon size={19} />
                  {item.name}
                </button>
              );
            })}
          </nav>

          <div className="mb-4 mt-10 px-3 text-xs font-bold uppercase tracking-wider text-gray-400">
            Tools
          </div>

          <button
            onClick={() => setActivePage("QR Codes")}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-gray-500 hover:bg-gray-50"
          >
            <QrCode size={19} />
            QR Codes
          </button>
        </div>

        <div className="mt-auto p-5">
          <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-5 text-white">
            <Zap size={25} />
            <h3 className="mt-3 font-bold">Upgrade your links</h3>
            <p className="mt-2 text-xs leading-5 text-blue-100">
              Get more features and unlock powerful link analytics.
            </p>
            <button className="mt-4 w-full rounded-lg bg-white py-2.5 text-sm font-bold text-blue-700 hover:bg-blue-50">
              Explore Plans
            </button>
          </div>

          <button className="mt-5 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-gray-500 hover:bg-gray-100">
            <LogOut size={18} />
            Log out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="min-h-screen lg:ml-64">

        {/* HEADER */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-200 bg-white px-5 sm:px-8 lg:px-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 hover:bg-gray-100 lg:hidden"
            >
              <Menu size={23} />
            </button>

            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {activePage}
              </h1>
              <p className="hidden text-xs text-gray-400 sm:block">
                Welcome back! Manage your links here.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="hidden rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 sm:block">
              Help Center
            </button>

            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
              U
            </button>
          </div>
        </header>

        <div className="mx-auto max-w-7xl p-5 sm:p-8 lg:p-10">

          {/* DASHBOARD */}
          {activePage === "Dashboard" && (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-extrabold text-gray-900">
                  Dashboard Overview
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  Create, manage and track all your shortened URLs.
                </p>
              </div>

              {/* CREATE URL CARD */}
              <section className="mb-9 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-100 px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#0068ff]">
                      <Link2 size={23} />
                    </div>
                    <div>
                      <h2 className="font-bold text-gray-900">
                        Shorten your URL
                      </h2>
                      <p className="text-xs text-gray-400">
                        Turn long links into short, shareable URLs.
                      </p>
                    </div>
                  </div>
                </div>

                <form
                  onSubmit={createShortUrl}
                  className="space-y-5 p-6"
                >
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Paste your long URL
                    </label>
                    <div className="relative">
                      <Globe
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        size={19}
                      />
                      <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com/your-very-long-url"
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 py-4 pl-12 pr-4 text-sm outline-none transition focus:border-[#0068ff] focus:bg-white focus:ring-4 focus:ring-blue-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Custom alias
                      <span className="ml-2 font-normal text-gray-400">
                        (Optional)
                      </span>
                    </label>
                    <div className="flex overflow-hidden rounded-xl border border-gray-200 focus-within:border-[#0068ff]">
                      <span className="flex items-center border-r border-gray-200 bg-gray-50 px-3 text-xs text-gray-500 sm:px-4">
                        tinyurl.com/
                      </span>
                      <input
                        type="text"
                        value={alias}
                        onChange={(e) => setAlias(e.target.value)}
                        placeholder="your-custom-name"
                        className="min-w-0 flex-1 bg-white px-4 py-3 text-sm outline-none"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
                      {success}
                    </div>
                  )}

                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <p className="text-xs text-gray-400">
                      <ShieldCheck size={15} className="mr-1 inline" />
                      Your links are stored in this browser.
                    </p>

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center justify-center gap-2 rounded-xl bg-[#0068ff] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:opacity-60"
                    >
                      {loading ? (
                        "Creating..."
                      ) : (
                        <>
                          <Plus size={18} />
                          Shorten URL
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </section>

              {/* STATISTICS */}
              <div className="mb-9 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => {
                  const Icon = stat.icon;

                  return (
                    <div
                      key={stat.title}
                      className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-500">
                          {stat.title}
                        </p>
                        <div className={`rounded-xl p-3 ${stat.color}`}>
                          <Icon size={21} />
                        </div>
                      </div>
                      <h3 className="mt-4 text-3xl font-extrabold text-gray-900">
                        {stat.value}
                      </h3>
                      <p className="mt-2 text-xs text-gray-400">
                        Your current link statistics
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* LINKS TABLE */}
              <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="flex flex-col justify-between gap-4 border-b border-gray-100 p-6 sm:flex-row sm:items-center">
                  <div>
                    <h2 className="font-bold text-gray-900">
                      Recent Links
                    </h2>
                    <p className="mt-1 text-xs text-gray-400">
                      Manage your recently created URLs.
                    </p>
                  </div>

                  <div className="relative">
                    <Search
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search links..."
                      className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 sm:w-64"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px] text-left">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">
                          Destination URL
                        </th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">
                          Short URL
                        </th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">
                          Clicks
                        </th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">
                          Created
                        </th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {filteredLinks.map((item) => (
                        <tr
                          key={item.id}
                          className="transition hover:bg-gray-50"
                        >
                          <td className="max-w-64 px-6 py-5">
                            <div className="flex items-center gap-2">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                                <Globe size={17} />
                              </div>
                              <span className="max-w-52 truncate text-sm font-medium text-gray-700">
                                {item.original}
                              </span>
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <span className="text-sm font-semibold text-[#0068ff]">
                              {BASE_URL}/{item.short}
                            </span>
                          </td>

                          <td className="px-6 py-5">
                            <span className="text-sm font-semibold text-gray-700">
                              {item.clicks}
                            </span>
                          </td>

                          <td className="px-6 py-5 text-sm text-gray-500">
                            {item.created}
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => copyLink(item.short)}
                                title="Copy link"
                                className="rounded-lg p-2 text-gray-500 transition hover:bg-blue-50 hover:text-blue-600"
                              >
                                {copied === item.short ? (
                                  <Check size={17} />
                                ) : (
                                  <Copy size={17} />
                                )}
                              </button>

                              <button
                                onClick={() => deleteLink(item.id)}
                                title="Delete link"
                                className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                              >
                                <Trash2 size={17} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}

                      {filteredLinks.length === 0 && (
                        <tr>
                          <td
                            colSpan="5"
                            className="px-6 py-12 text-center text-sm text-gray-400"
                          >
                            No links found. Create your first short URL!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="border-t border-gray-100 px-6 py-4 text-xs text-gray-400">
                  Showing {filteredLinks.length} of {links.length} links
                </div>
              </section>
            </>
          )}

          {/* MY URLS */}
          {activePage === "My URLs" && (
            <section>
              <h2 className="mb-2 text-2xl font-bold">All My URLs</h2>
              <p className="mb-7 text-sm text-gray-500">
                View and manage all your shortened links.
              </p>

              <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <div className="relative mb-5">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search all URLs..."
                    className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                {filteredLinks.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col justify-between gap-4 border-b border-gray-100 py-5 last:border-0 sm:flex-row sm:items-center"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-blue-600">
                        {BASE_URL}/{item.short}
                      </p>
                      <p className="mt-2 truncate text-xs text-gray-400">
                        {item.original}
                      </p>
                      <p className="mt-2 text-xs text-gray-400">
                        {item.clicks} clicks
                      </p>
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <button
                        onClick={() => copyLink(item.short)}
                        className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-100"
                      >
                        {copied === item.short ? "Copied!" : "Copy"}
                      </button>
                      <button
                        onClick={() => deleteLink(item.id)}
                        className="rounded-lg bg-red-50 p-2 text-red-500 hover:bg-red-100"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}

                {filteredLinks.length === 0 && (
                  <p className="py-10 text-center text-sm text-gray-400">
                    No URLs available.
                  </p>
                )}
              </div>
            </section>
          )}

          {/* ANALYTICS */}
          {activePage === "Analytics" && (
            <section>
              <h2 className="mb-2 text-2xl font-bold">Link Analytics</h2>
              <p className="mb-7 text-sm text-gray-500">
                Overview of your link performance.
              </p>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="rounded-2xl border border-gray-200 bg-white p-6">
                  <MousePointerClick className="mb-4 text-blue-600" size={28} />
                  <p className="text-sm text-gray-500">Total clicks</p>
                  <h3 className="mt-2 text-4xl font-extrabold">
                    {totalClicks.toLocaleString()}
                  </h3>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-6">
                  <Link2 className="mb-4 text-purple-600" size={28} />
                  <p className="text-sm text-gray-500">Total URLs</p>
                  <h3 className="mt-2 text-4xl font-extrabold">
                    {links.length}
                  </h3>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
                <h3 className="mb-5 font-bold">Link performance</h3>

                {links.map((item) => (
                  <div key={item.id} className="mb-6 last:mb-0">
                    <div className="mb-2 flex justify-between gap-3 text-sm">
                      <span className="truncate font-medium">
                        {item.short}
                      </span>
                      <span className="font-bold">{item.clicks} clicks</span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-blue-600"
                        style={{
                          width: `${
                            totalClicks
                              ? (item.clicks / totalClicks) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                ))}

                {links.length === 0 && (
                  <p className="text-sm text-gray-400">
                    Create links to see analytics.
                  </p>
                )}
              </div>
            </section>
          )}

          {/* SETTINGS */}
          {activePage === "Settings" && (
            <section>
              <h2 className="mb-2 text-2xl font-bold">Settings</h2>
              <p className="mb-7 text-sm text-gray-500">
                Manage your application preferences.
              </p>

              <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <h3 className="font-bold">Account settings</h3>
                <div className="mt-5 border-t border-gray-100 py-5">
                  <p className="font-semibold">Account name</p>
                  <p className="mt-1 text-sm text-gray-400">
                    Demo User
                  </p>
                </div>
                <div className="border-t border-gray-100 py-5">
                  <p className="font-semibold">Application</p>
                  <p className="mt-1 text-sm text-gray-400">
                    TinyURL Dashboard
                  </p>
                </div>
                <div className="border-t border-gray-100 py-5">
                  <p className="font-semibold">Storage</p>
                  <p className="mt-1 text-sm text-gray-400">
                    Browser LocalStorage
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (window.confirm("Delete all saved links?")) {
                      setLinks([]);
                    }
                  }}
                  className="mt-4 rounded-xl bg-red-50 px-5 py-3 text-sm font-bold text-red-600 hover:bg-red-100"
                >
                  Clear all links
                </button>
              </div>
            </section>
          )}

          {/* QR CODES */}
          {activePage === "QR Codes" && (
            <section>
              <h2 className="mb-2 text-2xl font-bold">QR Codes</h2>
              <p className="mb-7 text-sm text-gray-500">
                Generate QR codes for your short URLs.
              </p>

              <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <p className="mb-4 text-sm font-semibold">
                  Select a shortened URL
                </p>
                <select
                  id="qr-select"
                  className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-blue-500"
                >
                  {links.map((item) => (
                    <option key={item.id} value={item.short}>
                      {BASE_URL}/{item.short}
                    </option>
                  ))}
                </select>

                {links.length > 0 ? (
                  <button
                    onClick={() => {
                      const selected = document.getElementById("qr-select").value;
                      window.open(
                        `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`${BASE_URL}/${selected}`)}`,
                        "_blank"
                      );
                    }}
                    className="mt-5 rounded-xl bg-[#0068ff] px-6 py-3 text-sm font-bold text-white hover:bg-blue-700"
                  >
                    Generate QR Code
                  </button>
                ) : (
                  <p className="mt-4 text-sm text-gray-400">
                    Create a URL before generating a QR code.
                  </p>
                )}
              </div>
            </section>
          )}

          {/* FOOTER */}
          <footer className="mt-12 flex flex-col justify-between gap-3 border-t border-gray-200 pt-6 text-xs text-gray-400 sm:flex-row">
            <p>© 2026 TinyURL Clone. All rights reserved.</p>
            <div className="flex gap-5">
              <a href="#" className="hover:text-blue-600">Privacy</a>
              <a href="#" className="hover:text-blue-600">Terms</a>
              <a href="#" className="hover:text-blue-600">Support</a>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
