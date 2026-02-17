export default function MovieTabs({ activeTab, setActiveTab }) {
  const tabs = ["overview", "media", "trailers", "cast", "crew"];

  return (
    <div className="sticky top-0 z-30 bg-slate-950 shadow-sm border-b border-slate-800">
      <div className="w-4/5 mx-auto">
        <div className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`
                py-4 px-2 font-semibold text-sm transition-all duration-200 border-b-2
                ${
                  activeTab === tab
                    ? "text-blue-500 border-blue-500"
                    : "text-slate-400 border-transparent hover:text-slate-200 hover:border-slate-700"
                }
              `}
              onClick={() => setActiveTab(tab)}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
