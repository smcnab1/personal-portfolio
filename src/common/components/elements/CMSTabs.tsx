interface TabItem {
  id: string;
  label: string;
  icon?: string;
}

interface CMSTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const CMSTabs = ({ tabs, activeTab, onTabChange }: CMSTabsProps) => {
  return (
    <div className='border-b border-gray-200 dark:border-gray-700'>
      <nav className='-mb-px flex space-x-8'>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`border-b-2 px-1 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <span className='flex items-center space-x-2'>
              {tab.icon && <span>{tab.icon}</span>}
              <span>{tab.label}</span>
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
};
