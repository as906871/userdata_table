import React, { useState, useEffect, useMemo, useCallback } from "react";
import { ChevronUp, ChevronDown, Search, Users, MapPin, Building2 } from "lucide-react";
import Loading from "../utils/Loading";
import Error from "../utils/Error";

const UserData = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleSort = useCallback((key) => {
      let direction = "asc";
      if (sortConfig.key === key && sortConfig.direction === "asc") {
        direction = "desc";
      }
      setSortConfig({ key, direction });
    },[sortConfig]);

  const getSortIcon = useCallback((columnKey) => {
      if (sortConfig.key !== columnKey) {
        return <ChevronUp className="w-4 h-4 text-gray-400 opacity-50" />;
      }
      return sortConfig.direction === "asc" ? (
        <ChevronUp className="w-4 h-4 text-indigo-600" />
      ) : (
        <ChevronDown className="w-4 h-4 text-indigo-600" />
      );
    },[sortConfig]);

  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users.filter((user) =>
        user.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = sortConfig.key === "id" ? a.id : a.name.toLowerCase();
        let bValue = sortConfig.key === "id" ? b.id : b.name.toLowerCase();

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return filtered;
  }, [users, searchTerm, sortConfig]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error error={error} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-4 sm:py-6 lg:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl lg:rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-50 border-b border-gray-200 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-12 sm:h-12 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl shadow-lg">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                User Data
              </h1>
            </div>

            <div className="w-full sm:w-auto max-w-md sm:max-w-lg">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by ID or Name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base transition-all"
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm("")} className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-gray-400 hover:text-gray-600" >
                    <span className="text-lg">×</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th onClick={() => handleSort("id")} className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none">
                    <div className="flex items-center justify-between group">
                      <span className="group-hover:text-indigo-600">ID</span>
                      {getSortIcon("id")}
                    </div>
                  </th>
                  <th onClick={() => handleSort("name")} className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none">
                    <div className="flex items-center justify-between group">
                      <span className="group-hover:text-indigo-600">Name</span>
                      {getSortIcon("name")}
                    </div>
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Address</span>
                      <span className="sm:hidden">Addr</span>
                    </div>
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Building2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Company</span>
                      <span className="sm:hidden">Co.</span>
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-100">
                {filteredAndSortedUsers.map((user, index) => (
                  <tr key={user.id} className={`${index % 2 === 0 ? "bg-white" : "bg-indigo-50/30"} hover:bg-indigo-50 transition-colors`}>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-sm">
                          <span className="text-white font-bold text-xs sm:text-sm">
                            {user.id}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-3 sm:px-6 py-4">
                      <div>
                        <div className="text-sm sm:text-base font-semibold text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-xs sm:text-sm text-indigo-600 mt-1">
                          @{user.username}
                        </div>
                      </div>
                    </td>

                    <td className="px-3 sm:px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                          <span className="truncate">{user.address.city}</span>
                        </div>
                        <div className="text-xs text-gray-500 font-mono mt-1">
                          {user.address.zipcode}
                        </div>
                      </div>
                    </td>

                    <td className="px-3 sm:px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-gray-400 flex-shrink-0" />
                          <span className="truncate">{user.company.name}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1 line-clamp-2 sm:line-clamp-1">
                          {user.company.catchPhrase}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAndSortedUsers.length === 0 && searchTerm && (
            <div className="text-center py-12 px-4">
              <div className="bg-gray-100 rounded-full p-3 w-16 h-16 mx-auto mb-4">
                <Search className="mx-auto h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Results Found
              </h3>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                No users match your search for "<strong>{searchTerm}</strong>"
              </p>
              <button onClick={() => setSearchTerm("")} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Clear Search
              </button>
            </div>
          )}

          <div className="bg-gray-50 px-4 sm:px-6 py-3 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="text-sm text-gray-700">
                <div className="mt-3 text-center">
                  <span className="text-sm text-gray-600">
                    {searchTerm ? (
                      <> Showing <strong> {filteredAndSortedUsers.length} </strong> of <strong>{users.length}</strong> users</>
                    ) : (
                      <><strong>{users.length}</strong> total users </>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserData;
