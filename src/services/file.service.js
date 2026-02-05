import api from './api';

export const fileService = {
  // Get all files and folders
  getFiles: async (folderId = null) => {
    const params = folderId ? { folderId } : {};
    const response = await api.get('/files', { params });
    return response.data;
  },

  // Upload file
  uploadFile: async (file, folderId = null, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    if (folderId) {
      formData.append('folderId', folderId);
    }

    const response = await api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    });
    return response.data;
  },

  // Download file
  downloadFile: async (fileId) => {
    const response = await api.get(`/files/download/${fileId}`);
    return response.data;
  },

  // Delete file
  deleteFile: async (fileId) => {
    const response = await api.delete(`/files/${fileId}`);
    return response.data;
  },

  // Get file by ID
  getFileById: async (fileId) => {
    const response = await api.get(`/files/${fileId}`);
    return response.data;
  },

  // Create folder
  createFolder: async (name, parentId = null) => {
    const response = await api.post('/folders', { name, parentId });
    return response.data;
  },

  // Delete folder
  deleteFolder: async (folderId) => {
    const response = await api.delete(`/folders/${folderId}`);
    return response.data;
  },

  // Get folder by ID
  getFolderById: async (folderId) => {
    const response = await api.get(`/folders/${folderId}`);
    return response.data;
  },

  // Rename folder
  renameFolder: async (folderId, name) => {
    const response = await api.put(`/folders/${folderId}`, { name });
    return response.data;
  },
};
