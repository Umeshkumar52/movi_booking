export default function MovieTabs({ activeTab, setActiveTab }) {
  const tabs = ["overview", "media", "trailers", "cast", "crew"];

  return (
    <div className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200">
      <div className="w-4/5 mx-auto">
        <div className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`
                py-4 px-2 font-semibold text-sm transition-all duration-200 border-b-2
                ${
                  activeTab === tab
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-500 border-transparent hover:text-gray-800 hover:border-gray-300"
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
