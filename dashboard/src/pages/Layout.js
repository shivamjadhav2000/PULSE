const Layout=   ({ user,handleLogout }) => {
    if (!user) {
        return null; // or redirect to login page
    }
    return (
    <nav className="bg-blue-900 text-white p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img src="logo.png" alt="Logo" className="w-12 h-12" />
          <h2 className="text-xl font-semibold text-white">Climatic Crisis Admin</h2>
          <div className="flex space-x-4 text-xl text-gray-200 font-semibold ">
            <a href='/dashboard' className="border border-gray-900 p-2 rounded cursor-pointer hover:bg-red-400 hover:text-gray-900">Home</a>
            <a href='/crisis-report' className="border border-gray-900 p-2 rounded cursor-pointer hover:bg-red-400 hover:text-gray-900">report-crisis</a>
            <a href='/pre-crisis-analysis' className="border border-gray-900 p-2 rounded cursor-pointer hover:bg-red-400 hover:text-gray-900">pre-crisis-analysis</a>
            <a href='/post-crisis-analysis' className="border border-gray-900 p-2 rounded cursor-pointer hover:bg-red-400 hover:text-gray-900">post-crisis-analysis</a>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="bg-gray-900 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </nav>
    )
}
export default Layout;