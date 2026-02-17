export default function MovieTabs({ activeTab, setActiveTab }) {
  const tabs = ["overview", "media", "trailers", "cast", "crew"];

  return (
    <div className="tabs">
    <div className="flex gap-8 px-10">
        {tabs.map((tab) => (
        <button
          key={tab}
          className={activeTab === tab ? "tab active" : "tab"}
          onClick={() => setActiveTab(tab)}
        >
          {tab.toUpperCase()}
        </button>
      ))}
    </div>
    </div>
  );
}
