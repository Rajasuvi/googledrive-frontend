import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDropzone } from 'react-dropzone';
import {
  Cloud, LogOut, Plus, Upload, Folder, File, Download,
  Trash2, User, Search, Grid, List
} from 'lucide-react';
import { authService } from '../../services/auth.service';
import { fileService } from '../../services/file.service';
import { formatFileSize, formatDate, getFileIcon, downloadFileFromUrl } from '../../utils/helpers';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(authService.getCurrentUser());
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch files and folders
  const fetchData = useCallback(async (folderId = null) => {
    try {
      setLoading(true);
      const response = await fileService.getFiles(folderId);
      setFiles(response.data.files);
      setFolders(response.data.folders);
    } catch (error) {
      toast.error('Failed to load files');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(currentFolder);
  }, [currentFolder, fetchData]);

  // Handle file drop
  const onDrop = useCallback(async (acceptedFiles) => {
    for (const file of acceptedFiles) {
      try {
        toast.info(`Uploading ${file.name}...`);
        await fileService.uploadFile(file, currentFolder);
        toast.success(`${file.name} uploaded successfully!`);
        fetchData(currentFolder);
      } catch (error) {
        toast.error(`Failed to upload ${file.name}`);
      }
    }
  }, [currentFolder, fetchData]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
  });

  // Create folder
  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) {
      toast.error('Folder name cannot be empty');
      return;
    }

    try {
      await fileService.createFolder(newFolderName, currentFolder);
      toast.success('Folder created successfully!');
      setNewFolderName('');
      setShowCreateFolder(false);
      fetchData(currentFolder);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create folder');
    }
  };

  // Download file
  const handleDownload = async (file) => {
    try {
      const response = await fileService.downloadFile(file._id);
      downloadFileFromUrl(response.downloadUrl, file.name);
      toast.success('Download started!');
    } catch (error) {
      toast.error('Failed to download file');
    }
  };

  // Delete file
  const handleDeleteFile = async (fileId) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;

    try {
      await fileService.deleteFile(fileId);
      toast.success('File deleted successfully!');
      fetchData(currentFolder);
    } catch (error) {
      toast.error('Failed to delete file');
    }
  };

  // Delete folder
  const handleDeleteFolder = async (folderId) => {
    if (!window.confirm('Are you sure? This will delete all contents inside.')) return;

    try {
      await fileService.deleteFolder(folderId);
      toast.success('Folder deleted successfully!');
      fetchData(currentFolder);
    } catch (error) {
      toast.error('Failed to delete folder');
    }
  };

  // Logout
  const handleLogout = () => {
    authService.logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  // Filter files and folders based on search
  const filteredFolders = folders.filter(folder =>
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                <Cloud className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                My Drive
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>{user?.firstName} {user?.lastName}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" {...getRootProps()}>
        <input {...getInputProps()} />

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowCreateFolder(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
            >
              <Plus className="w-5 h-5" />
              <span>New Folder</span>
            </button>

            <label className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 cursor-pointer transition">
              <Upload className="w-5 h-5" />
              <span>Upload File</span>
              <input
                type="file"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files);
                  onDrop(files);
                  e.target.value = '';
                }}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search files..."
                className="pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex bg-white border border-gray-300 rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-purple-100 text-purple-600' : 'text-gray-600'} rounded-l-xl`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-purple-100 text-purple-600' : 'text-gray-600'} rounded-r-xl`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Drag & Drop Zone */}
        {isDragActive && (
          <div className="mb-6 p-12 border-4 border-dashed border-purple-400 bg-purple-50 rounded-2xl text-center">
            <Upload className="w-12 h-12 text-purple-500 mx-auto mb-3" />
            <p className="text-lg font-semibold text-purple-700">Drop files here to upload</p>
          </div>
        )}

        {/* Create Folder Modal */}
        {showCreateFolder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Create New Folder</h2>
              <form onSubmit={handleCreateFolder}>
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Folder name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
                  autoFocus
                />
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-purple-600 text-white py-2 rounded-xl hover:bg-purple-700 transition"
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateFolder(false);
                      setNewFolderName('');
                    }}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-xl hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-2'}>
            {/* Folders */}
            {filteredFolders.map((folder) => (
              <div
                key={folder._id}
                className={`bg-white rounded-xl shadow-sm hover:shadow-md transition cursor-pointer ${
                  viewMode === 'grid' ? 'p-4' : 'p-3 flex items-center justify-between'
                }`}
                onDoubleClick={() => setCurrentFolder(folder._id)}
              >
                <div className="flex items-center space-x-3">
                  <Folder className="w-8 h-8 text-yellow-500 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 truncate">{folder.name}</p>
                    <p className="text-xs text-gray-500">{formatDate(folder.createdAt)}</p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFolder(folder._id);
                  }}
                  className="text-red-500 hover:text-red-700 p-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            {/* Files */}
            {filteredFiles.map((file) => (
              <div
                key={file._id}
                className={`bg-white rounded-xl shadow-sm hover:shadow-md transition ${
                  viewMode === 'grid' ? 'p-4' : 'p-3 flex items-center justify-between'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-3xl flex-shrink-0">{getFileIcon(file.mimeType)}</div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)} • {formatDate(file.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDownload(file)}
                    className="text-blue-500 hover:text-blue-700 p-2"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteFile(file._id)}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredFolders.length === 0 && filteredFiles.length === 0 && (
          <div className="text-center py-12">
            <Cloud className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {searchQuery ? 'No files found' : 'Your drive is empty. Start by creating a folder or uploading files!'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
